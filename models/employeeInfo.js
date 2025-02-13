'use strict';

module.exports = (sequelize, DataTypes) => {
  const EmployeeInfo = sequelize.define("EmployeeInfo", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,  // Ensure one-to-one relationship
      references: {
        model: 'Users',  // table name
        key: 'id'
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hireDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    baseSalary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    tableName: 'employee_info',
    timestamps: true
  });

  EmployeeInfo.associate = function(models) {
    // Define one-to-one relationship with User
    EmployeeInfo.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE'
    });
  };

  return EmployeeInfo;
}; 