<template>
  <div id="app">
    <HeaderUSWDSBanner />
    <HeaderUSGS />
    <MapBox title="Delaware Basin Model" />
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
    color: #2c3e50;
    width: 100%;  
    }
  @media screen and (min-width: 601px){
    body{
      height: 100vh;
    }
    #app{
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
  }
</style>
