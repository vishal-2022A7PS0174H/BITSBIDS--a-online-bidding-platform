import { Component, AfterViewInit } from '@angular/core';
import * as c3 from 'c3';

@Component({
  selector: 'app-sales-income',
  templateUrl: './sales-income.component.html'
})
export class SalesIncomeComponent implements AfterViewInit {
  constructor() { }

  ngAfterViewInit() {
    const chart = c3.generate({
      bindto: '#income',
      data: {
        columns: [
          ['Growth Income', 100, 200, 300, 300, 400, 200],
          ['Net Income', 130, 100, 440, 200, 320, 100]
        ],
        type: 'bar'
      },
      bar: {
        space: 0.2,
        // or
        width: 15 // this makes bar width 100px
      },
      axis: {
        y: {
          tick: {
            count: 3,
            outer: false
          }
        }
      },
      legend: {
        hide: true
        // or hide: 'data1'
        // or hide: ['data1', 'data2']
      },
      grid: {
        x: {
          show: false
        },
        y: {
          show: true
        }
      },
      size: {
        height: 270
      },
      color: {
        pattern: ['#4798e8', '#ccc']
      }
    });

    const chart2 = c3.generate({
      bindto: '#sales',
      data: {
        columns: [['One+', 50], ['T', 60], ['Samsung', 10]],

        type: 'donut'
      },
      donut: {
        label: {
          show: false
        },
        title: '',
        width: 18
      },
      size: {
        height: 150
      },
      legend: {
        hide: true
        // or hide: 'data1'
        // or hide: ['data1', 'data2']
      },
      color: {
        pattern: ['#ffffff', '#4798e8', '#24d2b5', '#20aee3']
      }
    });
    // ==============================================================
    // Sales Prediction
    // ==============================================================

    const chart3 = c3.generate({
      bindto: '#prediction',
      data: {
        columns: [['data', 91.4]],
        type: 'gauge'
      },

      color: {
        pattern: ['#20aee3', '#20aee3', '#20aee3', '#24d2b5'], // the three color levels for the percentage values.
        threshold: {
          //            unit: 'value', // percentage is default
          //            max: 200, // 100 is default
          values: [30, 60, 90, 100]
        }
      },
      gauge: {
        width: 22
      },
      size: {
        height: 120,
        width: 150
      }
    });
  }
}
