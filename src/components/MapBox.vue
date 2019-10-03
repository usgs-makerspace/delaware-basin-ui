<template>
  <div id="viz_container">
    <div class="header-container">
      <div class="usa-prose">
        <h2 class="title-text">
          {{ title }}
        </h2>
      </div>
      <div id="mapbox_component-toggle" class="mapbox_component-topnav">
        <div id="topNavText">
          <a id="map-layers-label" class="active">Map Options</a>
        </div>
        <div id="ToggleOptions">
          <div id="mapLayers"></div>
          <div id="streams"></div>
          <div id="dataProviders"></div>
          <div id="projects"></div>
        </div>
        <div id="iconToggleContainer">
          <a id="layersIcon" class="icon">
            <font-awesome-icon icon="layer-group" />
          </a>
          <a id="streamsIcon" class="icon">
            <font-awesome-icon icon="water" />
          </a>
          <a id="dataProvidersIcon" class="icon">
            <font-awesome-icon icon="hand-holding-heart" />
          </a>
          <a id="projectsIcon" class="icon">
            <font-awesome-icon icon="microscope" />
          </a>
        </div>
      </div>
    </div>
    <div
      id="infoContainer"
      class="info-container"
    >
      <p>| <span id="infoForSelectedItem" /></p>
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
        :max-bounds="maxBounds"
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
                hoveredNHDFlowLineId: null,
                hoveredPRMSId: null,
                legendTitle: 'Legend',
                maxBounds: [[-179.56055624999985, 9.838930211369288], [-11.865243750001127, 57.20768307316615]], // The coordinates needed to make a bounding box for the continental United States.
            }
        },
        methods: {
            onMapLoaded(event) {
                let map = event.map; // This gives us access to the map as an object but only after the map has loaded
                console.log(map.getBounds().toString());
                // Get the element that will hold text information about a selected map element, such as a monitoring location.
                // We will use this later for several different map elements.
                let infoForSelectedItem = document.getElementById('infoForSelectedItem');

                // Next section gives us names for the layer toggle buttons
                let styleLayers = Object.values(mapStyles.style.layers); // Pulls the layers out of the styles object as an array

                let toggleableLayerIds = [];
                let layersTurnedOffAtStart = [];
                let toggleableStreamsIds = [];
                let streamsTurnedOffAtStart = [];
                let toggleableProjectSpecificIds = [];
                let ProjectSpecificTurnedOffAtStart = [];

                let assembledIdSets = [];
                let assembledOffAtStartSets = [];

                for (let index = 0; index < styleLayers.length; index++) {
                    if (styleLayers[index].showButtonLayerToggle === true) { // note: to NOT show a button for layer, change the 'showButtonLayerToggle' property in the mapStyles.js to false
                        toggleableLayerIds.push(styleLayers[index].id);

                        // Make a list if ids of any layers that we do not want to show when the page loads (layers that are toggleable but are off by default)
                        // These layers that are off by default have a visibility of 'none' in the style sheet.
                        if (styleLayers[index].layout.visibility === 'none') {
                            layersTurnedOffAtStart.push(styleLayers[index].id);
                        }
                    }
                    if (styleLayers[index].showButtonStreamToggle === true) {
                        toggleableStreamsIds.push(styleLayers[index].id);
                        if (styleLayers[index].layout.visibility === 'none') {
                            streamsTurnedOffAtStart.push(styleLayers[index].id);
                        }
                    }
                    if (styleLayers[index].showButtonProjectSpecific === true) {
                        toggleableProjectSpecificIds.push(styleLayers[index].id);
                        if (styleLayers[index].layout.visibility === 'none') {
                            ProjectSpecificTurnedOffAtStart.push(styleLayers[index].id);
                        }
                    }
                }
                assembledIdSets.push(toggleableLayerIds);
                assembledIdSets.push(toggleableStreamsIds);
                assembledIdSets.push(toggleableProjectSpecificIds);

                assembledOffAtStartSets.push(layersTurnedOffAtStart);
                assembledOffAtStartSets.push(streamsTurnedOffAtStart);
                assembledOffAtStartSets.push(ProjectSpecificTurnedOffAtStart);

                let elementTargets = ['mapLayers', 'streams', 'projects'];
                let countup = 0;
                assembledIdSets.forEach(function(idSet) {
                    // Go through each layer id that is in the array and make a button element for it
                    for (let index = 0; index < idSet.length; index++) {
                        let id = idSet[index];
                        let link = document.createElement('a');
                        link.href = '#';
                        // If the layer is not set to visible when first loaded, then do not mark it as active.
                        // In other words, if the layer is not visible on page load, make the button look like the layer is toggled off
                        if (assembledOffAtStartSets[countup].includes(id)) {
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
                        let layerToggleList = document.getElementById(elementTargets[countup]);
                        layerToggleList.appendChild(link);
                    }
                    countup++;
                });
                
                let layersIcon = document.getElementById("layersIcon");
                let streamsIcon = document.getElementById("streamsIcon");
                let dataProvidersIcon = document.getElementById("dataProvidersIcon");
                let projectsIcon = document.getElementById("projectsIcon");
                //Toggle which options are shown based on what icon is clicked
                let toggle = function(clicked, show){
                  let toggleOptions = document.getElementById("ToggleOptions");
                  let option = document.getElementById(show);
                  let icons = document.getElementById("iconToggleContainer").childNodes;
                  if(toggleOptions.classList.contains("active") && clicked.classList.contains("active")){
                    toggleOptions.classList.remove("active");
                    clicked.classList.remove("active");
                    option.style.display = "none";
                  }else if(toggleOptions.classList.contains("active")){
                    //Check toggle options to see if any options are currently showing
                    for(let i = 0; i < toggleOptions.childNodes.length; i++){
                      if(toggleOptions.childNodes[i].style.display === "flex"){
                        toggleOptions.childNodes[i].style.display = "none";
                      }
                    }
                    //Check to see if any icons are active and deactivate them
                    for(let j = 0; j < icons.length; j++){
                      if(icons[j].classList.contains("active")){
                        icons[j].classList.remove("active");
                      }
                    }
                    clicked.classList.add("active");
                    option.style.display = "flex";
                  }else{
                    toggleOptions.classList.add("active");
                    clicked.classList.add("active");
                    option.style.display = "flex";
                  }
                }

                layersIcon.onclick = function(){
                  toggle(this, "mapLayers");
                }
                streamsIcon.onclick = function(){
                  toggle(this, "streams");
                }
                dataProvidersIcon.onclick = function(){
                  toggle(this, "dataProviders");
                }
                projectsIcon.onclick = function(){
                  toggle(this, "projects");
                }
                // next section controls the HRU hover effect
                let hoveredHRUId = this.hoveredHRUId;
                map.on("mousemove", "hru - highlight", function(e) {
                    if (e.features.length > 0) {
                        if (hoveredHRUId) {
                            infoForSelectedItem.textContent = 'Hydrological Response Unit - ' + e.features[0].id;
                            map.setFeatureState({source: 'HRU', sourceLayer: 'hrus', id: hoveredHRUId}, {hover: false});
                        }
                        hoveredHRUId = e.features[0].id;
console.log('HRU ', e.features[0])
                        map.setFeatureState({source: 'HRU', sourceLayer: 'hrus', id: hoveredHRUId}, {hover: true});
                    }
                });
                map.on("mouseleave", "hru - highlight", function () {
                    if (hoveredHRUId) {
                        infoForSelectedItem.textContent = '';
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
                    infoForSelectedItem.textContent = '';
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
                            infoForSelectedItem.textContent += key + ': ' + value + ' | ';
                        }
                    }
                });

                // Change the cursor to a pointer when the mouse is over the layer containing monitoring locations.
                map.on('mouseenter', 'monitoring-location-unclustered-point', function () {
                    map.getCanvas().style.cursor = 'pointer';
                });

                // Change it back to normal when it leaves the layer containing monitoring locations.
                map.on('mouseleave', 'monitoring-location-unclustered-point', function () {
                    map.getCanvas().style.cursor = '';
                });

                // Next section creates an information banner for stream reaches (nhd flow lines)
                map.on('click', 'NHD flow lines', function (e) {
                    infoForSelectedItem.textContent = 'NHD flow line || ';
                    let properties = e.features[0].properties;
                    for (let [key, value] of Object.entries(properties)) {
                        if (key !== '' && value !== '') {
                            infoForSelectedItem.textContent += key + ': ' + value + ' | ';
                        }
                    }
                });

                // Change the cursor to a pointer when the mouse is over the layer containing flow lines.
                map.on('mouseenter', 'NHD flow lines', function () {
                    map.getCanvas().style.cursor = 'pointer';
                });
                // Change it back to normal when it leaves the layer containing flow lines.
                map.on('mouseleave', 'NHD flow lines', function () {
                    map.getCanvas().style.cursor = '';
                });

                // Next section creates an information banner for PRMS rivers
                map.on('click', 'PRMS rivers', function (e) {
                    infoForSelectedItem.textContent = 'PMS River || ';
                    let properties = e.features[0].properties;
                    for (let [key, value] of Object.entries(properties)) {
                        if (key !== '' && value !== '') {
                            infoForSelectedItem.textContent += key + ': ' + value + ' | ';
                        }
                    }
                });
                // Change the cursor to a pointer when the mouse is over the layer containing PRMS rivers.
                map.on('mouseenter', 'PRMS rivers', function () {
                    map.getCanvas().style.cursor = 'pointer';
                });
                // Change it back to normal when it leaves the layer containing PRMS rivers.
                map.on('mouseleave', 'PRMS rivers', function () {
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
                let providersToggle = document.getElementById('dataProviders');

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

                                    let layerToggleList = document.getElementById('dataProviders');
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
                    document.getElementById("zoomlevel").innerHTML = map.getZoom();;
                }
                map.on("zoomend", onZoomend);
            }
        }
    }
