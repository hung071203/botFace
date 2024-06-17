const axios = require('axios');
const fs = require('fs');
const path = require('path');
module.exports.config = {
    name: 'sharemdl',
    version: '1.0.0',
    credit: 'YourName',
    description: ' share mdl',
    tag: 'DEV',
    usage: '!sharemdl [Ten command] '
};


module.exports.run = async function (api, event, args, client) {
    let check = client.DEV.find(item => item == event.senderID)
    if(!check) return api.sendMessage('Bạn không thể dùng chức năng này', event.threadID, event.messageID)
    if(args.length != 3 ) return api.sendMessage('Cú pháp không hợp lệ', event.threadID, event.messageID)
    
    let content = ''
    switch (args[1]) {
        case 'commands':
            try {
                const filePath = path.join(__dirname, `${args[2]}.js`);
                content = fs.readFileSync(filePath, 'utf8');
            } catch (error) {
                return api.sendMessage('Lỗi: ' + error.message, event.threadID, event.messageID)
            }
            
            break;
    
        case 'events':
            try {
                const filePath = path.join(__dirname, '..', 'events', `${args[3]}.js`);
                content = fs.readFileSync(filePath, 'utf8');
            } catch (error) {
                return api.sendMessage('Lỗi: ' + error.message, event.threadID, event.messageID)
            }
            break;
        default:
            api.sendMessage('Cú pháp không hợp lệ, chir hỗ trợ events hoặc commands', event.threadID, event.messageID)
            break;
        
        
    }
    
    console.log(content);
    
    const data = {
        charset: "UTF-8",
        content: content,
        content_type: "application/json",
        expiration: "1day",
        secret: "123",
        status: 200
    };

    try {
        const response = await axios.post('https://api.mocky.io/api/mock', data);
        console.log('Response Status:', response.status);
        console.log('Response Data:', response.data);
        api.sendMessage(response.data.link, event.threadID, event.messageID)
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        api.sendMessage(error.message, event.threadID, event.messageID)
    }
    

}
