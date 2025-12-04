module.exports = (sequelize, DataTypes) => {
    const Facility = sequelize.define('Facility', {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      name: { type: DataTypes.STRING, unique: true, allowNull: false }
    }, {
      tableName: 'facilities',
      timestamps: false
    });
  
    Facility.associate = (models) => {
      Facility.belongsToMany(models.School, { through: models.SchoolFacility, foreignKey: 'facility_id' });
    };
  
    return Facility;
  };