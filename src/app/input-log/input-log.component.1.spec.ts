import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {InputLogComponent} from './input-log.component';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {LoggerService} from '../logger.service';
import {ResetBtnComponent} from '../reset-btn/reset-btn.component';

describe('1', () => {  // 29.739 seconds

  for (let i = 0; i < 250; i++) {

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

      // TEMPLATE BINDINGS ---------------------------------------------------------------------

      it('should display the input value in the paragraph', () => {
        input.nativeElement.value = '1';
        fixture.detectChanges();
        const p = fixture.debugElement.query(By.css('p'));
        expect(p.nativeElement.textContent.trim()).toEqual('1');
      });

      // TEMPLATE CALLBACKS --------------------------------------------------------------------

      it('should trigger logType on \'keyup\' with the input value', () => {
        spyOn(cmp, 'logType');
        input.nativeElement.value = '1';
        input.triggerEventHandler('keyup', null);
        expect(cmp.logType).toHaveBeenCalledWith('1');
      });

      // TEMPLATE LOGIC ------------------------------------------------------------------------

      it('should style the paragraph green if the input value is >0', () => {
        input.nativeElement.value = '1';
        fixture.detectChanges();
        const p = fixture.debugElement.query(By.css('p'));
        expect(p.styles.color).toEqual('green');
      });

      it('should style the paragraph red if the input value is <= 0', () => {
        input.nativeElement.value = '0';
        fixture.detectChanges();
        const p = fixture.debugElement.query(By.css('p'));
        expect(p.styles.color).toEqual('red');
      });

      // FUNCTION LOGIC ------------------------------------------------------------------------

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

      // CHILD COMPONENT API -------------------------------------------------------------------

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
