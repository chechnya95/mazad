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
import { WelcomeComponent } from './welcome/welcome.component';

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
      defaultLanguage: 'en',
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
      { path: 'home', component: HomeComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin'] } },
      { path: 'users', component: UsersComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin'] }  },
      { path: 'slider', component: SliderComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin'] }  },
      { path: 'roles', component: RolesComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin'] }  },
      { path: 'auctions', component: AuctionsComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin', 'owner'] }  },
      { path: 'templates', component: TemplatesComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin'] }  },
      { path: 'items', component: ItemsComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin', 'owner'] }  }, 
      { path: 'auction_templates', component: AuctionTemplatesComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin'] }  },
      { path: 'settings', component: SettingsComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin'] }  },
      { path: 'messages', component: MessagesComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin'] }  },
      { path: 'fields', component: FieldsComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin'] }  },
      { path: 'form-fields', component: FormFieldsComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin'] }  },
      { path: 'auction-settings', component: AuctionSettingsComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin'] }  },
      { path: 'winners', component: WinnersComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin', 'owner'] }  },
      { path: 'bids', component: BidsComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin', 'owner', 'corporate'] }  },
      { path: 'welcome', component: WelcomeComponent  }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}