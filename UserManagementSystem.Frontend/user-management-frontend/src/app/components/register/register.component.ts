import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { isPlatformBrowser } from '@angular/common';
import { UserService } from '../../../services/userService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSnackBarModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      passwordHash: ['', [Validators.required, Validators.minLength(6)]],
      fullname: ['', [Validators.required]],
      role: ['User', Validators.required],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      }
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.snackBar.open('Please fill in all required fields correctly.', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    const user = this.registerForm.value;

    this.userService.createUser(user).subscribe({
      next: (response: { message: any; }) => {
        this.isLoading = false;
        this.snackBar.open(response.message || 'User registered successfully!', 'Close', { duration: 3000 });
        this.registerForm.reset({ role: 'User', isActive: true });
        this.router.navigate(['/user']);
      },
      error: (err: { error: { error: string; }; }) => {
        this.isLoading = false;
        const errorMessage = err.error?.error || 'Registration failed. Please try again.';
        this.snackBar.open(errorMessage, 'Close', { duration: 3000 });
      }
    });
  }
}