const { CounsellingRequest } = require("../models");

exports.createCounsellingRequest = async (req, res, next) => {
  try {
    const { parent_name, mobile_number, scheduled_date, scheduled_time, query } = req.body;

    const request = await CounsellingRequest.create({
      parent_name,
      mobile_number,
      scheduled_date,
      scheduled_time,
      query,
      status: "pending"
    });

    return res.status(201).json({
      success: true,
      message: "Your counselling request has been submitted",
      data: request
    });

  } catch (error) {
    next(error);
  }
};

exports.listCounsellingRequests = async (req, res, next) => {
    try {
      let {
        page = 1,
        limit = 20,
        status,
        date,
        search
      } = req.query;
  
      page = Number(page);
      limit = Number(limit);
      const offset = (page - 1) * limit;
  
      const where = {};
  
      // Filter by date
      if (date) {
        where.scheduled_date = date;
      }
  
      // Filter by status
      if (status) {
        where.status = status;
      }
  
      // Search by parent name or mobile
      if (search) {
        where[Op.or] = [
          { parent_name: { [Op.iLike]: `%${search}%` } },
          { mobile_number: { [Op.iLike]: `%${search}%` } }
        ];
      }
  
      // Fetch list
      const { rows, count } = await CounsellingRequest.findAndCountAll({
        where,
        order: [["created_at", "DESC"]],
        limit,
        offset,
      });
  
      return res.status(200).json({
        success: true,
        page,
        limit,
        total: count,
        data: rows,
      });
    } catch (error) {
      logger.error("getCounsellings error:", error);
      next(error);
    }
  };
