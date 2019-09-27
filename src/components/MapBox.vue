<template>
  <div id="viz_container">
    <div class="header-container">
      <div class="usa-prose">
        <h2 class="title-text">
          {{ title }}
        </h2>
      </div>
      <div
        id="mapbox_component-layers-toggle"
        class="mapbox_component-topnav"
      >
        <a
          id="map-layers-label"
          href="JavaScript:Void(0);"
          class="active"
        >Map Layers</a>
        <a
          href="JavaScript:Void(0);"
          class="icon"
          @click="changeToResponsiveElement('mapbox_component-layers-toggle')"
        ><font-awesome-icon icon="layer-group" />
        </a>
      </div>
      <div
        id="mapbox_component-streams-toggle"
        class="mapbox_component-topnav"
      >
        <a
          id="map-streams-label"
          href="JavaScript:Void(0);"
          class="active"
        >Stream Orders</a>
        <a
          class="icon"
          @click="changeToResponsiveElement('mapbox_component-streams-toggle')"
        ><font-awesome-icon icon="water" />
        </a>
      </div>
      <div
        id="mapbox_component-providers-toggle"
        class="mapbox_component-topnav"
      >
        <a
          id="map-providers-label"
          href="JavaScript:Void(0);"
          class="active"
        >Data Providers</a>
        <a
          class="icon"
          @click="changeToResponsiveElement('mapbox_component-providers-toggle')"
        ><font-awesome-icon icon="hand-holding-heart" />
        </a>
      </div>
      <div
        id="mapbox_component-project-specific-toggle"
        class="mapbox_component-topnav"
      >
        <a
          id="map-project-specific-label"
          href="JavaScript:Void(0);"
          class="active"
        >Project Specific</a>
        <a
          class="icon"
          @click="changeToResponsiveElement('mapbox_component-project-specific-toggle')"
        ><font-awesome-icon icon="microscope" />
        </a>
      </div>
    </div>
    <div
      id="infoContainer"
      class="info-container"
    >
      <p>| <span id="infoForSelectedItemContent" /></p>
    </div>
    <div id="mapContainer">
      <MapLegend :legend-title="legendTitle" />
      <MglMap
        id="map"
        :container="container"
        :map-style="mapStyle"
        :zoom="zoom"
        :min-zoom="minZoom"
        :max-zoom="maxZoom"
        :center="center"
        :pitch="pitch"
        :bearing="bearing"
        :pitch-with-rotate="false"
        :drag-rotate="false"
        :touch-zoom-rotate="false"
        @load="onMapLoaded"
      >
        <MglAttributionControl
          position="bottom-right"
          :compact="false"
          custom-attribution="© <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />
        <MglScaleControl
          position="bottom-right"
          unit="imperial"
        />
        <MglNavigationControl
          position="top-right"
          :show-compass="false"
        />
        <MglFullscreenControl
          position="top-right"
        />
      </MglMap>
    </div>
    <!--    If  you would like to see a current zoom level while doing development un-comment the following section,  -->
    <!--    and the ZOOM LEVEL code section. Hint, search for 'ZOOM LEVEL' to find the needed code section. -->
    <div>
      Current Zoom Level (listed for development purposes):
      <span id="zoomlevel" />
    </div>
  </div>
</template>

