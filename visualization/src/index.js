import axios from 'axios';
import { uniquePeople } from './utils/People';
import { uniquePublicationPlaces, uniqueMarkerRegions } from './utils/Places';
import Timeline from './Timeline';
import * as d3 from 'd3';

const WIDTH = 920;
const HEIGHT = 200;

import './index.scss';

class App {

  loadData = () => {
    return axios.get('TravelogueD16.json').then(response => {
      this.people = uniquePeople(response.data);
      this.places = uniquePublicationPlaces(response.data);
      this.markerRegions = uniqueMarkerRegions(response.data);
      this.timeline = new Timeline(response.data);
    });    
  }

  render = elem => {
    const svg = d3.select(elem)
      .append('svg')
        .attr('width', WIDTH)
        .attr('height', HEIGHT);

    const scale = d3.scaleLinear()
      .domain(this.timeline.getInterval())
      .range([0, WIDTH])
      .nice();

    const axis = d3.axisBottom(scale).tickFormat(n => n)
    svg.append('g')
      .attr('transform', 'translate(0, 45)')
      .call(axis);

    svg.selectAll('.dot')
      .data(this.timeline.getCounts())
      .enter()
        .append('circle')
        .attr('class', 'works-per-year')
        .attr('r', d => 2 + d.count * 2)
        .attr('cx', d => scale(d.year))
        .attr('cy', 20)
  }

}

const app = new App();
app.loadData().then(() => {
  app.render(document.getElementById('app'));
});
