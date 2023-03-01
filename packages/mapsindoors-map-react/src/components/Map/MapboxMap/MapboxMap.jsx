import { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Make the global MapsIndoors JavaScript SDK available here
const mapsindoors = window.mapsindoors;

/**
 * Takes care of instantiating a MapsIndoors Mapbox MapView.
 *
 * @param {object} props
 * @param {string} props.mapboxAccessToken - A Mapbox Access Token required for showing the map.
 * @param {function} props.onMapView - A function that is called when the MapView is constructed.
 * @param {object} props.mapsIndoorsInstance - Instance of the mapsindoors.MapsIndoors
 */
function MapboxMap({ mapboxAccessToken, onMapView, mapsIndoorsInstance }) {

    const [mapView, setMapView] = useState();
    const [hasFloorSelector, setHasFloorSelector] = useState(false);

    useEffect(() => {
        // Initialize MapboxView MapView
        window.mapboxgl = mapboxgl;
        const mapViewOptions = {
            accessToken: mapboxAccessToken,
            element: document.getElementById('map')
        };

        const mapViewInstance = new mapsindoors.mapView.MapboxView(mapViewOptions);
        setMapView(mapViewInstance);
        onMapView(mapViewInstance);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    // We ignore eslint warnings about missing dependencies because onMapView should never change runtime and changing Mapbox Access Token runtime will give other problems.

    // Add Floor Selector to the Map when ready.
    useEffect(() => {
        if (mapsIndoorsInstance && mapView && !hasFloorSelector) {
            const floorSelectorDiv = document.createElement('div');
            new mapsindoors.FloorSelector(floorSelectorDiv, mapsIndoorsInstance);
            mapView.getMap().addControl({
                onAdd: () => floorSelectorDiv,
                onRemove: () => {
                    floorSelectorDiv.parentNode.removeChild(floorSelectorDiv);
                }
            }, 'top-right');
            setHasFloorSelector(true);
        }
    }, [mapsIndoorsInstance, mapView, hasFloorSelector]);

    return <div className="map-container" id="map"></div>
}


export default MapboxMap;
