'use strict'
module.exports = (sequelize, DataTypes) => {
    const StockLogs = sequelize.define('StockLogs', {
        stockLogId: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        actioneeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: {
                    tableName: 'admin_users',
                    schema: 'public'
                },
                key: 'admin_user_id'
            }
        },
        actionType: { // added, removed, cancel
            type: DataTypes.STRING
        },
        actionId: { //  DEBIT: '0', CREDIT: '1', CANCEL: '2'
            type: DataTypes.STRING
        },
        stockId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: {
                    tableName: 'stocks',
                    schema: 'public'
                },
                key: 'stock_id'
            }
        },
        status: {
            type: DataTypes.INTEGER
        },
        beforeBalance: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        afterBalance: {
            type: DataTypes.FLOAT,
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
    },
        {
            sequelize,
            tableName: 'stock_logs',
            schema: 'public',
            timestamps: true,
            underscored: true
        })

    StockLogs.associate = function (model) {
        StockLogs.belongsTo(model.AdminUser, {
            foreignKey: 'actioneeId',
            constraints: false
        });
        StockLogs.belongsTo(model.Stock, {
            foreignKey: 'stockId',
            constraints: false
        })
    }

    return StockLogs

}