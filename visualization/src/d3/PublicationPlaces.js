import * as d3 from 'd3';

import { WIDTH, VERTICAL_HEIGHT } from '../Const';

export const renderPublicationPlaces = (places, svg) => {
  const scale = d3.scalePoint()
    .domain(places)
    .range([0, WIDTH]);

  const axis = d3.axisBottom(scale).tickFormat(n => n);
  svg.append('g')
    .attr('transform', 'translate(0, 190)')
    .call(axis)
    .selectAll('text')
      .attr('y', 0)
      .attr('x', 9)
      .attr('transform', 'rotate(60)')
      .style('text-anchor', 'start');

  return scale;
}

export const renderNERLocations = (locations, svg) => {
  const scale = d3.scalePoint()
    .domain(locations)
    .range([0, VERTICAL_HEIGHT / 2]);

  const axis = d3.axisLeft(scale).tickFormat(n => n);
  svg.append('g')
    .attr('transform', 'translate(460, 10)')
    .call(axis);
}