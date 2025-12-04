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
    } = req.query;

    const offset = (page - 1) * limit;

    const whereClauses = [];
    const params = {
      lat: Number(lat),
      lng: Number(lng),
      radius: Number(radiusKm),
      limit: Number(limit),
      offset: Number(offset),
    };

    if (q) {
      whereClauses.push(`s.name ILIKE :q`);
      params.q = `%${q}%`;
    }
    if (area) {
      whereClauses.push(`s.area = :area`);
      params.area = area;
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

    const whereSQL = whereClauses.length
      ? "AND " + whereClauses.join(" AND ")
      : "";

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
                    ) AS photos
                FROM schools s
                WHERE 
                    s.lat IS NOT NULL 
                    AND s.lng IS NOT NULL
                    ${whereSQL}
                    AND 
                    (
                        6371 * acos(
                            cos(radians(:lat)) 
                            * cos(radians(s.lat)) 
                            * cos(radians(s.lng) - radians(:lng))
                            + sin(radians(:lat)) 
                            * sin(radians(s.lat))
                        )
                    ) <= :radius
                ORDER BY distance_km ASC
                LIMIT :limit OFFSET :offset;
                `;

    const schools = await sequelize.query(sql, {
      replacements: params,
      type: sequelize.QueryTypes.SELECT,
    });
    console.log(schools);
    return res.status(200).json({
      page,
      limit,
      count: schools?.length,
      data: schools,
    });
  } catch (err) {
    console.log(err)
    logger.error("listSchools error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
