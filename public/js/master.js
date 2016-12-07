var map;
markers = [];
var PointsRef = firebase.database().ref("points");
var LinesRef = firebase.database().ref("lines");
var PolygonsRef = firebase.database().ref("polygons");
var MapRef = firebase.database().ref("mapData");
var CenterRef = firebase.database().ref("mapData/centerLatLng");
var ZoomRef = firebase.database().ref("mapData/mapZoom");

PointsRef.on('child_added', function(snapshot) {
    var location = new google.maps.LatLng(snapshot.val().pointLatLng.Lat, snapshot.val().pointLatLng.Lng);
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        key: snapshot.key
    });
    markers.push(marker);
    console.log(typeof marker);
    console.log(marker);
});

PointsRef.on('child_removed', function(snapshot) {
    for (var i = 0; i < markers.length; i++) {
        if (markers[i].key == snapshot.key) {
            markers[i].setMap(null);
        }
    }
});

CenterRef.on('value', function(snapshot) {
    var center = new google.maps.LatLng(snapshot.val().Lat, snapshot.val().Lng);
    //if (map.getCenter() != center) {
    map.setCenter(center);
    //}
});

ZoomRef.on('value', function(snapshot) {
    var zoom = snapshot.val();
    if (map.getZoom() != zoom) {
        map.setZoom(zoom);
        console.log(zoom);
    }
});

function initialize() {
  // Initialise the map.

    var mapOptions = {
        center: new google.maps.LatLng(53.917, -122.75),
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map"), mapOptions);

    google.maps.event.addListener(map, 'click', function(event) {
        if (document.getElementById('radPoint').checked && document.getElementById('radDraw').checked) {
            var jsonVariable = {
                pointLatLng: {
                    Lat: event.latLng.lat(),
                    Lng: event.latLng.lng()
                }
            }
            PointsRef.push(jsonVariable);
        } else if (document.getElementById('radLine').checked) {
            console.log('lnclick');
        } else if (document.getElementById('radPolygon').checked) {
            console.log('polyclick');
        }


    });

    google.maps.event.addListener(map, 'center_changed', function() {
        var center = map.getCenter();
        var zoom = map.getZoom();
        var jsonVariable = {
            centerLatLng: {
                Lat: center.lat(),
                Lng: center.lng()
            }
        }
        MapRef.update(jsonVariable);
    });

    google.maps.event.addListener(map, 'zoom_changed', function() {
        var center = map.getCenter();
        var zoom = map.getZoom();
        var jsonVariable = {
            mapZoom: zoom
        }
        MapRef.update(jsonVariable);
    });

}

function eraseAll() {
    PointsRef.remove();
}

google.maps.event.addDomListener(window, 'load', initialize);
