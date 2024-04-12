module.exports.config = {
    name: "crypto",
    version: "1.0.0",
    credits: "Ralph",
    description: "May rủi với tiền điện tử",
    tag: 'Money',
    usage: "!crypto [show/buy/sell]",
  };
  
  
module.exports.run = async function (api, event, args, client) {
    
    switch (args[1]) {
        case 'show':
            let msg = 'Thông tin giá trị các đồng coin hiện tại!\n---------------------------------------------------------\n'
            client.crypto.forEach((element, i) => {
                msg += `Số thứ tự: ${i + 1}\nTên đồng coin: ${element.name}\nGiá hiện tại: ${element.price}$\n---------------------------------------------------------\n`
            });
            api.sendMessage(msg, event.threadID, event.messageID)
            break;
        case 'buy':
            let arrC = client.crypto
            let msgs = 'Trả lời tin nhắn bằng ID đồng coin và số tiền bỏ ra để mua, tối thiểu 1$\nVí dụ: 1 100\n---------------------------------------------------------\n'
            arrC.forEach((element, i) => {
                msgs += `Số thứ tự: ${i + 1}\nTên đồng coin: ${element.name}\nGiá hiện tại: ${element.price}$\n---------------------------------------------------------\n`

            });
            api.sendMessage(msgs, event.threadID, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                
                client.handleReply.push({
                    type: 'buy',
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    crypto: arrC
                })
            }
            }, event.messageID)
            break;
        
        case 'sell':
            let check = client.money.find(item => item.ID == event.senderID && event.threadID == item.threadID)
            if(!check) return api.sendMessage('Thử lại sau!', event.threadID, event.messageID)
            if(check.crypto.length == 0) return api.sendMessage('Bạn chưa mua tiền ảo!', event.threadID, event.messageID)
            
            let mss = 'Trả lời tin nhắn bằng ID đồng coin và số coin bỏ ra để bán\nVí dụ: 1 0.1(hoặc all để bán hết)\n-------------------------------------------------------\n'
            let checkNum = 0
            check.crypto.forEach((element, i) => {
                mss += `Số thứ tự: ${i + 1}\nTên đồng coin: ${element.name}\nSố lượng hiện có: ${element.amount}$\n---------------------------------------------------------\n`

                if(element.amount == 0) checkNum ++
            });
            if(checkNum == check.crypto.length) return api.sendMessage('Rỗng túi rồi, định bán gì nữa', event.threadID, event.messageID)
            api.sendMessage(mss, event.threadID, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                
                client.handleReply.push({
                    type: 'sell',
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    crypto: check.crypto
                })
            }
            }, event.messageID)
            break;
        default:
            api.sendMessage('Cú pháp không hợp lệ!', event.threadID, event.messageID)
            break;
    }
}

module.exports.handleReply = async function (api, event, client, hdr) {
    if(!event) return;
    if(event.type != 'message_reply') return;
    let check = hdr
    if(check.author != event.senderID) return;
    if(check.messageID != event.messageReply.messageID) return
     
    switch (check.type) {
        case 'buy':
            const args = event.body.trim().split(' ')
            if(args.length < 2) return api.sendMessage('Cú pháp không hợp lệ, nhập số tt coin trước rồi đến số tiền bạn bỏ ra để mua!', event.threadID, event.messageID)
            if(isNaN(args[1]) || isNaN(args[0])) return api.sendMessage('Số tiền/ID phải là một con số!', event.threadID, event.messageID)
            if(args[0] < 1 || args[0] > check.crypto.length) {
                client.handleReply = client.handleReply.filter(item =>item.messageID != event.messageReply.messageID);
                api.unsendMessage(event.messageReply.messageID);
                return api.sendMessage('ID đồng coin không hợp lệ, hủy giao dịch!', event.threadID, event.messageID)
            }
            let checkM = client.money.find(item => item.ID == event.senderID && event.threadID == item.threadID)
            if(!checkM) return api.sendMessage('Bnaj chưa có tài khoản, thử lại sau!', event.threadID, event.messageID)
            if(args[1] < 1) return api.sendMessage('Cần tối thiểu 1 đô!', event.threadID, event.messageID)
            if(checkM.money < args[1]) return api.sendMessage('Bạn không đủ tiền!', event.threadID, event.messageID)
            checkM.money -= parseFloat(args[1])
            let checkC = checkM.crypto.find(item => item.name == check.crypto[parseInt(args[0]) - 1].name)
            if(!checkC){
                checkM.crypto.push({
                    name: check.crypto[parseInt(args[0]) - 1].name,
                    price: check.crypto[parseInt(args[0]) - 1].price,
                    amount: parseFloat(args[1]) / check.crypto[parseInt(args[0]) - 1].price
                })
            }else{
                checkC.amount += parseFloat(args[1]) / check.crypto[parseInt(args[0]) - 1].price
            }
            
            client.handleReply = client.handleReply.filter(item =>item.messageID != event.messageReply.messageID);
            api.unsendMessage(event.messageReply.messageID);
            api.sendMessage('Giao dịch thành công!', event.threadID, event.messageID)
            break;
        case 'sell':
            const arg = event.body.trim().split(' ')
            if(arg.length < 2) return api.sendMessage('Cú pháp không hợp lệ, nhập số tt coin trước rồi đến số coin bạn bỏ ra để bán!', event.threadID, event.messageID)
            if(isNaN(arg[0])) return api.sendMessage('ID phải là một con số!', event.threadID, event.messageID)
            if(arg[0] < 1 || arg[0] > check.crypto.length) {
                client.handleReply = client.handleReply.filter(item =>item.messageID != event.messageReply.messageID);
                api.unsendMessage(event.messageReply.messageID);
                return api.sendMessage('ID đồng coin không hợp lệ, hủy giao dịch!', event.threadID, event.messageID)
            }
            let numCoin = 0
            
            let userM = client.money.find(item => item.ID == event.senderID && event.threadID == item.threadID)
            if(!userM) return api.sendMessage('Bnaj chưa có tài khoản, thử lại sau!', event.threadID, event.messageID)
            if(isNaN(arg[1])){
                if(arg[1] == 'all'){
                    numCoin = userM.crypto[parseInt(arg[0]) - 1].amount
                }else{
                    return api.sendMessage('số coin k hợp lệ!', event.threadID, event.messageID)
                }
            }else{
                numCoin = parseFloat(arg[1])
            }
            if(numCoin < 0) return api.sendMessage('Hack nhau à:)))', event.threadID, event.messageID)
            if(userM.crypto[parseInt(arg[0]) - 1].amount < numCoin) return api.sendMessage('Bạn không đủ coin!', event.threadID, event.messageID)
            let findC = client.crypto.find(item => item.name == userM.crypto[parseInt(arg[0]) - 1].name)
            if(!findC) return api.sendMessage('Không tìm thấy đồng coin bạn muốn bán trên sàn!', event.threadID, event.messageID)
            userM.crypto[parseInt(arg[0]) - 1].amount -= numCoin
            userM.money += numCoin * findC.price
            api.sendMessage('Giao dịch thành công!', event.threadID, event.messageID)
            break;
        default:
            break;
    }
}