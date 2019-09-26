import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-value-display',
  templateUrl: './value-display.component.html',
  styleUrls: ['./value-display.component.css']
})
export class ValueDisplayComponent {
  @Input() inputValue: string;
}
