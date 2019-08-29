FROM debian:stretch

LABEL maintainer="tworr@usgs.gov"

# Run updates and install curl
RUN apt-get update && \
      apt-get upgrade -y && \
      apt-get install curl -y && \
      apt-get purge -y --auto-remove && \
      apt-get clean
      
# Enable the NodeSource repository and install the latest nodejs
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash - && \
      apt-get install nodejs -y

# Create temp directory for building viz app
RUN mkdir -p /tmp/wbeep-viz-app

# Copy source code
WORKDIR /tmp/wbeep-viz-app
COPY . .
# Set environment variables for build target and tile source and then run config.sh
# to insert the correct S3 tile source URLs in the Mapbox configuration file.
ARG BUILDTARGET="test"
ARG TILESOURCE="default"
ENV E_BUILDTARGET=$BUILDTARGET
ENV E_TILESOURCE=$TILESOURCE
RUN chmod +x ./config.sh && ./config.sh

# Build the Vue app.
RUN npm install
RUN npm run build
