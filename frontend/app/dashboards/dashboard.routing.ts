import {Routes} from '@angular/router';
import {Dashboard3Component} from './dashboard3/dashboard3.component';

export const DashboardRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'home',
        component: Dashboard3Component,
        data: {
          title: 'Charity',
          urls: [
            {title: 'dashboard', url: '/dashboard/home'},
            {title: 'home'}
          ]
        }
      }
    ]
  }
];
