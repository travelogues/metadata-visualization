import * as d3 from 'd3';

const Y_COORDS = [ 46, 100, 250, 370 ];


export const drawPath = (xCoords, svg, barcode) => {

  const start = { x: xCoords[0], y: Y_COORDS[0] };

  // Date -> publishers
  const lvl1 = xCoords[1].map(dest => {
    const from = start;
    const to = { x: dest, y: Y_COORDS[1] }
    return [ from , to ];
  });

  lvl1.forEach(l => {
    svg.append('line')
      .attr('class', 'path date-person')
      .attr('x1', l[0].x)
      .attr('y1', l[0].y)
      .attr('x2', l[1].x)
      .attr('y2', l[1].y)
      .attr('data-barcode', barcode)
  });

  // Publishers -> place
  const dest = { x: xCoords[2], y: Y_COORDS[2] };
  const lvl2 = lvl1.map(l => {
    const from = l[1];
    const to = dest;
    return [ from , to ];
  });

  lvl2.forEach(l => {
    svg.append('line')
      .attr('class', 'path person-place')
      .attr('x1', l[0].x)
      .attr('y1', l[0].y)
      .attr('x2', l[1].x)
      .attr('y2', l[1].y);
  });

  const lvl3 = xCoords[3].map(coord => {
    const from = dest;
    const to = { x: coord, y: Y_COORDS[3] };
    return [ from, to ];
  });

  lvl3.forEach(l => {
    svg.append('line')
      .attr('class', 'path place-region')
      .attr('x1', l[0].x)
      .attr('y1', l[0].y)
      .attr('x2', l[1].x)
      .attr('y2', l[1].y);
  })

}