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


var viewModel = {
  points: ko.observableArray([
    new point('Place1', 32.74, -117),
    new point('Place2', 32.72, -117)
    ])
}

ko.applyBindings(viewModel);
