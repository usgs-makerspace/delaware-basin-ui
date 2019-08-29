<template>
  <div id="app">
    <HeaderUSWDSBanner />
    <HeaderUSGS />
    <MapBox title="Current status of natural water availability across the Continental U.S." />
    <FooterUSGS />
  </div>
</template>

<script>
    import HeaderUSWDSBanner from './components/HeaderUSWDSBanner'
    import HeaderUSGS from './components/HeaderUSGS'
    import MapBox from './components/MapBox'
    import FooterUSGS from './components/FooterUSGS'

    export default {
        name: 'App',
        components: {
            HeaderUSWDSBanner,
            HeaderUSGS,
            MapBox,
            FooterUSGS
        }
    }
</script>

<style lang="scss">
  body{
    margin: 0;
    padding: 0;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
</style>
