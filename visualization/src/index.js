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
import { drawPath } from './d3/Path';

class App {

  constructor(elem) {
    this.elem = elem;
  }

  loadData = () => {
    return axios.get('TravelogueD16.json').then(response => {
      this.people = uniquePeople(response.data);
      this.places = uniquePublicationPlaces(response.data);
      this.markerRegions = uniqueMarkerRegions(response.data);
      this.timeline = new Timeline(response.data);
      this.records = response.data;
    });    
  }

  onMouseOver = d => {
    const records = this.timeline.getRecords(d.year);
    this.updatePaths(records);
  }

  onMouseOut = d => {
    this.updatePaths();
  }

  render = selectedPaths => {
    const svg = d3.select(this.elem)
      .append('svg')
        .attr('width', WIDTH)
        .attr('height', HEIGHT);

    this.dateScale = renderWorksByDate(this.timeline, svg, this.onMouseOver, this.onMouseOut);
    this.peopleScale = renderPeopleScale(this.people, svg);
    this.placeScale = renderPublicationPlaces(this.places, svg);
    this.regionScale = renderMarkerRegions(this.markerRegions, svg);

    this.svg = svg;
    this.updatePaths(selectedPaths);
  }
  
  // Horrible - clean up later
  updatePaths = selectedPaths => {
    // Clean slate
    d3.select(this.elem).selectAll('line').remove();

    d3.select('svg').attr('class', `${selectedPaths ? 'selected' : 'foo'}`)

    const records = selectedPaths ? selectedPaths : this.records;

    records.forEach((r, idx) => {
      const xCoords = [
        r.marker_regions.map(r => this.regionScale(r)),
        this.dateScale(r.date),
        this.placeScale(r.place_of_publication),
        r.people.map(p => this.peopleScale(p))
      ]

      if (selectedPaths)
        drawPath(xCoords, this.svg, r.barcode, idx);
      else 
        drawPath(xCoords, this.svg, r.barcode);
    });
  }

}

const app = new App(document.getElementById('app'));
app.loadData().then(() => app.render());
