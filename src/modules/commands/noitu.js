const axios = require('axios');

module.exports.config = {
    name: 'noitu',
    version: '1.0.0',
    credit: 'YourName',
    description: 'Quiz',
    tag: 'game',
    usage: '!noitu'
};

module.exports.run = async function (api, event, args, client) {
    const url = 'https://noitu.pro/init';

    try {
        // Gửi yêu cầu GET
        const response = await axios.get(url);

        // Kiểm tra mã trạng thái HTTP
        if (response.status === 200) {
            // In ra phản hồi JSON
            const data = response.data;
            if(data.error) return api.sendMessage(`Error: ${data.error}`, event.threadID, event.messageID);
            api.sendMessage(`Game nối từ bắt đầu:\n\n${data.chuan}`, event.threadID, (error, info) =>{
                if (error) return console.error(error);
                client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    threadID: event.threadID,
                    head: data.head,
                    tail: data.tail,
                    count: 0
                    
                })
            }, event.messageID);
        } else {
        console.log('Yêu cầu không thành công với mã trạng thái:', response.status);
        return api.sendMessage('Lỗi: ' + response.status, event.threadID, event.messageID);
        }
    } catch (error) {
        // Xử lý lỗi khi yêu cầu thất bại
        console.error('Đã xảy ra lỗi:', error.message);
        return api.sendMessage('Lỗi: ' + error.message, event.threadID, event.messageID);
    }
}

module.exports.handleReply = async function (api, event, client, hdr) {
    if(event.type != 'message_reply') return
    if(!event.messageReply.messageID) return
    if(hdr.messageID != event.messageReply.messageID) return
    if(hdr.author != event.senderID) return
    if(hdr.tail != event.args[0].toLowerCase()) return api.sendMessage('từ đầu tiên k hợp lệ, viết lại!', event.threadID, event.messageID)
    
    try {
        // Gửi yêu cầu GET
        const response = await axios.get(`https://noitu.pro/answer?word=${encodeURIComponent(event.body)}`);
    
        // Kiểm tra mã trạng thái HTTP
        if (response.status === 200) {
            // Lấy dữ liệu phản hồi
            const data = response.data;
            api.unsendMessage(hdr.messageID);
            client.handleReply = client.handleReply.filter((value) => value.messageID != hdr.messageID)
            if(data.win) return api.sendMessage('Chúc mừng bạn đã dành chiến thắng!', event.threadID, event.messageID);
            if(!data.success){
                
                return api.sendMessage(`Đáp án sai, số điểm của bạn là: ${hdr.count}`, event.threadID, event.messageID);
            } else{
                api.sendMessage(data.nextWord.chuan, event.threadID, (error, info) =>{
                    if (error) return console.error(error);
                    client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        threadID: event.threadID,
                        head: data.nextWord.head,
                        tail: data.nextWord.tail,
                        count: hdr.count + 1
                    })
                })
            }
        } else {
            console.log('Yêu cầu không thành công với mã trạng thái:', response.status);
            return api.sendMessage('Lỗi: ' + response.status, event.threadID, event.messageID);
        }
    } catch (error) {
    // Xử lý lỗi khi yêu cầu thất bại
    console.error('Đã xảy ra lỗi:', error.message);
    return api.sendMessage('Lỗi: ' + error.message, event.threadID, event.messageID);
    }
    
}