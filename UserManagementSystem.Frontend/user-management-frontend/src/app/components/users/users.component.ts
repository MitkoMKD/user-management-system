import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { UserService } from '../../../services/userService';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { AuthService } from '../../../services/authService';
import { UserDto } from '../../../models/UserDto';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
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
    MatIconModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit{
displayedColumns: string[] = ['username', 'email', 'role','fullName', 'isActive', 'actions'];
  dataSource = new MatTableDataSource<UserDto>();
  userForm: FormGroup;
  isEditing = false;
  editingUserId: number | null = null;
  searchSubject = new Subject<string>();

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
        console.log('UsersComponent initialized');

    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      passwordHash: ['', [Validators.required, Validators.minLength(6)]],
      role: ['User', Validators.required],
      fullName: ['', Validators.required],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadUsers();
      this.searchSubject.pipe(
        distinctUntilChanged(),
        switchMap((searchValue) => this.userService.getUsers(searchValue))
      ).subscribe({
        next: (users) => (this.dataSource.data = users as UserDto[]),
        error: (err) => console.error('Failed to search users:', err)
      });
    }
  }

  loadUsers(search: string = ''): void {
    this.userService.getUsers(search).subscribe({
      next: (users) => {
        this.dataSource.data = users as any;},
      error: (err) => console.error('Failed to load users:', err)
    });
  }

  onSearch(event: Event): void {
    const searchValue = (event.target as HTMLInputElement).value;
    this.searchSubject.next(searchValue);
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;

    const user = this.userForm.value;
    user.id = this.editingUserId;
    if (this.isEditing && this.editingUserId) {
      this.userService.updateUser(this.editingUserId as number, user).subscribe({
        next: () => {
          this.resetForm();
          this.loadUsers();
        },
        error: (err) => console.error('Failed to update user:', err)
      });
    } else {
      this.userService.createUser(user).subscribe({
        next: () => {
          this.loadUsers();
          this.resetForm();
        },
        error: (err) => console.error('Failed to register user:', err)
      });
    }
  }

  editUser(user: UserDto): void {
    this.isEditing = true;
    this.editingUserId = user.id;
    this.userForm.patchValue({
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      fullName: user.fullName,
      passwordHash: '' // Password is optional for updates
    });
    this.userForm.get('passwordHash')?.clearValidators();
    this.userForm.get('passwordHash')?.updateValueAndValidity();
  }

  resetForm(): void {
    this.isEditing = false;
    this.editingUserId = null;
    this.userForm.reset();
    this.userForm.patchValue({ role: 'User', isActive: true });
    this.userForm.get('passwordHash')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.get('passwordHash')?.updateValueAndValidity();
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => this.loadUsers(),
        error: (err) => console.error('Failed to delete user:', err)
      });
    }
  }

  logOut(): void {
    this.authService.logout();
  }
}