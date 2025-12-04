const { School, sequelize } = require("../src/models");

async function seedSchools() {
  const schools = [
    {
      name: "EuroKids Whitefield",
      slug: "eurokids-whitefield",
      address: "Whitefield Main Road, Whitefield, Bangalore",
      area: "Whitefield",
      city: "Bangalore",
      lat: 12.9692,
      lng: 77.7499,
      phone: "+91 9876543210",
      school_type: "Preschool",
      yearly_fee_min: 60000,
      yearly_fee_max: 120000,
      google_rating: 4.4,
      google_ratings_total: 120,
      primary_image_url: "https://via.placeholder.com/300x200?text=EuroKids",
      is_enriched: true,
    },
    {
      name: "Kangaroo Kids Marathahalli",
      slug: "kangaroo-kids-marathahalli",
      address: "Outer Ring Road, Marathahalli, Bangalore",
      area: "Marathahalli",
      city: "Bangalore",
      lat: 12.9568,
      lng: 77.7011,
      phone: "+91 9988776655",
      school_type: "Preschool",
      yearly_fee_min: 55000,
      yearly_fee_max: 110000,
      google_rating: 4.2,
      google_ratings_total: 80,
      primary_image_url: "https://via.placeholder.com/300x200?text=Kangaroo+Kids",
      is_enriched: true,
    },
    {
      name: "Kidzee Indiranagar",
      slug: "kidzee-indiranagar",
      address: "12th Main Road, Indiranagar, Bangalore",
      area: "Indiranagar",
      city: "Bangalore",
      lat: 12.9723,
      lng: 77.6408,
      phone: "+91 8877665544",
      school_type: "Preschool",
      yearly_fee_min: 45000,
      yearly_fee_max: 100000,
      google_rating: 4.3,
      google_ratings_total: 150,
      primary_image_url: "https://via.placeholder.com/300x200?text=Kidzee",
      is_enriched: true,
    },
    {
      name: "Little Millennium Electronic City",
      slug: "little-millennium-electronic-city",
      address: "Phase 1, Electronic City, Bangalore",
      area: "Electronic City",
      city: "Bangalore",
      lat: 12.8399,
      lng: 77.6770,
      phone: "+91 9988001122",
      school_type: "Preschool",
      yearly_fee_min: 40000,
      yearly_fee_max: 90000,
      google_rating: 4.1,
      google_ratings_total: 60,
      primary_image_url: "https://via.placeholder.com/300x200?text=Little+Millennium",
      is_enriched: true,
    },
    {
      name: "Hello Kids HSR Layout",
      slug: "hello-kids-hsr-layout",
      address: "27th Main Road, HSR Layout, Bangalore",
      area: "HSR Layout",
      city: "Bangalore",
      lat: 12.9121,
      lng: 77.6446,
      phone: "+91 8899223344",
      school_type: "Preschool",
      yearly_fee_min: 50000,
      yearly_fee_max: 95000,
      google_rating: 4.5,
      google_ratings_total: 140,
      primary_image_url: "https://via.placeholder.com/300x200?text=Hello+Kids",
      is_enriched: true,
    }
  ];

  try {
    await sequelize.sync(); // ensure DB connection
    await School.bulkCreate(schools, { ignoreDuplicates: true });
    console.log("Seed data inserted successfully!");
  } catch (err) {
    console.error("Error seeding data:", err);
  } finally {
    await sequelize.close();
  }
}

seedSchools();
