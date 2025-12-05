const generateTiles = require("./generateTiles");
const { searchNearby, getPlaceDetails } = require("./googlePlaces");
const upsertSchool = require("./upsertSchool");

async function importPreschools(minLat, maxLat, minLng, maxLng) {
  const tiles = generateTiles(minLat, maxLat, minLng, maxLng);
  const keywords = ["preschool", "play school", "montessori", "nursery", "daycare"];
  for (const tile of tiles) {

    for (const keyword of keywords) {
      let data = await searchNearby(tile.lat, tile.lng, keyword);
      await processResults(data.results);

      while (data.next_page_token) {
        await wait(3000); // must wait
        data = await searchNearby(tile.lat, tile.lng, keyword, data.next_page_token);

        await processResults(data.results);
      }
    }
  }
}

async function processResults(results) {
  for (const r of results) {
    const details = await getPlaceDetails(r.place_id);
    await upsertSchool(details);
  }
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

if (require.main === module) {
  const [minLat, maxLat, minLng, maxLng] = process.argv.slice(2).map(Number);

  if ([minLat, maxLat, minLng, maxLng].some((v) => isNaN(v))) {
    console.log("❌ Invalid arguments.");
    console.log("Usage:");
    console.log("node import.js <minLat> <maxLat> <minLng> <maxLng>");
    process.exit(1);
  }

  importPreschools(minLat, maxLat, minLng, maxLng).catch(console.error);
}

module.exports = importPreschools;
