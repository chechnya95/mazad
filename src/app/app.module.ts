import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthGuardGuard } from './services/auth-guard.guard';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { AuctionsComponent } from './auctions/auctions.component';
import { TemplatesComponent } from './templates/templates.component';
import { ItemsComponent } from './items/items.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    UsersComponent,
    RolesComponent,
    AuctionsComponent,
    TemplatesComponent,
    ItemsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: 'login', component: LoginComponent },
      { path: '', component: HomeComponent, canActivate: [AuthGuardGuard] },
      { path: 'home', component: HomeComponent, canActivate: [AuthGuardGuard] },
      { path: 'users', component: UsersComponent, canActivate: [AuthGuardGuard] },
      { path: 'roles', component: RolesComponent, canActivate: [AuthGuardGuard] },
      { path: 'auctions', component: AuctionsComponent, canActivate: [AuthGuardGuard] },
      { path: 'templates', component: TemplatesComponent, canActivate: [AuthGuardGuard] },
      { path: 'items', component: ItemsComponent, canActivate: [AuthGuardGuard] }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
