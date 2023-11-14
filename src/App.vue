<script setup lang="ts">
import { loader } from '@/lib/googleMaps';
import { ref } from 'vue';

const myPos = ref({
  lat: 0,
  lng: 0
});

const map = ref<google.maps.Map | null>(null);

const nearbyRestaurants = ref<{ name: string | undefined, loc: any }[]>([]);

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
      map.value = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        center: { ...myPos.value },
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapId: 'my-pos-map',
      });
      const marker01 = new AdvancedMarkerElement({
        map: map.value,
        position: { ...myPos.value },
        title: 'This marker is visible at zoom level 15 and higher.'
      });

      marker01.map = map.value;

      console.log('position is', myPos.value);

      var service = new google.maps.places.PlacesService(map.value);
      var center = new google.maps.LatLng(myPos.value.lat, myPos.value.lng);
      var request = {
        location: center,
        radius: 500,
        type: ['restaurant']
      } as unknown as google.maps.places.PlaceSearchRequest;

      service.nearbySearch(
        request,
        (
          results: google.maps.places.PlaceResult[] | null,
          status: google.maps.places.PlacesServiceStatus
        ) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            for (let i = 0; i < results.length; i++) {
              createMarker(results[i]);
            }
          }
        }
      );

    })
    .catch(e => {
      // do something
    });
}

function createMarker(place: google.maps.places.PlaceResult) {
  if (!place.geometry || !place.geometry.location) return;

  const marker = new google.maps.Marker({
    map: map.value,
    position: place.geometry.location,
    title: place.name,
  });
  nearbyRestaurants.value.push({ name: place.name, loc: place.geometry.location })
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
    <div class="list-hotels">
      <ol>
        <li v-for="hotel, idx in nearbyRestaurants" :key="idx">{{ hotel.name }}</li>
      </ol>
    </div>
  </main>
</template>

<style scoped>
#map {
  height: 300px;
}
</style>
