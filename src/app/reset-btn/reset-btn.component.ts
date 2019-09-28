import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-reset-btn',
  templateUrl: './reset-btn.component.html',
  styleUrls: ['./reset-btn.component.css']
})
export class ResetBtnComponent {
  @Output() reset: EventEmitter<null> = new EventEmitter<null>();
}