<script>
    import MapLegend from './MapLegend'
    import {
        MglMap,
        MglNavigationControl,
        MglFullscreenControl,
        MglScaleControl,
        MglAttributionControl
    } from "vue-mapbox";
    import mapStyles from '../assets/mapStyles/mapStyles';

    export default {
        name: 'MapBox',
        components: {
            MglMap,
            MglNavigationControl,
            MglFullscreenControl,
            MglScaleControl,
            MglAttributionControl,
            MapLegend
        },
        props: {
            title: {
                type: String,
                default: 'Add your title in App.vue or make this blank'
            }
        },
        data() {
            return {
                mapStyle: mapStyles.style,
                container: 'map',
                zoom: 6,
                minZoom: 3,
                maxZoom: 18,
                center: [-75.072994, 40.544454],
                pitch: 0, // tips the map from 0 to 60 degrees
                bearing: 0, // starting rotation of the map from 0 to 360
                hoveredHRUId: null,
                legendTitle: 'Legend',
                coordinates: null
            }
        },
        methods: {
            // Switch to a mobile menu (add the 'responsive' class name) when user clicks the 'layer-group' icon.
            // Note: this method is bound to the anchor ('a') element that contains the subject related icons.
            changeToResponsiveElement: function(targetElement) {
                let mapboxComponentLayerToggle = document.getElementById(targetElement);
                if (mapboxComponentLayerToggle.className === "mapbox_component-topnav") {
                    mapboxComponentLayerToggle.className += " responsive";
                } else {
                    mapboxComponentLayerToggle.className = "mapbox_component-topnav";
                }
            },
            onMapLoaded(event) {
                let map = event.map; // This gives us access to the map as an object but only after the map has loaded
                // Get the element that will hold text information about a selected map element, such as a monitoring location.
                // We will use this later for several different map elements.
                let infoForSelectedItemContent = document.getElementById('infoForSelectedItemContent');

                // For now, I am going to duplicate this code section for each set of toggles (currently layers and streams), ideally this would be
                // in separate components, but for prototyping purposes this is fine for now.

                // Next section gives us names for the layer toggle buttons
                let styleLayers = Object.values(mapStyles.style.layers); // Pulls the layers out of the styles object as an array
                let toggleableLayerIds = [];
                let layersTurnedOffAtStart = [];
                let toggleableStreamsIds = [];
                let streamsTurnedOffAtStart = [];
                let toggleableProjectSpecificIds = [];
                let ProjectSpecificTurnedOffAtStart = [];

                for (let index = 0; index < styleLayers.length; index++) {
                    if (styleLayers[index].showButtonLayerToggle === true) { // note: to NOT show a button for layer, change the 'showButtonLayerToggle' property in the mapStyles.js to false
                        toggleableLayerIds.push(styleLayers[index].id);

                        // Make a list if ids of any layers that we do not want to show when the page loads (layers that are toggleable but are off by default)
                        // These layers that are off by default have a visibility of 'none' in the style sheet.
                        if (styleLayers[index].layout.visibility === 'none') {
                            layersTurnedOffAtStart.push(styleLayers[index].id);
                        }
                    }
                }

                // Go through each layer id that is in the array and make a button element for it
                for (let i = 0; i < toggleableLayerIds.length; i++) {
                    let id = toggleableLayerIds[i];

                    let link = document.createElement('a');
                    link.href = '#';
                    // If the layer is not set to visible when first loaded, then do not mark it as active.
                    // In other words, if the layer is not visible on page load, make the button look like the layer is toggled off
                    if (layersTurnedOffAtStart.includes(id)) {
                        link.className = '';
                    } else {
                        link.className = 'active';
                    }

                    // Set the wording (label) for the layer toggle button to match the 'id' listed in the style sheet
                    link.textContent = id;

                    // Creates a click event for each button so that when clicked by the user, the visibility property
                    // is changed as is the class (color) of the button
                    link.onclick = function (e) {
                        let clickedLayer = this.textContent;
                        e.preventDefault();
                        e.stopPropagation();

                        let visibility = map.getLayoutProperty(clickedLayer, 'visibility');

                        if (visibility === 'visible') {
                            map.setLayoutProperty(clickedLayer, 'visibility', 'none');
                            this.className = '';
                        } else {
                            this.className = 'active';
                            map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
                        }
                    };

                    let layerToggleList = document.getElementById('mapbox_component-layers-toggle');
                    layerToggleList.appendChild(link);
                }

                // Next section gives us names for the streams toggle buttons


                for (let index = 0; index < styleLayers.length; index++) {
                    if (styleLayers[index].showButtonStreamToggle === true) { // note: to NOT show a button for layer, change the 'showButtonStreamToggle' property in the mapStyles.js to false
                        toggleableStreamsIds.push(styleLayers[index].id);

                        // Make a list if ids of any layers that we do not want to show when the page loads (layers that are toggleable but are off by default)
                        // These layers that are off by default have a visibility of 'none' in the style sheet.
                        if (styleLayers[index].layout.visibility === 'none') {
                            streamsTurnedOffAtStart.push(styleLayers[index].id);
                        }
                    }
                }

                // Go through each streams id that is in the array and make a button element for it
                for (let i = 0; i < toggleableStreamsIds.length; i++) {
                    let id = toggleableStreamsIds[i];

                    let link = document.createElement('a');
                    link.href = '#';
                    // If the layer is not set to visible when first loaded, then do not mark it as active.
                    // In other words, if the layer is not visible on page load, make the button look like the layer is toggled off
                    if (streamsTurnedOffAtStart.includes(id)) {
                        link.className = '';
                    } else {
                        link.className = 'active';
                    }

                    // Set the wording (label) for the streams toggle button to match the 'id' listed in the style sheet
                    link.textContent = id;

                    // Creates a click event for each button so that when clicked by the user, the visibility property
                    // is changed as is the class (color) of the button
                    link.onclick = function (e) {
                        let clickedLayer = this.textContent;
                        e.preventDefault();
                        e.stopPropagation();

                        let visibility = map.getLayoutProperty(clickedLayer, 'visibility');

                        if (visibility === 'visible') {
                            map.setLayoutProperty(clickedLayer, 'visibility', 'none');
                            this.className = '';
                        } else {
                            this.className = 'active';
                            map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
                        }
                    };

                    let streamsToggleList = document.getElementById('mapbox_component-streams-toggle');
                    streamsToggleList.appendChild(link);
                }

                // Next section gives us names for the project specific toggle buttons


                for (let index = 0; index < styleLayers.length; index++) {
                    if (styleLayers[index].showButtonProjectSpecific === true) { // note: to NOT show a button for layer, change the 'showButtonStreamToggle' property in the mapStyles.js to false
                        toggleableProjectSpecificIds.push(styleLayers[index].id);

                        // Make a list if ids of any layers that we do not want to show when the page loads (layers that are toggleable but are off by default)
                        // These layers that are off by default have a visibility of 'none' in the style sheet.
                        if (styleLayers[index].layout.visibility === 'none') {
                            ProjectSpecificTurnedOffAtStart.push(styleLayers[index].id);
                        }
                    }
                }

                // Go through each id that is in the array and make a button element for it
                for (let i = 0; i < toggleableProjectSpecificIds.length; i++) {
                    let id = toggleableProjectSpecificIds[i];

                    let link = document.createElement('a');
                    link.href = '#';
                    // If the layer is not set to visible when first loaded, then do not mark it as active.
                    // In other words, if the layer is not visible on page load, make the button look like the layer is toggled off
                    if (ProjectSpecificTurnedOffAtStart.includes(id)) {
                        link.className = '';
                    } else {
                        link.className = 'active';
                    }

                    // Set the wording (label) for the streams toggle button to match the 'id' listed in the style sheet
                    link.textContent = id;

                    // Creates a click event for each button so that when clicked by the user, the visibility property
                    // is changed as is the class (color) of the button
                    link.onclick = function (e) {
                        let clickedLayer = this.textContent;
                        e.preventDefault();
                        e.stopPropagation();

                        let visibility = map.getLayoutProperty(clickedLayer, 'visibility');

                        if (visibility === 'visible') {
                            map.setLayoutProperty(clickedLayer, 'visibility', 'none');
                            this.className = '';
                        } else {
                            this.className = 'active';
                            map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
                        }
                    };

                    let projectSpecificToggleList = document.getElementById('mapbox_component-project-specific-toggle');
                    projectSpecificToggleList.appendChild(link);
                }



                // next section controls the HRU hover effect
                let hoveredHRUId = this.hoveredHRUId;
                map.on("mousemove", "hru - highlight", function(e) {
                    if (e.features.length > 0) {
                        if (hoveredHRUId) {
                            infoForSelectedItemTitle.textContent = 'Hydrological Response Unit ';
                            infoForSelectedItemContent.textContent = e.features[0].id;
                            map.setFeatureState({source: 'HRU', sourceLayer: 'hrus', id: hoveredHRUId}, {hover: false});
                        }
                        hoveredHRUId = e.features[0].id;

                        map.setFeatureState({source: 'HRU', sourceLayer: 'hrus', id: hoveredHRUId}, {hover: true});
                    }
                });
                map.on("mouseleave", "hru - highlight", function () {
                    if (hoveredHRUId) {
                        infoForSelectedItemTitle.textContent = '';
                        infoForSelectedItemContent.textContent = '';
                        map.setFeatureState({source: 'HRU', sourceLayer: 'hrus', id: hoveredHRUId}, {hover: false});
                    }
                    hoveredHRUId = null;
                });

                // next section controls clustering of monitoring locations
                // inspect a cluster on click
                map.on('click', 'clusters-monitoring-location-', function (e) {
                    let features = map.queryRenderedFeatures(e.point, {layers: ['clusters-monitoring-location-']});
                    let clusterId = features[0].properties.cluster_id;
                    map.getSource('monitoring_location_summary').getClusterExpansionZoom(clusterId, function (err, zoom) {
                        if (err)
                            return;

                        map.easeTo({
                            center: features[0].geometry.coordinates,
                            zoom: zoom
                        });
                    });
                });

                map.on('mouseenter', 'clusters-monitoring-location-', function () {
                    map.getCanvas().style.cursor = 'pointer';
                });
                map.on('mouseleave', 'clusters-monitoring-location-', function () {
                    map.getCanvas().style.cursor = '';
                });

                // Create an information banner when the user clicks on a monitoring location
                map.on('click', 'monitoring-location-unclustered-point', function (e) {
                    infoForSelectedItemContent.textContent = '';
                    let properties = e.features[0].properties;
                    for (let [key, value] of Object.entries(properties)) {
                        // Clean up the wording of some of the known keys so that they look better on the page
                        switch (key) {
                            case 'site_id':
                                key = 'site id';
                                break;
                            case 'nobsBin':
                                key = '';
                                break;
                            case 'n_obs':
                                key = 'observations';
                                break;
                            case 'dist_to_reach_km':
                                key = 'distance to reach (km)';
                                break;
                            case 'matched_reach_id':
                                key = 'matched reach id';
                                break;
                            default:
                                // If key doesn't match a known value, just leave it like it is and print it out.
                        }

                        if (key !== '' && value !== '') {
                            infoForSelectedItemContent.textContent += key + ': ' + value + ' | ';
                        }
                    }
                });

                // Change the cursor to a pointer when the mouse is over the layer containing monitoring locations.
                map.on('mouseenter', 'monitoring-location-unclustered-point', function () {
                    map.getCanvas().style.cursor = 'pointer';
                });

                // Change it back to a pointer when it leaves the layer containing monitoring locations.
                map.on('mouseleave', 'monitoring-location-unclustered-point', function () {
                    map.getCanvas().style.cursor = '';
                });



                // This section starts data provider filtering . . .
                // We need an object to do the filtering and can't just use the data pulled in with the original
                // call to get the monitoring location information we made in the style sheet,
                // so I am making a second call (using the 'fetch' api) to get the GeoJson monitoring location
                // information again. Then we pack it into a object that we can use to create a new map layer for each
                // data provider. Then buttons are added for each of those layers.
                let url = 'https://delaware-basin-test-website.s3-us-west-2.amazonaws.com/geojson/delaware_site_summary.geojson';
                // set up a element to contain the filter selections for monitoring locations
                let providersToggle = document.getElementById('mapbox_component-providers-toggle');

                // Create a function to handle the 'response' returned from the 'fetch' command
                function status(response) {
                    if (response.status >= 200 && response.status < 300) {
                        return Promise.resolve(response)
                    } else {
                        return Promise.reject(new Error(response.statusText))
                    }
                }

                // If the 'fetch' returned a valid response, turn it into JSON
                function json(response) {
                    return response.json()
                }

                fetch(url)
                        .then(status)
                        .then(json)
                        .then(function(monitoringLocationList) {
                            map.addSource("monitoringLocationList", {
                                "type": "geojson",
                                "data": monitoringLocationList
                            });

                            // The next section generates the colors for the monitoring location markers
                            // First we need to know how many data providers there are in the data
                            let uniqueDataProviders = [];
                            monitoringLocationList.features.forEach(function(feature) {
                                let providerName = feature.properties['source'];
                                if (!uniqueDataProviders.includes(providerName)) {
                                    uniqueDataProviders.push(providerName);
                                }
                            });
                            // Next we need to generate a list of colors based on the number of providers we have.
                            // We will use HSL colors in the format hsl((hue, saturation, lightness).
                            // We will only adjust the hue. The 'hue' range is from 0-360, but we want to stay out the red
                            // range so will only use 45-290. We will use 45 and 290 as our start and end, then we will
                            // select additional points as needed based on the number of providers.
                            let hslHues = [];
                            let hslStartPoint = 45;
                            let hslEndPoint = 290;
                            let hslRange = hslEndPoint - hslStartPoint;
                            let hslRangeDivisor = uniqueDataProviders.length - 1;
                            let countToNextHslPoint = Math.floor(hslRange/hslRangeDivisor);
                            // Add the start point to our array of hsl color points.
                            hslHues.push(hslStartPoint);
                            let hslIntermediatePoint = hslStartPoint + countToNextHslPoint;
                            // If there is more than one intermediate hsl point, loop to add; otherwise just add the one.

                            if (hslRangeDivisor > 2) {
                                for(let index = 0; index < hslRangeDivisor-1; index++) {
                                    hslHues.push(hslIntermediatePoint);
                                    hslIntermediatePoint = hslIntermediatePoint + countToNextHslPoint;
                                }
                            } else {
                                hslHues.push(hslIntermediatePoint);
                            }
                            // Add the hsl end point
                            hslHues.push(hslEndPoint);

                            let loopCount = 0;
                            monitoringLocationList.features.forEach(function(feature) {
                                // Check the value of the 'source' property of the current GeoJSON 'feature' and create
                                // a new map layer for it--provided that a map layer for that type does not already exist.
                                let providerName = feature.properties['source'];
                                let layerID = providerName;
                                let color = 'hsl('+ hslHues[loopCount] + ', 100%, 51%)';
                                if (!map.getLayer(layerID)) {
                                    let styleObject =
                                            {
                                                'id': layerID,
                                                'type': 'circle',
                                                'source': 'monitoringLocationList',
                                                'layout': {
                                                    'visibility': 'none'
                                                },
                                                'filter': ['==', 'source', providerName],
                                                'paint': {
                                                    'circle-color':  color,
                                                    'circle-opacity': 0.1,
                                                    'circle-radius': 10,
                                                    'circle-stroke-width': 2,
                                                    'circle-stroke-color': color,
                                                },
                                                'minzoom': 3,
                                                'maxzoom': 23,
                                            };
                                    loopCount++;
                                    // Add the layer to the map
                                    map.addLayer(styleObject);

                                    // add the layer to the style sheet in memory
                                    mapStyles.style.layers.push(styleObject);

                                    let link = document.createElement('a');
                                    let colorKey = document.createElement('span');
                                    colorKey.style.backgroundColor = color;
                                    colorKey.style.marginLeft = '5px';
                                    colorKey.style.display = 'inline-block';
                                    colorKey.style.height = '10px';
                                    colorKey.style.width = '10px';
                                    colorKey.style.borderRadius = '50%';
                                    link.href = '#';
                                    // We want all of these links to be off (and look off) as a default,
                                    // so we will NOT mark them with the 'active' class.
                                    link.classname = '';
                                    link.textContent = providerName;
                                    link.appendChild(colorKey);


                                    // Add a click event to each toggle button to toggle the layer, also add a way
                                    // to change the button's class so that we can see if it switched on or off.
                                    link.onclick = function(e) {
                                            let clickedLayer = this.textContent;
                                            e.preventDefault();
                                            e.stopPropagation();

                                            let visibility = map.getLayoutProperty(clickedLayer, 'visibility');

                                            if (visibility === 'visible') {
                                                map.setLayoutProperty(clickedLayer, 'visibility', 'none');
                                                this.className = '';
                                            } else {
                                                this.className = 'active';
                                                map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
                                            }
                                    };

                                    let layerToggleList = document.getElementById('mapbox_component-providers-toggle');
                                    layerToggleList.appendChild(link);

                                }
                            });
                        }).catch(function(error) {
                    console.log('Request to gather the monitoring location data failed', error);
                });

                // To see the current ZOOM LEVEL of the map during development, uncomment the next section.
                // This section adds a indicator so that we can see the current zoom level
                // This is for development and should be removed before sending to production
                function onZoomend() {
                    let currentZoom = map.getZoom();
                    document.getElementById("zoomlevel").innerHTML = currentZoom;
                }
                map.on("zoomend", onZoomend);
            }
        }
    }
