import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthGuardGuard } from './services/auth-guard.guard';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { AuctionsComponent } from './auctions/auctions.component';
import { TemplatesComponent } from './templates/templates.component';
import { ItemsComponent } from './items/items.component';
import { SliderComponent } from './slider/slider.component';
import { AuctionTemplatesComponent } from './auction-templates/auction-templates.component';
import { SettingsComponent } from './settings/settings.component';
import { MessagesComponent } from './messages/messages.component';
import { FieldsComponent } from './settings/fields/fields.component';
import { SettingHeaderComponent } from './settings/setting-header/setting-header.component';
import { FormFieldsComponent } from './settings/form-fields/form-fields.component';
import { AuctionSettingsComponent } from './settings/auction-settings/auction-settings.component';
import { WinnersComponent } from './winners/winners.component';
import { BidsComponent } from './bids/bids.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    UsersComponent,
    RolesComponent,
    AuctionsComponent,
    TemplatesComponent,
    ItemsComponent,
    SliderComponent,
    AuctionTemplatesComponent,
    SettingsComponent,
    MessagesComponent,
    FieldsComponent,
    SettingHeaderComponent,
    FormFieldsComponent,
    AuctionSettingsComponent,
    WinnersComponent,
    BidsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
    RouterModule.forRoot([
      { path: 'login', component: LoginComponent },
      //{ path: '', component: HomeComponent, canActivate: [AuthGuardGuard] },
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent, canActivate: [AuthGuardGuard] },
      { path: 'users', component: UsersComponent, canActivate: [AuthGuardGuard] },
      { path: 'slider', component: SliderComponent, canActivate: [AuthGuardGuard] },
      { path: 'roles', component: RolesComponent, canActivate: [AuthGuardGuard] },
      { path: 'auctions', component: AuctionsComponent, canActivate: [AuthGuardGuard] },
      { path: 'templates', component: TemplatesComponent, canActivate: [AuthGuardGuard] },
      { path: 'items', component: ItemsComponent, canActivate: [AuthGuardGuard] }, 
      { path: 'auction_templates', component: AuctionTemplatesComponent, canActivate: [AuthGuardGuard] },
      { path: 'settings', component: SettingsComponent, canActivate: [AuthGuardGuard] },
      { path: 'messages', component: MessagesComponent, canActivate: [AuthGuardGuard] },
      { path: 'fields', component: FieldsComponent, canActivate: [AuthGuardGuard] },
      { path: 'form-fields', component: FormFieldsComponent, canActivate: [AuthGuardGuard] },
      { path: 'auction-settings', component: AuctionSettingsComponent, canActivate: [AuthGuardGuard] },
      { path: 'winners', component: WinnersComponent, canActivate: [AuthGuardGuard] },
      { path: 'bids', component: BidsComponent, canActivate: [AuthGuardGuard] }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}