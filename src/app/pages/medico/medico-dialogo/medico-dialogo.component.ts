import { MedicoService } from './../../../_service/medico.service';
import { Medico } from './../../../_model/medico';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-medico-dialogo',
  templateUrl: './medico-dialogo.component.html',
  styleUrls: ['./medico-dialogo.component.css']
})
export class MedicoDialogoComponent implements OnInit {

  medico: Medico;

  constructor(
    private dialogRef: MatDialogRef<MedicoDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Medico,
    private medicoService: MedicoService
  ) { }

  ngOnInit(): void {
    this.medico = new Medico();
    this.medico.idMedico = this.data.idMedico;
    this.medico.nombres = this.data.nombres;
    this.medico.apellidos = this.data.apellidos;
    this.medico.cmp = this.data.cmp;
    this.medico.fotoUrl = this.data.fotoUrl;
  }

  operar() {
    if (this.medico != null && this.medico.idMedico > 0) {
      //MODIFICAR
      //PRACTICA IDEAL
      this.medicoService.modificar(this.medico).pipe(switchMap(() => {
        return this.medicoService.listar();
      })).subscribe(data => {
        this.medicoService.setMedicoCambio(data);
        this.medicoService.setMensajeCambio('SE MODIFICO');
      });

      //PRACTICA COMUN
      /*this.medicoService.modificar(this.medico).subscribe(() => {
        this.medicoService.listar().subscribe(data => {
          this.medicoService.medicoCambio.next(data);
        });
      });*/
    } else {
      //REGISTRAR
      this.medicoService.registrar(this.medico).pipe(switchMap(() => {
        return this.medicoService.listar();
      })).subscribe(data => {
        this.medicoService.setMedicoCambio(data);
        this.medicoService.setMensajeCambio('SE REGISTRO');
      });
    }
    this.cancelar();
  }

  cancelar() {
    this.dialogRef.close();
  }

}
