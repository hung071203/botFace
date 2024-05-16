const axios = require('axios');

module.exports.config = {
    name: 'smail',
    version: '1.0.0',
    credit: 'HungDz',
    description: 'Hiện tin nhắn mail ảo',
    tag: 'temp_mail',
    usage: '!smail',
};

module.exports.run = async function (api, event, args, client) {
    let check = client.tempMail.find(item => item.ID == event.senderID);
    if(!check) return api.sendMessage('Bạn chưa tạo mail ảo nào trên hệ thống, sử dụng !cmail để tạo mail ảo!', event.threadID, event.messageID)
    let arr = check.email.trim().split('@');
    console.log(arr);
    axios.get(`https://www.1secmail.com/api/v1/?action=getMessages&login=${arr[0]}&domain=${arr[1]}`)
    .then(response => {
        mails = response.data;
        msgs = `email: ${check.email}`;
        msgs += `\n`
        
        if(mails.length == 0){
            msgs += `Không có tin nhắn để hiển thị!`
        }else{
            mails.forEach(e => {
                msgs += `\n`
                msgs += `Ngày gửi: ${e.date}\n`
                msgs += `Bên gửi: ${e.from}\n`
                msgs += `Nội dung: ${e.subject}\n`
                msgs += `\n`
            });
        }
        api.sendMessage(msgs, event.threadID, event.messageID);
    })
    .catch(error => {
        console.error('Lỗi khi gửi yêu cầu:', error);
        api.sendMessage('Tính năng tạm thời không khả dụng, thử lại sau!', event.threadID, event.messageID);

    });
}