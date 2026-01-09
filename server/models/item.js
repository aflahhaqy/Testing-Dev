"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    static associate(models) {
      Item.belongsTo(models.Group, {
        foreignKey: "groupId",
        as: "Group",
      });
    }
  }
  
  Item.init(
    {
      groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      nama_item: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bobot_d: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      bobot_f: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Item",
    }
  );
  
  return Item;
};
