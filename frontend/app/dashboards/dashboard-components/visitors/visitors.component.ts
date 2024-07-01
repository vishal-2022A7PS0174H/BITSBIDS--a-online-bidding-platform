import { Component } from '@angular/core';
import * as shape from 'd3-shape';
import * as d3 from 'd3';
import { multi } from './data';
import { colorSets } from '@swimlane/ngx-charts/lib/utils/color-sets';

@Component({
  selector: 'app-visitors',
  templateUrl: './visitors.component.html',
  styleUrls: ['./visitors.component.scss']
})
export class VisitorsComponent {
  multi: any[];
  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  tooltipDisabled = false;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Visits';
  showGridLines = true;
  innerPadding = 0;
  autoScale = true;
  timeline = false;
  barPadding = 2;
  groupPadding = 0;
  roundDomains = false;
  maxRadius = 10;
  minRadius = 3;
  view = '';
  showLabels = true;
  explodeSlices = false;
  doughnut = false;
  arcWidth = 0.25;
  rangeFillOpacity = 0;

  colorScheme = {
    domain: ['#2962FF', '#4fc3f7', '#a1aab2']
  };
  schemeType = 'ordinal';

  constructor() {
    Object.assign(this, {
      multi
    });
  }
}
