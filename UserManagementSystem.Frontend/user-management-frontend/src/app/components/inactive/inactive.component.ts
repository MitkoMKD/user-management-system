import { Component } from '@angular/core';

@Component({
  selector: 'app-inactive',
  standalone: true,
  imports: [],
  templateUrl: './inactive.component.html',
  styleUrl: './inactive.component.scss'
})
export class InactiveComponent {
constructor() {
    console.log('InactiveComponent initialized');
  }
}
