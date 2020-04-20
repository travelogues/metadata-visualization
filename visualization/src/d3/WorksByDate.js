import * as d3 from 'd3';

import { WIDTH } from '../Const';

export const renderWorksByDate = (timeline, svg) => {

  const scale = d3.scaleLinear()
    .domain(timeline.getInterval())
    .range([0, WIDTH])
    .nice();

  const axis = d3.axisBottom(scale).tickFormat(n => n)
  svg.append('g')
    .attr('transform', 'translate(0, 45)')
    .call(axis);

  svg.selectAll('.dot')
    .data(timeline.getCounts())
    .enter()
      .append('circle')
      .attr('class', 'works-per-year')
      .attr('r', d => 2 + d.count * 2)
      .attr('cx', d => scale(d.year))
      .attr('cy', 20);
}