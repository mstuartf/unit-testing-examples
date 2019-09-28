import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {InputLogComponent} from './input-log.component';
import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {By} from '@angular/platform-browser';
import {LoggerService} from '../logger.service';
import {ResetBtnComponent} from '../reset-btn/reset-btn.component';

describe('4', () => {  // 12.638 secs

  for (let i = 0; i < 500; i++) {

    describe('InputLogComponent (shallow)', () => {

      let cmp: InputLogComponent;
      let fixture: ComponentFixture<InputLogComponent>;
      let input: DebugElement;

      beforeEach(async(() => {
        TestBed.configureTestingModule({
          declarations: [InputLogComponent],
          providers: [{
            provide: LoggerService,
            useValue: jasmine.createSpyObj<LoggerService>(['logPositive', 'logNegative', 'logZero'])
          }],
          schemas: [NO_ERRORS_SCHEMA]
        })
          .compileComponents();
      }));

      beforeEach(() => {
        fixture = TestBed.createComponent(InputLogComponent);
        cmp = fixture.componentInstance;
        fixture.detectChanges();
        input = fixture.debugElement.query(By.css('input'));
      });

      it('should trigger logType on \'keyup\' with the input value', () => {
        spyOn(cmp, 'logType');
        input.nativeElement.value = '1';
        input.triggerEventHandler('keyup', null);
        expect(cmp.logType).toHaveBeenCalledWith('1');
      });

    });

    describe('InputLogComponent (integrated)', () => {

      let cmp: InputLogComponent;
      let fixture: ComponentFixture<InputLogComponent>;
      let input: DebugElement;

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

      beforeEach(() => {
        fixture = TestBed.createComponent(InputLogComponent);
        cmp = fixture.componentInstance;
        fixture.detectChanges();
        input = fixture.debugElement.query(By.css('input'));
      });

      it('should reset the input value when the reset btn component emits \'reset\'', () => {
        input.nativeElement.value = '-1';
        fixture.detectChanges();
        const childCmp = fixture.debugElement.query(By.directive(ResetBtnComponent));
        childCmp.triggerEventHandler('reset', {});
        fixture.detectChanges();
        expect(input.nativeElement.value).toBe('');
      });

    });

    describe('InputLogComponent (isolated)', () => {

      let cmp: InputLogComponent;

      beforeEach(() => {
        cmp = new InputLogComponent(jasmine.createSpyObj<LoggerService>(['logPositive', 'logNegative', 'logZero']));
      });

      it('should call \'logPositive\' when the user inputs \'1\'', () => {
        cmp.logType('1');
        expect(cmp.loggerSvc.logPositive).toHaveBeenCalled();
      });

      it('should call \'logNegative\' when the user inputs \'-1\'', () => {
        cmp.logType('-1');
        expect(cmp.loggerSvc.logNegative).toHaveBeenCalled();
      });

      it('should call \'logZero\' when the user inputs \'0\'', () => {
        cmp.logType('0');
        expect(cmp.loggerSvc.logZero).toHaveBeenCalled();
      });

    });

  }

});
