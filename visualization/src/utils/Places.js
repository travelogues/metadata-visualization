export const uniquePublicationPlaces = records => {
  const all = records.map(r => r.place_of_publication);
  
  const unique = [...new Set(all)]; 
  unique.sort();
  unique.reverse();
  
  return unique;
}

export const uniqueMarkerRegions = records => {
  let all = [];
  records.forEach(r => all = all.concat(r.marker_regions));

  const unique = [...new Set(all)]; 
  unique.sort();
  
  return unique;
}