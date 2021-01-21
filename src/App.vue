<template>
  <div id="app">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <router-view/>
  </div>
</template>

<style>
@font-face {
  font-family: "RoastChicken";
  src: local("RoastChicken"),   url(./assets/fonts/RoastChicken.ttf) format("truetype");
}
@font-face {
  font-family: "TragicMarker";
  src: local("TragicMarker"),   url(./assets/fonts/TragicMarker.otf) format("opentype");
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

h2 {
  font-family: TragicMarker, Helvetica, Arial, sans-serif;
}
</style>
