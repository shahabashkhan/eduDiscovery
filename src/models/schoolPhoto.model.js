module.exports = (sequelize, DataTypes) => {
    const SchoolPhoto = sequelize.define('SchoolPhoto', {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      school_id: { type: DataTypes.UUID, allowNull: false },
      photo_reference: {type: DataTypes.TEXT, allowNull: false},
      image_url: { type: DataTypes.TEXT, allowNull: false },
      is_primary: { type: DataTypes.BOOLEAN, defaultValue: false },
      source: { type: DataTypes.ENUM('google','admin','school'), defaultValue: 'google' }
    }, {
      tableName: 'school_photos',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['school_id', 'photo_reference'],   // composite unique constraint
          name: 'unique_school_photo'
        }
      ]
    });
  
    SchoolPhoto.associate = (models) => {
      SchoolPhoto.belongsTo(models.School, { foreignKey: 'school_id' });
    };
  
    return SchoolPhoto;
  };