import { Component, AfterViewInit } from '@angular/core';
import * as c3 from 'c3';

@Component({
  selector: 'app-mix-stats',
  templateUrl: './mix-stats.component.html'
})
export class MixstatsComponent implements AfterViewInit {
  constructor() { }

  // bar chart
  public barChartData: Array<any> = [
    { data: [1.1, 1.4, 1.1, 0.9, 1.9, 1, 0.3, 1.1, 1.4, 1.1, 0.9, 1.9, 1, 0.3, 1.1], label: 'Cost' }
  ];
  public barChartLabels: Array<any> = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15'
  ];
  public barChartOptions: any = {
    maintainAspectRatio: false,
    legend: {
      display: true
    },
    tooltips: {
      enabled: false
    },
    scales: {
      xAxes: [{
        display: false,
        barPercentage: 0.3,
        categoryPercentage: 0.7
      }],
      yAxes: [{
        display: false
      }]
    }
  };
  public barChartColors: Array<any> = [
    {
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      hoverBackgroundColor: 'rgba(255, 255, 255, 0.5)',
      hoverBorderWidth: 2,
      hoverBorderColor: 'rgba(255, 255, 255, 0.5)'
    }
  ];
  public barChartLegend = false;
  public barChartType = 'bar';


  public lineChartData1: Array<any> = [
    { data: [22, 20, 26, 25, 19, 12, 15, 18, 16, 20], label: 'Bounce %' }
  ];
  public lineChartLabels1: Array<any> = ['1', '5', '10', '3', '8', '2', '6', '7', '9', '4'];
  public lineChartOptions1: any = {
    maintainAspectRatio: false,
    animation: {
      easing: 'easeInOutQuad',
      duration: 520
    },
    scales: {
      xAxes: [{
        display: false
      }],
      yAxes: [{
        display: false,
        ticks: {
          min: 0,
          max: 30,
          stepSize: 10,
          beginAtZero: true
        }
      }]
    },
    elements: {
      line: {
        tension: 0
      }
    },
    legend: {
      display: false
    }
  };
  public lineChartColors1: Array<any> = [
    {
      backgroundColor: 'transparent',
      pointRadius: 2,
      borderWidth: 2,
      borderColor: '#fff',
    }
  ];
  public lineChartLegend1 = false;
  public lineChartType1 = 'line';

  ngAfterViewInit() {

    const chart5 = c3.generate({
      bindto: '#visitor2',
      data: {
        columns: [['Iphone', 60], ['Samsung', 12], ['One+', 28]],

        type: 'donut'
      },
      donut: {
        label: {
          show: false
        },
        title: 'Sales',
        width: 20
      },

      legend: {
        hide: true
        // or hide: 'data1'
        // or hide: ['data1', 'data2']
      },
      color: {
        pattern: ['#4798e8', '#01c0c8', '#f6f6f6']
      }
    });
    // ==============================================================
    // Sales income
    // ==============================================================
    const chart2 = c3.generate({
      bindto: '#income',
      data: {
        columns: [
          ['Growth Income', 250, 200, 100, 250, 300],
          ['Net Income', 190, 100, 140, 200, 190]
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
            count: 4,

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
        height: 300
      },
      color: {
        pattern: ['#4798e8', '#01c0c8']
      }
    });
  }
}
