import { Component } from '@angular/core';
import { AuthService } from '../../../services/authService';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {
  public username: string | undefined;
  constructor(private authService: AuthService) {
    console.log('WelcomeComponent initialized');
    this.username = this.authService.getUsername() as string;
  }

  logOut(): void {
    this.authService.logout();
  }
}
