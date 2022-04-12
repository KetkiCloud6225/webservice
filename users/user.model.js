const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        id: { type: DataTypes.UUID, primaryKey: true , defaultValue: DataTypes.UUIDV4 , allowNull: true },
        first_name: { type: DataTypes.STRING, allowNull: false },
        last_name: { type: DataTypes.STRING, allowNull: false },
        username: { type: DataTypes.STRING, allowNull: false },
        password: { type: DataTypes.STRING, allowNull: false },
        verified : { type : DataTypes.BOOLEAN, defaultValue : false, allowNull: false },
        verified_on : { type : DataTypes.DATE }
    };

    return sequelize.define('User', attributes,  {
        timestamps: false
      });
}