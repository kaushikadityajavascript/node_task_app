"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: "id",
        // targetKey: "id",
      });
    }
  }
  Task.init(
    {
      reminder_date: DataTypes.DATE,
      description: DataTypes.STRING,
      title: DataTypes.STRING,
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "User",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Task",
    }
  );
  return Task;
};
