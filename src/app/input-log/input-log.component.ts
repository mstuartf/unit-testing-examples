import { Component } from '@angular/core';
import {LoggerService} from '../logger.service';

@Component({
  selector: 'app-input-log',
  templateUrl: './input-log.component.html',
  styleUrls: ['./input-log.component.css']
})
export class InputLogComponent {

  constructor(public loggerSvc: LoggerService) {}

  public logType(raw: string): void {
    const value = parseInt(raw, 10);
    if (value > 0) {
      this.loggerSvc.logPositive();
    } else if (value < 0) {
      this.loggerSvc.logNegative();
    } else {
      this.loggerSvc.logZero();
    }
  }

}
