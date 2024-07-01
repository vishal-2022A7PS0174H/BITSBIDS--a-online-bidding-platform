import { Component } from '@angular/core';

import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-earnings',
  templateUrl: './earnings.component.html'
})
export class EarningsComponent {

  public config: PerfectScrollbarConfigInterface = {};

  constructor() { }
}
