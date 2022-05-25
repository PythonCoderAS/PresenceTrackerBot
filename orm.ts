import {Sequelize, DataTypes, Optional, Model} from "sequelize"

const config = require("./config.json")
const sequelize = new Sequelize(config.database)

/*export const Activity: ActivityAttributes = sequelize.define("Activity", {
    userId: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    data: {
        type: DataTypes.STRING,
        allowNull: true
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    }
})*/

export interface ActivityAttributes {
    userId: string
    name: string
    data: string | null
    type: string
}

interface ActivityCreationAttributes extends ActivityAttributes {}

export class Activity extends Model<ActivityAttributes, ActivityCreationAttributes>
    implements ActivityAttributes {
    userId!: string
    name!: string
    data: string | null
    type!: string;
    id!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Activity.init({
    userId: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    data: {
        type: DataTypes.STRING,
        allowNull: true
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {sequelize})

export async function init() {
    await sequelize.sync({alter: true})
}