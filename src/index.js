require('dotenv').config();


const { readFileSync } = require("fs");
const login = require("facebook-chat-api");

loginPath = {appState: JSON.parse(readFileSync(__dirname + "/appstate.json", "utf-8"))};
loginAcc = {email: "hungng856@gmail.com", password: "hung123456"}

var client = {
    config: process.env,
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

    // api.listenMqtt((err, event) => {
    //     if (err) return console.error(err);
    //     if (event.threadID) {
    //         api.getThreadInfo(event.threadID, (err, info) => {
    //             if (err) {
    //                 console.log(err);
    //             } else {
    //                 console.log(info, event.threadID);
    //                 if (info.adminIDs.length != countAD-1) {
    //                     console.log('jdhf '+info.adminIDs.length);
    //                     countAD = info.adminIDs.length +1;
    
    //                     for (let index = 0; index < info.adminIDs.length; index++) {
    //                         client.QTV.push({
    //                             threadID: event.threadID,
    //                             adminID: info.adminIDs[index].id
    //                         })
                            
    //                     }
    //                 }
                    
                    
    //             }
        
    //         })
    //     }
        
    // });
});