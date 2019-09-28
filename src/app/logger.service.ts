import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  public logNegative(): void {
    console.log('negative');
  }

  public logPositive(): void {
    console.log('positive');
  }

  public logZero(): void {
    console.log('zero');
  }

}
