import axios from 'axios';
import { uniquePeople } from './utils/People';
import { uniquePublicationPlaces, uniqueMarkerRegions } from './utils/Places';
import Timeline from './Timeline';

class App {

  constructor(elem) {
    axios.get('TravelogueD16.json').then(response => {
      this.people = uniquePeople(response.data);
      this.places = uniquePublicationPlaces(response.data);
      this.markerRegions = uniqueMarkerRegions(response.data);
      this.timeline = new Timeline(response.data);
    });    
  }

}

new App(document.getElementById('app'));
