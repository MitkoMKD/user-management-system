import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDto } from '../models/UserDto';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'https://localhost:7095/api/';

constructor(private http: HttpClient) {}

  getUsers(search: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}Users`, { params: { search } });
  }

  getUser(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createUser(user: any): Observable<any> {
    return this.http.post<{ message: string; user: UserDto }>(this.apiUrl+'Auth/register', user);
  }

  updateUser(id: number, user: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}Users/${id}`, user as UserDto);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}Users/${id}`);
  }
}