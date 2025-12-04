const { School } = require("../src/models");
const { SchoolPhoto } = require("../src/models");

// async function upsertSchool(place) {
//   const photos = place.photo_urls || [];

//   // First, upsert the school
//   const [school] = await School.upsert(
//     {
//       google_place_id: place.place_id,
//       name: place.name || null,
//       address: place.formatted_address || null,
//       lat: place.geometry?.location?.lat || null,
//       lng: place.geometry?.location?.lng || null,
//       phone: place.international_phone_number || null,
//       website: place.website || null,
//       google_rating: place.rating || null,
//       google_ratings_total: place.user_ratings_total || null,
//       primary_image_url: place.photos?.[0]
//         ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${process.env.GOOGLE_KEY}`
//         : null,
//       city: "Bangalore"
//     },
//     {
//       conflictFields: ["google_place_id"],
//       returning: true
//     }
//   );
//   const schoolId = school.id;

//   if (!photos.length) return school;

//   // Fetch existing photo_reference list
//   const existingPhotos = await SchoolPhoto.findAll({
//     where: { school_id: schoolId },
//     attributes: ["photo_reference"],
//   });

//   const existingRefs = new Set(existingPhotos.map((p) => p.photo_reference));

//   // Build final array for insertion
//   console.log("photos",photos)
//   const newPhotos = photos
//     .filter((p) => !existingRefs.has(p.photo_reference))
//     .map((p, index) => ({
//       school_id: schoolId,
//       photo_reference: p.photo_reference,
//       image_url: p.image_url,
//       is_primary: index === 0, // mark first photo as primary
//     }));
//   console.log("new photos",newPhotos)
//   if (newPhotos.length > 0) {
//     await SchoolPhoto.bulkCreate(newPhotos);
//   }

//   return school;
// }

async function upsertSchool(place) {
  // Check if school already exists
  const existingSchool = await School.findOne({
    where: { google_place_id: place.place_id },
    attributes: ["id"]
  });

  const schoolData = {
    google_place_id: place.place_id,
    name: place.name || null,
    address: place.formatted_address || null,
    lat: place.lat || null,
    lng: place.lng || null,
    phone: place.international_phone_number || null,
    website: place.website || null,
    google_rating: place.rating || null,
    google_ratings_total: place.user_ratings_total || null,
    primary_image_url: place.photo_urls?.[0]?.image_url || null,
    area: place.area || null,
    city: place.city || null,
    state: place.state || null,
    pincode: place.pincode || null,
    google_map_url: place.google_map_url || null,
  };

  let school;

  if (existingSchool) {
    await School.update(schoolData, { where: { id: existingSchool.id } });
    school = await School.findByPk(existingSchool.id);
  } else {
    school = await School.create(schoolData);
  }

  const schoolId = school.id;

  if (!existingSchool && place.photo_urls?.length) {
    
    const photosToInsert = place.photo_urls.map((p, index) => ({
      school_id: schoolId,
      photo_reference: p.photo_reference,
      image_url: p.image_url,
      is_primary: index === 0,
      source: "google"
    }));

    await SchoolPhoto.bulkCreate(photosToInsert);
  }

  return school;
}

module.exports = upsertSchool;
