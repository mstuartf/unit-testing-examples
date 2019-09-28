import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {InputLogComponent} from './input-log/input-log.component';
import {LoggerService} from './logger.service';
import {ResetBtnComponent} from './reset-btn/reset-btn.component';

@NgModule({
  declarations: [
    AppComponent,
    InputLogComponent,
    ResetBtnComponent
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
export class AppModule {
}
