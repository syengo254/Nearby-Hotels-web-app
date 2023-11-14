import { Loader } from "@googlemaps/js-api-loader"

export const loader = new Loader({
  apiKey: import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY,
  version: "weekly",
  libraries: ["places", "maps", "core"]
});
