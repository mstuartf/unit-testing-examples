import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {InputLogComponent} from './input-log.component';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {LoggerService} from '../logger-svc/logger.service';
import {ResetBtnComponent} from '../reset-btn-cmp/reset-btn.component';

describe('1', () => {

  for (let i = 0; i < 1000; i++) {

    describe('InputLogComponent', () => {

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

      it('should call \'logPositive\' when the user inputs \'1\'', () => {
        spyOn(cmp.loggerSvc, 'logPositive');
        input.nativeElement.value = '1';
        input.triggerEventHandler('keyup', null);
        expect(cmp.loggerSvc.logPositive).toHaveBeenCalled();
      });

      it('should call \'logNegative\' when the user inputs \'-1\'', () => {
        spyOn(cmp.loggerSvc, 'logNegative');
        input.nativeElement.value = '-1';
        input.triggerEventHandler('keyup', null);
        expect(cmp.loggerSvc.logNegative).toHaveBeenCalled();
      });

      it('should call \'logZero\' when the user inputs \'0\'', () => {
        spyOn(cmp.loggerSvc, 'logZero');
        input.nativeElement.value = '0';
        input.triggerEventHandler('keyup', null);
        expect(cmp.loggerSvc.logZero).toHaveBeenCalled();
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

  }

});
