# Changelog
All notable changes to this project will be documented in this file.

## [Unreleased]
- Refined layer toggle for appearance and mobile compatibility
- Adjusted the minimum zoom level to 3 as well as the default/initial zoom level to 3
- Added Legend
- Added hover effect to HRUs
- Changed to allow tile assets to be pulled from S3
- Added layer toggle for all layers, and added 'showButton' property to mapStyles.js to control display of buttons
- Moved the map styles to a separate mapStyles.js 
- Changed application to use vue-mapbox plugin
- Dotted State lines to show its possible.
- Added Cities to the basemap layers.
- Changed basemap creation so  we have several source layers to avoid loading in all layers multiple times and filtering.  This way we only call the layer we want when we want
- changed layer order so HRU layer is lowest and changed the opacity of that layer 
- added map controls
- Deleted second mbtiles folder
- Fixed the title bar CSS at wide widths, adjusted the page title
- Added basemap mbtiles to the mbtiles directory
- Fixed menu bar title, added more appropriate title to page
- Added appropriate changes to the style variable in the Mapbox.vue to style the map the way I chose to
- Added USWDS components, Added title, removed component not needed

