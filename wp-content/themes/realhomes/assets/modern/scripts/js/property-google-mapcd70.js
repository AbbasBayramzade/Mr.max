/**
 * Javascript to handle open street map for property single page.
 */
jQuery( function($) {
	'use strict';

	if ( typeof propertyMapData !== "undefined" ) {

		if ( propertyMapData.lat && propertyMapData.lng ) {

			var iconURL = propertyMapData.icon;
			var iconSize = new google.maps.Size( 42, 57 );

			// retina
			if( window.devicePixelRatio > 1.5 ) {
				if( propertyMapData.retinaIcon ) {
					iconURL = propertyMapData.retinaIcon;
					iconSize = new google.maps.Size( 83, 113 );
				}
			}

			var markerIcon = {
				url : iconURL,
				size : iconSize,
				scaledSize : new google.maps.Size( 42, 57 ),
				origin : new google.maps.Point( 0, 0 ),
				anchor : new google.maps.Point( 21, 56 )
			};

			var propertyLocation = new google.maps.LatLng( propertyMapData.lat, propertyMapData.lng );
			var propertyMapOptions = {
				center : propertyLocation,
				zoom : 15,
				mapTypeId : google.maps.MapTypeId.ROADMAP,
				scrollwheel : false
			};
			var propertyMap = new google.maps.Map( document.getElementById( "property_map" ), propertyMapOptions );
			var propertyMarker = new google.maps.Marker( {
				position : propertyLocation, map : propertyMap, icon : markerIcon
			} );


			var boxText = document.createElement( "div" );
			boxText.className = 'map-info-window';
			var innerHTML = "";
			if( propertyMapData.thumb ) {
				innerHTML += '<img class="prop-thumb" src="' + propertyMapData.thumb + '" alt="' + propertyMapData.title + '"/>';
			}
			innerHTML += '<h5 class="prop-title">' + propertyMapData.title + '</h5>';
			if( propertyMapData.price ) {
				innerHTML += '<p><span class="price">' + propertyMapData.price + '</span></p>';
			}
			innerHTML += '<div class="arrow-down"></div>';
			boxText.innerHTML = innerHTML;

			// info window close icon URL
			var closeIconURL = "";
			if ( ( typeof mapStuff !== "undefined" ) && mapStuff.closeIcon ) {
				closeIconURL = mapStuff.closeIcon;
			}

			var infoWindowOptions = {
				content : boxText,
				disableAutoPan : true,
				maxWidth : 0,
				alignBottom : true,
				pixelOffset : new google.maps.Size( -122, -48 ),
				zIndex : null,
				closeBoxMargin : "0 0 -16px -16px",
				closeBoxURL : closeIconURL,
				infoBoxClearance : new google.maps.Size( 1, 1 ),
				isHidden : false,
				pane : "floatPane",
				enableEventPropagation : false
			};

			var infoBox = new InfoBox( infoWindowOptions );

			google.maps.event.addListener( propertyMarker, 'click', function() {
				var scale = Math.pow( 2, propertyMap.getZoom() );
				var offsety = ( (150 / scale) || 0 );
				var projection = propertyMap.getProjection();
				var markerPosition = propertyMarker.getPosition();
				var markerScreenPosition = projection.fromLatLngToPoint( markerPosition );
				var pointHalfScreenAbove = new google.maps.Point( markerScreenPosition.x, markerScreenPosition.y - offsety );
				var aboveMarkerLatLng = projection.fromPointToLatLng( pointHalfScreenAbove );
				propertyMap.setCenter( aboveMarkerLatLng );
				infoBox.open( propertyMap, propertyMarker );
			} );

		}

	}

} );
