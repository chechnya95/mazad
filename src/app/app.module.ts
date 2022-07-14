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
import { SmsNotificationsComponent } from './sms-notifications/sms-notifications.component';
import { ProfileComponent } from './profile/profile.component';
import { ItemDetailsComponent } from './items/item-details/item-details.component';
import { NewItemComponent } from './items/new-item/new-item.component';
import { NewTemplateComponent } from './auction-templates/new-template/new-template.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { EditItemComponent } from './items/edit-item/edit-item.component';
import { AuctionDetailsComponent } from './auctions/auction-details/auction-details.component';
import { UserPipePipe } from './pipes/user-pipe.pipe';
import { AuctionPipePipe } from './pipes/auction-pipe.pipe';
import { ItemPipePipe } from './pipes/item-pipe.pipe';
import { PaymentTransactionsComponent } from './payment-transactions/payment-transactions.component';
import { DepositsComponent } from './deposits/deposits.component';
import { WalletsComponent } from './wallets/wallets.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { OwnerPaymentOptionsComponent } from './owner-payment-options/owner-payment-options.component';
import { BidsPipePipe } from './pipes/bids-pipe.pipe';
import { DepositPipePipe } from './pipes/deposit-pipe.pipe';
import { OwnersComponent } from './owners/owners.component';
import { OwnerPipePipe } from './pipes/owner-pipe.pipe';
import { TransactionsPipePipe } from './pipes/transactions-pipe.pipe';
import { TemplateDetailsComponent } from './auction-templates/template-details/template-details.component';
import { OwnerDetailsComponent } from './owners/owner-details/owner-details.component';
import { InvoiceDetailsComponent } from './invoices/invoice-details/invoice-details.component';
import { PaymentDetailsComponent } from './payment-transactions/payment-details/payment-details.component';
import { UserDetailsComponent } from './users/user-details/user-details.component';
import { BlacklistComponent } from './blacklist/blacklist.component';
import { GroupsComponent } from './groups/groups.component';
import { ClassificationComponent } from './settings/classification/classification.component';
import { ChildernComponent } from './settings/classification/childern/childern.component';
import { Nl2brPipe } from './pipes/nl2br.pipe';
import { ReportsComponent } from './reports/reports.component';

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
    BidsComponent,
    SmsNotificationsComponent,
    ProfileComponent,
    ItemDetailsComponent,
    NewItemComponent,
    NewTemplateComponent,
    PageNotFoundComponent,
    EditItemComponent,
    AuctionDetailsComponent,
    UserPipePipe,
    AuctionPipePipe,
    ItemPipePipe,
    PaymentTransactionsComponent,
    DepositsComponent,
    WalletsComponent,
    InvoicesComponent,
    OwnerPaymentOptionsComponent,
    BidsPipePipe,
    DepositPipePipe,
    OwnersComponent,
    OwnerPipePipe,
    TransactionsPipePipe,
    TemplateDetailsComponent,
    OwnerDetailsComponent,
    InvoiceDetailsComponent,
    PaymentDetailsComponent,
    UserDetailsComponent,
    BlacklistComponent,
    GroupsComponent,
    ClassificationComponent,
    ChildernComponent,
    Nl2brPipe,
    ReportsComponent
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
      { path: 'users', component: UsersComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin'] } },
      { path: 'user-details', component: UserDetailsComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin'] } },
      { path: 'blacklist', component: BlacklistComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin'] } },
      { path: 'owners', component: OwnersComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin'] } },
      { path: 'owner-details', component: OwnerDetailsComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin'] } },
      { path: 'slider', component: SliderComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin'] } },
      { path: 'roles', component: RolesComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin'] } },
      { path: 'auctions', component: AuctionsComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin', 'owner'] } },
      { path: 'auction-details', component: AuctionDetailsComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin', 'owner'] } },
      { path: 'templates', component: TemplatesComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin'] } },
      { path: 'groups', component: GroupsComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin'] } },
      { path: 'items', component: ItemsComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin', 'owner'] } },
      { path: 'item-details', component: ItemDetailsComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin', 'owner'] } },
      { path: 'template-details', component: TemplateDetailsComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin', 'owner'] } },
      { path: 'new-item', component: NewItemComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin', 'owner'] } },
      { path: 'edit-item', component: EditItemComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin', 'owner'] } },
      { path: 'auction_templates', component: AuctionTemplatesComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin', 'owner'] } },
      { path: 'new-template', component: NewTemplateComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin', 'owner'] } },
      { path: 'settings', component: SettingsComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin'] } },
      { path: 'messages', component: MessagesComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin'] } },
      { path: 'payment-transactions', component: PaymentTransactionsComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin'] } },
      { path: 'payment-details', component: PaymentDetailsComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin'] } },
      { path: 'wallets', component: WalletsComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin'] } },
      { path: 'deposits', component: DepositsComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin'] } },
      { path: 'invoices', component: InvoicesComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin'] } },
      { path: 'invoice-details', component: InvoiceDetailsComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin'] } },
      { path: 'fields', component: FieldsComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin'] } },
      { path: 'owner-payment-options', component: OwnerPaymentOptionsComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin'] } },
      { path: 'form-fields', component: FormFieldsComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin'] } },
      { path: 'sms-notification', component: SmsNotificationsComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin'] } },
      { path: 'auction-settings', component: AuctionSettingsComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin'] } },
      { path: 'classifications', component: ClassificationComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin'] } },
      { path: 'children', component: ChildernComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin'] } },
      { path: 'winners', component: WinnersComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin', 'owner'] } },
      { path: 'bids', component: BidsComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin'] } },
      { path: 'reports', component: ReportsComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin'] } },
      { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin', 'owner', 'corporate'] } },
      { path: 'welcome', component: WelcomeComponent },
      { path: '**', component: PageNotFoundComponent }
    ], { scrollPositionRestoration: 'enabled' })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}