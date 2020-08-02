import { Menu } from './../_model/menu';
import { map } from 'rxjs/operators';
import { MenuService } from './menu.service';
import { environment } from './../../environments/environment';
import { LoginService } from './login.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate {

  constructor(
    private loginService: LoginService,
    private menuService: MenuService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    //1) VERIFICAR SI ESTA LOGUEADO
    let rpta = this.loginService.estaLogueado();
    if (!rpta) {
      this.loginService.cerrarSesion();
      return false;
    } else {
      //2) VERIFICAR SI EL TOKEN NO HA EXPIRADO
      const helper = new JwtHelperService();
      let token = sessionStorage.getItem(environment.TOKEN_NAME);
      if (!helper.isTokenExpired(token)) {
        //3) VERIFICAR SI TIENES EL ROL NECESARIO PARA ACCEDER A ESA PAGINA  

        //url -> /consulta
        let url = state.url;
        const decodedToken = helper.decodeToken(token);

        return this.menuService.listarPorUsuario(decodedToken.user_name).pipe(map((data: Menu[]) => {
          this.menuService.setMenuCambio(data);

          let cont = 0;
          for (let m of data) {
            if (url.startsWith(m.url)) {
              cont++;
              break;
            }
          }

          if (cont > 0) {
            return true;
          } else {
            this.router.navigate(['not-403']);
            return false;
          }

        }));

      } else {
        this.loginService.cerrarSesion();
        return false;
      }
    }

  }
}
