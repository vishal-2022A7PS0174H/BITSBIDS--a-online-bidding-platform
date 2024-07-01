import { Component, AfterViewInit } from '@angular/core';
import * as c3 from 'c3';

@Component({
  selector: 'app-device-visits',
  templateUrl: './device-visits.component.html'
})
export class DeviceVisitsComponent implements AfterViewInit {
  constructor() { }

  ngAfterViewInit() {
    const chart = c3.generate({
      bindto: '#visitor',
      data: {
        columns: [['Desktop', 60], ['Tablet', 12], ['Mobile', 28]],

        type: 'donut'
      },
      donut: {
        label: {
          show: false
        },
        title: 'Visits',
        width: 25
      },

      legend: {
        hide: true
        // or hide: 'data1'
        // or hide: ['data1', 'data2']
      },
      color: {
        pattern: ['#4798e8', '#ff7676', '#f6f6f6']
      }
    });
  }
}
