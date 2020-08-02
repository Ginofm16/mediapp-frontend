import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Especialidad } from '../_model/especialidad';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService extends GenericService<Especialidad> {

  especialidadCambio = new Subject<Especialidad[]>();
  mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) {
    super(
      http,
      `${environment.HOST}/especialidades`);
  }
}
