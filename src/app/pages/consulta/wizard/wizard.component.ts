import { ConsultaListaExamenDTO } from './../../../_dto/consultaListaExamenDTO';
import { Consulta } from './../../../_model/consulta';
import { DetalleConsulta } from './../../../_model/detalleConsulta';
import { Examen } from './../../../_model/examen';
import { Medico } from './../../../_model/medico';
import { Especialidad } from './../../../_model/especialidad';
import { Paciente } from './../../../_model/paciente';
import { ConsultaService } from './../../../_service/consulta.service';
import { ExamenService } from './../../../_service/examen.service';
import { MedicoService } from './../../../_service/medico.service';
import { EspecialidadService } from './../../../_service/especialidad.service';
import { PacienteService } from './../../../_service/paciente.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.css']
})
export class WizardComponent implements OnInit {

  @ViewChild('stepper') stepper: MatStepper;

  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  pacientes: Paciente[] = [];
  especialidades: Especialidad[] = [];
  medicos: Medico[] = [];
  examenes: Examen[] = [];

  fechaSeleccionada: Date = new Date();
  maxFecha: Date = new Date();

  diagnostico: string;
  tratamiento: string;
  mensaje: string;

  detalleConsulta: DetalleConsulta[] = [];
  examenesSeleccionados: Examen[] = [];

  medicoSeleccionado: Medico;
  especialidadSeleccionada: Especialidad;
  pacienteSeleccionado: Paciente;
  examenSeleccionado: Examen;

  consultorios: number[] = [];
  consultorioSeleccionado: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private pacienteService: PacienteService,
    private especialidadService: EspecialidadService,
    private medicoService: MedicoService,
    private examenService: ExamenService,
    private consultaService: ConsultaService
  ) { }

  ngOnInit(): void {
    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required],
      fecha: ['', new FormControl(new Date(), [Validators.required])],
      'diagnostico': new FormControl(''),
      'tratamiento': new FormControl(''),
    });

    this.secondFormGroup = this.formBuilder.group({
      hidden: ['', Validators.required]
    });

    this.listarPacientes();
    this.listarExamenes();
    this.listarMedicos();
    this.listarEspecialidad();
    this.listarConsultorios();
  }


  seleccionarPaciente(e: any) {
    this.pacienteSeleccionado = e.value;
  }

  seleccionarEspecialidad(e: any) {
    this.especialidadSeleccionada = e.value;
  }

  seleccionarMedico(medico: Medico) {
    this.medicoSeleccionado = medico;
  }

  agregar() {

    if (this.diagnostico != null && this.tratamiento != null) {
      let det = new DetalleConsulta();
      det.diagnostico = this.diagnostico;
      det.tratamiento = this.tratamiento;
      this.detalleConsulta.push(det);
      this.diagnostico = null;
      this.tratamiento = null;
    } else {
      this.mensaje = `Debe agregar un diagnóstico y tramiento`;
      this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });
    }
  }

  agregarExamen() {
    if (this.examenSeleccionado) {
      let cont = 0;
      for (let i = 0; i < this.examenesSeleccionados.length; i++) {
        let examen = this.examenesSeleccionados[i];
        if (examen.idExamen === this.examenSeleccionado.idExamen) {
          cont++;
          break;
        }
      }
      if (cont > 0) {
        this.mensaje = `El examen se encuentra en la lista`;
        this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });
      } else {
        this.examenesSeleccionados.push(this.examenSeleccionado);
      }
    } else {
      this.mensaje = `Debe agregar un examen`;
      this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });
    }
  }

  seleccionarConsultorio(c: number) {
    this.consultorioSeleccionado = c;
  }

  estadoBotonRegistrar() {
    return (this.detalleConsulta.length === 0 || this.especialidadSeleccionada === undefined || this.medicoSeleccionado === undefined || this.pacienteSeleccionado === undefined || this.consultorioSeleccionado === 0);
  }


  removerDiagnostico(index: number) {
    this.detalleConsulta.splice(index, 1);
  }

  removerExamen(index: number) {
    this.examenesSeleccionados.splice(index, 1);
  }

  listarConsultorios() {
    for (let i = 1; i <= 20; i++) {
      this.consultorios.push(i);
    }
  }

  listarPacientes() {
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    });
  }

  listarEspecialidad() {
    this.especialidadService.listar().subscribe(data => {
      this.especialidades = data;
    });
  }

  listarMedicos() {
    this.medicoService.listar().subscribe(data => {
      this.medicos = data;
    });
  }

  listarExamenes() {
    this.examenService.listar().subscribe(data => {
      this.examenes = data;
    });
  }

  nextManualStep() {    
    if (this.consultorioSeleccionado > 0) {
        this.stepper.linear = false;
        this.stepper.next();
    } else {
      this.snackBar.open('DEBES SELECCIONAR ASIENTO', 'INFO', { duration: 2000 });
    }

  }

  registrar() {
    let consulta = new Consulta();
    consulta.especialidad = this.especialidadSeleccionada;
    consulta.medico = this.medicoSeleccionado;
    consulta.paciente = this.pacienteSeleccionado;
    consulta.fecha = moment(this.fechaSeleccionada).format('YYYY-MM-DDTHH:mm:ss');
    consulta.detalleConsulta = this.detalleConsulta;
    consulta.numConsultorio = `C${this.consultorioSeleccionado}`;

    let consultaListaExamenDTO = new ConsultaListaExamenDTO();
    consultaListaExamenDTO.consulta = consulta;
    consultaListaExamenDTO.lstExamen = this.examenesSeleccionados;

    this.consultaService.registrarTransaccion(consultaListaExamenDTO).subscribe(() => {
      this.snackBar.open("Se registró", "Aviso", { duration: 2000 });

      setTimeout(() => {
        this.limpiarControles();
      }, 2000);
    });
  }

  limpiarControles() {
    this.detalleConsulta = [];
    this.examenesSeleccionados = [];
    this.diagnostico = '';
    this.tratamiento = '';
    this.pacienteSeleccionado = undefined;
    this.especialidadSeleccionada = undefined;
    this.medicoSeleccionado = undefined;
    this.examenSeleccionado = undefined;
    this.fechaSeleccionada = new Date();
    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);
    this.consultorioSeleccionado = 0;
    this.mensaje = '';
    this.stepper.reset();
  }

}
