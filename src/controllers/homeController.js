import db from '../models/index'
import CRUDServices from '../services/CRUDServices';
let getHomePage = (req, res) => {
    return res.render('homePage.ejs');
}
let getAboutPage = (req, res) => {
    return res.render('test/about.ejs');
}
let getCRUD = (req, res) => {
    return res.render('crud.ejs');
}
let postCRUD = async(req, res) => {
    let messenger = await CRUDServices.createNewUser(req.body);
    console.log(messenger);
    return res.send('post crud');
}
let displayGetCRUD = async(req, res) => {
    let data = await CRUDServices.getAllUser();
    console.log("---------------------");
    console.log(data);
    return res.render('displayCRUD.ejs',{
        dataTable: data
    });
}
let getEditCRUD = async(req, res) =>{
    let userId = req.query.id;
    console.log(userId);
    if(userId){
        let userData = await CRUDServices.getUserInfoById(userId);
        console.log("-----------");
        console.log(userData);
        return res.render('editCRUD.ejs', {
            user: userData
        });
    }
    else{
        return res.send('User not found');
    }
}
let putCRUD = async(req, res) => {
    let data = req.body;
    let allUsers = await CRUDServices.updateUserData(data);
    return res.render('displayCRUD.ejs', {
        dataTable: allUsers
    });
}
let deleteCRUD = async(req, res) => {
    let userId = req.query.id;
    if (userId) {
        await CRUDServices.deleteUserById(userId);
    return res.send("delete the user succeed")
    }
    else{
        return res.send("use npt found")
    }

}
//objects{
//  key: '',
//  value: ''
//}
module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,
}