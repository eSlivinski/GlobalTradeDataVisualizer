function initMap() {
  map = new L.Map('map', {
    //center: new L.LatLng(15, 0),
    maxZoom:5,
    minZoom: 1,
    layers: [centroidLayerGroup],
    zoomControl:false,
    doubleClickZoom:false,
    worldCopyJump:true,
    continuousWorld:true,
    markerZoomAnimation: true
  }).fitWorld();


//Defines the the basemap and adds it to the map
  var mapbox = new L.TileLayer("http://{s}.tile.cloudmade.com/77a6ff5a162e44c2a9152755795c07bf/105047/256/{z}/{x}/{y}.png",{
    attribution: " | © Mid America Freight Coalition, 2013"
  }).addTo(map);
 

  // Attach event handlers to objects in the control bar
  $('#zoomIn').on('click', function() {
    map.zoomIn();
  });
  $('#zoomOut').on('click', function() {
    map.zoomOut();
  });
  $(window).on("resize", function() {
    resize();
  });

  $('#collapse').on('click', function() { 
    if ($('#collapseMenu').is(':hidden')) {
      $('#collapseMenu').slideDown();
    } else {
      $('#collapseMenu').slideUp();
    }
  });

  $('#legendButton').on('click', function() {
    if ($('.info.legend').is(':hidden')) {
      $('.info.legend').show();
      $('#legendButton').html('<i class="icon-key icon-large"></i> Hide Legend');
    } else {
      $('.info.legend').hide();
      $('#legendButton').html('<i class="icon-key icon-large"></i> Show Legend');
    }
  });

  $('.nav-list a').on('click', function() {
    $('#collapseMenu').slideUp();
  });

}//End of initMap

// Make everything fit the viewport
$('#map').css('width', $('body').width());

// Function to make sure the map and interface fit the device viewport
function resize () {
  if ($('body').width() < 550) {
    $('#map').css('width', $('body').width());
    $('.info.legend').css('display', 'none');
  } else {
    $('#map').css('width', $('body').width());
    $('.info.legend').css('display', 'block');
    $('#collapseMenu').hide();
  }
}

