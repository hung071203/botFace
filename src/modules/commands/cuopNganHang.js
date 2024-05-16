
module.exports.config = {
    name: "cuopnh",
    version: "1.0.0",
    credits: "Ralph",
    description: "Kiếm tiền",
    tag: 'game',
    usage: "!cuopnh",
};
  
let checkUser = []
module.exports.run = async function (api, event, args, client) {
    const randomNumber = Math.floor(Math.random() * 4);
    let find = client.money.find(item => item.ID == event.senderID && item.threadID == event.threadID)
    if(!find) return api.sendMessage('truy xuất thông tin người dùng thất bại!', event.threadID, event.messageID)
    let check = checkUser.find(item => item.ID == event.senderID && item.threadID == event.threadID)
    if(!check){
        checkUser.push({
            ID: event.senderID,
            threadID: event.threadID,
            timestamp: parseInt(event.timestamp) + 5 * 60 * 1000
        })
        console.log(checkUser);
    }else{
        
        if(check.timestamp > parseInt(event.timestamp)){
            const difference = check.timestamp - parseInt(event.timestamp)

            // Chia chênh lệch thành giờ, phút và giây
            const hours = Math.floor(difference / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            return api.sendMessage(`Bạn cần đợi thêm ${hours} giờ ${minutes} phút ${seconds} giây để tiếp tục cướp!`, event.threadID, event.messageID)
        }else{
            check.timestamp = parseInt(event.timestamp) + 5 * 60 * 1000
        }
    }
    const moneyC = Math.floor(Math.random() * (100000 - 10000 + 1)) + 10000;
    if(randomNumber != 1){
        const rd = Math.floor(Math.random() * 2);
        if (rd == 1) {
            find.moneyV += moneyC/2
            api.sendMessage(`Bạn đi cướp ngân hàng nhưng giữa đường bị cảnh sát tóm, Bạn bị bắt phải đút lót ${(moneyC/2).toLocaleString('en-US')}$ nếu không sẽ bị tóm và bạn đồng ý\nSố nợ hiện tại: ${find.moneyV.toLocaleString('en-US')}$`, event.threadID, event.messageID)
        }else{
            api.sendMessage(`Nay bạn chán không muốn cướp!`, event.threadID, event.messageID)

        }
        
    }else{
        
        find.money += moneyC
        api.sendMessage(`Bạn đã cướp thành công ${moneyC.toLocaleString('en-US')}$`, event.threadID, event.messageID)
    }
}