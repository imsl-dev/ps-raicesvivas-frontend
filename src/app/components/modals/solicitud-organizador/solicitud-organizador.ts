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
    // Don't close this dialog yet, just open the form dialog
    const formDialogRef = this.formSolicitudDialog.open(FrmSolicitudOrganizador);

    // Listen for the form dialog result
    formDialogRef.afterClosed().subscribe((result) => {
      // Now close THIS dialog and pass the result up to Profile
      this.dialogRef.close(result);
    });
  }
}