</script>

<style scoped lang="scss">
  @import"~mapbox-gl/dist/mapbox-gl.css";

  .header-container {
    background-color: #fff;
  }
  /* Add a background color to the layer toggle bar */
  .mapbox_component-topnav {
    background-color: #4574a3;
    overflow: hidden;
  }

  #map-layers-label::after {
    content: "|";
    padding-left: 10px;
    float: right;
    color: #fff;
  }

  #map-streams-label::after {
    content: "|";
    padding-left: 10px;
    float: right;
    color: #fff;
  }

  #map-providers-label::after {
    content: "|";
    padding-left: 10px;
    float: right;
    color: #fff;
  }

  #map-project-specific-label::after {
    content: "|";
    padding-left: 10px;
    float: right;
    color: #fff;
  }


  .usa-prose {
    border-bottom: 1px solid rgb(100,100,100);
  }

  .info-container p {
    font-family: 'Source Sans Pro', sans-serif;
    margin: 0;
  }

  /* override USWDS style to prevent title from wrapping too soon */
  .title-text {
    margin-left: 1.5rem;
    padding: 0.5rem 0;
  }

  #mapContainer{
    position: relative;
    height:80vh;
    min-height: 500px;
  }

  @media screen and (min-width:600px) {
    #viz_container {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    #mapContainer {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: auto;
    }
    #map {
      flex: 1;
    }
  }

