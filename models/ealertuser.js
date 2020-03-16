const Sequelize = require('sequelize')

let db

db = new Sequelize('eAlert', process.env.DATABASE_USER, process.env.DATABASE_PASS_08, {
	dialect: 'mssql'
})

const Ealertuser = db.define('ealertusers', {
    firstname: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastname: {
        type: Sequelize.STRING,
        allowNull: false
    },
    phonenumber: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: true
    },
    isAdmin: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    isProduction: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    },
    isOffice: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    },
    isReditus: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    },
    isTest: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    }
}, {
    timestamps: false
})

module.exports = Ealertuser