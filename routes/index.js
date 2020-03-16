const express = require("express")
const router = express.Router()
const Sequelize = require('sequelize')
const nodemailer = require('nodemailer')

const Ealertuser = require('../models/ealertuser')
const Pin = require("../models/pin")

router.get('/', (req, res) => {
    res.render('ealert')
})

router.post("/ealert", async (req, res) => {
    try {
        if (req.body.password == process.env.EALERT_PASS) {
            const eAlertAdmin = await Ealertuser.findOne({
                where: {
                    email: req.body.email,
                    isAdmin: true
                }
            })
            if (eAlertAdmin) {
                let pin = Math.floor(Math.random() * Math.floor(1000000))
                if (pin < 100000) {
                    pin += 100000
                }
                let pinString = pin.toString()
                console.log(pinString)
                await Pin.update({ ealertpin: pinString }, {
                    where: {
                        id: 1
                    }
                })
                let transporter = nodemailer.createTransport({
                    host: "smtp-relay.gmail.com",
                    port: 25,
                    secure: false
                })
                await transporter.sendMail({
                    from: '"PAL eAlert System PIN" <support@palhealth.com>', 
                    to: eAlertAdmin.phonenumber,
                    subject: "eAlert Test",
                    text: `Please enter the following PIN on the next page of the PAL eAlert System: ${pin}`
                })
                res.render("ealertmessage", {
                    eAlertAdmin: eAlertAdmin,
                    pin: pin
                })
            } else {
                res.send("Admin user not found, please press back button")
            }
        } else {
            res.send("Sorry, password is incorrect. Please click the back button and try again.")
        }
    } catch(err) {
        console.error(err)
    }
})

router.post('/ealertmessage', async (req, res) => {
    let interval = 10000
    try {
        let employees = []
        let employeeSMSEmails = []
        let test, production, office, reditus
        if (req.body.test) {
            test = await Ealertuser.findAll({
                where: {
                    isTest: true
                }
            })
            employees.push(...test)
        }
        if (req.body.production) {
            production = await Ealertuser.findAll({
                where: {
                    isProduction: true
                }
            })
            employees.push(...production)
        }
        if (req.body.office) {
            office = await Ealertuser.findAll({
                where: {
                    isOffice: true
                }
            })
            employees.push(...office)
        }
        if (req.body.reditus) {
            reditus = await Ealertuser.findAll({
                where: {
                    isReditus: true
                }
            })
            employees.push(...reditus)
        }
        employees.forEach(e => {
            employeeSMSEmails.push(e.phonenumber)
        })
        const pin = await Pin.findOne({
            where: {
                id: 1
            }
        })
        if (pin.ealertpin == req.body.pin) {
            let transporter = nodemailer.createTransport({
                host: "smtp-relay.gmail.com",
                port: 25,
                secure: false
            })
            // for (let j=0; j<20; j++) {
            //     for (let i=0; i<employeeSMSEmails.length; i++) {
            //         setTimeout(() => {
            //             transporter.sendMail({
            //                 from: '"PAL eAlert System" <support@palhealth.com>', 
            //                 subject: "eAlert Test",
            //                 text: `MASS TEXT 2-${j+1} (12:04 PM)`,
            //                 to: employeeSMSEmails[i]
            //             })
            //             console.log("Email sent to " + employeeSMSEmails[i])
            //         }, interval)
            //         interval += 10000
            //     }
            // }
            for (let i=0; i<employeeSMSEmails.length; i++) {
                setTimeout(() => {
                    transporter.sendMail({
                        from: '"PAL eAlert System" <support@palhealth.com>', 
                        subject: "eAlert Test",
                        text: req.body.message,
                        to: employeeSMSEmails[i]
                    })
                    console.log("Email sent to " + employeeSMSEmails[i])
                }, interval)
                interval += 10000
            }
            console.log(employeeSMSEmails.length)
            res.send("Submission success. Emails are being sent out.")
        } else {
            res.send("Sorry, the pin you entered was incorrect. Please go back and try again.")
        }
    } catch(err) {
        console.error(err)
    }
})

module.exports = router