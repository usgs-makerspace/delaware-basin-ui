export default {
    style: {
        version: 8,
        sources: {
            delaware_basin_tiles: {
                type: 'vector',
                // The following line is used as a reference point for automated builds
                // to insert the correct HRU tile location - do not modify:
                // DELAWARE BASIN SOURCE INSERT

                // If you are setting up a local build, you can uncomment the following
                // URL assignment to pull the HRU tiles from S3 so that no local tile
                // server is required:
                // 'tiles': ['https://delaware-basin-test-website.s3-us-west-2.amazonaws.com/tiles/{z}/{x}/{y}.pbf'],
                "minzoom": 3,
                "maxzoom": 14
            },
            monitoring_location_summary: {
                type: 'geojson',
                data: 'http://maptiles-prod-website.s3-us-west-2.amazonaws.com/geojson/delaware_site_summary.geojson',
                cluster: true,
                clusterMaxZoom: 8,
                clusterRadius: 50
            },
            states: {
                type: 'geojson',
                data: 'http://maptiles-prod-website.s3-us-west-2.amazonaws.com/geojson/states_500k.geojson'
            },
            nhd_streams: {
                type: 'vector',
                'tiles':['http://maptiles-prod-website.s3-us-west-2.amazonaws.com/nhdstreams/{z}/{x}/{y}.pbf'],
                "minzoom": 3, // setting this to equal the minzoom of main map, real tile extent is 0
                "maxzoom": 10  // setting this to equal real tile extent of 10 so that we can use Mapbox gl to over zoom
            },
            HRU: {
                type: 'vector',
                'tiles': ['https://maptiles-prod-website.s3-us-west-2.amazonaws.com/hru/{z}/{x}/{y}.pbf'],
                "minzoom": 3,
                "maxzoom": 14
            },
            openmaptiles: {
                type: 'vector',
                'tiles': ['https://maptiles-prod-website.s3-us-west-2.amazonaws.com/openmaptiles/baselayers/{z}/{x}/{y}.pbf'],
                "minzoom": 3,
                "maxzoom": 14
            },
            hillshade: {
                type: 'raster',
                'tiles': ['https://maptiles-prod-website.s3-us-west-2.amazonaws.com/openmaptiles/omthillshade/{z}/{x}/{y}.png'],
                "minzoom": 2,
                "maxzoom": 12,
                "tileSize": 256
            }
        },
        'sprite': '',
        'glyphs': 'https://orangemug.github.io/font-glyphs/glyphs/{fontstack}/{range}.pbf',
        'layers': [
            {
                "id": "background",
                "paint": {
                    "background-color": "hsl(47, 26%, 93%)"
                },
                "type": "background",
                'showButtonLayerToggle': false,
                'showButtonLayerToggleStreamToggle': false,
                'showButtonProjectSpecific': false,
                'inLegend': false                
            },
            {
                'filter': ['all', ['==', '$type', 'Polygon'],
                    ['in', 'class', 'residential', 'suburb', 'neighbourhood']
                ],
                'id': 'landuse-residential',
                'layout': {
                    'visibility': 'visible'
                },
                'paint': {
                    'fill-color': 'hsl(47, 13%, 86%)',
                    'fill-opacity': 0.7
                },
                'minzoom': 3,
                'maxzoom': 23,
                'source': 'openmaptiles',
                'source-layer': 'landuse',
                'type': 'fill',
                'showButtonLayerToggle': false,
                'showButtonLayerToggleStreamToggle': false,
                'showButtonProjectSpecific': false,
                'inLegend': true
            },
            {
                'filter': ['==', 'class', 'grass'],
                'id': 'landcover_grass',
                'paint': {
                    'fill-color': 'hsl(82, 46%, 72%)',
                    'fill-opacity': 0.45
                },
                'minzoom': 3,
                'maxzoom': 23,
                'source': 'openmaptiles',
                'source-layer': 'landcover',
                'type': 'fill',
                'showButtonLayerToggle': false,
                'showButtonLayerToggleStreamToggle': false,
                'showButtonProjectSpecific': false,
                'inLegend': true
            },
            {
                'filter': ['==', 'class', 'wood'],
                'id': 'landcover_wood',
                'paint': {
                    'fill-color': 'hsl(82, 46%, 72%)',
                    'fill-opacity': {
                        'base': 1,
                        'stops': [
                            [8, 0.6],
                            [23, 1]
                        ]
                    }
                },
                'minzoom': 3,
                'maxzoom': 23,
                'source': 'openmaptiles',
                'source-layer': 'landcover',
                'type': 'fill',
                'showButtonLayerToggle': false,
                'showButtonLayerToggleStreamToggle': false,
                'showButtonProjectSpecific': false,
                'inLegend': true
            },
            {
                'filter': ['all', ['in', 'class', 'sand']],
                'id': 'landcover_sand',
                'metadata': {},
                'paint': {
                    'fill-antialias': false,
                    'fill-color': 'rgba(232, 214, 38, 1)',
                    'fill-opacity': 0.3
                },
                'minzoom': 3,
                'maxzoom': 23,
                'source': 'openmaptiles',
                'source-layer': 'landcover',
                'type': 'fill',
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': false,
                'inLegend': true
            },
            {
                'filter': ['==', 'class', 'agriculture'],
                'id': 'landuse',
                'layout': {
                    'visibility': 'visible'
                },
                'paint': {
                    'fill-color': '#eae0d0'
                },
                'minzoom': 3,
                'maxzoom': 23,
                'source': 'openmaptiles',
                'source-layer': 'landuse',
                'type': 'fill',
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': false,
                'inLegend': false
            },
            {
                'filter': ['==', 'class', 'national_park'],
                'id': 'landuse_national_park',
                'paint': {
                    'fill-color': '#E1EBB0',
                    'fill-opacity': {
                        'base': 1,
                        'stops': [
                            [5, 0],
                            [9, 0.75]
                        ]
                    }
                },
                'minzoom': 3,
                'maxzoom': 23,
                'source': 'openmaptiles',
                'source-layer': 'landcover',
                'type': 'fill',
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': false,
                'inLegend': true
            },
            {
                'id': 'hill shade',
                'type': 'raster',
                'minzoom': 3,
                'maxzoom': 23,
                'source': 'hillshade',
                'layout': {
                    'visibility': 'visible'
                },
                'showButtonLayerToggle': true,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': false,
                'inLegend': false
            },
            {
                'filter': ['all', ['==', '$type', 'LineString'],
                    ['==', 'brunnel', 'tunnel']
                ],
                'id': 'waterway-tunnel',
                'paint': {
                    'line-color': 'hsl(205, 56%, 73%)',
                    'line-dasharray': [3, 3],
                    'line-gap-width': {
                        'stops': [
                            [12, 0],
                            [20, 6]
                        ]
                    },
                    'line-opacity': 1,
                    'line-width': {
                        'base': 1.4,
                        'stops': [
                            [8, 1],
                            [20, 2]
                        ]
                    }
                },
                'minzoom': 3,
                'maxzoom': 23,
                'source': 'openmaptiles',
                'source-layer': 'waterway',
                'type': 'line',
                'layout': {
                    'visibility': 'visible'
                },
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': false,
                'inLegend': false
            },
            {
                'filter': ['all', ['==', '$type', 'LineString'],
                    ['!in', 'brunnel', 'tunnel', 'bridge'],
                    ['!=', 'intermittent', 1]
                ],
                'id': 'waterway',
                'paint': {
                    'line-color': 'hsl(205, 56%, 73%)',
                    'line-opacity': 1,
                    'line-width': {
                        'base': 1.4,
                        'stops': [
                            [8, 1],
                            [20, 8]
                        ]
                    }
                },
                'minzoom': 3,
                'maxzoom': 23,
                'source': 'openmaptiles',
                'source-layer': 'waterway',
                'type': 'line',
                'layout': {
                    'visibility': 'visible'
                },
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': false,
                'inLegend': false
            },
            {
                'filter': ['all', ['==', '$type', 'LineString'],
                    ['!in', 'brunnel', 'tunnel', 'bridge'],
                    ['==', 'intermittent', 1]
                ],
                'id': 'waterway_intermittent',
                'paint': {
                    'line-color': 'hsl(205, 56%, 73%)',
                    'line-opacity': 1,
                    'line-width': {
                        'base': 1.4,
                        'stops': [
                            [8, 1],
                            [20, 8]
                        ]
                    },
                    'line-dasharray': [2, 1]
                },
                'minzoom': 3,
                'maxzoom': 23,
                'source': 'openmaptiles',
                'source-layer': 'waterway',
                'type': 'line',
                'layout': {
                    'visibility': 'visible'
                },
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': false,
                'inLegend': false
            },
            {
                'filter': ['all', ['==', '$type', 'LineString'],
                    ['==', 'brunnel', 'tunnel'],
                    ['==', 'class', 'transit']
                ],
                'id': 'tunnel_railway_transit',
                'layout': {
                    'line-cap': 'butt',
                    'line-join': 'miter'
                },
                'paint': {
                    'line-color': 'hsl(34, 12%, 66%)',
                    'line-dasharray': [3, 3],
                    'line-opacity': {
                        'base': 1,
                        'stops': [
                            [11, 0],
                            [16, 1]
                        ]
                    }
                },
                'minzoom': 3,
                'maxzoom': 23,
                'source': 'openmaptiles',
                'source-layer': 'transportation',
                'type': 'line',
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': false,
                'inLegend': false
            },
            {
                'id': 'building',
                'paint': {
                    'fill-antialias': true,
                    'fill-color': 'rgba(232, 211, 190, 1)',
                    'fill-opacity': {
                        'base': 1,
                        'stops': [
                            [13, 0],
                            [15, 1]
                        ]
                    },
                    'fill-outline-color': {
                        'stops': [
                            [15, 'rgba(212, 177, 146, 0)'],
                            [16, 'rgba(212, 177, 146, 0.5)']
                        ]
                    }
                },
                'minzoom': 3,
                'maxzoom': 23,
                'source': 'openmaptiles',
                'source-layer': 'building',
                'type': 'fill',
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': false,
                'inLegend': false
            },
            {
                'filter': ['==', '$type', 'Point'],
                'id': 'housenumber',
                'layout': {
                    'text-field': '{housenumber}',
                    'text-font': ['Noto Sans Regular'],
                    'text-size': 10
                },
                'minzoom': 17,
                'maxzoom': 23,
                'paint': {
                    'text-color': 'rgba(212, 177, 146, 1)'
                },
                'source': 'openmaptiles',
                'source-layer': 'housenumber',
                'type': 'symbol',
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': false,
                'inLegend': false
            },
            {
                'id': 'road_area_pier',
                'type': 'fill',
                'metadata': {},
                'source': 'openmaptiles',
                'source-layer': 'transportation',
                'filter': ['all', ['==', '$type', 'Polygon'],
                    ['==', 'class', 'pier']
                ],
                'layout': {
                    'visibility': 'visible'
                },
                'paint': {
                    'fill-color': 'hsl(47, 26%, 88%)',
                    'fill-antialias': true
                },
                'minzoom': 3,
                'maxzoom': 23,
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': false,
                'inLegend': false
            },
            {
                'id': 'road_pier',
                'type': 'line',
                'metadata': {},
                'source': 'openmaptiles',
                'source-layer': 'transportation',
                'filter': ['all', ['==', '$type', 'LineString'],
                    ['in', 'class', 'pier']
                ],
                'layout': {
                    'line-cap': 'round',
                    'line-join': 'round'
                },
                'paint': {
                    'line-color': 'hsl(47, 26%, 88%)',
                    'line-width': {
                        'base': 1.2,
                        'stops': [
                            [15, 1],
                            [17, 4]
                        ]
                    }
                },
                'minzoom': 3,
                'maxzoom': 23,
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': false,
                'inLegend': false
            },
            {
                'filter': ['all', ['==', '$type', 'Polygon'],
                    ['in', 'brunnel', 'bridge']
                ],
                'id': 'road_bridge_area',
                'layout': {},
                'paint': {
                    'fill-color': 'hsl(47, 26%, 88%)',
                    'fill-opacity': 0.5
                },
                'minzoom': 3,
                'maxzoom': 23,
                'source': 'openmaptiles',
                'source-layer': 'transportation',
                'type': 'fill',
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': false,
                'inLegend': false
            },
            {
                'filter': ['all', ['==', '$type', 'LineString'],
                    ['in', 'class', 'path', 'track']
                ],
                'id': 'road_path',
                'layout': {
                    'line-cap': 'square',
                    'line-join': 'bevel'
                },
                'paint': {
                    'line-color': 'hsl(0, 0%, 97%)',
                    'line-dasharray': [1, 1],
                    'line-width': {
                        'base': 1.55,
                        'stops': [
                            [4, 0.25],
                            [20, 10]
                        ]
                    }
                },
                'minzoom': 3,
                'maxzoom': 23,
                'source': 'openmaptiles',
                'source-layer': 'transportation',
                'type': 'line',
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': false,
                'inLegend': false
            },
            {
                'filter': ['all', ['==', '$type', 'LineString'],
                    ['in', 'class', 'minor', 'service']
                ],
                'id': 'road_minor',
                'layout': {
                    'line-cap': 'round',
                    'line-join': 'round'
                },
                'paint': {
                    'line-color': 'hsl(0, 0%, 97%)',
                    'line-width': {
                        'base': 1.55,
                        'stops': [
                            [4, 0.25],
                            [20, 30]
                        ]
                    }
                },
                'minzoom': 13,
                'maxzoom': 23,
                'source': 'openmaptiles',
                'source-layer': 'transportation',
                'type': 'line',
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': false,
                'inLegend': false
            },
            {
                'filter': ['all', ['==', '$type', 'LineString'],
                    ['==', 'brunnel', 'tunnel'],
                    ['==', 'class', 'minor_road']
                ],
                'id': 'tunnel_minor',
                'layout': {
                    'line-cap': 'butt',
                    'line-join': 'miter'
                },
                'paint': {
                    'line-color': '#efefef',
                    'line-dasharray': [0.36, 0.18],
                    'line-width': {
                        'base': 1.55,
                        'stops': [
                            [4, 0.25],
                            [20, 30]
                        ]
                    }
                },
                'minzoom': 3,
                'maxzoom': 23,
                'source': 'openmaptiles',
                'source-layer': 'transportation',
                'type': 'line',
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': false,
                'inLegend': false
            },
            {
                'filter': ['all', ['==', '$type', 'LineString'],
                    ['==', 'brunnel', 'tunnel'],
                    ['in', 'class', 'primary', 'secondary', 'tertiary', 'trunk']
                ],
                'id': 'tunnel_major',
                'layout': {
                    'line-cap': 'butt',
                    'line-join': 'miter'
                },
                'paint': {
                    'line-color': '#fff',
                    'line-dasharray': [0.28, 0.14],
                    'line-width': {
                        'base': 1.4,
                        'stops': [
                            [6, 0.5],
                            [20, 30]
                        ]
                    }
                },
                'minzoom': 3,
                'maxzoom': 23,
                'source': 'openmaptiles',
                'source-layer': 'transportation',
                'type': 'line',
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': false,
                'inLegend': false
            },
            {
                'filter': ['all', ['==', '$type', 'Polygon'],
                    ['in', 'class', 'runway', 'taxiway']
                ],
                'id': 'aeroway-area',
                'layout': {
                    'visibility': 'visible'
                },
                'metadata': {
                    'mapbox:group': '1444849345966.4436'
                },
                'paint': {
                    'fill-color': 'rgba(255, 255, 255, 1)',
                    'fill-opacity': {
                        'base': 1,
                        'stops': [
                            [13, 0],
                            [14, 1]
                        ]
                    }
                },
                'minzoom': 4,
                'maxzoom': 23,
                'source': 'openmaptiles',
                'source-layer': 'aeroway',
                'type': 'fill',
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': false,
                'inLegend': false
            },
            {
                'filter': ['all', ['in', 'class', 'taxiway'],
                    ['==', '$type', 'LineString']
                ],
                'id': 'aeroway-taxiway',
                'layout': {
                    'line-cap': 'round',
                    'line-join': 'round',
                    'visibility': 'visible'
                },
                'metadata': {
                    'mapbox:group': '1444849345966.4436'
                },
                'minzoom': 12,
                'maxzoom': 23,
                'paint': {
                    'line-color': 'rgba(255, 255, 255, 1)',
                    'line-opacity': 1,
                    'line-width': {
                        'base': 1.5,
                        'stops': [
                            [12, 1],
                            [17, 10]
                        ]
                    }
                },
                'source': 'openmaptiles',
                'source-layer': 'aeroway',
                'type': 'line',
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': false,
                'inLegend': false
            },
            {
                'filter': ['all', ['in', 'class', 'runway'],
                    ['==', '$type', 'LineString']
                ],
                'id': 'aeroway-runway',
                'layout': {
                    'line-cap': 'round',
                    'line-join': 'round',
                    'visibility': 'visible'
                },
                'metadata': {
                    'mapbox:group': '1444849345966.4436'
                },
                'minzoom': 4,
                'maxzoom': 23,
                'paint': {
                    'line-color': 'rgba(255, 255, 255, 1)',
                    'line-opacity': 1,
                    'line-width': {
                        'base': 1.5,
                        'stops': [
                            [11, 4],
                            [17, 50]
                        ]
                    }
                },
                'source': 'openmaptiles',
                'source-layer': 'aeroway',
                'type': 'line',
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': false,
                'inLegend': false
            },
            {
                'filter': ['all', ['==', '$type', 'LineString'],
                    ['in', 'class', 'trunk', 'primary']
                ],
                'id': 'road_trunk_primary',
                'layout': {
                    'line-cap': 'round',
                    'line-join': 'round'
                },
                'paint': {
                    'line-color': '#fff',
                    'line-width': {
                        'base': 1.4,
                        'stops': [
                            [6, 0.5],
                            [20, 30]
                        ]
                    }
                },
                'minzoom': 3,
                'maxzoom': 23,
                'source': 'openmaptiles',
                'source-layer': 'transportation',
                'type': 'line',
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': false,
                'inLegend': false
            },
            {
                'filter': ['all', ['==', '$type', 'LineString'],
                    ['in', 'class', 'secondary', 'tertiary']
                ],
                'id': 'road_secondary_tertiary',
                'layout': {
                    'line-cap': 'round',
                    'line-join': 'round'
                },
                'paint': {
                    'line-color': '#fff',
                    'line-width': {
                        'base': 1.4,
                        'stops': [
                            [6, 0.5],
                            [20, 20]
                        ]
                    }
                },
                'minzoom': 3,
                'maxzoom': 23,
                'source': 'openmaptiles',
                'source-layer': 'transportation',
                'type': 'line',
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': false,
                'inLegend': false
            },
            {
                'filter': ['all', ['==', '$type', 'LineString'],
                    ['==', 'class', 'motorway']
                ],
                'id': 'road',
                'layout': {
                    'line-cap': 'round',
                    'line-join': 'round'
                },
                'paint': {
                    'line-color': 'hsl(0, 0%, 100%)',
                    'line-offset': 0,
                    'line-width': {
                        'base': 1.4,
                        'stops': [
                            [8, 1],
                            [16, 10]
                        ]
                    }
                },
                'minzoom': 3,
                'maxzoom': 23,
                'source': 'openmaptiles',
                'source-layer': 'transportation',
                'type': 'line',
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': false,
                'inLegend': true
            },
            {
                'filter': ['all', ['==', 'class', 'transit'],
                    ['!=', 'brunnel', 'tunnel']
                ],
                'id': 'railway-transit',
                'layout': {
                    'visibility': 'visible'
                },
                'paint': {
                    'line-color': 'hsl(34, 12%, 66%)',
                    'line-opacity': {
                        'base': 1,
                        'stops': [
                            [11, 0],
                            [16, 1]
                        ]
                    }
                },
                'minzoom': 3,
                'maxzoom': 23,
                'source': 'openmaptiles',
                'source-layer': 'transportation',
                'type': 'line',
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': false,
                'inLegend': false
            },
            {
                'filter': ['==', 'class', 'rail'],
                'id': 'railway',
                'layout': {
                    'visibility': 'visible'
                },
                'paint': {
                    'line-color': 'hsl(34, 12%, 66%)',
                    'line-opacity': {
                        'base': 1,
                        'stops': [
                            [11, 0],
                            [16, 1]
                        ]
                    }
                },
                'minzoom': 3,
                'maxzoom': 23,
                'source': 'openmaptiles',
                'source-layer': 'transportation',
                'type': 'line',
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': false,
                'inLegend': false
            },
            {
                'filter': ['all', ['==', '$type', 'LineString'],
                    ['==', 'brunnel', 'bridge']
                ],
                'id': 'waterway-bridge-case',
                'layout': {
                    'line-cap': 'butt',
                    'line-join': 'miter'
                },
                'paint': {
                    'line-color': '#bbbbbb',
                    'line-gap-width': {
                        'base': 1.55,
                        'stops': [
                            [4, 0.25],
                            [20, 30]
                        ]
                    },
                    'line-width': {
                        'base': 1.6,
                        'stops': [
                            [12, 0.5],
                            [20, 10]
                        ]
                    }
                },
                'minzoom': 3,
                'maxzoom': 23,
                'source': 'openmaptiles',
                'source-layer': 'waterway',
                'type': 'line',
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': false,
                'inLegend': false
            },
            {
                'filter': ['all', ['==', '$type', 'LineString'],
                    ['==', 'brunnel', 'bridge']
                ],
                'id': 'waterway-bridge',
                'layout': {
                    'line-cap': 'round',
                    'line-join': 'round'
                },
                'paint': {
                    'line-color': 'hsl(205, 56%, 73%)',
                    'line-width': {
                        'base': 1.55,
                        'stops': [
                            [4, 0.25],
                            [20, 30]
                        ]
                    }
                },
                'minzoom': 3,
                'maxzoom': 23,
                'source': 'openmaptiles',
                'source-layer': 'waterway',
                'type': 'line',
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': false,
                'inLegend': false
            },
            {
                'filter': ['all', ['==', '$type', 'LineString'],
                    ['==', 'brunnel', 'bridge'],
                    ['==', 'class', 'minor_road']
                ],
                'id': 'bridge_minor case',
                'layout': {
                    'line-cap': 'butt',
                    'line-join': 'miter'
                },
                'paint': {
                    'line-color': '#dedede',
                    'line-gap-width': {
                        'base': 1.55,
                        'stops': [
                            [4, 0.25],
                            [20, 30]
                        ]
                    },
                    'line-width': {
                        'base': 1.6,
                        'stops': [
                            [12, 0.5],
                            [20, 10]
                        ]
                    }
                },
                'minzoom': 3,
                'maxzoom': 23,
                'source': 'openmaptiles',
                'source-layer': 'transportation',
                'type': 'line',
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': false,
                'inLegend': false
            },
            {
                'filter': ['all', ['==', '$type', 'LineString'],
                    ['==', 'brunnel', 'bridge'],
                    ['in', 'class', 'primary', 'secondary', 'tertiary', 'trunk']
                ],
                'id': 'bridge_major case',
                'layout': {
                    'line-cap': 'butt',
                    'line-join': 'miter'
                },
                'paint': {
                    'line-color': '#dedede',
                    'line-gap-width': {
                        'base': 1.55,
                        'stops': [
                            [4, 0.25],
                            [20, 30]
                        ]
                    },
                    'line-width': {
                        'base': 1.6,
                        'stops': [
                            [12, 0.5],
                            [20, 10]
                        ]
                    }
                },
                'minzoom': 3,
                'maxzoom': 23,
                'source': 'openmaptiles',
                'source-layer': 'transportation',
                'type': 'line',
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': false,
                'inLegend': false
            },
            {
                'filter': ['all', ['==', '$type', 'LineString'],
                    ['==', 'brunnel', 'bridge'],
                    ['==', 'class', 'minor_road']
                ],
                'id': 'bridge_minor',
                'layout': {
                    'line-cap': 'round',
                    'line-join': 'round'
                },
                'paint': {
                    'line-color': '#efefef',
                    'line-width': {
                        'base': 1.55,
                        'stops': [
                            [4, 0.25],
                            [20, 30]
                        ]
                    }
                },
                'minzoom': 3,
                'maxzoom': 23,
                'source': 'openmaptiles',
                'source-layer': 'transportation',
                'type': 'line',
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': false,
                'inLegend': false
            },
            {
                'filter': ['all', ['==', '$type', 'LineString'],
                    ['==', 'brunnel', 'bridge'],
                    ['in', 'class', 'primary', 'secondary', 'tertiary', 'trunk']
                ],
                'id': 'bridge_major',
                'layout': {
                    'line-cap': 'round',
                    'line-join': 'round'
                },
                'paint': {
                    'line-color': '#fff',
                    'line-width': {
                        'base': 1.4,
                        'stops': [
                            [6, 0.5],
                            [20, 30]
                        ]
                    }
                },
                'minzoom': 3,
                'maxzoom': 23,
                'source': 'openmaptiles',
                'source-layer': 'transportation',
                'type': 'line',
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': false,
                'inLegend': false
            },

            {
                'filter': ['all', ['==', '$type', 'Point'],
                    ['==', 'rank', 1]
                ],
                'id': 'poi_label',
                'layout': {
                    'icon-size': 1,
                    'text-anchor': 'top',
                    'text-field': '{name:latin}\n{name:nonlatin}',
                    'text-font': ['Noto Sans Regular'],
                    'text-max-width': 8,
                    'text-offset': [0, 0.5],
                    'text-size': 11,
                    'visibility': 'visible'
                },
                'minzoom': 14,
                'maxzoom': 23,
                'paint': {
                    'text-color': '#666',
                    'text-halo-blur': 1,
                    'text-halo-color': 'rgba(255,255,255,0.75)',
                    'text-halo-width': 1
                },
                'source': 'openmaptiles',
                'source-layer': 'poi',
                'type': 'symbol',
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': false,
                'inLegend': false
            },
            {
                'filter': ['==', '$type', 'LineString'],
                'id': 'road_major_label',
                'layout': {
                    'symbol-placement': 'line',
                    'text-field': '{name:latin} {name:nonlatin}',
                    'text-font': ['Noto Sans Regular'],
                    'text-letter-spacing': 0.1,
                    'text-rotation-alignment': 'map',
                    'text-size': {
                        'base': 1.4,
                        'stops': [
                            [10, 8],
                            [20, 14]
                        ]
                    },
                    'text-transform': 'uppercase'
                },
                'paint': {
                    'text-color': '#000',
                    'text-halo-color': 'hsl(0, 0%, 100%)',
                    'text-halo-width': 2
                },
                'minzoom': 3,
                'maxzoom': 23,
                'source': 'openmaptiles',
                'source-layer': 'transportation_name',
                'type': 'symbol',
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': false,
                'inLegend': false
            },
            {
                'filter': ['all', ['==', '$type', 'Polygon'],
                    ['!=', 'intermittent', 1]
                ],
                'id': 'water - base layer',
                'paint': {
                    'fill-color': 'hsl(205, 56%, 73%)'
                },
                'minzoom': 3,
                'maxzoom': 23,
                'source': 'openmaptiles',
                'source-layer': 'water',
                'type': 'fill',
                'layout': {
                    'visibility': 'visible'
                },
                'showButtonLayerToggle': true,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': false,
                'inLegend': true
            },

            {
                'filter': ['all', ['==', '$type', 'Polygon'],
                    ['==', 'intermittent', 1]
                ],
                'id': 'water_intermittent',
                'paint': {
                    'fill-color': 'hsl(205, 56%, 73%)',
                    'fill-opacity': 0.7
                },
                'minzoom': 3,
                'maxzoom': 23,
                'source': 'openmaptiles',
                'source-layer': 'water',
                'type': 'fill',
                'layout': {
                    'visibility': 'visible'
                },
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': false,
                'inLegend': false
            },
            {
                'id': 'NHD water bodies',
                'type': 'fill',
                'source': 'delaware_basin_tiles',
                'source-layer': 'nhd_hires_waterbodies',
                'layout': {
                    'visibility': 'visible'
                },
                'paint': {
                    'fill-color': 'hsl(205, 92%, 49%)'
                },
                'minzoom': 3,
                'maxzoom': 23,
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': true,
                'inLegend': true
            },
            {
                'filter': ['==', 'FType', 466],
                'id': 'NHD swamp/marsh',
                'type': 'fill',
                'source': 'delaware_basin_tiles',
                'source-layer': 'nhd_hires_waterbodies',
                'layout': {
                    'visibility': 'visible'
                },
                'paint': {
                    'fill-color': 'hsla(120, 31%, 54%, 1)'
                },
                'minzoom': 3,
                'maxzoom': 23,
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': true,
                'inLegend': true
            },
            {
                "id": "order 1",
                'type': 'line',
                'source': 'nhd_streams',
                'source-layer': 'nhdplus_order_1',
                'layout': {
                    'visibility': 'none'
                },
                'paint': {
                    'line-color': '#00E5C7'
                },
                'minzoom': 3,
                'maxzoom': 23,
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': true,
                'showButtonProjectSpecific': false,
                'inLegend': false
            },
            {
                "id": "order 2",
                'type': 'line',
                'source': 'nhd_streams',
                'source-layer': 'nhdplus_order_2',
                'layout': {
                    'visibility': 'none'
                },
                'paint': {
                    'line-color': '#00D4E0'
                },
                'minzoom': 3,
                'maxzoom': 23,
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': true,
                'showButtonProjectSpecific': false,
                'inLegend': false
            },
            {
                "id": "order 3",
                'type': 'line',
                'source': 'nhd_streams',
                'source-layer': 'nhdplus_order_3',
                'layout': {
                    'visibility': 'none'
                },
                'paint': {
                    'line-color': '#00A8DC'
                },
                'minzoom': 3,
                'maxzoom': 23,
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': true,
                'showButtonProjectSpecific': false,
                'inLegend': false
            },
            {
                "id": "order 4",
                'type': 'line',
                'source': 'nhd_streams',
                'source-layer': 'nhdplus_order_4',
                'layout': {
                    'visibility': 'none'
                },
                'paint': {
                    'line-color': '#007ED8'
                },
                'minzoom': 3,
                'maxzoom': 23,
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': true,
                'showButtonProjectSpecific': false,
                'inLegend': false
            },
            {
                "id": "order 5",
                'type': 'line',
                'source': 'nhd_streams',
                'source-layer': 'nhdplus_order_5',
                'layout': {
                    'visibility': 'none'
                },
                'paint': {
                    'line-color': '#0055D4'
                },
                'minzoom': 3,
                'maxzoom': 23,
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': true,
                'showButtonProjectSpecific': false,
                'inLegend': false
            },
            {
                "id": "order 6",
                'type': 'line',
                'source': 'nhd_streams',
                'source-layer': 'nhdplus_order_6',
                'layout': {
                    'visibility': 'none'
                },
                'paint': {
                    'line-color': '#002ECF'
                },
                'minzoom': 3,
                'maxzoom': 23,
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': true,
                'showButtonProjectSpecific': false,
                'inLegend': false
            },
            {
                "id": "order 7",
                'type': 'line',
                'source': 'nhd_streams',
                'source-layer': 'nhdplus_order_7',
                'layout': {
                    'visibility': 'none'
                },
                'paint': {
                    'line-color': '#0008CB'
                },
                'minzoom': 3,
                'maxzoom': 23,
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': true,
                'showButtonProjectSpecific': false,
                'inLegend': false
            },
            {
                "id": "order 8",
                'type': 'line',
                'source': 'nhd_streams',
                'source-layer': 'nhdplus_order_8',
                'layout': {
                    'visibility': 'none'
                },
                'paint': {
                    'line-color': '#1B00C7'
                },
                'minzoom': 3,
                'maxzoom': 23,
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': true,
                'showButtonProjectSpecific': false,
                'inLegend': false
            },
            {
                "id": "order 9",
                'type': 'line',
                'source': 'nhd_streams',
                'source-layer': 'nhdplus_order_9',
                'layout': {
                    'visibility': 'none'
                },
                'paint': {
                    'line-color': '#3D00C3'
                },
                'minzoom': 3,
                'maxzoom': 23,
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': true,
                'showButtonProjectSpecific': false,
                'inLegend': false
            },
            {
                "id": "order minus_9",
                'type': 'line',
                'source': 'nhd_streams',
                'source-layer': '#5F00BF',
                'layout': {
                    'visibility': 'none'
                },
                'paint': {
                    'line-color': 'rgba(115, 255, 255, 1)'
                },
                'minzoom': 3,
                'maxzoom': 23,
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': true,
                'showButtonProjectSpecific': false,
                'inLegend': false
            },
            {
                'id': 'NHD flow lines',
                'type': 'line',
                'source': 'delaware_basin_tiles',
                'source-layer': 'nhd_hires_flowlines',
                'layout': {
                    'visibility': 'visible'
                },
                'paint': {
                    'line-color': ['case',
                        ['boolean', ['feature-state', 'hover'], false],
                        'pink', // this is here for the hover, but we need to change the data set to get it to work
                        'orange'
                    ],
                    'line-width': {
                        'base': 1,
                        'stops': [
                            [6, 0],
                            [10, 1]
                        ]
                    }
                },
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': true,
                'inLegend': true
            },
            {
                'id': 'PRMS rivers',
                'type': 'line',
                'source': 'delaware_basin_tiles',
                'source-layer': 'delaware_PRMS_streams',
                'layout': {
                    'visibility': 'visible'
                },
                'paint': {
                    'line-color': 'red',
                    'line-width': {
                        'base': 1,
                        'stops': [
                            [6, 0],
                            [10, 1]
                        ]
                    }
                },
                'minzoom': 3,
                'maxzoom': 23,
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': true,
                'inLegend': true
            },
            {
                'id': 'hru - highlight',
                'type': 'fill',
                'source': 'HRU',
                'source-layer': 'hrus',
                'layout': {
                    'visibility': 'none'
                },
                'paint': {
                    'fill-color': 'rgb(189, 209, 240)',
                    'fill-opacity': ['case',
                        ['boolean', ['feature-state', 'hover'], false],
                        0.5,
                        0
                    ],
                    'fill-outline-color': 'red'
                },
                'minzoom': 3,
                'maxzoom': 23,
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': true,
                'inLegend': false
            },
            {
                'id': 'hru names',
                'type': 'symbol',
                'source': 'HRU',
                'source-layer': 'hrus',
                'layout': {
                    'visibility': 'none',
                    'text-field': 'HRU - {hru_id_nat}',
                    'text-font': [
                        'Roboto Regular'
                    ],
                    'text-size': 12,
                    'symbol-placement': 'point',
                    'text-line-height': 1.2,
                    'text-justify': 'center',
                    'text-anchor': 'center',
                    'text-offset': [
                        0,
                        -1.5
                    ]
                },
                'paint': {
                    'text-color': 'rgba(0, 0, 0, 0.5)',
                    'text-halo-width': 1,
                    'text-halo-blur': 1,
                    'text-halo-color': 'rgba(255,255,255, 1)',
                    'text-opacity': ['case',
                        ['boolean', ['feature-state', 'hover'], false],
                        0,
                        1
                    ],
                },
                'minzoom': 3,
                'maxzoom': 23,
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': true,
                'inLegend': false
            },
            {
                'id': 'hru - outlines',
                'type': 'line',
                'source': 'HRU',
                'source-layer': 'hrus',
                'layout': {
                    'visibility': 'none'
                },
                'paint': {
                    'line-color': 'rgba(57, 79, 87, .5)'
                },
                'minzoom': 3,
                'maxzoom': 23,
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': true,
                'inLegend': true
            },
            {
                'id': 'state boundaries',
                'layout': {
                    'visibility': 'visible'
                },
                'paint': {
                    'line-color': 'rgba(173, 166, 163, 1)'
                },
                'minzoom': 3,
                'maxzoom': 23,
                'source': 'states',
                'type': 'line',
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': false,
                'inLegend': true
            },
            {
                'id': 'monitoring-location-clusters',
                'type': 'circle',
                'source': 'monitoring_location_summary',
                'layout': {
                    'visibility': 'visible'
                },
                'filter': ['has', 'point_count'],
                'paint': {
                'circle-color': [
                    'step',
                    ['get', 'point_count'],
                    'rgba(0, 87, 239, .25)', 100, // if less than 101 monitoring locations in the cluster, make it this color
                    'rgba(0, 106, 210, .5)', 750, // if there is less than 751 monitoring locations in the cluster make it this color
                    'rgba(0, 49, 74.9, .5)'
                    ],
                'circle-radius': [
                'step',
                    ['get', 'point_count'],
                    20, 100, // if there are less than 101 monitoring locations in the cluster, make it 20 px in radius
                    30, 750,
                    40
                    ]
                },
                'minzoom': 3,
                'maxzoom': 23,
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': false,
                'inLegend': false
            },
            {
                'id': 'monitoring-location-cluster-count',
                'type': 'symbol',
                'source': 'monitoring_location_summary',
                'filter': ['has', 'point_count'],
                'layout': {
                    'visibility': 'visible',
                    'text-field': '{point_count_abbreviated}',
                    'text-font': [
                        'Roboto Regular'
                    ],
                    'text-size': 12,
                    'symbol-placement': 'point'
                },
                'paint': {
                    'text-color': 'rgba(0,0,0, 1)',
                    'text-halo-width': 1,
                    'text-halo-blur': 1,
                    'text-halo-color': 'rgba(255,255,255, 1)',
                },
                'minzoom': 3,
                'maxzoom': 23,
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': false,
                'inLegend': false
            },
            {
                'id': 'monitoring-location-unclustered-point',
                'type': 'circle',
                'source': 'monitoring_location_summary',
                'layout': {
                    'visibility': 'visible'
                },
                'filter': ['!', ['has', 'point_count']],
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
                    'circle-radius': 4,
                    'circle-stroke-width': 1,
                    'circle-stroke-color': '#11b4da'
                },
                'minzoom': 3,
                'maxzoom': 23,
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': false,
                'inLegend': true
            },
            {
                'id': 'site names',
                'type': 'symbol',
                'source': 'monitoring_location_summary',
                'layout': {
                    'visibility': 'none',
                    'text-field': '{site_id} | {n_obs} | {latitude} | {longitude} | {source}',
                    'text-font': [
                        'Roboto Regular'
                    ],
                    'text-size': 12,
                    'symbol-placement': 'point',
                    'text-line-height': 1.2,
                    'text-justify': 'center',
                    'text-anchor': 'center',
                    'text-offset': [
                        0,
                        -1.5
                    ]
                },
                'paint': {
                    'text-color': 'rgba(0, 0, 0, 0.5)',
                    'text-halo-width': 1,
                    'text-halo-blur': 1,
                    'text-halo-color': 'rgba(255,255,255, 1)',
                },
                'minzoom': 3,
                'maxzoom': 23,
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': true,
                'inLegend': false
            },
            {
                'id': 'NHD names',
                'type': 'symbol',
                'source': 'delaware_basin_tiles',
                'source-layer': 'nhd_hires_waterbodies',
                'layout': {
                    'visibility': 'none',
                    'text-field': '{Permanent_Identifier}  {GNIS_Name}',
                    'text-font': [
                        'Roboto Regular'
                    ],
                    'text-size': 12,
                    'symbol-placement': 'point',
                    'text-line-height': 1.2,
                    'text-justify': 'center',
                    'text-anchor': 'bottom',
                    'text-offset': [
                        0,
                        -1.5
                    ]
                },
                'paint': {
                    'text-color': 'rgba(0, 0, 0, 0.5)',
                    'text-halo-width': 1,
                    'text-halo-blur': 1,
                    'text-halo-color': 'rgba(255,255,255, 1)',
                },
                'minzoom': 3,
                'maxzoom': 23,
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': true,
                'inLegend': false
            },

            {
                'id': 'NHD Permanent_Identifier',
                'type': 'symbol',
                'source': 'delaware_basin_tiles',
                'source-layer': 'nhd_hires_flowlines',
                'layout': {
                    'visibility': 'none',
                    'text-field': 'PID {Permanent_Identifier}',
                    'text-font': [
                        'Roboto Regular'
                    ],
                    'text-size': 12,
                    'symbol-placement': 'point',
                    'text-line-height': 1.2,
                    'text-justify': 'center',
                    'text-anchor': 'bottom',
                    'text-offset': [
                        0,
                        -1.5
                    ]
                },
                'paint': {
                    'text-color': 'rgba(52, 128, 235, 1)',
                    'text-halo-width': 1,
                    'text-halo-blur': 1,
                    'text-halo-color': 'rgba(255,255,255, 1)',
                },
                'minzoom': 3,
                'maxzoom': 23,
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': true,
                'inLegend': false
            },

            {
                'id': 'PRMS river names',
                'type': 'symbol',
                'source': 'delaware_basin_tiles',
                'source-layer': 'delaware_PRMS_streams',
                'layout': {
                    'visibility': 'none',
                    'text-field': 'seg_id {seg_id_nat}',
                    'text-font': [
                        'Roboto Regular'
                    ],
                    'text-size': 12,
                    'symbol-placement': 'point',
                    'text-line-height': 1.2,
                    'text-justify': 'center',
                    'text-anchor': 'bottom',
                    'text-offset': [
                        0,
                        -1.5
                    ]
                },
                'paint': {
                    'text-color': 'rgba(107, 52, 235, 1)',
                    'text-halo-width': 1,
                    'text-halo-blur': 1,
                    'text-halo-color': 'rgba(255,255,255, 1)',
                },
                'minzoom': 3,
                'maxzoom': 23,
                'showButtonLayerToggle': false,
                'showButtonStreamToggle': false,
                'showButtonProjectSpecific': true,
                'inLegend': false
            },









            {
                'filter': ['all', ['==', '$type', 'Point'],
                    ['==', 'class', 'city']
                ],
                'id': 'city names',
                'layout': {
                    'text-field': '{name:latin}\n{name:nonlatin}',
                    'text-font': ['Noto Sans Regular'],
                    'text-max-width': 10,
                    'text-size': {
                        'stops': [
                            [3, 12],
                            [8, 16]
                        ]
                    }
                },
                'maxzoom': 16,
                'minzoom': 5,
                'paint': {
                    'text-color': 'hsl(0, 0%, 0%)',
                    'text-halo-blur': 0,
                    'text-halo-color': 'hsla(0, 0%, 100%, 0.75)',
                    'text-halo-width': 2
                },
                'source': 'openmaptiles',
                'source-layer': 'place',
                'type': 'symbol',
                'showButtonLayerToggle': true,
                'showButtonStreamToggle': false,
                'inLegend': false
            }
        ]
    }
};