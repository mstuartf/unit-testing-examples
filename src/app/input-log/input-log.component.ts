import { Component } from '@angular/core';

@Component({
  selector: 'app-input-log',
  templateUrl: './input-log.component.html',
  styleUrls: ['./input-log.component.css']
})
export class InputLogComponent {

  public logType(raw: string): void {
    const value = parseInt(raw, 10);
    if (value > 0) {
      console.log('positive');
    } else if (value < 0) {
      console.log('negative');
    } else {
      console.log('zero');
    }
  }

}
