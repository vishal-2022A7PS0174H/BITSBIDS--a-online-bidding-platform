import {RouteInfo} from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [
  {
    path: '/marketplace',
    title: 'Marketplace',
    icon: 'icon-Files',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '',
    title: 'Manage Bids',
    icon: 'icon-Bird',
    class: 'nav-small-cap',
    extralink: true,
    submenu: []
  },
  {
    path: '/create-bid',
    title: 'Create Bid',
    icon: 'icon-Files',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/manage-bid',
    title: 'Manage Bid',
    icon: 'icon-Files',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/messages',
    title: 'Messages',
    icon: 'icon-Files',
    class: '',
    extralink: false,
    submenu: []
  },
];
