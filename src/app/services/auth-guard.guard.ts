import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService,RoleAccess } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard  {
  constructor(private router: Router, private api: ApiService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const accessRules = route.data.roles as RoleAccess;

    if (this.api.isAllowed(accessRules)) {
      return true;
    } else {
      this.router.navigateByUrl('/welcome');
      return false;
    }
  }

}