</script>

<style scoped lang="scss">
  @import"~mapbox-gl/dist/mapbox-gl.css";
$color: #fff;
$blue: #4574a3;
$border: 1px solid #fff;
.header-container {
  background-color: #fff;
}
/* Add a background color to the layer toggle bar */
#mapbox_component-toggle {
  background-color: $blue;
  display: flex;
}
#topNavText {
  border-right: $border;
  width: 100px;
  a {
    width: 100%;
    font-size: 0.9em;
    color: $color;
    background: #00264c;
    vertical-align: center;
  }
}

#mapLayers,
#streams,
#dataProviders,
#projects{
  display: none;
}
#iconToggleContainer {
  width: 170px;
  display: flex;
  a {
    flex: 1;
    background: #00264c;
    margin: 0;
    color: $color;
    border-left: $border;
    cursor: pointer;
  }
  a.active{
      background: #00bf26
    }
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
      min-height: 70vh;
    }
  }

</style>
<style lang="scss">
$color: #fff;
$blue: #4574a3;
$border: 1px solid #fff;
#mapbox_component-toggle a {
  text-decoration: none;
  padding: 5px 10px;
  display: block;
  background: #00264c;
  outline: none;
  text-align: center;
}
#ToggleOptions {
  display: flex;
  flex: 8;
  flex-wrap: wrap;
  height: 30px;
  div {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    position: relative;
    z-index: 90000;
      a{
        width: 100%;
        font-size: 0.8em;
        color: $color;
        text-decoration: line-through;
        &:hover {
          text-decoration: none;
          background: $blue;
        }
      }
  }
  .active {
    text-decoration: none;
    background: $blue;
  }
}

@media screen and (min-width:960px) {
  #ToggleOptions {
    div{
      a{
        flex-grow: 1;
        width: auto;
      }
    }
  }
}
</style>
