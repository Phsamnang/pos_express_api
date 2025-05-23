const { DataTypes } = require("sequelize");
const database = require("../config/database");
const Roles = require("./roles");

const User = database.define(
  "User",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "usr_nm",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "nm",
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "pwd",
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "User",
        key: "id",
      },
      field: "p_id",
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Roles,
        key: "id",
      },
      field: "role_id",
    },
  },
  {
    underscored: false,
  }
);
(async () => {
  try {
    await database.sync({ alter: true });
    console.log("Migration successful!");
  } catch (error) {
    console.error("Error migrating database:", error);
  }
})();
module.exports = User;
