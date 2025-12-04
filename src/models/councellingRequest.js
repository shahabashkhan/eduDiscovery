module.exports = (sequelize, DataTypes) => {
    const CounsellingRequest = sequelize.define("CounsellingRequest", {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      parent_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mobile_number: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      scheduled_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      scheduled_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      query: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "pending",
      },
    });
  
    return CounsellingRequest;
  };
  