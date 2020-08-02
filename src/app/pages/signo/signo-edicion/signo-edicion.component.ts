import { Signo } from './../../../_model/signo';
import { PacienteService } from './../../../_service/paciente.service';
import { Paciente } from './../../../_model/paciente';
import { Observable } from 'rxjs';
import { SignoService } from './../../../_service/signo.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-signo-edicion',
  templateUrl: './signo-edicion.component.html',
  styleUrls: ['./signo-edicion.component.css']
})
export class SignoEdicionComponent implements OnInit {

  form: FormGroup;
  id: number;
  edicion: boolean;

  pacienteEdicion: Paciente;

  maxFecha: Date = new Date();
  fechaSeleccionada: Date = new Date();
  pacienteSeleccionado: Paciente;
  pacientes: Paciente[] = [];

  myControlPaciente: FormControl = new FormControl();

  pacientesFiltrados: Observable<Paciente[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private signoService: SignoService,
    private pacienteService: PacienteService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'id': new FormControl(0),
      'paciente' : this.myControlPaciente,
      'temperatura': new FormControl('', Validators.required),
      'pulso': new FormControl('', Validators.required),
      'ritmoCardiaco': new FormControl(''),
      'fecha': new FormControl('')
    });

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.initForm();
    });

    this.listarPacientes();

    this.pacientesFiltrados = this.myControlPaciente.valueChanges.pipe(map(val => this.filtrarPacientes(val)));
  }

  initForm() {
    //EDITAR, por lo tanto carga la data a editar
    if (this.edicion) {
      this.signoService.listarPorId(this.id).subscribe(data => {
        this.form = new FormGroup({
          'id': new FormControl(data.idSigno),
          'temperatura': new FormControl(data.temperatura),
          'paciente': new FormControl(data.paciente),
          'pulso': new FormControl(data.pulso),
          'ritmoCardiaco': new FormControl(data.ritmoCardiaco),
          'fecha': new FormControl(data.fecha)
        });
        this.pacienteEdicion = data.paciente;
      });
    }

    
  }

  listarPacientes() {
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    });
  }

  filtrarPacientes(val: any) {
    if (val != null && val.idPaciente > 0) {
      return this.pacientes.filter(el =>
        el.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || el.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) || el.dni.includes(val.dni)
      );
    }    
    return this.pacientes.filter(el =>
      el.nombres.toLowerCase().includes(val?.toLowerCase()) || el.apellidos.toLowerCase().includes(val?.toLowerCase()) || el.dni.includes(val)
    );
  }

  seleccionarPaciente(e: any) {
    this.pacienteSeleccionado = e.option.value;
  }

  mostrarPaciente(val: Paciente) {
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }


  get f() { return this.form.controls; }

  operar(){

    if (this.form.invalid) { return; }

    let signo = new Signo();
    signo.idSigno = this.form.value['id'];
    signo.paciente = this.pacienteEdicion;
    signo.temperatura = this.form.value['temperatura'];
    signo.pulso = this.form.value['pulso'];
    signo.ritmoCardiaco = this.form.value['ritmoCardiaco'];
    signo.fecha = moment(this.form.value['fecha']).format('YYYY-MM-DDTHH:mm:ss');

    if (this.edicion) {
      //MODIFICAR
      this.signoService.modificar(signo).subscribe(() => {
        this.signoService.listar().subscribe(data => {
          this.signoService.signoCambio.next(data);
          this.signoService.mensajeCambio.next('SE MODIFICO');
        });
      });
    } else {
      //INSERTAR
      this.signoService.registrar(signo).subscribe(() => {
        this.signoService.listar().subscribe(data => {
          this.signoService.signoCambio.next(data);
          this.signoService.mensajeCambio.next('SE REGISTRO');
        });
      });
    }
    this.router.navigate(['signo']);
  }

}
