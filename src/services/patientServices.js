import { where } from "sequelize";
import db from "../models/index"
require('dotenv').config();
import _ from 'lodash';
import emailService from './emailService'

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorID || !data.timeType || !data.date
                || !data.fullName
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter! '
                })
            }
            else {
                await emailService.sendSimpleEmail({
                    reciverEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectLink: 'https://youtu.be/-cg9dq-Jq2M?si=9elcWEgdTiSiiO-Y'
                })

                //upsert patient
                let user = await db.User.findOrCreate({
                    where: {
                        email: data.email
                    },
                    defaults: {
                        email: data.email,
                        roleID: 'R3'
                    }
                })
                console.log('check user: ', user[0])
                // create a booking record
                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: {
                            patientID: user[0].id
                        },
                        defaults: {
                            statusID: 'S1',
                            doctorID: data.doctorID,
                            patientID: user[0].id,
                            date: data.date,
                            timeType: data.timeType
                        }
                    })
                }
                resolve({

                    errCode: 0,
                    errMessage: 'Save infor patient succeed! '
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    postBookAppointment: postBookAppointment
}