const Sequelize = require('sequelize')

let db

db = new Sequelize('eAlert', process.env.DATABASE_USER, process.env.DATABASE_PASS_08, {
	dialect: 'mssql'
})

const Pin = db.define('pins', {
    ealertpin: {
        type: Sequelize.STRING,
        allowNull: true
    }
}, {
    timestamps: false
})

module.exports = Pin