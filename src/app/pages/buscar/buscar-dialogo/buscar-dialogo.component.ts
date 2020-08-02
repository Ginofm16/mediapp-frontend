import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConsultaService } from './../../../_service/consulta.service';
import { ConsultaListaExamenDTO } from './../../../_dto/consultaListaExamenDTO';
import { Consulta } from './../../../_model/consulta';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-buscar-dialogo',
  templateUrl: './buscar-dialogo.component.html',
  styleUrls: ['./buscar-dialogo.component.css']
})
export class BuscarDialogoComponent implements OnInit {

  consulta: Consulta;
  examenes: ConsultaListaExamenDTO[];

  constructor(
    private consultaService : ConsultaService,
    private dialogRef: MatDialogRef<BuscarDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Consulta
  ) { }

  ngOnInit(): void {
    this.consulta = this.data;
    this.listarExamenes();
  }

  cancelar(){
    this.dialogRef.close();
  }

  listarExamenes(){
    this.consultaService.listarExamenPorConsulta(this.consulta.idConsulta).subscribe(data => {
      this.examenes = data;
    })
  }


}
