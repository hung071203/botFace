module.exports.config = {
    name: "repeat",
    version: "1.0.0",
    credits: "Ralph",
    description: "Bật tắt tính năng nhại tin nhắn ai đó!",
    usage: "!repeat [@ai đó(hoặc không tag nếu muôns nhại bạn)/off(để tắt)]",
};
  
let time = 5
module.exports.run = async function (api, event, args, client) {
    let findRepeat = client.handleReply.find(item =>item.name == this.config.name && item.threadID == event.threadID)
    if(!findRepeat){
        let victim = []
        if(Object.keys(event.mentions).length === 0){
            if(args[1] == 'all'){
                victim.push(event.threadID)
            }else if(args[1] == 'off'){
                return api.sendMessage('Lệnh chưa khởi chạy', event.threadID, event.messageID)
            }else{
                victim.push(event.senderID)
            }
            
        }else{
            victim = Object.keys(event.mentions)
        }
        client.handleReply.push({
            name: this.config.name,
            threadID: event.threadID,
            author: event.senderID,
            timestamp: event.timestamp,
            victim: victim
        })
        api.sendMessage('Nhại lại tin nhắn đã kích hoạt!', event.threadID, event.messageID)
    }else{
        if(Object.keys(event.mentions).length != 0 || args[1] != 'off') return api.sendMessage('Lệnh đang được thực thi, vui lòng hủy lệnh trước khi muốn thực hiện thêm!', event.threadID, event.messageID)
        if(findRepeat.author != event.senderID) return api.sendMessage(`Chỉ người chạy lệnh mới tắt được, hoạc bạn có thể đợi sau ${time} phút`, event.threadID, event.messageID)
        client.handleReply = client.handleReply.filter(item => item != findRepeat)
        api.sendMessage('Nhại lại tin nhắn đã dừng lại!', event.threadID, event.messageID)
    }
}

module.exports.handleReply = async function (api, event, client, hdr) {
    if(!event) return
    if(!event.body) return
    if(hdr.threadID != event.threadID) return
    
    if(parseInt(hdr.timestamp) + time * 60 * 1000 > parseInt(event.timestamp)){
        
        let check = hdr.victim.find(item => item == event.threadID)
        if(!check) {
            let checkUser = hdr.victim.find(item => item == event.senderID)
            if(!checkUser) return
        }
        api.sendMessage(event.body, event.threadID)
    }else{
        let find = client.handleReply.find(item =>item.name == this.config.name && item.threadID == event.threadID)
        client.handleReply = client.handleReply.filter(item => item != find)
        api.sendMessage('Nhại lại tin nhắn đã dừng lại do quá thơif gian!', event.threadID)
    }
    
}