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
            let legendColors = [];
            let layers = [];

            // look through the styles layers grab all that are marked as 'inLegend': 'true'
            for (let index = 0; index < styleLayers.length; index++) {
                if (styleLayers[index].inLegend === true) {
                    if (styleLayers[index].paint['line-color']) {
                        legendColors.push(styleLayers[index].paint['line-color']);
                        layers.push(styleLayers[index].id);
                    }
                    if (styleLayers[index].paint['fill-color']) {
                        legendColors.push(styleLayers[index].paint['fill-color']);
                        layers.push(styleLayers[index].id);
                    }
                }
            }

            let legend = this.legend;
            legend = document.getElementById('map_legend_container');

            for (let index = 0; index < layers.length; index++) {
                let layer = layers[index];
                let color = legendColors[index];
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
