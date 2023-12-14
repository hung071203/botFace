const puppeteer = require('puppeteer');
let fs = require('fs');

const path = require('path');
const axios = require('axios');

module.exports.config = {
    name: 'checknoti',
    version: '1.0.0',
    credit: 'HungDz',
    description: 'checkNoti!',
    usage: ''
}



module.exports.run = async function (api, event, args, client) {
    // Hàm được thực thi khi sự kiện xảy ra
    if (!event) {
        return;
    }
    if (event.type == 'message') {
        
        const inputURL = event.body.toLowerCase(); // Giả sử args[0] là đường dẫn cần kiểm tra
        console.log(inputURL);
        const chui = [
            "Bố mẹ đẻ ra để m chửi bậy thế à?",
            "Chửi ít thôi",
            "M là thánh chửi à, chửi ít thôi",
            "để t tụng kinh niệm phật cho m nhá, khẩu nghiệp ít thôi",
            "nói tiếng người đi bạn",
            "Chửi bậy là một biểu hiện của sự vô học"
        ]
        const pipi = [
            "đi đi không tiễn ಥ_ಥ",
            "kut nhanh",
            "Ra đi thanh 👍",
            "Paipai",
            "biến nhanh",
            "ò, kut:)))"
        ]
        const i = Math.floor(Math.random() * 6);
        if (event.senderID == process.env.ADMIN) {
            
        }else{
            if (inputURL.includes('bot')) {
                api.sendMessage('Tag cc j?', event.threadID, event.messageID);
              } 
              if (inputURL.includes('dm') || inputURL.includes('chó') || inputURL.includes('lồn') || inputURL.includes('lon') || inputURL.includes(' cc') || inputURL.includes('dit') || inputURL.includes('địt') || inputURL.includes('cm') || inputURL.includes('lol') || inputURL.includes('dell') || inputURL.includes('đéo') ) {
                api.sendMessage(chui[i], event.threadID, event.messageID);
      
              }
              
              if (inputURL.includes('pp')) {
                api.sendMessage(pipi[i], event.threadID, event.messageID);
      
              }
        }
        
    }
}
