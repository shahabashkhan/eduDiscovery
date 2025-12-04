module.exports = (sequelize, DataTypes) => {
    const Claim = sequelize.define('Claim', {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      school_id: { type: DataTypes.UUID, allowNull: false },
      user_id: { type: DataTypes.UUID, allowNull: false }, // school owner user
      status: { type: DataTypes.ENUM('pending','approved','rejected'), defaultValue: 'pending' },
      message: { type: DataTypes.TEXT, allowNull: true },
      contact_email: { type: DataTypes.STRING, allowNull: true },
      contact_phone: { type: DataTypes.STRING, allowNull: true }
    }, {
      tableName: 'claims',
      timestamps: true
    });
  
    Claim.associate = (models) => {
      Claim.belongsTo(models.School, { foreignKey: 'school_id' });
      Claim.belongsTo(models.User, { foreignKey: 'user_id' });
    };
  
    return Claim;
  };
  