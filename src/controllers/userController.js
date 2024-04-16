// import { READUNCOMMITTED } from "sequelize/types/lib/table-hints";
import userService from "../services/userServices";
// API
// 
let handleLogin = async (req, res) => {

    // lấy email pass bên phía khách hàng gửi lên 
    let email = req.body.email;
    let password = req.body.password;
    // check email co ton tai hay khong 
    // password co chinh xac khong
    // return thong tin nguoi dung
    // access token: JWT json web token
    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: "Tai khoan hoac mat khau trong"
        })
    }
    let userData = await userService.handleUserLogin(email, password);
    // kiểm tra người dùng hơp lệ thì trả về 1 object người dùng
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {},
    })
}
// Lay ra user 
let handleGetAllUsers = async (req, res) => {
    // doi tu .body sang .query (?id=....)
    let id = req.query.id; // All, ID
    // 
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'ID trong ',
            users: []
        })
    }
    // lay user theo id hoac la lay ra tat ca user
    let users = await userService.getAllUsers(id);
    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        users
    })
}
// Them nguoi dung moi
let handleCreateNewUser = async (req, res) => {
    let message = await userService.createNewUser(req.body);
    // console.log(message);
    return res.status(200).json(message);
}
// xoa nguoi dung
let handleDeleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Khong tim thay id can xoa'
        })
    }
    let message = await userService.deleteUser(req.body.id);
    return res.status(200).json(message);
}
// cap nhat nguoi dung
let handleEditUser = async(req, res) => {
    let data = req.body;
    let message = await userService.updateUserData(data);
    return res.status(200).json(message)
}

let getAllCode = async (req, res) => {
    try {
        let data = await userService.getAllCodeService(req.query.type);
        return res.status(200).json(data);
    } catch (error) {
        console.log('Get all code error: ', error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
    getAllCode: getAllCode,
}