'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Doctor_infor extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Doctor_infor.belongsTo(models.User, { foreignKey: 'doctorID' })

            Doctor_infor.belongsTo(models.Allcode, { foreignKey: 'priceID', targetKey: 'keyMap', as: 'priceTypeData' })
            Doctor_infor.belongsTo(models.Allcode, { foreignKey: 'provinceID', targetKey: 'keyMap', as: 'provinceTypeData' })
            Doctor_infor.belongsTo(models.Allcode, { foreignKey: 'paymentID', targetKey: 'keyMap', as: 'paymentTypeData' })

        }
    };
    Doctor_infor.init({
        doctorID: DataTypes.INTEGER,
        specialtyID: DataTypes.INTEGER,
        clinicID: DataTypes.INTEGER,
        priceID: DataTypes.STRING,
        provinceID: DataTypes.STRING,
        paymentID: DataTypes.STRING,
        addressClinic: DataTypes.STRING,
        nameClinic: DataTypes.STRING,
        note: DataTypes.STRING,
        count: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Doctor_infor',
        freezeTableName: true
    });
    return Doctor_infor;
};