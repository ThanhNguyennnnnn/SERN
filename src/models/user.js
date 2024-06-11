'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Allcode, {foreignKey: 'positionID', targetKey: 'keyMap', as: 'positionData'})
      User.belongsTo(models.Allcode, {foreignKey: 'gender', targetKey: 'keyMap', as: 'genderData'})
      User.hasOne(models.Markdown, { foreignKey: 'doctorID' })
      User.hasOne(models.Doctor_infor, { foreignKey: 'doctorID' })

      User.hasMany(models.Schedule, { foreignKey: 'doctorID', as: 'doctorData' })
      User.hasMany(models.Booking, { foreignKey: 'patientID', as: 'patientData' })

    }
  };
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    address: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    gender: DataTypes.STRING,
    image: DataTypes.STRING,
    roleID: DataTypes.STRING,
    positionID: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};