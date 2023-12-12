
  // TO MAKE THE MAP APPEAR YOU MUST
  // ADD YOUR ACCESS TOKEN FROM
  // https://account.mapbox.com
  let map_token = mapToken;
  console.log(map_token);
  mapboxgl.accessToken =map_token;
const map = new mapboxgl.Map({
container: 'map', // container ID
center:listing.geometry.coordinates, // starting position [lng, lat]
zoom: 10 // starting zoom
});

const marker1 = new mapboxgl.Marker({color:"black"})
.setLngLat(listing.geometry.coordinates)
// creating a function for the popup text
.setPopup(new mapboxgl.Popup({offset:25, className: 'my-class'})

.setHTML(`<h4>${listing.location}</h4><p>Exact Location provided after Booking</p>`)
)
.addTo(map);