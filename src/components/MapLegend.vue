<template>
  <div
    id="map_legend_container"
    class="map-overlay"
  >
    <p>{{ legendTitle }}</p>
  </div>
</template>

<script>
  import mapStyles from '../assets/mapStyles/mapStyles';

  export default {
      name: 'MapLegend',
      props: {
          legendTitle: {
              type: String,
              default: 'Add your title for the legend in MapBox.vue or make this blank'
          }
      },
      data() {
          return {
            legend: null
          }
      },
      mounted() {
          this.createLegend()
      },
      methods: {
        createLegend() {
            // get the style layers from the map styles object
            let styleLayers = mapStyles.style.layers;
            let colors = [];
            let layers = [];
            // look through the styles layers to find the one with the Hydrological Response Unit fill colors
            for (let index = 0; index < styleLayers.length; index++) {
                if (styleLayers[index].id === 'HRUS Fill Colors') {
                    // Get the fill color values and names then put them in separate lists
                    let hruColors = styleLayers[index].paint['fill-color'].stops;
                    let hruColorLabel = null;
                    for (let index = 0; index < hruColors.length; index ++) {
                        // Make a label for the blank and missing data
                        if (hruColors[index][0] === '') {
                            hruColorLabel = 'no data';
                        } else {
                            hruColorLabel = hruColors[index][0];
                        }
                        colors.push(hruColors[index][1]);
                        layers.push(hruColorLabel);
                    }
                }
            }

            let legend = this.legend;
            legend = document.getElementById('map_legend_container');

            for (let index = 0; index < layers.length; index++) {
                let layer = layers[index];
                let color = colors[index];
                let item = document.createElement('div');
                let key = document.createElement('span');

                key.style.backgroundColor = color;
                key.style.marginRight = '5px';
                key.style.display = 'inline-block';
                key.style.height = '10px';
                key.style.width = '10px';
                let value = document.createElement('span');

                value.innerHTML = layer;
                item.appendChild(key);
                item.appendChild(value);
                legend.appendChild(item);
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .map-overlay {
    font-family: 'merriweather',serif;
    border-style: groove;
    position: absolute;
    z-index:1000;
    bottom: 190px;
    left: 10px;
    background: rgba(255, 255, 255, 0.8);
    margin-right: 120px;
    overflow: auto;
    border-radius: 3px;
    padding: 5px;
  }

</style>
