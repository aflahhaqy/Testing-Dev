"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ApplicationAnswer extends Model {
    static associate(models) {
      ApplicationAnswer.belongsTo(models.Application, {
        foreignKey: "applicationId",
        as: "Application",
      });
      ApplicationAnswer.belongsTo(models.Item, {
        foreignKey: "itemId",
        as: "Item",
      });
    }
  }
  
  ApplicationAnswer.init(
    {
      applicationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      itemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ApplicationAnswer",
    }
  );
  
  return ApplicationAnswer;
};
