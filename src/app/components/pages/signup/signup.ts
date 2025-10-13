import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { HttpService } from '../../../services/http.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ValidadorEmailDisponible } from '../../../validators/ValidadorEmailDisponible';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule,
    FormsModule,
    CommonModule,
    RouterModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup implements OnInit {
  signupForm!: FormGroup;
  provincias: any[] = [];



  private _snackBar = inject(MatSnackBar);
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private httpService: HttpService,
    private validadorEmail: ValidadorEmailDisponible,
    private router: Router,

  ) { }

  imagePreview: string | null = null;

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email], [this.validadorEmail.verificarEmailDisponible()]],
      password: ['', Validators.required],
      tipoDocumento: ['', [Validators.required]],
      nroDocumento: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^[0-9]+$/)]],
      idProvincia: ['', Validators.required],
      rutaImg: ['']
    });

    this.httpService.getProvincias().subscribe({

      next: (res) => this.provincias = res,
      error: (err) => console.error('Error fetching provincias', err)
    });
  }

  validarSoloNumeros(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',  // 'start' | 'center' | 'end' | 'left' | 'right'
      verticalPosition: 'bottom',      // 'top' | 'bottom'
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.authService.register(this.signupForm.value).subscribe({
        next: (res) => {
          this.openSnackBar("¡Bienvenido/a a Raices Vivas!")
          const email = this.signupForm.controls["email"].value
          const password = this.signupForm.controls["password"].value

          this.authService.login(email, password).subscribe(
            {
              next: () => {
                this.router.navigate(['/']);
              }
            }

          )
          this.router.navigate(['/'])

        },
        error: (err) => {
          alert("Error registrando usuario")
          console.error('Error registrando usuario', err);
        }
      });

    }

  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {

      const file = input.files[0];
      console.log(file);
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result as string;
        this.imagePreview = result;
        console.log(result);
        this.signupForm.patchValue({ rutaImg: result });
      };

      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.imagePreview = null;
    this.signupForm.patchValue({ rutaImg: '' });
  }



}