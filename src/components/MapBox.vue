<template>
  <div id="viz_container">
    <div class="header-container">
      <div class="usa-prose">
        <h2 class="title-text">
          {{ title }}
        </h2>
      </div>
      <div
        id="mapbox_component-layer-toggle"
        class="mapbox_component-topnav"
      >
        <a
          id="map-layers-label"
          href="#"
          class="active"
        >Map Layers</a>
        <a
          href="javascript:void(0);"
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
          href="#"
          class="active"
        >Stream Orders</a>
        <a
          href="javascript:void(0);"
          class="icon"
          @click="changeToResponsiveElement('mapbox_component-streams-toggle')"
        ><font-awesome-icon icon="water" />
        </a>
      </div>
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

      <!--    next section is for the monitoring location provider filters -->
      <nav
        id="filter-group"
        class="filter-group"
      >
      </nav>
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
                legendTitle: 'Legend'
            }
        },
        methods: {
            // Switch to a mobile menu (add the 'responsive' class name) when user clicks the 'layer-group' icon.
            // Note: this method is bound to the anchor ('a') element that contains the 'layer-group' icon.
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


                // For now, I am going to duplicate this code section for each set of toggles (currently layers and streams), ideally this would be
                // in separate components, but for prototyping purposes this is fine for now.

                // Next section gives us names for the layer toggle buttons
                let styleLayers = Object.values(mapStyles.style.layers); // Pulls the layers out of the styles object as an array
                let toggleableLayerIds = [];
                let layersTurnedOffAtStart = [];

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

                    let layerToggleList = document.getElementById('mapbox_component-layer-toggle');
                    layerToggleList.appendChild(link);
                }

                // Next section gives us names for the streams toggle buttons
                let toggleableStreamsIds = [];
                let streamsTurnedOffAtStart = [];

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


                // next section controls the HRU hover effect
                let hoveredHRUId = this.hoveredHRUId;
                map.on("mousemove", "hydrological unit - highlight", function(e) {
                    if (e.features.length > 0) {
                        if (hoveredHRUId) {
                            map.setFeatureState({source: 'HRU', sourceLayer: 'hrus', id: hoveredHRUId}, {hover: false});
                        }
                        hoveredHRUId = e.features[0].id;
                        map.setFeatureState({source: 'HRU', sourceLayer: 'hrus', id: hoveredHRUId}, {hover: true});
                    }
                });
                map.on("mouseleave", "HRUS Fill Colors", function () {
                    if (hoveredHRUId) {
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


// section starts provider filtering
                let url = 'https://delaware-basin-test-website.s3-us-west-2.amazonaws.com/geojson/delaware_site_summary.geojson';
                // set up a element to contain the filter selections for monitoring locations
                let filterGroup = document.getElementById('filter-group');
                function status(response) {
                    if (response.status >= 200 && response.status < 300) {
                        return Promise.resolve(response)
                    } else {
                        return Promise.reject(new Error(response.statusText))
                    }
                }

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
                            monitoringLocationList.features.forEach(function(feature) {
                                // Check the value of the 'source' property of the current GeoJSON 'feature' and create
                                // a new map layer for it--provided that a map layer for that type does not already exist.
                                let providerName = feature.properties['source'];
                                let layerID = 'provider-' + providerName;

                                if (!map.getLayer(layerID)) {
                                    map.addLayer({
                                        'id': layerID,
                                        'type': 'circle',
                                        'source': 'monitoringLocationList',
                                        'layout': {
                                            'visibility': 'none'
                                        },
                                        'filter': ['==', 'source', providerName],
                                        'paint': {
                                            'circle-color':  {
                                                'property': 'nobsBin',
                                                'type': 'categorical',
                                                'stops': [
                                                    ['1-10', '#A1F7FA'],
                                                    ['10-100','#6A6EE7'],
                                                    ['100-1000','#C239D4'],
                                                    ['1000+','#C10F32']
                                                ]
                                            },
                                            'circle-opacity': 0.5,
                                            'circle-radius': 10,
                                            'circle-stroke-width': 1,
                                            'circle-stroke-color': '#11b4da'
                                        },
                                        'minzoom': 3,
                                        'maxzoom': 23,

                                    });

                                    // let popup = MglMap.Popup({closeOnClick: true})
                                    //         .setLngLat([-74.6228, 39.795])
                                    //         .setHTML('<h1>Hello World!</h1>')
                                    //         .addTo(map);

                                    // Add checkbox and label elements for the layer.
                                    let input = document.createElement('input');
                                    input.type = 'checkbox';
                                    input.id = layerID;
                                    input.checked = true;
                                    filterGroup.appendChild(input);

                                    let label = document.createElement('label');
                                    label.setAttribute('for', layerID);
                                    label.textContent = providerName;
                                    filterGroup.appendChild(label);

                                    // When the checkbox changes, update the visibility of the layer.
                                    input.addEventListener('change', function(e) {
                                        map.setLayoutProperty(layerID, 'visibility',
                                                e.target.checked ? 'visible' : 'none');
                                    });
                                }
                            });







                        }).catch(function(error) {
                    console.log('Request to gather the monitoring location data failed', error);
                });






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

  .usa-prose{
    border-bottom: 1px solid rgb(100,100,100);
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

  @media screen and (min-width:600px){
    #viz_container{
      flex:1;
      display: flex;
      flex-direction:column;
    }

    #mapContainer{
      flex: 1;
      display: flex;
      flex-direction: column;
      height: auto;
    }
    #map{
      flex: 1;
    }

    .font-awesome-close {
      float: right;
      background-color: red;
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
    .mapbox_component-topnav a:not(:first-child) {display: none;}
    .mapbox_component-topnav a.icon {
      float: right;
      display: block;
    }
    /* The "responsive" class is added to the topnav with JavaScript when the user clicks on the layer group icon.
    This class makes the to layer toggle menu look good on small screens (display the links vertically instead of horizontally) */

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



/*  next section of styles are for the providers toggles */
  .filter-group {
    font: 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
    font-weight: 600;
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1;
    border-radius: 3px;
    width: 120px;
    color: #fff;
  }

  .filter-group input[type=checkbox]:first-child + label {
    border-radius: 3px 3px 0 0;
  }

  .filter-group label:last-child {
    border-radius: 0 0 3px 3px;
    border: none;
  }

  .filter-group input[type=checkbox] {
    display: none;
  }

  .filter-group input[type=checkbox] + label {
    background-color: #3386c0;
    display: block;
    cursor: pointer;
    padding: 10px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.25);
  }

  .filter-group input[type=checkbox] + label {
    background-color: #3386c0;
    text-transform: capitalize;
  }

  .filter-group input[type=checkbox] + label:hover,
  .filter-group input[type=checkbox]:checked + label {
    background-color: #4ea0da;
  }

  .filter-group input[type=checkbox]:checked + label:before {
    content: '✔';
    margin-right: 5px;
  }



</style>
