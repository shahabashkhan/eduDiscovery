const axios = require("axios");
require("dotenv").config();

const GOOGLE_KEY = process.env.GOOGLE_KEY;

function extractAddressComponents(components = []) {
  const find = (type) =>
    components.find((c) => c.types.includes(type))?.long_name || null;

  return {
    area: find("sublocality") || find("sublocality_level_1"),
    city: find("locality"),
    district: find("administrative_area_level_2"),
    state: find("administrative_area_level_1"),
    pincode: find("postal_code"),
  };
}

/**
 * Places Nearby Search
 */
async function searchNearby(lat, lng, keyword, pagetoken = null) {
  const params = {
    location: `${lat},${lng}`,
    radius: 500,
    key: GOOGLE_KEY,
    keyword,
  };

  if (pagetoken) params.pagetoken = pagetoken;

  const res = await axios.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json", { params });

  return res.data;
}

/**
 * Places Details API
 */
async function getPlaceDetails(placeId) {
  const params = {
    place_id: placeId,
    key: GOOGLE_KEY,
    fields: [
      "place_id",
      "name",
      "formatted_address",
      "international_phone_number",
      "opening_hours",
      "geometry",
      "website",
      "rating",
      "user_ratings_total",
      "photos",
      "business_status",
      "url",
      "address_components"
    ].join(",")
  };

  const res = await axios.get("https://maps.googleapis.com/maps/api/place/details/json", { params });
  const result = res.data.result;

  const addr = extractAddressComponents(result.address_components);

  result.area = addr.area;
  result.city = addr.city;
  result.state = addr.state;
  result.pincode = addr.pincode;
  result.google_map_url = result.url || null;

  // Convert geometry functions to numeric values
  if (result.geometry?.location?.lat) {
    result.lat = typeof result.geometry.location.lat === "function"
      ? result.geometry.location.lat()
      : result.geometry.location.lat;

    result.lng = typeof result.geometry.location.lng === "function"
      ? result.geometry.location.lng()
      : result.geometry.location.lng;
  }

  result.photo_urls = (result.photos || []).map((p) => ({
    photo_reference: p.photo_reference,
    image_url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${p.photo_reference}&key=${GOOGLE_KEY}`,
  }));

    return result;
  }

module.exports = { searchNearby, getPlaceDetails };
