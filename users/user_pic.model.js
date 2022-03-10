const { DataTypes, NOW } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        id: { type: DataTypes.UUID , primaryKey: true , defaultValue: DataTypes.UUIDV4 , allowNull: true },
        file_name: { type: DataTypes.STRING, allowNull: false },
        url: { type: DataTypes.STRING, allowNull: false },
        upload_date: { type: DataTypes.DATEONLY , defaultValue: NOW},
        user_id: { type: DataTypes.UUID, allowNull: false }
    };

    const options = {
        defaultScope: {
            // exclude password hash by default
            attributes: { exclude: ['passwordHash'] }
        },
        scopes: {
            // include hash with this scope
            withHash: { attributes: {}, }
        }
    };

    return sequelize.define('Image', attributes, options);
}