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
        const ngu = [
            'T không ngu, có m thôi!',
            '??, có m ngu',
            "Ngu sao bàng m:))",
            "fuck you🖕",
            "lol, m ngu(╬▔皿▔)╯",
            "🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕"
        ]
        const pipi = [
            "đi đi không tiễn ಥ_ಥ",
            "kut nhanh",
            "Ra đi thanh 👍",
            "Paipai",
            "biến nhanh",
            "ò, kut:)))"
        ]
        if(inputURL.includes(process.env.PREFIX)) return
        const i = Math.floor(Math.random() * 6);
        let argsAD = process.env.ADMIN.trim().split(' ');
        let checkAD = argsAD.find(item => item == event.senderID)
        if (checkAD) {
            
        }else{
            if (inputURL.includes('bot') && inputURL.includes('ngu') ) {
                api.sendMessage(ngu[i], event.threadID, event.messageID);
            }
            else if (inputURL.includes('bot')) {
                api.sendMessage('bot đây(o゜▽゜)o☆', event.threadID, event.messageID);
              } 
            //   if (inputURL.includes('dm') || inputURL.includes('chó') || inputURL.includes('lồn') || inputURL.includes('lon') || inputURL.includes(' cc') || inputURL.includes('dit') || inputURL.includes('địt') || inputURL.includes('cm') || inputURL.includes('lol') || inputURL.includes('dell') || inputURL.includes('đéo') ) {
            //     api.sendMessage(chui[i], event.threadID, event.messageID);
      
            //   }
              
              
        }
        if (inputURL.includes('pp')) {
            api.sendMessage(pipi[i], event.threadID, event.messageID);
  
        }
        
    }
}
