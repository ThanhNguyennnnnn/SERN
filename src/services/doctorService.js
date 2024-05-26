import { raw } from "body-parser";
import db from "../models/index"
require('dotenv').config();
import _ from 'lodash';
import e from "express";
import { where } from "sequelize";

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limitInput,
                order: [['createdAt', 'DESC']],
                where: { roleID: 'R2' },
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
                ],
                raw: true,
                nest: true
            })
            resolve({
                errCode: 0,
                data: users
            })
        } catch (error) {
            reject(error)
        }
    })
}

let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleID: 'R2' },
                attributes: {
                    exclude: ['password', 'image']
                }
            })
            resolve({
                errCode: 0,
                data: doctors
            })
        } catch (error) {
            reject(error)
        }
    })
}

let saveDetailInforDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.doctorID
                || !inputData.contentHTML
                || !inputData.contentMarkdown || !inputData.action
                || !inputData.selectedPrice || !inputData.selectedPayment
                || !inputData.selectedProvince || !inputData.nameClinic
                || !inputData.addressClinic || !inputData.note
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            }
            else {
                // upsert to Markdown table
                if (inputData.action === "CREATE") {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorID: inputData.doctorID

                    })
                }
                else if (inputData.action === "EDIT") {
                    let doctorMarkdown = await db.Markdown.findOne({
                        where: { doctorID: inputData.doctorID },
                        raw: false
                    })
                    if (doctorMarkdown) {
                        doctorMarkdown.contentHTML = inputData.contentHTML;
                        doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
                        doctorMarkdown.description = inputData.description;
                        // doctorMarkdown.updateAt = new Date();
                        await doctorMarkdown.save();
                    }

                }

                // upsert to doctor infor table
                let doctorInfor = await db.Doctor_infor.findOne({
                    where: {
                        doctorID: inputData.doctorID,
                    },
                    raw: false
                })
                if (doctorInfor) {
                    // update
                    doctorInfor.doctorID = inputData.doctorID;
                    doctorInfor.priceID = inputData.selectedPrice;
                    doctorInfor.paymentID = inputData.selectedPayment;
                    doctorInfor.provinceID = inputData.selectedProvince;
                    doctorInfor.nameClinic = inputData.nameClinic;
                    doctorInfor.addressClinic = inputData.addressClinic;
                    doctorInfor.note = inputData.note;
                    // doctorInfor.updateAt = new Date();
                    await doctorInfor.save();

                }
                else {
                    // create
                    await db.Doctor_infor.create({
                        doctorID: inputData.doctorID,
                        priceID: inputData.selectedPrice,
                        paymentID: inputData.selectedPayment,
                        provinceID: inputData.selectedProvince,
                        nameClinic: inputData.nameClinic,
                        addressClinic: inputData.addressClinic,
                        note: inputData.note,

                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Save infor doctor succeed! '
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getDetailDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            }
            else {
                let data = await db.User.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },

                        {
                            model: db.Allcode, as: 'positionData',
                            attributes: ['valueEn', 'valueVi']
                        },

                        {
                            model: db.Doctor_infor,
                            attributes: {
                                exclude: ['id', 'doctorID']
                            },
                            include: [
                                {
                                    model: db.Allcode, as: 'priceTypeData',
                                    attributes: ['valueEn', 'valueVi']
                                },
                                {
                                    model: db.Allcode, as: 'paymentTypeData',
                                    attributes: ['valueEn', 'valueVi']
                                },
                                {
                                    model: db.Allcode, as: 'provinceTypeData',
                                    attributes: ['valueEn', 'valueVi']
                                },
                            ]
                        },

                    ],
                    raw: false,
                    nest: true
                })

                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }

                if (!data) {
                    data = {}
                }

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorID || !data.formatedDate) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required param!"
                })
            }
            else {
                let schedule = data.arrSchedule;
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                }

                let existing = await db.Schedule.findAll(
                    {
                        where: { doctorID: data.doctorID, date: data.formatedDate },
                        attributes: ['timeType', 'date', 'doctorID', 'maxNumber'],
                        raw: true
                    }
                );

                // compare different 
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                })
                // create data
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate)
                }

                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                });
            }

        } catch (error) {
            reject(error);
        }
    })
}

let getScheduleByDate = (doctorID, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorID || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter! '
                })
            }
            else {
                let dataSchedule = await db.Schedule.findAll({
                    where: {
                        doctorID: doctorID,
                        date: date
                    },
                    include: [
                        {
                            model: db.Allcode, as: 'timeTypeData',
                            attributes: ['valueEn', 'valueVi']
                        },

                    ],
                    raw: false,
                    nest: true
                })
                if (!dataSchedule) {
                    dataSchedule = []
                }
                resolve({
                    errCode: 0,
                    data: dataSchedule
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    saveDetailInforDoctor: saveDetailInforDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
}