"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ApplicationScore extends Model {
    static associate(models) {
      ApplicationScore.belongsTo(models.Application, {
        foreignKey: "applicationId",
        as: "Application",
      });
    }
  }
  
  ApplicationScore.init(
    {
      applicationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      total_score: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ApplicationScore",
    }
  );
  
  return ApplicationScore;
};
