import { GenericService } from './generic.service';
import { Paciente } from './../_model/paciente';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PacienteService extends GenericService<Paciente> {

  pacienteCambio = new Subject<Paciente[]>();
  mensajeCambio = new Subject<string>();
  
  //url: string = `${environment.HOST}/pacientes`;

  constructor(protected http: HttpClient) {
    super(
      http,
      `${environment.HOST}/pacientes`
    );
  }

  listarPageable(p: number, s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

  /*listar() {
    return this.http.get<Paciente[]>(this.url);
  }

  listarPorId(id: number) {
    return this.http.get<Paciente>(`${this.url}/${id}`);
  }

  registrar(paciente: Paciente) {
    return this.http.post(this.url, paciente);
  }

  modificar(paciente: Paciente) {
    return this.http.put(this.url, paciente);
  }

  eliminar(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }*/

}
