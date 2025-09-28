import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7095/api';

  constructor(private http: HttpClient, private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Auth/login`, credentials);
  }

  setSession(authResult: any) {
    if (isPlatformBrowser(this.platformId)) {
    localStorage.setItem('token', authResult.token);
    localStorage.setItem('role', authResult.role);
    localStorage.setItem('username', authResult.username);
    localStorage.setItem('isActive', authResult.isActive);
    }
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('username');
      localStorage.removeItem('isActive');
    }
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false; 
    }
    return !!localStorage.getItem('token');
  }

  getRole(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null; 
    }
    return localStorage.getItem('role');
  }

  getUsername(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null; 
    }
    return localStorage.getItem('username');
  }

  isActive(): boolean {
    return localStorage.getItem('isActive') === 'true';
  }
}