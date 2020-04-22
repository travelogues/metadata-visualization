import * as d3 from 'd3';

import { WIDTH, VERTICAL_HEIGHT } from '../Const';

export const renderWorksByDate = (timeline, svg, mouseOver, mouseOut) => {
  const scale = d3.scaleLinear()
    .domain(timeline.getInterval())
    .range([0, WIDTH])
    .nice();

  const axis = d3.axisBottom(scale).tickFormat(n => n)
  svg.append('g')
    .attr('transform', 'translate(0, 100)')
    .call(axis);

  svg.selectAll('.dot')
    .data(timeline.getCounts())
    .enter()
      .append('circle')
      .attr('class', 'works-per-year')
      .attr('r', d => 2 + d.count * 2)
      .attr('cx', d => scale(d.year))
      .attr('cy', 100)
      .on('mouseover', mouseOver)
      .on('mouseout', mouseOut);

  return scale;
}

export const renderWorksByDateVertical = (timeline, svg, mouseOver, mouseOut) => {
  const scale = d3.scaleLinear()
    .domain(timeline.getInterval())
    .range([VERTICAL_HEIGHT / 4, 0])
    .nice();

  const axis = d3.axisLeft(scale).tickFormat(n => n)
  svg.append('g')
    .attr('transform', 'translate(740, 0)')
    .call(axis);

  svg.selectAll('.dot')
    .data(timeline.getCounts())
    .enter()
      .append('circle')
      .attr('class', 'works-per-year')
      .attr('r', d => 2 + d.count * 2)
      .attr('cx', 740)
      .attr('cy', d => scale(d.year))
      .on('mouseover', mouseOver)
      .on('mouseout', mouseOut);

  return scale;
}