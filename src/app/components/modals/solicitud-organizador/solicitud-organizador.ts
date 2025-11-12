import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FrmSolicitudOrganizador } from '../frm-solicitud-organizador/frm-solicitud-organizador';
@Component({
  selector: 'app-solicitud-organizador',
  imports: [MatDialogModule, MatDialogContent, MatDialogActions, MatButtonModule, ReactiveFormsModule],
  templateUrl: './solicitud-organizador.html',
  styleUrl: './solicitud-organizador.css'
})
export class SolicitudOrganizador {
  data = inject(MAT_DIALOG_DATA)

  formSolicitudDialog = inject(MatDialog)

  constructor(
    private dialogRef: MatDialogRef<SolicitudOrganizador>,

  ) { }

  openDialog() {

    this.dialogRef.close();

    // Wait for closing animation before opening the new one
    this.dialogRef.afterClosed().subscribe(() => {
      this.formSolicitudDialog.open(FrmSolicitudOrganizador);
    });



  }
}
