import axios from 'axios';
import * as d3 from 'd3';
import { uniqueNERPersons } from './utils/People';
import { uniqueMarkerRegions, uniqueNERLocations } from './utils/Places';
import Timeline from './Timeline';
import { renderRegionsVertical } from './d3/MarkerRegions';
import { renderWorksByDateVertical } from './d3/WorksByDate';
import { renderNERPeople } from './d3/People';
import { renderNERLocations } from './d3/PublicationPlaces';

import { WIDTH, HEIGHT } from './Const';

import './index.scss';
import { drawPathVertical } from './d3/Path';

class App {

  constructor(elem) {
    this.elem = elem;
  }

  loadData = () => {
    return axios.get('TravelogueD16.json').then(response => {
      this.markerRegions = uniqueMarkerRegions(response.data);
      this.markerRegions.reverse();
      this.timeline = new Timeline(response.data);
      this.nerPeople = uniqueNERPersons(response.data);
      this.nerLocations = uniqueNERLocations(response.data);
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

    this.dateScale = renderWorksByDateVertical(this.timeline, svg, this.onMouseOver, this.onMouseOut);
    this.regionScale = renderRegionsVertical(this.markerRegions, svg);
    this.nerPeopleScale = renderNERPeople(this.nerPeople, svg);
    this.nerLocationsScale = renderNERLocations(this.nerLocations, svg);

    this.svg = svg;
    this.updatePaths(selectedPaths);
  }
  
  // Horrible - clean up later
  updatePaths = selectedPaths => {
    // Clean slate
    d3.select(this.elem).selectAll('line').remove();

    d3.select('svg').attr('class', `${selectedPaths ? 'selected' : ''}`)

    const records = selectedPaths ? selectedPaths : this.records;

    records.forEach((r, idx) => {
      const yCoords = [
        r.entities.people.map(p => this.nerPeopleScale(p)),
        r.entities.locations.map(l => this.nerLocationsScale(l)),
        r.marker_regions.map(r => this.regionScale(r)),
        this.dateScale(r.date)
      ]

      drawPathVertical(yCoords, this.svg, r.barcodes);
    });
  }

}

const app = new App(document.getElementById('app'));
app.loadData().then(() => app.render());
