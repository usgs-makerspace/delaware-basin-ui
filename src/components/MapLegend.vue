<template>
  <div
    id="map_legend_container"
    class="map-overlay"
  >
  <div id="legendHeader">
    <div id="legendTitle">
        <p>{{ legendTitle }}</p>
    </div>
    <div id="legendToggle">
        <a id="minus" class="legendIcon">
            <font-awesome-icon icon="minus" />
        </a>
        <a id="plus" class="legendIcon">
            <font-awesome-icon icon="plus" />
        </a>
    </div>
  </div>
    <div id="legendContent"></div>
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
            let mainLegendColors = [];
            let layers = [];
            let monitoringLocationLegendColors = [];
            let monitoringLocationLegendScales = [];

            // look through the styles layers grab all that are marked as 'inLegend': 'true'
            for (let index = 0; index < styleLayers.length; index++) {
                if (styleLayers[index].inLegend === true) {
                    if (styleLayers[index].paint['line-color']) {
                        mainLegendColors.push(styleLayers[index].paint['line-color']);
                        layers.push(styleLayers[index].id);
                    }
                    if (styleLayers[index].paint['fill-color']) {
                        mainLegendColors.push(styleLayers[index].paint['fill-color']);
                        layers.push(styleLayers[index].id);
                    }
                    // If we have monitoring locations we need to get the paint colors and associated scales
                    if (styleLayers[index].id === 'monitoring-location-unclustered-point') {
                        // Get color and scales and put them in an object as key value pairs
                        for (let subIndex = 0; subIndex < styleLayers[index].paint['circle-color'].stops.length; subIndex++) {
                            // Check to see if one of the scales is blank ''. If so, replace it with text such as 'no data'
                            if (styleLayers[index].paint['circle-color'].stops[subIndex][0] === '') {
                                monitoringLocationLegendScales.push('no data');
                            } else {
                                monitoringLocationLegendScales.push(styleLayers[index].paint['circle-color'].stops[subIndex][0]);
                            }
                            monitoringLocationLegendColors.push(styleLayers[index].paint['circle-color'].stops[subIndex][1]);
                        }
                    }
                }
            }

            let legend = this.legend;
            legend = document.getElementById('legendContent');
            // Loop through the layers to get the layer names and the colors associated with them.
            for (let index = 0; index < layers.length; index++) {
                let layer = layers[index];
                let color = mainLegendColors[index];
                let item = document.createElement('div');
                let key = document.createElement('span');

                item.style.margin = "0 10px 0 0";
                key.style.backgroundColor = color;
                key.style.margin = '0 5px 0 0';
                key.style.display = 'inline-block';
                key.style.height = '10px';
                key.style.width = '10px';
                let value = document.createElement('span');

                value.innerHTML = layer;
                item.appendChild(key);
                item.appendChild(value);
                legend.appendChild(item);
            }

            // If we have monitoring locations colors and scales add them to the legend
            if (monitoringLocationLegendColors && monitoringLocationLegendScales) {
                let dynamicText = document.createElement('p');
                dynamicText.setAttribute('id', 'dynamicP');
                dynamicText.appendChild(document.createTextNode('Observations at location'));
                legend.appendChild(document.createElement('hr'));
                legend.appendChild(dynamicText);
                for (let index = 0; index < monitoringLocationLegendColors.length; index++) {
                    let layer = monitoringLocationLegendScales[index];
                    let color = monitoringLocationLegendColors[index];
                    let item = document.createElement('div');
                    let key = document.createElement('span');
                    
                    item.style.margin = "0 10px 0 0";
                    key.style.backgroundColor = color;
                    key.style.margin = '0 5px 0 0';
                    key.style.display = 'inline-block';
                    key.style.height = '10px';
                    key.style.width = '10px';
                    key.style.borderRadius = '50%';
                    let value = document.createElement('span');

                    value.innerHTML = layer;
                    item.appendChild(key);
                    item.appendChild(value);
                    legend.appendChild(item);
                }
            }

            let legendMinus = document.getElementById("minus");
            let legendPlus = document.getElementById("plus");
            let legendContent = document.getElementById("legendContent");
            let legendHeader = document.getElementById("legendHeader");

            let toggle = function(clicked, switchOut){
                if(clicked.id === "minus"){
                    legendContent.style.display = "none";
                }else{
                    legendContent.style.display = "block";
                }
                clicked.style.display = "none";
                switchOut.style.display = "block";
            }

            legendMinus.onclick = function(){
                toggle(legendMinus, legendPlus);
            }
            legendPlus.onclick = function(){
                toggle(legendPlus, legendMinus);
            }
        },
    }
  }
</script>

<style scoped lang="scss">
$border: 1px solid rgb(200, 200, 200);
  .map-overlay {
    font-family: 'merriweather',serif;
    position: absolute;
    z-index:1000;
    bottom: 15px;
    left: 10px;
    background: rgba(255, 255, 255, 0.8);
    margin-right: 120px;
    border: $border;
    border-radius: 3px;
  }

  #legendHeader{
      display: flex;
      border-bottom: $border;
  }

  #legendTitle{
      flex: 1;

    p{
        line-height: 25px;
        padding: 0 0 0 10px;
        margin-right: 10px;
    }      
  }

  #legendToggle{
      width:25px;
      height: 25px;
      border-left: $border;
  }

  .legendIcon{
      display: block;
      width: 100%;
      height: 100%;
      text-align: center;
      outline: none;
      cursor: pointer;
        svg {
            margin: 4px 0 0 0;
            width: 16px;
            height: 16px;
        }
  }

  #minus,
  #legendContent{
      display: none;
  }

  #legendContent{
      padding: 0 10px 10px 10px;
      margin-top: 10px;
  }

  @media screen and (min-width: 600px){
    #minus,
    #legendContent{
        display: block;
    }
    #plus{
        display: none;
    }
  }

</style>
<style lang="scss">
    .map-overlay{
        p{
            margin:0;
        }

        hr{
            margin: 10px 0 10px 0;
        }
    }
    #dynamicP{
        margin-bottom: 10px;
    }

    .collapsed{
        background: red;
    }
</style>
