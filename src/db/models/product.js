'use strict'
module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
    productId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    size: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sclae: {
      type: DataTypes.STRING,
      allowNull: true
    },
    colour: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: {
          tableName: 'admin_users',
          schema: 'public'
        },
        key: 'admin_user_id'
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    tableName: 'products',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  Product.associate = function (model) {  
    Product.belongsTo(model.AdminUser, {
      foreignKey: 'ownerId',
      constraints: false
    })

    Product.hasMany(model.Stock, {
      foreignKey: 'productId',
      as: 'stocks' // Optional alias
  });
  }

  return Product
}