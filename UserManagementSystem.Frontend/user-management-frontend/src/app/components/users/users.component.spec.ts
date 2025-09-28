import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersComponent } from './users.component';
import { UserService } from '../../../services/userService';
import { AuthService } from '../../../services/authService';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  let userServiceSpy: jasmine.SpyObj<UserService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['getUsers', 'createUser', 'updateUser', 'deleteUser']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);
    // Always return observable for getUsers to avoid undefined.subscribe error
    userServiceSpy.getUsers.and.returnValue(of([]));
    await TestBed.configureTestingModule({
      imports: [
        UsersComponent,
        BrowserAnimationsModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatCheckboxModule,
        MatDialogModule,
        MatIconModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.userForm.value.role).toBe('User');
    expect(component.userForm.value.isActive).toBe(true);
  });

  it('should reset the form to default values and restore password validators', () => {
    component.userForm.patchValue({
      username: 'test',
      email: 'test@example.com',
      role: 'Admin',
      isActive: false,
      fullName: 'Test User',
      passwordHash: '123456'
    });
    component.isEditing = true;
    component.editingUserId = 123;
    component.resetForm();
    expect(component.isEditing).toBe(false);
    expect(component.editingUserId).toBeNull();
    expect(component.userForm.value.role).toBe('User');
    expect(component.userForm.value.isActive).toBe(true);
    // Password should be required again after reset
    const ctrl = component.userForm.get('passwordHash');
    ctrl?.setValue('');
    expect(ctrl?.valid).toBe(false);
    ctrl?.setValue('123456');
    expect(ctrl?.valid).toBe(true);
  });

  it('should patch the form and clear password validators when editUser is called', () => {
    const user = {
      id: 1,
      username: 'edituser',
      email: 'edit@example.com',
      role: 'Admin',
      isActive: false,
      fullName: 'Edit User',
      passwordHash: ''
    };
    component.editUser(user as any);
    expect(component.isEditing).toBe(true);
    expect(component.editingUserId).toBe(1);
    expect(component.userForm.value.username).toBe('edituser');
    expect(component.userForm.value.email).toBe('edit@example.com');
    expect(component.userForm.value.role).toBe('Admin');
    expect(component.userForm.value.isActive).toBe(false);
    expect(component.userForm.value.fullName).toBe('Edit User');
    // Password should not be required after editUser
    const ctrl = component.userForm.get('passwordHash');
    ctrl?.setValue('');
    expect(ctrl?.valid).toBe(true);
  });

  it('should call createUser on submit if not editing', () => {
    userServiceSpy.createUser.and.returnValue(of({}));
    spyOn(component, 'resetForm');
    spyOn(component, 'loadUsers');
    // Use valid values for all validators
    component.userForm.setValue({
      username: 'validuser', // minLength 3
      email: 'a@a.com',
      passwordHash: '123456', // minLength 6
      role: 'User',
      fullName: 'Valid Name', // minLength 1 (required)
      isActive: true
    });
    component.isEditing = false;
    component.onSubmit();
    expect(userServiceSpy.createUser).toHaveBeenCalled();
    expect(component.resetForm).toHaveBeenCalled();
    expect(component.loadUsers).toHaveBeenCalled();
  });

  it('should call updateUser on submit if editing', () => {
    userServiceSpy.updateUser.and.returnValue(of({}));
    spyOn(component, 'resetForm');
    spyOn(component, 'loadUsers');
    // Use valid values for all validators
    component.userForm.setValue({
      username: 'validuser',
      email: 'a@a.com',
      passwordHash: '123456',
      role: 'User',
      fullName: 'Valid Name',
      isActive: true
    });
    component.isEditing = true;
    component.editingUserId = 5;
    component.onSubmit();
    expect(userServiceSpy.updateUser).toHaveBeenCalledWith(5, jasmine.any(Object));
    expect(component.resetForm).toHaveBeenCalled();
    expect(component.loadUsers).toHaveBeenCalled();
  });

  it('should call deleteUser if confirmed', () => {
    userServiceSpy.deleteUser.and.returnValue(of({}));
    spyOn(window, 'confirm').and.returnValue(true);
    component.deleteUser(7);
    expect(userServiceSpy.deleteUser).toHaveBeenCalledWith(7);
  });

  it('should not call deleteUser if not confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.deleteUser(7);
    expect(userServiceSpy.deleteUser).not.toHaveBeenCalled();
  });
});
