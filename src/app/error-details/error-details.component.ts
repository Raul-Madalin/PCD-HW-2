import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-details',
  templateUrl: './error-details.component.html',
  styleUrls: ['./error-details.component.css']
})
export class ErrorDetailsComponent {
  @Input() errorData: any;
}
