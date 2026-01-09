"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Application extends Model {
    static associate(models) {
      Application.hasMany(models.ApplicationAnswer, {
        foreignKey: "applicationId",
        as: "ApplicationAnswers",
      });
      Application.hasOne(models.ApplicationScore, {
        foreignKey: "applicationId",
        as: "ApplicationScore",
      });
      Application.belongsTo(models.Admin, {
        foreignKey: "UserId",
      });
    }
  }
  
  Application.init(
    {
      no_aplikasi: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      nama: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tanggal_lahir: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      tempat_lahir: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      jenis_kelamin: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      alamat: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      kode_pos: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Application",
    }
  );
  
  return Application;
};
