import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputLogComponent } from './input-log.component';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';

for (let i = 0; i < 1000; i++) {

  describe('InputLogComponent', () => {

    let component: InputLogComponent;
    let fixture: ComponentFixture<InputLogComponent>;
    let input: DebugElement;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [ InputLogComponent ]
      })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(InputLogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      input = fixture.debugElement.query(By.css('input'));
    });

    it('should log \'positive\' when the user inputs \'1\'', () => {
      spyOn(console, 'log');
      input.nativeElement.value = '1';
      input.triggerEventHandler('keyup', null);
      expect(console.log).toHaveBeenCalledWith('positive');
    });

    it('should log \'negative\' when the user inputs \'-1\'', () => {
      spyOn(console, 'log');
      input.nativeElement.value = '-1';
      input.triggerEventHandler('keyup', null);
      expect(console.log).toHaveBeenCalledWith('negative');
    });

    it('should log \'zero\' when the user inputs \'0\'', () => {
      spyOn(console, 'log');
      input.nativeElement.value = '0';
      input.triggerEventHandler('keyup', null);
      expect(console.log).toHaveBeenCalledWith('zero');
    });

  });

}


