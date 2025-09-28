import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeComponent } from './welcome.component';
import { UserService } from '../../../services/userService';
import { AuthService } from '../../../services/authService';

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['getUsers', 'createUser', 'updateUser', 'deleteUser']);
  authServiceSpy = jasmine.createSpyObj('AuthService', ['logout', 'getUsername']);
  authServiceSpy.getUsername.and.returnValue('testuser');

    await TestBed.configureTestingModule({
      imports: [WelcomeComponent],
      providers: [
              { provide: UserService, useValue: userServiceSpy },
              { provide: AuthService, useValue: authServiceSpy }
            ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
