"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    static associate(models) {
      Group.hasMany(models.Item, {
        foreignKey: "groupId",
        as: "Items",
      });
    }
  }
  
  Group.init(
    {
      nama_group: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      bobot_b: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Group",
    }
  );
  
  return Group;
};
