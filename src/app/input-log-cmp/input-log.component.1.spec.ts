import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {InputLogComponent} from './input-log.component';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {LoggerService} from '../logger-svc/logger.service';
import {ValueDisplayComponent} from '../value-display/value-display.component';

describe('1', () => {  // 49.792 secs // 23.907

  for (let i = 0; i < 500; i++) {

    describe('InputLogComponent', () => {

      let cmp: InputLogComponent;
      let fixture: ComponentFixture<InputLogComponent>;
      let input: DebugElement;

      beforeEach(async(() => {
        TestBed.configureTestingModule({
          declarations: [
            InputLogComponent,
            ValueDisplayComponent
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

      it('should log \'positive\' when the user inputs \'1\'', () => {
        spyOn(cmp.loggerSvc, 'logPositive');
        input.nativeElement.value = '1';
        input.triggerEventHandler('keyup', null);
        expect(cmp.loggerSvc.logPositive).toHaveBeenCalled();
      });

      it('should log \'negative\' when the user inputs \'-1\'', () => {
        spyOn(cmp.loggerSvc, 'logNegative');
        input.nativeElement.value = '-1';
        input.triggerEventHandler('keyup', null);
        expect(cmp.loggerSvc.logNegative).toHaveBeenCalled();
      });

      it('should log \'zero\' when the user inputs \'0\'', () => {
        spyOn(cmp.loggerSvc, 'logZero');
        input.nativeElement.value = '0';
        input.triggerEventHandler('keyup', null);
        expect(cmp.loggerSvc.logZero).toHaveBeenCalled();
      });

      it('should pass the input value to the display component', () => {
        input.nativeElement.value = '-1';
        fixture.detectChanges();
        const childCmp = fixture.debugElement.query(By.directive(ValueDisplayComponent));
        expect(childCmp).toBeTruthy();
        expect(childCmp.componentInstance.inputValue).toEqual('-1');
      });

    });

  }

});
