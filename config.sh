#!/usr/bin/env sh

# This script inserts the corect Delaware Basin and basemap tile
# locations into the appropriate Mapbox configuration file
# before an automated build of the vue app.
#
# Two sets of tiles are available, one in the test bucket
# and one in the prod bucket.  By default the app
# in the test bucket will use the test tiles, while the
# prod builds will use tiles from prod.
#
# There will be an option in Jenkins to override the tile 
# locations so that for example we can do a test build that
# uses tiles from prod.

# Mapbox configuration file where tile locations are defined
mbconfig=src/assets/mapStyles/mapStyles.js

# S3 bucket addresses where tiles are stored
# note: once we have a public URL for prod we'll need
# to change that here
prodBucket=delaware-basin-prod-website.s3-website-us-west-2.amazonaws.com
testBucket=delaware-basin-test-website.s3-website-us-west-2.amazonaws.com

# common prefix/suffix for tile URL configuration
globalTilePrefix='"tiles": ["http://'
globalTileSuffix='/{z}/{x}/{y}.pbf"],'
# tile directories
delawareBasinTileLocation='/tiles'
baseTileLocation='/basetiles'

# Set default tile location to prod and override if we are building to
# test or if a non-default tile source is specified.
delawareBasinSource="$globalTilePrefix$prodBucket$delawareBasinTileLocation$globalTileSuffix"
baseSource="$globalTilePrefix$prodBucket$baseTileLocation$globalTileSuffix" 

if [ \( "$E_BUILDTARGET" = "test" -a "$E_TILESOURCE" != "prod" \) -o \( "$E_TILESOURCE" = "test" \) ];
then
  delawareBasinSource="$globalTilePrefix$testBucket$delawareBasinTileLocation$globalTileSuffix"
  baseSource="$globalTilePrefix$testBucket$baseTileLocation$globalTileSuffix"   
fi

# Insert HRU and base tile URLs into Mapbox configuration file
sed -i "/DELAWARE BASIN SOURCE INSERT/a $delawareBasinSource" "$mbconfig"
sed -i "/BASE SOURCE INSERT/a $baseSource" "$mbconfig"
