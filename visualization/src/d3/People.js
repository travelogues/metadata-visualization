import * as d3 from 'd3';

import { WIDTH } from '../Const';

export const renderPeopleScale = (people, svg) => {
  const scale = d3.scalePoint()
    .domain(people)
    .range([0, WIDTH]);

  const axis = d3.axisBottom(scale).tickFormat(n => n)
  svg.append('g')
    .attr('transform', 'translate(0, 100)')
    .call(axis)
    .selectAll('text')
      .attr('y', 0)
      .attr('x', 9)
      .attr('transform', 'rotate(60)')
      .style('text-anchor', 'start');

  return scale;
}