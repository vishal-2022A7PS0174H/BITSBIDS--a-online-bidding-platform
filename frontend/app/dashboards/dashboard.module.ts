import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ChartsModule} from 'ng2-charts';
import {ChartistModule} from 'ng-chartist';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {DashboardRoutes} from './dashboard.routing';
import {Dashboard3Component} from './dashboard3/dashboard3.component';
import {MomentModule} from 'ngx-moment';
import {
  ProductInfoComponent,
  ProjectComponent,
  WelcomeComponent,

} from './dashboard-components';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {httpTranslateLoader} from '../app.module';
import {HttpClient} from '@angular/common/http';
import {NgxSpinnerModule} from 'ngx-spinner';
import {AlertModule} from './_alert';
import {EndPoints} from './_models/EndPoints';
import {ApiManagerService} from './_services/api-manager.service';
import {UserInfoBody} from './_models/UserInfoBody';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    NgbModule,
    ChartsModule,
    ChartistModule,
    RouterModule.forChild(DashboardRoutes),
    PerfectScrollbarModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    NgxChartsModule,
    NgxDatatableModule,
    MomentModule,
    NgbModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
    NgxSpinnerModule,
    AlertModule,
    ReactiveFormsModule,
  ],
  declarations: [
    Dashboard3Component,
    ProductInfoComponent,
    ProjectComponent,
    WelcomeComponent,
  ],
  providers: [
    ApiManagerService,
    EndPoints,
    UserInfoBody
  ]
})
export class DashboardModule {
}
