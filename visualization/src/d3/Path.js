import * as d3 from 'd3';

const Y_COORDS = [ 21, 100, 190, 310 ];

const VERTICAL_X_COORDS = [ 1060, 460, 610, 740 ];

export const drawPath = (xCoords, svg, barcodes) => {

  // First level: n regions to 1 work
  const regionsXList = xCoords[0];
  const regionsY = Y_COORDS[0];

  const workX = xCoords[1];
  const workY = Y_COORDS[1];

  regionsXList.forEach(x => {
    svg.append('line')
      .attr('class', 'path region-work')
      .attr('x1', x)
      .attr('y1', regionsY)
      .attr('x2', workX)
      .attr('y2', workY)
      .attr('data-barcodes', barcodes.join(' '))
  });

  // Second level: 1 work to 1 publication place
  const pubPlaceX = xCoords[2];
  const pubPlaceY = Y_COORDS[2];

  svg.append('line')
    .attr('class', 'path work-publication-place')
    .attr('x1', workX)
    .attr('y1', workY)
    .attr('x2', pubPlaceX)
    .attr('y2', pubPlaceY)
    .attr('data-barcodes', barcodes.join(' '));

  // Third level: 1 publication place to N people
  const peopleXList = xCoords[3];
  const peopleY = Y_COORDS[3];

  peopleXList.forEach(x => {
    svg.append('line')
      .attr('class', 'path publication-place-person')
      .attr('x1', pubPlaceX)
      .attr('y1', pubPlaceY)
      .attr('x2', x)
      .attr('y2', peopleY)
      .attr('data-barcode', barcodes.join(' '))
  });

}

export const drawPathVertical = (yCoords, svg, barcodes) => {

  // First level: 1 work to n regions
  const workX = VERTICAL_X_COORDS[3];
  const workY = yCoords[3];

  const regionsX = VERTICAL_X_COORDS[2];
  const regionsYList = yCoords[2];

  regionsYList.forEach(y => {
    svg.append('line')
      .attr('class', 'path work-region')
      .attr('x1', workX)
      .attr('y1', workY)
      .attr('x2', regionsX)
      .attr('y2', y)
      .attr('data-barcodes', barcodes.join(' '))
  });

  // Second level: n regions to n NER places
  const nerPlacesX = VERTICAL_X_COORDS[1];
  const nerPlacesYList = yCoords[1];

  regionsYList.forEach(regionY => {
    nerPlacesYList.forEach(nerPlaceY => {
      svg.append('line')
      .attr('class', 'path region-nerplace')
      .attr('x1', regionsX)
      .attr('y1', regionY)
      .attr('x2', nerPlacesX)
      .attr('y2', nerPlaceY)
      .attr('data-barcodes', barcodes.join(' '))
    });  
  });

  // Hack 1 date to n people
  const nerPeopleX = VERTICAL_X_COORDS[0]
  const nerPeopleYList = yCoords[0];

  nerPeopleYList.forEach(nerPersonY => {
    svg.append('line')
    .attr('class', 'path nerplace-nerperson')
    .attr('x1', workX)
    .attr('y1', workY)
    .attr('x2', nerPeopleX)
    .attr('y2', nerPersonY)
    .attr('data-barcodes', barcodes.join(' '))
  });

}
