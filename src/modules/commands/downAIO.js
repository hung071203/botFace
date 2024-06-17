const CryptoJS = require('crypto-js');
const axios = require('axios');

module.exports.config = {
    name: "down",
    version: "1.0.0",
    credits: "Ralph",
    description: "Hỗ trợ tải video từ nhiều trang web, !down help để biết chi tiết",
    tag: 'Công cụ',
    usage: "!down [link]",
};
const ke = {
    J2DOWN_SECRET: 'U2FsdGVkX19k5otQh93hNm2YuT6PU7O7fL4ofKNVTFWIvpABfxLh93IuUk0mQn6s'
};
  
module.exports.run = async function (api, event, args, client) {
    if(args[1] == 'help') return api.sendMessage('hỗ trợ tải video, hình ảnh được chia sẻ từ Tiktok, Douyin, Capcut, Threads, Instagram, Facebook, Espn, Kuaishou, Pinterest, imdb, imgur, ifunny, Izlesene, Reddit, Youtube, Twitter, Vimeo, Snapchat, Bilibili, Dailymotion, Sharechat, Linkedin, Tumblr, Hipi, Telegram, Getstickerpack, Bitchute, Febspot, 9GAG, oke.ru, Rumble, Streamable, Ted, SohuTv, Xvideos, Xnxx, Xiaohongshu, Weibo, Miaopai, Meipai, Xiaoying, National Video, Yingke, Soundcloud, Mixcloud, Spotify, Zingmp3, Bandcamp.', event.threadID, event.messageID)
    
    api.sendMessage('Gửi đường dẫn là được ', event.threadID, event.messageID);
};

module.exports.handleEvent = async function (api, event, client) {
    if(!event.body) return
    const url = event.body
    const isURL = /^http(|s):\/\//.test(url);

    if (!isURL) return
    if(/instagram\.com/.test(url) || /facebook\.com/.test(url) || /pinterest\.com/.test(url) || /soundcloud\.com/.test(url) || /pin\.it/.test(url) || /capcut\.com/.test(url) || /spotify\.com/.test(url)) {
        const encryptor = new MyEncryptor();
        const encryptedUri = encryptor.getUri(url);

        try {
            const response = await axios.post('https://api.zm.io.vn/v1/social/autolink', {
                data: encryptedUri
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    token: "eyJ0eXAiOiJqd3QiLCJhbGciOiJIUzI1NiJ9.eyJxxx",
                    apikey: "manhdeptraicogisai"
                }
            });

            console.log('Response:', response.data);
            const data = response.data;
            if(data.duration){
                if(data.duration > 300000) return api.sendMessage('kích thước quá lớn, hủy gửi!', event.threadID, event.messageID)
            }
            
            let msgs = `${data.title}\n${data.url}\n${data.author}`
            api.sendMessage(JSON.stringify(data, null, 4), event.threadID, event.messageID)
            
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
        }
    }

    
}

class MyEncryptor {
    
    secretKey() {
        const decrypted = CryptoJS.AES.decrypt(ke.J2DOWN_SECRET, 'manhg-api');
        return decrypted.toString(CryptoJS.enc.Utf8);
    }

    getUri(url) {
        const data = {
            url: url,
            unlock: true
        };
        const secretKey = this.secretKey();
        const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
        return encrypted;
    }
}