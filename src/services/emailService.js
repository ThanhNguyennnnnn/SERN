require('dotenv').config();
import nodemailer from 'nodemailer'

let sendSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    // async..await is not allowed in global scope, must use a wrapper
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"ThanhNguyen 👻" <viechoctap6789@gmail.com>', // sender address
        to: dataSend.reciverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        html: getBodyHTMLEmail(dataSend)
        , // html body
    });

}

let getBodyHTMLEmail = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result =
            `
                <h3>Xin chào ${dataSend.patientName}</h3>
                <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên website ThanhNguyen </p>
                <p>Thông tin đặt lịch khám bệnh: </p>
                <div><b>Thời gian: ${dataSend.time}</b></div>
                <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>

                <p>Nếu các thông tin trên là đúng sự thật, vui lòng click vào link bên dưới 
                để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh.
                </p>
                <div>
                    <a href=${dataSend.redirectLink} target="_blank">Click here</a>
                </div>
                <div>Xin chân thành cảm ơn</div>
            `
    }
    if (dataSend.language === 'en') {
        result =
            `
                <h3>Dear ${dataSend.patientName}</h3>
                <p>You received this email because you booked an online medical examination appointment on the ThanhNguyen website</p>
                <p>Information for scheduling medical examination: </p>
                <div><b>Time: ${dataSend.time}</b></div>
                <div><b>Doctor: ${dataSend.doctorName}</b></div>

                <p>If the above information is true, please click on the link below
 to confirm and complete the medical appointment booking procedure.
                </p>
                <div>
                    <a href=${dataSend.redirectLink} target="_blank">Click here</a>
                </div>
                <div>Sincerely thank</div>
            `
    }
    return result;
}

let sendAttachment = async (dataSend) => {
    return new Promise(async(resolve, reject) => {
        try {
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // Use `true` for port 465, `false` for all other ports
                auth: {
                    user: process.env.EMAIL_APP,
                    pass: process.env.EMAIL_APP_PASSWORD,
                },
            });

            // async..await is not allowed in global scope, must use a wrapper
            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: '"ThanhNguyen 👻" <viechoctap6789@gmail.com>', // sender address
                to: dataSend.email, // list of receivers
                subject: "Kết quả khám bệnh", // Subject line
                html: getBodyHTMLEmailRemedy(dataSend)
                , // html body
                attachments: [
                    {   // encoded string as an attachment
                        filename: `remedy-${dataSend.patientID}-${new Date().getTime()}.png`,
                        content: dataSend.imgBase64.split('base64,')[1],
                        encoding: 'base64'
                    }
                ]
            });
            resolve()
        } catch (error) {
            reject(error)
        }
    })


}
let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result =
            `
                <h3>Xin chào ${dataSend.patientName}</h3>
                <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên website ThanhNguyen thành công</p>
                <p>Thông tin đơn thuốc/ hóa đơn được gửi trong file đính kèm! </p>
                
                <div>Xin chân thành cảm ơn</div>
            `
    }
    if (dataSend.language === 'en') {
        result =
            `
                <h3>Dear ${dataSend.patientName}</h3>
                <p>You received this email because you booked an online medical examination appointment on the ThanhNguyen website</p>
                
                <div>Sincerely thank</div>
            `
    }
    return result;
}


module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendAttachment: sendAttachment
}