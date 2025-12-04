function generateTiles() {
    const tiles = [];
    // 12.8272182	77.4122682
    const minLat = 12.821;
    const maxLat = 12.828;//12.95;
    const minLng = 77.411;
    const maxLng = 77.42 //77.85;
    
    const step = 0.005;  // approx ~500m grid
  
    for (let lat = minLat; lat <= maxLat; lat += step) {
      for (let lng = minLng; lng <= maxLng; lng += step) {
        tiles.push({ lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) });
      }
    }
  
    return tiles;
  }
  
  module.exports = generateTiles;
  