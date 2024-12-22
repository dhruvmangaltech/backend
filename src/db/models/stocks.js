'use strict'
module.exports = (sequelize, DataTypes) => {
    const Stock = sequelize.define('Stock', {
        stockId: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        amount: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: 0.0
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
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        productId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: {
                    tableName: 'products',
                    schema: 'public'
                },
                key: 'productId'
            }
        }
    }, {
        sequelize,
        tableName: 'stocks',
        schema: 'public',
        timestamps: true,
        underscored: true
    })

    Stock.associate = function (model) {  
        Stock.belongsTo(model.AdminUser, {
          foreignKey: 'ownerId',
          constraints: false
        });

        Stock.belongsTo(model.Product, {
            foreignKey: 'productId',
            as: 'product' // Optional alias
        });

        Stock.hasOne(model.StockLogs, {
            foreignKey: 'stockId',
            as: 'stockLogs' // Optional alias
        });
      }

    return Stock

}