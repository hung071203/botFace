const axios = require('axios');
const qs = require('qs');

module.exports.config = {
    name: 'bot',
    version: '1.0.0',
    credit: 'YourName',
    description: ' Tự trò chuyện',
    usage: 'bot'
};

module.exports.run = async function (api, event, args, client) {
    let msg = ''
    let find = client.QTVOL.find(e => e.threadID == event.threadID)
    if(!checkBotRep(event.threadID, client)) {
        
        if(!find) {
            msg = 'Lỗi k xác định, thử lại!'
        }else{
            find.botRep = true
            msg = 'Đã bật auto rep!'
        }
    }else{
        if(!find) {
            msg = 'Lỗi k xác định, thử lại!'
        }else{
            find.botRep = true
            msg = 'Đã tắt auto rep!'
        }
    }
    api.sendMessage(msg, event.threadID, event.messageID);
}

module.exports.handleEvent = function (api, event, client) {
    if (event.type == 'message' || event.type == 'message_reply') {
        if(!event.body) return
        if (event.args[0].includes(process.env.PREFIX)) return;
        const inputURL = event.body.toLowerCase(); 
        if (!inputURL.includes('bot')) return;
        if (event.type == 'message_reply') {
            if(!event.messageReply) return
            let find = client.handleReply.find(item => item.messageID == event.messageReply.messageID);
            if (find) return;
        }
        if(!checkBotRep(event.threadID, client)) return
        getmsg(api, event, client);
    }
}

module.exports.handleReply = async function (api, event, client, hdr) {
    if (event.type != 'message_reply') return;
    if(!event.body) return
    if (event.args[0].includes(process.env.PREFIX)) return;
    if(!event.messageReply) return
    if (event.messageReply.messageID != hdr.messageID) return;
    if(!checkBotRep(event.threadID, client)) return
    getmsg(api, event, client);
}

function checkBotRep(threadID, client){
    let find = client.QTVOL.find(e => e.threadID == threadID && e.botRep == true)
    if(find) return true
    return false
}

function getmsg(api, event, client) {
    // const apiUrl = 'https://api.simsimi.vn/v1/simtalk';
    // const params = new URLSearchParams();
    // params.append('text', event.body);
    // params.append('lc', 'vn');
    // params.append('key', ''); // Replace with your actual API key if you have one

    // axios.post(apiUrl, params)
    // .then(response => {
    //     console.log(response.data);
    //     if (!response.data) return api.sendMessage('loi!', event.threadID, event.messageID);
        
    //     api.sendMessage(`${response.data.message}`, event.threadID, (err, info) => {
    //         if (err) return console.error(err);
    //         client.handleReply.push({
    //             type: 'sim',
    //             name: module.exports.config.name, // Sử dụng module.exports.config thay cho this.config
    //             messageID: info.messageID,
    //             author: event.senderID,
    //             timestamp: parseInt(info.timestamp)
    //         });
    //     }, event.messageID);
    // })
    // .catch(error => {
    //     console.error('Error:', error);
    //     api.sendMessage(error.message, event.threadID, event.messageID);
    // });

    const url = `https://api.sumiproject.net/sim`;
    const encodedQuestion = encodeURIComponent(event.body);

    // Tham số gửi kèm truy vấn GET
    const params = {
      type: 'ask',
      ask: encodedQuestion
    };
    
    // Gửi yêu cầu GET
    axios.get(url, { params })
    .then(response => {
        // Xử lý dữ liệu nhận được từ URL
        console.log(response.data);
        api.sendMessage(`${response.data.answer}`, event.threadID, (err, info) => {
            if (err) return console.error(err);
            client.handleReply.push({
                type: 'sim',
                name: module.exports.config.name, // Sử dụng module.exports.config thay cho this.config
                messageID: info.messageID,
                author: event.senderID,
                timestamp: parseInt(info.timestamp)
            });
        }, event.messageID);
    })
    .catch(error => {
        // Xử lý lỗi nếu có
        console.error('Đã xảy ra lỗi:', error);
        api.sendMessage(error.message, event.threadID, event.messageID);
    });
}

