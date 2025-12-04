module.exports = (sequelize, DataTypes) => {
  const School = sequelize.define('School', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: true, unique: true },
    google_place_id: { type: DataTypes.STRING, allowNull: true, unique: true },
    phone: { type: DataTypes.STRING, allowNull: true },
    website: { type: DataTypes.STRING, allowNull: true },
    address: { type: DataTypes.TEXT, allowNull: true },
    area: { type: DataTypes.STRING, allowNull: true },
    city: { type: DataTypes.STRING, allowNull: true },
    state: { type: DataTypes.STRING, allowNull: true },
    pincode: { type: DataTypes.STRING, allowNull: true },
    lat: { type: DataTypes.DECIMAL(10, 7), allowNull: true },
    lng: { type: DataTypes.DECIMAL(10, 7), allowNull: true },
    school_type: { type: DataTypes.STRING, allowNull: true }, // e.g., Montessori, Play School
    age_group: { type: DataTypes.STRING, allowNull: true }, // e.g., "2-6"
    yearly_fee_min: { type: DataTypes.INTEGER, allowNull: true },
    yearly_fee_max: { type: DataTypes.INTEGER, allowNull: true },
    teacher_student_ratio: { type: DataTypes.STRING, allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    google_rating: { type: DataTypes.FLOAT, allowNull: true },
    google_ratings_total: { type: DataTypes.INTEGER, allowNull: true },
    image_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    primary_image_url: { type: DataTypes.TEXT, allowNull: true },
    google_map_url: { type: DataTypes.TEXT, allowNull: true },

  }, {
    tableName: 'schools',
    timestamps: true,
    indexes: [
      { fields: ["lat", "lng"] },
      { fields: ["name"] },
      { fields: ["area"] },
      { fields: ["school_type"] },
      { fields: ["yearly_fee_min", "yearly_fee_max"] },
      { unique: true, fields: ["slug"] },
      { unique: true, fields: ["google_place_id"] }
    ]
  });

  School.associate = (models) => {
    School.hasMany(models.SchoolPhoto, { foreignKey: 'school_id', as: 'photos' });
    School.belongsToMany(models.Facility, { through: models.SchoolFacility, foreignKey: 'school_id', as: 'facilities' });
    School.hasMany(models.Review, { foreignKey: 'school_id', as: 'reviews' });
    School.hasMany(models.Claim, { foreignKey: 'school_id', as: 'claims' });
  };

  return School;
};
