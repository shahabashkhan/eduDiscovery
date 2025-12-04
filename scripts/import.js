const generateTiles = require("./generateTiles");
const { searchNearby, getPlaceDetails } = require("./googlePlaces");
const upsertSchool = require("./upsertSchool");

async function importBangalorePreschools() {
  const tiles = generateTiles();
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

importBangalorePreschools()
  .then(() => console.log("Import Completed"))
  .catch(console.error);
