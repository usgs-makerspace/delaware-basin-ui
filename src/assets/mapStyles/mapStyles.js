export default {
    style: {
        version: 8,
        sources: {
            basemap: {
                type: 'vector',
                // The following line is used as a reference point for automated builds
                // to insert the correct base tile location - do not modify:
                // BASE SOURCE INSERT

                // If you are setting up a local build, you can uncomment the following
                // URL assignment to pull the base tiles from S3 so that no local tile
                // server is required:
                // 'tiles': ['http://wbeep-test-website.s3-website-us-west-2.amazonaws.com/basetiles/{z}/{x}/{y}.pbf']
            },
            delaware_basin_tiles: {
                type: 'vector',
                // The following line is used as a reference point for automated builds
                // to insert the correct HRU tile location - do not modify:
                // DELAWARE BASIN SOURCE INSERT

                // If you are setting up a local build, you can uncomment the following
                // URL assignment to pull the HRU tiles from S3 so that no local tile
                // server is required:
                // 'tiles': ['https://delaware-basin-test-website.s3-us-west-2.amazonaws.com/tiles/{z}/{x}/{y}.pbf']
            }
        },
        'sprite': '',
        'glyphs': 'https://orangemug.github.io/font-glyphs/glyphs/{fontstack}/{range}.pbf',
        'layers': [
            {
                'id': 'Background',
                'type': 'background',
                'layout': {
                    'visibility': 'visible'
                },
                'paint': {
                    'background-color': 'rgba(154, 215, 219, 0.5)'
                },
                'showButton': false
            },
            {
                'id': 'State Color Fill',
                'type': 'fill',
                'source': 'basemap',
                'source-layer': 'states',
                'layout': {
                    'visibility': 'visible'
                },
                'paint': {
                    'fill-color': 'rgba(246, 246, 244, 1)',
                },
                'showButton': false
            },
            {
                'id': 'Delaware Water Bodies',
                'type': 'fill',
                'source': 'delaware_basin_tiles',
                'source-layer': 'nhd_hires_waterbodies',
                'layout': {
                    'visibility': 'visible'
                },
                'paint': {
                    'fill-color': 'blue'
                },
                'showButton': true
            },
            {
                'id': 'Delaware Rivers',
                'type': 'line',
                'source': 'delaware_basin_tiles',
                'source-layer': 'delaware_PRMS_streams',
                'layout': {
                    'visibility': 'visible'
                },
                'paint': {
                    'line-color': 'red'
                },
                'showButton': true
            },
            {
                'id': 'Delaware Monitoring Location Markers',
                'type': 'circle',
                'source': 'delaware_basin_tiles',
                'source-layer': 'delaware_sites_summary',
                'layout': {
                    'visibility': 'visible'
                },
                'paint': {
                    'circle-color': 'red',
                    'circle-radius': 4
                },
                'showButton': true
            },
            {
                'id': 'Delaware Flow Lines',
                'type': 'line',
                'source': 'delaware_basin_tiles',
                'source-layer': 'nhd_hires_flowlines',
                'layout': {
                    'visibility': 'visible'
                },
                'paint': {
                    'line-color': 'orange'
                },
                'showButton': true
            },
            {
                'id': 'Delaware ML Names',
                'type': 'symbol',
                'source': 'delaware_basin_tiles',
                'source-layer': 'delaware_sites_summary',
                'layout': {
                    'visibility': 'visible',
                    'text-field': '{site_id}',
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
                        -0.5
                    ]
                },
                'paint': {
                    'text-color': 'rgba(255,255,255, 1)',
                    'text-halo-width': 1,
                    'text-halo-blur': 1,
                    'text-halo-color': 'rgba(0, 0, 0, 0.5)',
                },
                'showButton': true
            },
            {
                'id': 'Rivers',
                'type': 'line',
                'source': 'basemap',
                'source-layer': 'USA_Rivers_and_Streams',
                'minzoom': 5,
                'layout': {
                    'visibility': 'visible'
                },
                'paint': {
                    'line-color': 'rgba(115, 255, 255, 1)'
                },
                'showButton': true
            },
            {
                'id': 'Counties Borders',
                'type': 'line',
                'source': 'basemap',
                'source-layer': 'counties',
                'minzoom': 6,
                'maxzoom': 24,
                'layout': {
                    'visibility': 'visible'
                },
                'paint': {
                    'line-color': 'rgba(218, 234, 240, 1)'
                },
                'showButton': true
            },
            {
                'id': 'State Borders',
                'type': 'line',
                'source': 'basemap',
                'source-layer': 'states',
                'layout': {
                    'visibility': 'visible'
                },
                'paint': {
                    'line-color': 'rgba(218, 234, 240, 1)',
                    'line-dasharray': [
                        2,
                        1.5
                    ]
                },
                'showButton': true
            },
            {
                'id': 'Cities Dots',
                'type': 'circle',
                'source': 'basemap',
                'source-layer': 'Cities_and_Towns_NTAD',
                'minzoom': 6,
                'layout': {
                    'visibility': 'visible'
                },
                'paint': {
                    'circle-radius': 4
                },
                'showButton': true
            },
            {
                'id': 'Cities Names',
                'type': 'symbol',
                'source': 'basemap',
                'source-layer': 'Cities_and_Towns_NTAD',
                'minzoom': 6,
                'layout': {
                    'visibility': 'visible',
                    'text-field': '{NAME}',
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
                        -0.5
                    ]
                },
                'paint': {
                    'text-color': 'rgba(255,255,255, 1)',
                    'text-halo-width': 1,
                    'text-halo-blur': 1,
                    'text-halo-color': 'rgba(0, 0, 0, 0.5)',
                },
                'showButton': true
            }
        ]
    }
};