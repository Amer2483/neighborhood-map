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

  // To get the values of Place's open hours property using getDayOfWeek function

  var dateMap = {
        0: 'Monday',
        1: 'Tuesday',
        2: 'Wednesday',
        3: 'Thursday',
        4: 'Friday',
        5: 'Saturday',
        6: 'Sunday',
    };

  // Get the map of San Jose area
  function initialize() {
    sanjose = new google.maps.LatLng(37.2970155, -121.8174109)
    map = new google.maps.Map(document.getElementById('map-canvas'), {
      center: sanjose,
      zoom: 12,
      disableDefaultUI:true
    });
    getAllPlaces();
  };

  // Call Google Map API for popular restaurants and bars in San Jose area
    
    function getAllPlaces() {
        self.allPlaces([]);
        var request = {
            location: sanjose,
            radius: 500,
            types: ['cafe', 'bar', 'exotic']
        };
        infowindow = new google.maps.InfoWindow();
        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, getAllPlacesCallback);
    }


     
     // Obtain places from getAllPlaces Google request.  Recieve results as an array of PlaceResult Objects
     //Begins an Instagram request to get recent media for this location.  
     // The results stored in the place's instagram array created in this function.

    function getAllPlacesCallback(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            // Create a new boundary for the map.  Will be updated with each new
            // location search.
            bounds = new google.maps.LatLngBounds();

            results.forEach(function (place) {
                place.marker = createMarker(place);
               
                 //Create an array object to store data from Instagram API request.  
                 // Data are pushed to the allPlaces array
                 
                place.instagrams = ko.observableArray([]);
                
                // Returns a boolean value if getInstagrams function is still running
    
                place.isGettingInstagrams = ko.observable(true);
               
                // Returns a boolean value if  place included in the filteredPlaces array
                 
                place.isInFilteredList = ko.observable(true);
                self.allPlaces.push(place);
                getInstagrams(place);
                bounds.extend(new google.maps.LatLng(
                    place.geometry.location.lat(),
                    place.geometry.location.lng()));
            });
            // Show all markers when done looping through the result
            map.fitBounds(bounds);
        }
    }

  


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
