const { School, Facility, SchoolPhoto, sequelize } = require("../models");
const { Op } = require("sequelize");
const logger = require("../utils/logger");

exports.listSchools = async (req, res) => {
  try {
    const {
      q,
      area,
      schoolType,
      minFee,
      maxFee,
      lat,
      lng,
      radiusKm = 1,
      page = 1,
      limit = 10,
      minRating,
      city,
      name,
      sortBy = "distance_km",
      sortOrder = "ASC",
    } = req.query;

    // validation / parse
    const pageNum = Math.max(Number(page) || 1, 1);
    const pageSize = Math.max(Number(limit) || 10, 1);
    const offset = (pageNum - 1) * pageSize;
    const params = {};

    const whereClauses = ["s.lat IS NOT NULL", "s.lng IS NOT NULL"];

    if (q) {
      whereClauses.push(`s.name ILIKE :q`);
      params.q = `%${q}%`;
    }
    if (schoolType) {
      whereClauses.push(`s.school_type = :schoolType`);
      params.schoolType = schoolType;
    }
    if (minFee) {
      whereClauses.push(`s.yearly_fee_min >= :minFee`);
      params.minFee = Number(minFee);
    }
    if (maxFee) {
      whereClauses.push(`s.yearly_fee_max <= :maxFee`);
      params.maxFee = Number(maxFee);
    }
    if (minRating) {
      whereClauses.push(`s.google_rating >= :minRating`);
      params.minRating = Number(minRating);
    }
    if (area) {
      whereClauses.push(`s.area ilike :area`);
      params.area = `%${area}%`;
    }
    if (name) {
      whereClauses.push(`s.name ilike :name`);
      params.name = `%${name}%`;
    }
    if (city) {
      whereClauses.push(`s.city = :city`);
      params.city = city;
    }

    // If lat/lng provided, add bounding box prefilter to speed up query
    let distanceFilterSQL = "";
    if (lat && lng) {
      const latNum = Number(lat);
      const lngNum = Number(lng);
      const radius = Number(radiusKm);

      // Rough conversion: 1 deg latitude ~ 111.32 km
      const latDelta = radius / 111.32;
      // longitude delta depends on latitude
      const lngDelta = radius / (111.32 * Math.cos((latNum * Math.PI) / 180) || 1);

      params.minLat = latNum - latDelta;
      params.maxLat = latNum + latDelta;
      params.minLng = lngNum - lngDelta;
      params.maxLng = lngNum + lngDelta;
      params.lat = latNum;
      params.lng = lngNum;
      params.radius = radius;

      whereClauses.push(`s.lat BETWEEN :minLat AND :maxLat`);
      whereClauses.push(`s.lng BETWEEN :minLng AND :maxLng`);

      // we'll apply the exact spherical distance later (in HAVING-like clause)
      distanceFilterSQL = `
        AND (
          6371 * acos(
            cos(radians(:lat)) 
            * cos(radians(s.lat)) 
            * cos(radians(s.lng) - radians(:lng))
            + sin(radians(:lat)) 
            * sin(radians(s.lat))
          )
        ) <= :radius
      `;
    }

    const whereSQL = whereClauses.length ? "WHERE " + whereClauses.join(" AND ") : "";

    // Use COUNT(*) OVER() to get total_count for pagination
    const sql = `
      SELECT
        s.*,
        (
          6371 * acos(
            cos(radians(:lat)) 
            * cos(radians(s.lat)) 
            * cos(radians(s.lng) - radians(:lng))
            + sin(radians(:lat)) 
            * sin(radians(s.lat))
          )
        ) AS distance_km,
        (
          SELECT json_agg(json_build_object('image_url', sp.image_url, 'is_primary', sp.is_primary))
          FROM school_photos sp
          WHERE sp.school_id = s.id
        ) AS photos,
        COUNT(*) OVER() AS total_count
      FROM schools s
      ${whereSQL}
      ${distanceFilterSQL}
      ORDER BY ${sortBy} ${sortOrder}
      LIMIT :limit OFFSET :offset;
    `;

    // supply limit/offset as params even if lat/lng was not provided
    params.limit = pageSize;
    params.offset = offset;

    const schools = await sequelize.query(sql, {
      replacements: params,
      type: sequelize.QueryTypes.SELECT,
    });

    const total = schools.length ? Number(schools[0].total_count || 0) : 0;

    // remove total_count from each row before returning (optional)
    const cleaned = schools.map(({ total_count, ...rest }) => rest);

    return res.status(200).json({
      page: pageNum,
      limit: pageSize,
      total,             // total matching records (correct)
      count: cleaned.length, // rows in current page
      data: cleaned,
    });
  } catch (err) {
    logger.error("listSchools error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

