// GeoJSON source options for the world map
export const geoSources = [
  // Primary source - from jsDelivr CDN
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json",
  
  // Alternative source - Natural Earth via GitHub
  "https://raw.githubusercontent.com/topojson/world-atlas/master/countries-110m.json",
  
  // Another popular source
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json"
];

// Local source for development (will be used if others fail)
export const localGeoSource = "/data/world-countries.json"; 