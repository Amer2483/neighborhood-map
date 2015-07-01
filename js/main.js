$(document).ready(function(){

    var self = this;
    var sanjose, map, infoWindow;

    // List of my favorite places in San Francisco
var Model = [
    {
      "name": "Aqui Cal-Mex",
      "latlng": [37.2872782,-121.9464099]
    },
    {
      "name": "Hannah Coffee & Sweets",
      "latlng": [37.331574,-121.905534]
    },
    {
      "name": "Yard House",
      "latlng": [37.323022,-121.947505]
    },
    {
      "name": "Bill's Cafe",
      "latlng": [37.3283812,-121.9318303]
    },  
    {
      "name": "Bijan Bakery & Cafe",
      "latlng": [37.3324488,-121.8887316]
    },
    {
      "name": "Crema Coffee Roasting Company",
      "latlng": [37.3313523,-121.9082112]
    },
    {
      "name": "Panera Bread",
      "latlng": [37.340226,-121.903743]
    },
    {
      "name": "Cafe Pomegranate",
      "latlng": [37.33661,-121.88462]
    },
    {
      "name": "Caffe Frascati",
      "latlng": [37.331145,-121.8870726]
    },
    {
      "name": "SmokeEaters Hot Wings",
      "latlng": [37.3362316,-121.8881166]
    }
]


    // Initialize Google map based on predefined San Jose position
    function initialize() {

      var mapOptions = {
        center: new google.maps.LatLng(37.2970155, -121.8174109),
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      return new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      
    };

    google.maps.event.addDomListener(window, 'load', initialize);

    
    //Knockout ViewModel

    var appViewModel = function() {
      var self = this;
      self.markers = ko.observableArray([]);
      self.allLocations = ko.observableArray([]);


      self.filter =  ko.observable("");
      self.search = ko.observable("");

      var map = initialize();
      // if google map is not displaying, alert the user
      if (!map) {
        alert("Currently Google Maps is not available. Please try again later!");
        return;
      }  
      self.map = ko.observable(map);
      fetchForsquare(self.allLocations, self.map(), self.markers);

      // Based on the search keywords filter the list view
      self.filteredArray = ko.computed(function() {
        return ko.utils.arrayFilter(self.allLocations(), function(item) {
          if (item.name.toLowerCase().indexOf(self.filter().toLowerCase()) !== -1) {
            if(item.marker)
              item.marker.setMap(map); 
          } else {
            if(item.marker)
              item.marker.setMap(null);
          }     
          return item.name.toLowerCase().indexOf(self.filter().toLowerCase()) !== -1;
        });
      }, self);

      self.clickHandler = function(data) {
        centerLocation(data, self.map(), self.markers);
      }
    };

    

  ko.applyBindings(appViewModel);
});