<script setup lang="ts">
import { loader } from '@/lib/googleMaps';
import { ref } from 'vue';

const myPos = ref({
  lat: 0,
  lng: 0
});

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(updatePosition);
  } else {
    window.alert("Geolocation is not supported by this browser.");
  }
}

function updatePosition(position: GeolocationPosition) {
  myPos.value.lat = position.coords.latitude;
  myPos.value.lng = position.coords.longitude;

  loader
    .load()
    .then(async (google) => {
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
      const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        center: { ...myPos.value },
        zoom: 19,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapId: 'my-pos-map',
      });
      const marker01 = new AdvancedMarkerElement({
        map,
        position: { ...myPos.value },
        title: 'This marker is visible at zoom level 15 and higher.'
      });

      marker01.map = map;

      console.log('position is', myPos.value);
    })
    .catch(e => {
      // do something
    });
}

function startApp() {
  getLocation();
}
</script>

<template>
  <header>

    <div class="wrapper">
      <button @click="startApp">Start</button>
    </div>

  </header>

  <main>
    <div id="map"></div>
  </main>
</template>

<style scoped>
#map {
  height: 300px;
}
</style>