</style>
<style>
  /* Style the links inside the layer toggle bar */
  .mapbox_component-topnav a {
    float: left;
    display: block;
    color: #d3d9f2;
    text-align: center;
    padding: 10px 16px;
    margin: 2px 0;
    background-color: #00264c;
    font-size: 17px;
    text-decoration: line-through;
  }

  /* Change the color of links in layer toggle on hover */
  .mapbox_component-topnav a.active:hover {
    background-color: #ddd;
    color: black;
  }

  /* Override the hover effect for so the 'Map Layers' label does not appear click-able. */
  #map-layers-label:hover {
    background-color: #4574a3;
    color: white;
  }

  /* Override the hover effect for so the 'Stream Orders' label does not appear click-able. */
  #map-streams-label:hover {
    background-color: #4574a3;
    color: white;
  }

  /* Override the hover effect for so the 'Stream Orders' label does not appear click-able. */
  #map-providers-label:hover {
    background-color: #4574a3;
    color: white;
  }

  /* Add an active class to highlight the current toggle */
  .mapbox_component-topnav a.active {
    background-color: #4574a3;
    color: white;
    text-decoration: none;
  }

  /* Hide the layer-group icon that should open and close the toggle menu on small screens */
  .mapbox_component-topnav .icon {
    display: none;
  }

  /* When the screen is less than 600 pixels wide, hide all links, except for the title ("map layers").
  Show the layer-group that should open and close the layer toggle bar */
  @media screen and (max-width: 900px) {
    .usa-prose .title-text {
      font-size: .8em;
      margin-left: 1rem;
    }

    .mapbox_component-topnav a:not(:first-child) {
      display: none;
    }

    .mapbox_component-topnav a.icon {
      float: right;
      display: block;
    }

    /* The "responsive" class is added to the topnav with JavaScript when the user clicks on the any of the toggle icons.
    This class makes the to layer toggle menu look good on small screens (display the links vertically instead of horizontally) */
    .mapbox_component-topnav.responsive {
      position: relative;
    }

    .mapbox_component-topnav.responsive a.icon {
      position: absolute;
      right: 0;
      top: 0;
    }

    .mapbox_component-topnav.responsive a {
      float: none;
      display: block;
      text-align: left;
    }
  }
</style>
