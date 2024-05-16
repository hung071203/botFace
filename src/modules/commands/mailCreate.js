const axios = require('axios');

module.exports.config = {
    name: 'cmail',
    version: '1.0.0',
    credit: 'HungDz',
    description: 'Tạo mail ảo',
    tag: 'temp_mail',
    usage: '!cmail',
};

module.exports.run = async function (api, event, args, client) {
    axios.get('https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1')
    .then(response => {
        mails = response.data;
        mail = mails[0];
        console.log('Dữ liệu nhận được:', response.data, mail);

        let check = client.tempMail.find(item => item.ID == event.senderID);
        if(!check){
            client.tempMail.push({
                ID: event.senderID,
                email: mail
            })
            api.sendMessage(`email mới của bạn là: ${mail}`, event.threadID, event.messageID);
        }else{
            check.email = mail
            api.sendMessage(`email mới của bạn là: ${mail}`, event.threadID, event.messageID);
        }
    })
    .catch(error => {
        console.error('Lỗi khi gửi yêu cầu:', error);
        api.sendMessage('Tính năng tạm thời không khả dụng, thử lại sau!', event.threadID, event.messageID);

    });
}