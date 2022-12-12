"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Role_Assigned extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Role, {
        foreignKey: "id",
        // targetKey: "role_id",
      });
      this.belongsTo(models.User, {
        foreignKey: "id",
      });
      // this.belongsToMany(models.User, {
      //   foreignKey: "id",
      //   // targetKey: "user_id",
      // });
    }
  }
  Role_Assigned.init(
    {
      role_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Role",
          key: "id",
        },
      },
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
      modelName: "Role_Assigned",
    }
  );
  return Role_Assigned;
};
