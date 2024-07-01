import {Routes, RouterModule} from '@angular/router';

import {FullComponent} from './layouts/full/full.component';
import {BlankComponent} from './layouts/blank/blank.component';
import {AuthGuard} from './_guards/auth.guard';
import {ProductCreateComponent} from "./product-create-component/product-create-component.component";
import {ProductListComponent} from "./product-list/product-list.component";
import {ProductMarketplaceComponent} from "./product-marketplace-component/product-marketplace-component.component";
import {ProductDetailsComponent} from "./product-details/product-details.component";
import {MessageComponent} from "./message/message.component";
import {ProfileComponent} from "./profile/profile.component";

export const Approutes: Routes = [
  {
    path: '',
    component: BlankComponent,
    children: [
      {path: '', redirectTo: '/authentication/login', pathMatch: 'full'},
      {
        path: 'authentication',
        loadChildren:
          () => import('./authentication/authentication.module').then(m => m.AuthenticationModule)
      }
    ]
  },
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboards/dashboard.module').then(m => m.DashboardModule),
        canActivate: [AuthGuard]
      },

      {
        path: 'create-bid',
        component: ProductCreateComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'manage-bid',
        component: ProductListComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'marketplace',
        component: ProductMarketplaceComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'product/:id',
        component: ProductDetailsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'messages',
        component: MessageComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard]
      },
    ]
  },
  // {
  //   path: '**',
  //   redirectTo: '/authentication/404'
  // }
];

