$(document).ready(function(){

    var self = this;
    var sanjose, map, infoWindow;

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