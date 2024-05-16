module.exports.config = {
    name: "congphap",
    version: "1.0.0",
    credits: "Ralph",
    description: "Mua công pháp",
    tag: 'TUTIEN',
    usage: "!congphap",
  };
  
  
module.exports.run = async function (api, event, args, client) {
    let findUser = client.userLevel.find(item => item.ID == event.senderID && item.threadID == event.threadID)
    if (!findUser) return api.sendMessage('Thử lại sau', event.threadID, event.messageID)
    let getCP = client.dataLevel.tu
    let CP = getCP.filter(item => item.tu == findUser.tu)
    if(!CP) return api.sendMessage('Thử lại sau, lỗi!', event.threadID, event.messageID)
    msgs ='🎄Danh sách công pháp:🎄\n--------------------------------------------------------------------\n'
    CP.forEach(element => {
        msgs += `ID: ${element.id}\n`
        msgs += `Tên công pháp: ${element.name}\n`
        msgs += `Giải thích: ${element.des}\n`
        msgs += `Tốc độ tu luyện: +${element.power}\n`
        msgs += `Giá: ${element.price.toLocaleString('en-US')}$\n--------------------------------------------------------------------\n`
    });
    msgs += 'Đính kèm tin nhắn và chọn ID để mua, chọn số khác để hủy mua!\n'
    api.sendMessage(msgs, event.threadID,(error, info) => {
        if (error) {
            console.log(error);
        } else {
            
            client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                cp: CP
            })
             
        }
    }, event.messageID)
    

}

module.exports.handleReply = async function (api, event, client, hdr) {
    if(!event) return;
    if(event.type != 'message_reply') return;
    if(hdr.author != event.senderID) return
    if(hdr.messageID != event.messageReply.messageID) return
    let userMN = client.money.find(item => item.ID == event.senderID && item.threadID == event.threadID)
    if(!userMN) return api.sendMessage('Lỗi, vui lòng thử lại sau!', event.threadID, messageID)
    let checkbuy = hdr.cp.find(item => item.id == event.body)
    if(!checkbuy) {
        api.sendMessage('Công pháp không tồn tại, hủy giao dịch!', event.threadID, event.messageID)
    }else{
        console.log(userMN, checkbuy.price);
        if(userMN.money < checkbuy.price){
            api.sendMessage('Bạn không đủ tiền!', event.threadID, event.messageID)
        }else{
            
            let findUser = client.userLevel.find(item => item.ID == event.senderID && item.threadID == event.threadID)
            let findCP = findUser.congphap.filter(item => item.id == event.body)
            if (findCP.length >= 3) {
                api.sendMessage('Công pháp đã luyện đến tần cao nhất, không thể mua thêm!', event.threadID, event.messageID)
            }else{
                userMN.money -= checkbuy.price
                findUser.congphap.push(checkbuy)
                api.sendMessage(`Bạn đã mua thành công công pháp ${checkbuy.name}\nTốc độ tu luyện của bạn +${checkbuy.power}`, event.threadID, event.messageID)

            }
            
        }
    }
    api.unsendMessage(hdr.messageID);
    client.handleReply = client.handleReply.filter(item =>item.messageID != event.messageReply.messageID);
          
}