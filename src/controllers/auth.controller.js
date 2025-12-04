const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

module.exports = {
  register: async (req, res) => {
    try {
      const { name, email, password, phone } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const exists = await User.findOne({ where: { email } });
      if (exists) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const password_hash = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        phone,
        password_hash,
      });

      return res.status(201).json({
        message: "User registered successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password)
        return res.status(400).json({ message: "Missing email or password" });

      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(400).json({ message: "Invalid credentials" });

      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  },

  me: async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: ["id", "name", "email", "phone", "role"],
      });

      return res.json({ user });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  },

  createCounsellingRequest: async (req, res, next) => {
    try {
      const { parentName, mobileNumber, scheduledDate, scheduledTime, query } = req.body;
  
      const request = await CounsellingRequest.create({
        parent_name: parentName,
        mobile_number: mobileNumber,
        scheduled_date: scheduledDate,
        scheduled_time: scheduledTime,
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
  },
};
