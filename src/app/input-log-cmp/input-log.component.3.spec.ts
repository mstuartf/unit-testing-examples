import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {InputLogComponent} from './input-log.component';
import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {By} from '@angular/platform-browser';
import {LoggerService} from '../logger-svc/logger.service';
import {ValueDisplayComponent} from '../value-display/value-display.component';

describe('3', () => {  // 25.241 secs // 11.485

  for (let i = 0; i < 500; i++) {

    describe('InputLogComponent (shallow)', () => {

      let cmp: InputLogComponent;
      let fixture: ComponentFixture<InputLogComponent>;
      let input: DebugElement;

      beforeEach(async(() => {
        TestBed.configureTestingModule({
          declarations: [InputLogComponent],
          providers: [LoggerService],
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

      it('should log \'positive\' when the user inputs \'1\'', () => {
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

      it('should pass the input value to the display component', () => {
        input.nativeElement.value = '-1';
        fixture.detectChanges();
        const childCmp = fixture.debugElement.query(By.directive(ValueDisplayComponent));
        expect(childCmp).toBeTruthy();
        expect(childCmp.componentInstance.inputValue).toEqual('-1');
      });

    });

    describe('InputLogComponent (isolated)', () => {

      let cmp: InputLogComponent;

      beforeEach(() => {
        cmp = new InputLogComponent(new LoggerService());
      });

      it('should call \'logPositive\' when the user inputs \'1\'', () => {
        spyOn(cmp.loggerSvc, 'logPositive');
        cmp.logType('1');
        expect(cmp.loggerSvc.logPositive).toHaveBeenCalled();
      });

      it('should call \'logNegative\' when the user inputs \'-1\'', () => {
        spyOn(cmp.loggerSvc, 'logNegative');
        cmp.logType('-1');
        expect(cmp.loggerSvc.logNegative).toHaveBeenCalled();
      });

      it('should call \'logZero\' when the user inputs \'0\'', () => {
        spyOn(cmp.loggerSvc, 'logZero');
        cmp.logType('0');
        expect(cmp.loggerSvc.logZero).toHaveBeenCalled();
      });

    });

  }

});
