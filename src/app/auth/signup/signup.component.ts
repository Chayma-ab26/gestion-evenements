import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  isLoading = false;
  selectedFile: File | null = null;

  roles = ['participant', 'organisateur'];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      phone: [''],
      role: ['participant', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {}

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value ? null : { mismatch: true };
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  getFieldError(field: string): string {
    const control = this.signupForm.get(field);
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Requis';
      if (control.errors['minlength']) return 'Trop court';
      if (control.errors['mismatch']) return 'Mots de passe différents';
    }
    return '';
  }

  onSubmit() {
    if (this.signupForm.valid) {

      this.isLoading = true;
      const formData = new FormData();

      // ⚠️ Champs EXACTS attendus par ton backend
      formData.append('username', this.signupForm.get('username')?.value);
      formData.append('password', this.signupForm.get('password')?.value);
      formData.append('firstname', this.signupForm.get('firstname')?.value);
      formData.append('lastname', this.signupForm.get('lastname')?.value);
      formData.append('phone', this.signupForm.get('phone')?.value || '');
      formData.append('role', this.signupForm.get('role')?.value);

      if (this.selectedFile) formData.append('file', this.selectedFile);

      this.userService.create(formData).subscribe({
        next: () => {
          this.isLoading = false;
          Swal.fire('Succès', 'Inscription réussie', 'success').then(() =>
            this.router.navigate(['/login'])
          );
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('Erreur:', error);
          Swal.fire('Erreur', 'Problème lors de l\'inscription', 'error');
        }
      });
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
}
