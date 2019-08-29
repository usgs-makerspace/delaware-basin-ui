<template>
  <div id="viz_container">
    <div class="header-container">
      <div class="usa-prose">
        <h2 class="title-text">
          {{ title }}
        </h2>
      </div>
      <hr>
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
          @click="changeToResponsiveElement"
        ><font-awesome-icon icon="layer-group" />
        </a>
      </div>
    </div>
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
      @load="onMapLoaded"
    >
      <MglScaleControl
        position="bottom-right"
        unit="imperial"
      />
      <MglNavigationControl
        position="bottom-right"
        :show-compass="false"
      />
      <MglGeolocateControl
        position="bottom-right"
      />
      <MglFullscreenControl
        position="bottom-right"
      />
    </MglMap>
  </div>
</template>

<script>
    import MapLegend from './MapLegend'
    import {
        MglMap,
        MglNavigationControl,
        MglGeolocateControl,
        MglFullscreenControl,
        MglScaleControl
    } from "vue-mapbox";
    import mapStyles from '../assets/mapStyles/mapStyles';

    export default {
        name: 'MapBox',
        components: {
            MglMap,
            MglNavigationControl,
            MglGeolocateControl,
            MglFullscreenControl,
            MglScaleControl,
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
                zoom: 3,
                minZoom: 3,
                maxZoom: 9,
                center: [-95.7129, 37.0902],
                pitch: 0, // tips the map from 0 to 60 degrees
                bearing: 0, // starting rotation of the map from 0 to 360
                hoveredHRUId: null,
                legendTitle: 'Calculated Availability'
            }
        },
        methods: {
            changeToResponsiveElement: function() {
                console.log('click worked');
                let mapboxComponentLayerToggle = document.getElementById("mapbox_component-layer-toggle");
                if (mapboxComponentLayerToggle.className === "mapbox_component-topnav") {
                    mapboxComponentLayerToggle.className += " responsive";
                } else {
                    mapboxComponentLayerToggle.className = "mapbox_component-topnav";
                }
            },
            onMapLoaded(event) {
                let map = event.map; // This gives us access to the map as an object but only after the map has loaded



                // Next section gives us names for the layer toggle buttons
                let styleLayers = Object.values(mapStyles.style.layers); // Pulls the layers out of the styles object as an array
                let toggleableLayerIds = [];

                for (let index = 0; index < styleLayers.length; index++) {
                    if (styleLayers[index].showButton === true) { // note: to NOT show a layer, change the 'showButton' property in the mapStyles.js to false
                        toggleableLayerIds.push(styleLayers[index].id)
                    }
                }

                // Go through each layer id that is in the array and make a button element for it
                for (let i = 0; i < toggleableLayerIds.length; i++) {
                    let id = toggleableLayerIds[i];

                    let link = document.createElement('a');
                    link.href = '#';
                    link.className = 'active';
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

                // next section controls the HRU hover effect
                let hoveredHRUId = this.hoveredHRUId;
                map.on("mousemove", "HRUS Fill Colors", function(e) {
                    if (e.features.length > 0) {
                        if (hoveredHRUId) {
                            map.setFeatureState({source: 'HRU', sourceLayer: 'hrus', id: hoveredHRUId}, { hover: false});
                        }
                        hoveredHRUId = e.features[0].id;
                        map.setFeatureState({source: 'HRU', sourceLayer: 'hrus', id: hoveredHRUId}, { hover: true});
                    }
                });
                map.on("mouseleave", "HRUS Fill Colors", function() {
                    if (hoveredHRUId) {
                        map.setFeatureState({source: 'HRU', sourceLayer: 'hrus', id: hoveredHRUId}, { hover: false});
                    }
                    hoveredHRUId =  null;
                });
            }
        }
    }
</script>

<style scoped lang="scss">
  @import"~mapbox-gl/dist/mapbox-gl.css";

  .header-container {
    background-color: white;
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

  #map {
    position: absolute;
    z-index: -1;
    top: 100px;
    bottom: 0;
    width: 100%;
  }

  /* override USWDS style to prevent title from wrapping too soon */
  .title-text {
    margin-left: 1.5rem;
    padding-top: 0.5rem;
  }

  /* make the line below the title stay off the title but snug up to the map */
  hr {
    margin: 2px 0 0 0;
    padding-bottom: 0;
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

  /* Override the hover effect for so the 'Map Layer' label does not appear click-able. */
  #map-layers-label:hover {
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

  /* When the screen is less than 600 pixels wide, hide all links, except for the title ("map layers"). Show the layer-group that should open and close the layer toggle bar */
  @media screen and (max-width: 600px) {
    .mapbox_component-topnav a:not(:first-child) {display: none;}
    .mapbox_component-topnav a.icon {
      float: right;
      display: block;
    }
  }

  /* The "responsive" class is added to the topnav with JavaScript when the user clicks on the layer group icon. This class makes the to layer toggle menu look good on small screens (display the links vertically instead of horizontally) */
  @media screen and (max-width: 600px) {
    .mapbox_component-topnav.responsive {position: relative;}
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
