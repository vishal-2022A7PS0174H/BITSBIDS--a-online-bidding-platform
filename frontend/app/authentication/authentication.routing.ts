import {Routes} from '@angular/router';

import {NotfoundComponent} from './_components/404/not-found.component';
import {LockComponent} from './_components/lock/lock.component';
import {LoginComponent} from './_components/login/login.component';
import {SignupComponent} from './_components/signup/signup.component';

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '404',
        component: NotfoundComponent
      },
      {
        path: 'lock',
        component: LockComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'signup',
        component: SignupComponent
      },
    ]
  }
];
