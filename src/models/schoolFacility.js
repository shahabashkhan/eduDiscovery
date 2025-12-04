module.exports = (sequelize, DataTypes) => {
    const SchoolFacility = sequelize.define('SchoolFacility', {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      school_id: { type: DataTypes.UUID, allowNull: false },
      facility_id: { type: DataTypes.UUID, allowNull: false }
    }, {
      tableName: 'school_facilities',
      timestamps: false
    });
  
    return SchoolFacility;
  };