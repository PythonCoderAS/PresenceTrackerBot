import {Sequelize, DataTypes} from "sequelize"

const config = require("./config.json")
const sequelize = new Sequelize(config.database)

const Activity = sequelize.define("Activity", {
    userId: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    startTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    }
})