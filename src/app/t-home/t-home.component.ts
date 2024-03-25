import { Component } from '@angular/core';

@Component({
  selector: 'app-t-home',
  templateUrl: './t-home.component.html',
  styleUrl: './t-home.component.css'
})
export class THomeComponent {
  isTextVisible1: boolean = false;
  isTextVisible2: boolean = false;
  isTextVisible3: boolean = false;

  toggleText(textIndex: any): void {
    if (textIndex == 1) {
      this.isTextVisible1 = !this.isTextVisible1;
   }
   else if (textIndex == 2) {
    this.isTextVisible2 = !this.isTextVisible2;
 }
 else if (textIndex == 3) {
  this.isTextVisible3 = !this.isTextVisible3;
}
}
}
