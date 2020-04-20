import axios from 'axios';
import * as d3 from 'd3';
import { uniquePeople } from './utils/People';
import { uniquePublicationPlaces, uniqueMarkerRegions } from './utils/Places';
import Timeline from './Timeline';
import { renderMarkerRegions } from './d3/MarkerRegions';
import { renderWorksByDate } from './d3/WorksByDate';
import { renderPeopleScale } from './d3/People';
import { renderPublicationPlaces } from './d3/PublicationPlaces';

import { WIDTH, HEIGHT } from './Const';

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


    renderWorksByDate(this.timeline, svg);
    renderMarkerRegions(this.markerRegions, svg);
    renderPeopleScale(this.people, svg);
    renderPublicationPlaces(this.places, svg);
  }

}

const app = new App();
app.loadData().then(() => {
  app.render(document.getElementById('app'));
});
