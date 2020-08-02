import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Signo } from './../_model/signo';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignoService extends GenericService<Signo>{

  signoCambio = new Subject<Signo[]>();
  mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) {
    super(
      http,
      `${environment.HOST}/signos`
    );
   }

   listarPageable(p: number, s: number){
     return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
   }


}
