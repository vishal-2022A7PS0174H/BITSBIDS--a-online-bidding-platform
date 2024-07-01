import { Component, AfterViewInit } from '@angular/core';
import * as c3 from 'c3';

@Component({
  selector: 'app-info-box',
  templateUrl: './info-box.component.html',
  styleUrls: ['./info-box.component.css']
})
export class InfoBoxComponent implements AfterViewInit {
  constructor() { }

  public lineChartData: Array<any> = [
    { data: [12, 19, 3, 5, 2, 3], label: 'Balance $' }
  ];
  public lineChartLabels: Array<any> = [
    '2012',
    '2013',
    '2014',
    '2015',
    '2016',
    '2017'
  ];
  public lineChartOptions: any = {
    responsive: true,
    elements: {
      point: {
        radius: 2
      }
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            display: false,
            drawBorder: false
          },
          ticks: {
            display: false
          }
        }
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
            drawBorder: false
          },
          ticks: {
            display: false
          }
        }
      ]
    }
  };
  public lineChartColors: Array<any> = [
    {
      backgroundColor: 'transparent',
      borderColor: '#bbb790',
      pointBackgroundColor: '#bbb790',
      pointBorderColor: '#bbb790',
      pointHoverBackgroundColor: '#bbb790',
      pointHoverBorderColor: '#bbb790'
    }
  ];
  public lineChartLegend = false;
  public lineChartType = 'line';

  // bar chart
  public barChartData: Array<any> = [
    { data: [1.1, 1.4, 1.1, 0.9, 1.5, 1, 0.3], label: 'Cost' }
  ];
  public barChartLabels: Array<any> = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7'
  ];
  public barChartOptions: any = {
    maintainAspectRatio: false,
    legend: {
      display: false
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
      backgroundColor: '#16baf0',
      hoverBackgroundColor: '#16baf0',
      hoverBorderWidth: 4,
      hoverBorderColor: '#16baf0'
    }
  ];
  public barChartLegend = false;
  public barChartType = 'bar';

  ngAfterViewInit() {

    const chart = c3.generate({
      bindto: '#foo',
      data: {
        columns: [['data', 91.4]],
        type: 'gauge'
      },
      gauge: {
        label: {
          format: function (value, ratio) {
            return value;
          },
          show: false
        },
        min: 0,
        max: 100,
        units: ' %',
        width: 15
      },
      legend: {
        hide: true
      },
      size: {
        height: 80
      },
      color: {
        pattern: ['#24d2b5']
      }
    });
  }
}
