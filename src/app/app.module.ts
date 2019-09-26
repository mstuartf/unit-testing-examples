import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { InputLogComponent } from './input-log-cmp/input-log.component';
import {LoggerService} from './logger-svc/logger.service';
import { ValueDisplayComponent } from './value-display/value-display.component';

@NgModule({
  declarations: [
    AppComponent,
    InputLogComponent,
    ValueDisplayComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    LoggerService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
