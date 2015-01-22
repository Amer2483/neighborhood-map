function initialize() {
        var mapOptions = {
          center: { lat: 32.73, lng: -117.162},
          zoom: 12
        };
        var map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
}

google.maps.event.addDomListener(window, 'load', initialize);

// For asynchronous loading of maps
function loadScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&' +
      'callback=initialize';
  document.body.appendChild(script);
}
window.onload = loadScript;

ko.applyBindings(viewModel);
