function point(name, lat, lng){
  this.name = name;
  this.lat = ko.observable(lat);
  this.lng = ko.observable(lng);

  var myLatlng = new google.maps.LatLng(lat, lng);

  var marker = new google.maps.Marker({
    position: myLatlng,
    map: map,
    title: name,
    draggable: true
  });
}



var mapOptions = {
          center: new google.maps.LatLng(32.73,-117.162),
          zoom: 12,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

var map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);


// Create the search box and link it to the UI element.
function initialize() {
  var markers = [];
  var input = document.getElementById('pac-input');
  var autocomplete = new google.maps.places.Autocomplete(input);

  var searchBox = new google.maps.places.SearchBox(
    /** @type {HTMLInputElement} */(input));
  // [START region_getplaces]
  // Listen for the event fired when the user selects an item from the
  // pick list. Retrieve the matching places for that item.
  google.maps.event.addListener(searchBox, 'places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }
    for (var i = 0, marker; marker = markers[i]; i++) {
      marker.setMap(null);
    }

    // For each place, get the icon, place name, and location.
    markers = [];
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, place; place = places[i]; i++) {
      var image = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      var marker = new google.maps.Marker({
        map: map,
        icon: image,
        title: place.name,
        position: place.geometry.location
      });

      markers.push(marker);

      bounds.extend(place.geometry.location);
    }

    map.fitBounds(bounds);
  });
  // [END region_getplaces]

  // Bias the SearchBox results towards places that are within the bounds of the
  // current map's viewport.
  google.maps.event.addListener(map, 'bounds_changed', function() {
    var bounds = map.getBounds();
    searchBox.setBounds(bounds);
  });
}

google.maps.event.addDomListener(window, 'load', initialize);

var viewModel = {
  points: ko.observableArray([
    new point('Place1', 32.74, -117),
    new point('Place2', 32.72, -117)
    ])
}

ko.applyBindings(viewModel);
