import { ActivatedRoute } from '@angular/router';
import { environment } from './../../../environments/environment';
import { SignoService } from './../../_service/signo.service';
import { Signo } from './../../_model/signo';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JwtHelperService } from '@auth0/angular-jwt';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-signo',
  templateUrl: './signo.component.html',
  styleUrls: ['./signo.component.css']
})
export class SignoComponent implements OnInit {

  usuario: string;
  roles: string[] = [];
  rol: string;
  cantidad: number = 0;
  displayedColumns = ['idSigno', 'paciente', 'temperatura', 'pulso', 'ritmoCardiaco','fecha','acciones'];
  dataSource: MatTableDataSource<Signo>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private signoService: SignoService,
    private snackBar: MatSnackBar,
    public route: ActivatedRoute) { }

  ngOnInit(): void {

    this.signoService.signoCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    this.signoService.mensajeCambio.subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000
      });
    })

    this.signoService.listarPageable(0, 10).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    })

  }

  filtrar(valor: string) {
    console.log(this.dataSource.filteredData);
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  eliminar(idSigno: number) {
    this.signoService.eliminar(idSigno).subscribe(() => {
      this.signoService.listar().subscribe(data => {
        this.signoService.signoCambio.next(data);
        this.signoService.mensajeCambio.next('SE ELIMINÓ');
      });
    });
  }

  mostrarMas(e: any) {
    this.signoService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });
  }

  

}
