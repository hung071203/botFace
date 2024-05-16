require('dotenv').config();


const { readFileSync } = require("fs");
// const login = require("facebook-chat-api");
const login = require("../Fca-Horizon-Remastered");


loginPath = {appState: JSON.parse(readFileSync(__dirname + "/appstate.json", "utf-8"))};
loginAcc = {email: "039271203341", password: "01677796540761"}

var client = {
    config: process.env,
    ADMIN: process.env.ADMIN.trim().split(' ').filter(item => item !== ""),
    DEV: process.env.DEV.trim().split(' ').filter(item => item !== ""),
    members: new Map(),
    commands: new Map(),
    events: new Map(),
    noprefix: new Map(),
    handleReply: new Array(),
    umessage: new Array(), // Khởi tạo umessage ở đây
    money: new Array(),
    message: new Array(),
    unsend: new Array(),
    shortcut: new Array(),
    QTV: new Array(),
    QTVOL: new Array(),
    tempMail: new Array(),
    userCM: new Array(),
    coinMaster: new Array(),
    userLevel: new Array(),
    dataLevel: new Array(),
    Ban: new Array(),
    botTime: new Array(),
    crypto: new Array,
    onload: new Array()
  }



const handlers = ['handlerCommand', 'handlerEvent'];

handlers.forEach(handler => {
    // code sử dụng biến handler
    require(`${__dirname}/core/${handler}`)(client);
  
});


login(loginPath, (err, api) => {
    if(err) return console.error(err);
    
    require(`${__dirname}/core/listen`) (api, client);

    
});