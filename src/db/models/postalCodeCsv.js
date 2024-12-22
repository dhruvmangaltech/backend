'use strict'

module.exports = (sequelize, DataTypes) => {
  const PostalCodeCsv = sequelize.define('PostalCodeCsv', {
    csvId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    csvUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    successCount: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    failedCount: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    totalCount: {
      type: DataTypes.VIRTUAL,
      get () {
        return (this.failedCount + this.successCount)
      }
    }
  },
  {
    sequelize,
    tableName: 'postal_code_csv',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  // PostalCodeCsv.associate = function (model) {
  // }

  return PostalCodeCsv
}
