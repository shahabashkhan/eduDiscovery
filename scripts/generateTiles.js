function generateTiles(minLat, maxLat, minLng, maxLng, step = 0.01) {
    const tiles = [];
  
    for (let lat = minLat; lat <= maxLat; lat += step) {
      for (let lng = minLng; lng <= maxLng; lng += step) {
        tiles.push({ lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) });
      }
    }
  
    return tiles;
  }
  
  module.exports = generateTiles;
  