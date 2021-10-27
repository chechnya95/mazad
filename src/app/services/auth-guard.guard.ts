import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {
  constructor(private router: Router, private api: ApiService) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    /* if (this.api.isValidUser) {
      this.router.navigateByUrl("/login");
    }
    return this.api.gettoken(); */
    if (this.api.isAllowed()) return true;
    else {
      this.router.navigateByUrl('/login');
      return false;
    }
  }

}
