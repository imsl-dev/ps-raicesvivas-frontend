import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { HttpService } from '../../../services/http.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ValidadorEmailDisponible } from '../../../validators/ValidadorEmailDisponible';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule,
    FormsModule,
    CommonModule,
    RouterModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup implements OnInit {
  signupForm!: FormGroup;
  provincias: any[] = [];

  private _snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

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
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      // Open the Terms and Conditions dialog
      const dialogRef = this.dialog.open(TermsDialogComponent, {
        width: '600px',
        maxWidth: '90vw',
        maxHeight: '90vh',
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          // User accepted terms, proceed with registration
          this.proceedWithRegistration();
        }
        // If result is false or undefined, do nothing (user declined or closed dialog)
      });
    }
  }

  private proceedWithRegistration() {
    this.authService.register(this.signupForm.value).subscribe({
      next: (res) => {
        this.openSnackBar("¡Bienvenido/a a Raices Vivas!")
        const email = this.signupForm.controls["email"].value
        const password = this.signupForm.controls["password"].value

        this.authService.login(email, password).subscribe({
          next: () => {
            this.router.navigate(['/']);
          }
        })
      },
      error: (err) => {
        alert("Error registrando usuario")
        console.error('Error registrando usuario', err);
      }
    });
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

// Terms and Conditions Dialog Component
@Component({
  selector: 'app-terms-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatCheckboxModule, FormsModule],
  template: `
    <div class="terms-dialog">
      <h2 mat-dialog-title class="dialog-title">Términos y Condiciones</h2>
      
      <mat-dialog-content class="dialog-content" #dialogContent>
        <div class="terms-text">
          <p class="update-date">Última actualización: 20/11/2025</p>
          
          <p>Al usar RaícesVivas, aceptás estos términos simplificados:</p>
          
          <h3>1. Uso y Registro</h3>
          <ul>
            <li>Debés ser mayor de 18 años.</li>
            <li>Debés brindar datos verdaderos: nombre, apellido, email, provincia y fecha de nacimiento.</li>
          </ul>
          
          <h3>2. Inscripción a Eventos</h3>
          <ul>
            <li>La inscripción se paga mediante MercadoPago.</li>
            <li>No existen reembolsos, sin excepción.</li>
            <li>La participación y asistencia dependen del organizador del evento.</li>
          </ul>
          
          <h3>3. Asistencia y Puntos</h3>
          <ul>
            <li>Los organizadores registran la asistencia.</li>
            <li>Solo los usuarios que asisten reciben Puntos.</li>
            <li>Los Puntos no tienen valor monetario, no se reembolsan ni se transfieren.</li>
            <li>Los Puntos pueden canjearse por beneficios dentro de la app.</li>
          </ul>
          
          <h3>4. Donaciones</h3>
          <ul>
            <li>Son voluntarias.</li>
            <li>Se realizan por MercadoPago.</li>
            <li>No admiten reembolso.</li>
          </ul>
          
          <h3>5. Organizadores</h3>
          <ul>
            <li>Podés solicitar ser organizador completando el formulario.</li>
            <li>Los administradores pueden aceptar o rechazar la solicitud sin apelaciones.</li>
            <li>Si te convertís en organizador, perdés todos tus Puntos.</li>
          </ul>
          
          <h3>6. Responsabilidad de Eventos</h3>
          <ul>
            <li>Los eventos son organizados por terceros independientes.</li>
            <li>RaícesVivas no se responsabiliza por incidentes, cancelaciones o problemas en los eventos.</li>
          </ul>
          
          <h3>7. Datos Personales</h3>
          <ul>
            <li>Solo se recopilan: nombre, apellido, email, provincia y fecha de nacimiento.</li>
            <li>Se usan para gestionar tu cuenta, inscripciones y solicitudes.</li>
            <li>No se comparten con terceros salvo obligación legal.</li>
          </ul>
          
          <h3>8. Aceptación</h3>
          <p>Al continuar, confirmás que leíste y aceptás estos Términos y Condiciones.</p>
        </div>
      </mat-dialog-content>
      
      <div class="checkbox-container">
        <mat-checkbox [(ngModel)]="termsAccepted" class="terms-checkbox">
          He leído y acepto los Términos y Condiciones
        </mat-checkbox>
      </div>
      
      <mat-dialog-actions class="dialog-actions">
        <button mat-stroked-button (click)="onDecline()" class="btn-decline">
          Rechazar
        </button>
        <button mat-raised-button [disabled]="!termsAccepted" (click)="onAccept()" class="btn-accept">
          Aceptar y Continuar
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .terms-dialog {
      font-family: inherit;
    }

    .dialog-title {
      color: #2c3e50;
      font-size: 1.75rem;
      font-weight: 700;
      margin: 0;
      padding: 1.5rem 1.5rem 1rem;
      background: linear-gradient(135deg, #28a745, #20c997);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      border-bottom: 2px solid #e9ecef;
    }

    .dialog-content {
      padding: 1.5rem;
      max-height: 60vh;
      overflow-y: auto;
    }

    .terms-text {
      color: #2c3e50;
      line-height: 1.6;
    }

    .update-date {
      color: #6c757d;
      font-size: 0.9rem;
      font-style: italic;
      margin-bottom: 1rem;
    }

    .terms-text h3 {
      color: #28a745;
      font-size: 1.1rem;
      font-weight: 600;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
    }

    .terms-text ul {
      margin: 0.5rem 0;
      padding-left: 1.5rem;
    }

    .terms-text li {
      margin: 0.5rem 0;
      color: #495057;
    }

    .terms-text p {
      margin: 0.75rem 0;
      color: #495057;
    }

    .checkbox-container {
      margin: 0 1.5rem;
      padding: 1rem;
      background-color: #f8f9fa;
      border-radius: 10px;
      border: 2px solid #e9ecef;
    }

    .terms-checkbox {
      font-weight: 500;
      color: #2c3e50;
    }

    ::ng-deep .terms-checkbox .mat-checkbox-frame {
      border-color: #28a745;
      border-width: 2px;
    }

    ::ng-deep .terms-checkbox.mat-checkbox-checked .mat-checkbox-background {
      background-color: #28a745;
    }

    ::ng-deep .terms-checkbox .mat-checkbox-label {
      font-size: 0.95rem;
    }

    .dialog-actions {
      padding: 1rem 1.5rem 1.5rem;
      justify-content: space-between;
      border-top: 2px solid #e9ecef;
      gap: 1rem;
    }

    .btn-decline {
      color: #dc3545;
      border-color: #dc3545;
      font-weight: 600;
      padding: 0.5rem 1.5rem;
      border-radius: 10px;
      transition: all 0.3s ease;
    }

    .btn-decline:hover {
      background-color: #dc3545;
      color: white;
    }

    .btn-accept {
      background: linear-gradient(135deg, #28a745, #20c997);
      color: white;
      font-weight: 600;
      padding: 0.5rem 1.5rem;
      border-radius: 10px;
      transition: all 0.3s ease;
    }

    .btn-accept:hover:not(:disabled) {
      background: linear-gradient(135deg, #218838, #1fa383);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
    }

    .btn-accept:disabled {
      background: linear-gradient(135deg, #6c757d, #5a6268);
      color: rgba(255, 255, 255, 0.5);
      cursor: not-allowed;
    }

    /* Scrollbar styling */
    .dialog-content::-webkit-scrollbar {
      width: 8px;
    }

    .dialog-content::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }

    .dialog-content::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #28a745, #20c997);
      border-radius: 10px;
    }

    .dialog-content::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, #218838, #1fa383);
    }

    @media (max-width: 600px) {
      .dialog-title {
        font-size: 1.5rem;
        padding: 1rem;
      }

      .dialog-content {
        padding: 1rem;
      }

      .dialog-actions {
        flex-direction: column;
        padding: 1rem;
      }

      .btn-decline,
      .btn-accept {
        width: 100%;
      }
    }
  `]
})
export class TermsDialogComponent implements AfterViewInit {
  termsAccepted = false;
  @ViewChild('dialogContent') dialogContent!: ElementRef;

  constructor(
    private dialogRef: MatDialogRef<TermsDialogComponent>
  ) { }

  ngAfterViewInit() {
    // Scroll to top when dialog opens
    if (this.dialogContent) {
      this.dialogContent.nativeElement.scrollTop = 0;
    }
  }

  onAccept() {
    this.dialogRef.close(true);
  }

  onDecline() {
    this.dialogRef.close(false);
  }
}