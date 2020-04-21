import * as d3 from 'd3';

import { WIDTH } from '../Const';

export const renderMarkerRegions = (regions, svg) => {
  const scale = d3.scalePoint()
    .domain(regions)
    .range([0, WIDTH]);

  const axis = d3.axisBottom(scale).tickFormat(n => n)
  svg.append('g')
    .attr('transform', 'translate(0, 20)')
    .call(axis);

  return scale;
}