## Segment your Angular component unit tests to make them run 50% faster

In this article I want to explain why and how we should separate Angular unit tests into isolated, shallow and integrated tests. There are plenty of great guides and tutorials out there on segmenting Angular unit tests (e.g. [here](https://vsavkin.com/three-ways-to-test-angular-2-components-dcea8e90bd8d)). But when I found myself having to draft some unit testing guidelines for a project, I struggled to point to resources that gave concrete examples of the value of separating isolated, shallow and integrated tests, or that offered a clear framework for how to separate them. 

This article is partly to clarify my own thinking on the subject, but hopefully it will also be useful to someone else. I’ll start with why we write unit tests and think about the main types of regression errors we want to catch, then experiment with how we can test for them in the most efficient way, which fairly naturally leads us to separate our tests into these three buckets. 

#### Why do we write unit tests?

First things first: what is the purpose of unit tests? We write unit tests to protect code’s existing functionality. When we come back to a piece of code we (or someone else) wrote weeks, months or years ago to add a feature or fix a bug, we want to be able to make changes without breaking existing functionality. Unit tests aren’t for checking if something works; they’re for checking if something _still_ works. So when unit testing a piece of code, we should consider all the possible ways we could break it when changing the code in the future. 

#### What should Angular component unit tests cover?

For an Angular component, the main things we could break are:

* *Template data bindings* (e.g. we could change the name of a component property and not update its use in the template)
* *Template callbacks* (e.g. we could change the name of a component function and not update its use in the template)
* *Template logic* (e.g. we could edit the template and accidentally delete an ngIf condition on an element)
* *Function logic* (e.g. we could edit a function on the component to account for an edge case and break its core functionality)
* *Child component API* (e.g. we could change the name of a child component’s input and not update its use in the parent component template)
* *Service API* (e.g. we could change the name of a service function and not update its use in the component)

There are a few more complicated scenarios to consider (e.g. use of custom directives and pipes in the component template) but this list covers most regression errors. Luckily, the TS compiler will catch regression errors relating to a component’s use of a service API for us. For example, if we change the name of a service function and attempt to compile without updating its use in our components, we get: 

> Property ‘myFunction’ does not exist on type 'MyService'

That leaves us with five main types of regression errors to guard against. 

#### An over-engineered example

I’ve created a very over-engineered component that requires tests for each of these cases [here](https://github.com/mstuartf/unit-testing-examples). The component contains an input element and a reset button. Whenever the user edits the input value, the component uses different service functions to console log ‘positive’, ‘zero’ or ‘negative’. The current value is displayed in a paragraph element, which is green if it is positive, red otherwise. The reset button is a child component that emits a ‘reset’ event. This covers all five of our test cases:

* *Template bindings*: is the input element value displayed in the paragraph element?
* *Template callbacks*: is the component function called on keyup?
* *Template logic*: is the paragraph element green if the input value is positive, red otherwise?
* *Function logic*: does the component function call the correct service function depending on the value?
* *Child component API*: does the reset button component output wipe the input value?

So how should we write these tests?

#### Angular CLI default approach

When we use the Angular CLI to generate a new component, it automatically sets up a testing module for us using TestBed inside a beforeEach:

```
beforeEach(async(() => {
  TestBed.configureTestingModule({
    declarations: [
      InputLogComponent,
      ResetBtnComponent
    ],
    providers: [LoggerService]
  })
    .compileComponents();
}));
```

To start with, let’s use this setup for all of our tests. 

In `input-log.component.1.spec.ts` you can see the 8 tests required to guard all of the component’s functionality. Running the entire test suite for a single component is very fast and won’t tell us much about how efficiently the tests run. But we can put the entire suite inside a loop to run multiple times to (crudely) simulate how long it would take to test a larger application if we followed this approach. As a benchmark, running these tests locally 250 times takes *29.739 seconds*. 

At this scale, this doesn’t seem like a lot. But once an application starts to get above 1000 tests, and if components are more complicated, the time taken to run a test suite isn’t trivial. So we should consider how we can optimise this. 

How can we make our tests run faster?

#### Separating isolated tests

An obvious place to start is to look at what TestBed is doing in the beforeEach. Before running, each of these tests compiles a testing module that provides the LogsService and renders the two component templates. Given how expensive this is, is it really necessary for all tests?

For example, consider this test of the component’s function logic:

```
it('should call \'logPositive\' when the user inputs \'1\'', () => {
  spyOn(cmp.loggerSvc, 'logPositive');
  cmp.logType('1');
  expect(cmp.loggerSvc.logPositive).toHaveBeenCalled();
});
```

This test involves no DOM interaction, so rendering the template is completely unnecessary. So the first thing we can do is restructure our tests so that we only render templates when required by the tests. In `input-log.component.2.spec.ts`, all of the function logic tests have been moved into a separate describe block without the expensive setup. Instead, we simply instantiate the component as a plain TS class in a beforeEach. 

```
beforeEach(() => {
  cmp = new InputLogComponent(new LoggerService());
});
```

Running the same tests separated this way cuts the execution time down to *17.664 seconds*. Simply by breaking off function logic into separate isolated tests with cheaper setup, we have reduced test execution time by *41%*. 

But can we make them run even faster?

#### Separating shallow tests

Let’s take another look at the TestBed setup that is still running before each of our template binding, callback and logics and child component API tests. The testing module being compiled renders two templates: the parent component (InputLogComponent) and the child component (ResetBtnComponent). We have seen already how expensive template rendering is in test setup, so it is really necessary to render both templates for all tests?

For example, consider this test of the component’s template binding: 

```
it('should display the input value in the paragraph', () => {
  input.nativeElement.value = '1';
  fixture.detectChanges();
  const p = fixture.debugElement.query(By.css('p'));
  expect(p.nativeElement.textContent.trim()).toEqual('1');
});
```

This test has no dependency on the child component, so rendering it is redundant. In fact, the only test that needs this template to be rendered to run is the child component API test. 

In `input-log.component.3.spec.ts`, all of the other tests have been moved to another describe block with a simplified setup. We still use TestBed to compile a testing module, but we do not declare the ResetBtnComponent. Now, when the compiler is validating the parent component template and encounters the `<app-reset-btn>` element it will not know how to handle it and will not render it. To prevent an error being thrown, we tell the compiler to use the `NO_ERRORS_SCHEMA`:

```
beforeEach(async(() => {
  TestBed.configureTestingModule({
    declarations: [InputLogComponent],
    providers: [LoggerService],
    schemas: [NO_ERRORS_SCHEMA]
  })
    .compileComponents();
}));
```

Running the same tests again with this further separation cuts the execution time down again to *15.403 seconds*. By simplifying the setup for shallow tests that are not dependent on the child component, we have managed to reduce test execution time by a further *7%* relative to the original execution time to give a *total time saving of 48%*.

The remaining test of the interaction with the child component’s API requires both templates in order to execute, so we cannot simplify the setup any further. This is called an integrated test because it tests that different parts of the application interact correctly. 

> At this point, you might wonder why we can’t just mock the child component and make all template tests shallow. But this approach is prone to ‘code rot’. For example, we if change child component API, the parent component tests based on mocks will continue to pass! To test how different parts of the app interact, we can’t rely on mocks. 

#### Summary

Walking through this example, we now understand why we should separate isolated, shallow and integrated tests: testing different functionality requires different setup and, since setup can be expensive, we should group our tests according to the minimum setup required for them to execute. 

That covers why we separate our unit tests. Regarding how we should do so, we now have a clear framework for deciding how to test a given piece of component functionality:

| Testing                     | Do we need to render template? | Do we need to render child components? | Type of test |
|:----------------------------|:-------------------------------|:---------------------------------------|:-------------|
| Function logic              | No                             | No                                     | Isolated     |
| Template data bindings      | Yes                            | No                                     | Shallow      |
|  Template function bindings | Yes                            | No                                     | Shallow      |
| Template logic              | Yes                            | No                                     | Shallow      |
| Child component API         | Yes                            | Yes                                    | Integrated   |

The five cases I’ve considered here are not exhaustive, but you can add to this framework to decide how further pieces of functionality should be tested. 

Hopefully the benefits of separating shallow, isolated and integrated tests are now clear. The exact time saving from grouping tests this way will of course depend on the structure of an application. But in our simple example, we’ve managed to *reduce test execution time by almost 50% without re-writing any tests*, simply by logically grouping them according to the minimum setup required. I hope this has been useful!
