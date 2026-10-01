const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class session extends Model {}

session.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'session',
  tableName: 'session'
})

module.exports = session