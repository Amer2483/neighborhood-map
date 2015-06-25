function appViewModel() {

  var self = this;
  var sanjose, map, infoWindow;

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


  // Create the search box and link it to the UI element.
  function initialize() {
    sanjose = new google.maps.LatLng(37.2970155, -121.8174109)
    map = new google.maps.Map(document.getElementById('map-canvas'), {
      center: sanjose,
      zoom: 12,
      disableDefaultUI:true
    });
  };

  function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                var place = results[i];
                place.marker = createMarker(results[i]);
                self.searchResults.push(place);
            }
        }
  };

  function createMarker(place) {
        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
        });
        google.maps.event.addListener(marker, 'click', function () {
            /*
            self.searchResults().forEach(function(result) {
                result.marker.setAnimation(null);
            })
            infowindow.setContent("<p>" + place.name + "</p>");
            infowindow.open(map, this);
            map.panTo(marker.position);
            self.chosenResult(place);
            document.getElementById(place.id).scrollIntoView();
            marker.setAnimation(google.maps.Animation.BOUNCE);
            */
            var placeId = '#' + place.id;
            $(placeId).trigger('click');

        });
        return marker;
  };
  self.splitAddress = function (address) {
        var firstComma = address.indexOf(',');
        var street = address.slice(0, firstComma);
        var cityState = address.slice(firstComma + 1);
        return [street, cityState];
  };

  self.displayInfo = function (place) {
        console.log(place);
        infowindow.setContent("<p>" + place.name + "</p>");
        infowindow.open(map, place.marker);
        map.panTo(place.marker.position);
  };
  
  initialize();

  self.query = ko.observable();
    self.searchResults = ko.observableArray([]);
    self.chosenResult = ko.observable();
    self.allMarkers = ko.observableArray([]);
    self.search = function () {
        self.searchResults([]);
        self.allMarkers([]);
        var request = {
            location: boston,
            radius: '500',
            query: self.query()
        };
        infowindow = new google.maps.InfoWindow();
        service = new google.maps.places.PlacesService(map);
        service.textSearch(request, callback);
    };
    self.goToResult = function (searchResult) {
        self.searchResults().forEach(function(result) {
            result.marker.setAnimation(null);
        });
        console.log(searchResult);
        self.chosenResult(searchResult);
        document.getElementById(searchResult.id).scrollIntoView();
        searchResult.marker.setAnimation(google.maps.Animation.BOUNCE);
    };


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



ko.applyBindings(new appViewModel());
