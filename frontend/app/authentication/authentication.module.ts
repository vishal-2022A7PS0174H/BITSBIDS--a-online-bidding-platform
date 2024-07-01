import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NotfoundComponent} from './_components/404/not-found.component';
import {LockComponent} from './_components/lock/lock.component';
import {LoginComponent} from './_components/login/login.component';
import {SignupComponent} from './_components/signup/signup.component';
import {AuthenticationRoutes} from './authentication.routing';
import {EndPoints} from './_models/EndPoints';
import {ApiManagerService} from './_services/api-manager.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxSpinnerModule} from 'ngx-spinner';
import {AlertModule} from './_alert';
import {RegistrationRequestBody} from './_models/RegistrationRequestBody';
import {TranslateCompiler, TranslateLoader, TranslateModule, TranslateParser} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {httpTranslateLoader} from '../app.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthenticationRoutes),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    AlertModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [
    NotfoundComponent,
    LoginComponent,
    SignupComponent,
    LockComponent
  ],
  providers: [
    EndPoints,
    ApiManagerService,
    RegistrationRequestBody
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AuthenticationModule {
}
