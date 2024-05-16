const request = require('request');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

let players = []

module.exports.config = {
    name: "taixiu",
    version: "1.0.0",
    credits: "Ralph",
    description: "Tài xỉu nhiều người chơi",
    tag: 'game',
    usage: "!taixiu [join [t/x] [Mức tiền cược]: tham gia phòng /out: rời phòng /run: Bắt đầu ]",
};
  
  
module.exports.run = async function (api, event, args, client) {
    let find = client.handleReply.find(item => item.name == this.config.name && event.threadID == item.threadID)
    if(find) return api.sendMessage('Nhóm này đã tạo bàn!', event.threadID, event.messageID)
    api.sendMessage('Tạo bàn thành công!\njoin [t/x] [số tiền cược]: Tham gia\nout: Rời phòng\nrun: bắt đầu\nback: Hủy phòng', event.threadID, (err, data) => {
        if(err) return console.log(err)
        client.handleReply.push({
            name: this.config.name,
            messageID: data.messageID,
            threadID: data.threadID,

        })
    })
}

module.exports.handleReply = async function (api, event, client, hdr) {
    if(event.threadID != hdr.threadID) return
    if(!event.body) return
    const args = (event.body.toLowerCase()).trim().split(' ');
    let findP = players.find(item => event.threadID == item.threadID && item.ID == event.senderID)
    let userMN = client.money.find(item => item.ID == event.senderID && item.threadID == event.threadID)
    let checkPs = players.filter(item => item.threadID == event.threadID)
    switch (args[0]) {
        case 'join':
            if(args.length != 3) return api.sendMessage('Tin nhắn sai cú pháp, join [t/x] [số tiền cược] để tham gia', event.threadID, event.messageID)
            if(!userMN) return  api.sendMessage('Đọc thông tin tk bạn bị lỗi, thử lại sau', event.threadID, event.messageID)
                let mn = 0
            if(isNaN(args[2])){
                if(args[2] != 'allin') return api.sendMessage('Số tiền phải là 1 con số, hoặc allin đề tất tay!', event.threadID, event.messageID)

                mn = userMN.money
            }
            mn = parseFloat(args[2])
            if(userMN.money < mn || mn < 0) return api.sendMessage('Bạn không đủ tiền trong TK', event.threadID, event.messageID)
            
            if(args[1] == 't' || args[1] == 'x'){
                let tx = ''
                if(args[1] == 't'){
                    tx = 'tài'
                }else{
                    tx = 'xỉu'
                }
                if(!findP){
                    players.push({
                        ID: event.senderID,
                        threadID: event.threadID,
                        tx: args[1],
                        money: mn
                    })
                    
                    
                    api.sendMessage(`🎄Tham gia bàn cược thành công\n🎭Bạn cược ${tx}\n💵Mức cược: ${mn.toLocaleString('en-US')} $`, event.threadID, event.messageID)
                }else{
                    findP.tx = args[1]
                    findP.money = mn
                    api.sendMessage(`🎄Cập nhật bàn cược thành công\n🎭Bạn cược ${tx}\n💵Mức cược: ${mn.toLocaleString('en-US')} $`, event.threadID, event.messageID)
                }
            }
            
            break;
        case 'out':
            if(!findP) return api.sendMessage('Bạn chưa tham gia bàn cược nào', event.threadID, event.messageID)
            players = players.filter(item => item.ID != event.senderID && item.threadID != event.threadID)
            
            api.sendMessage(`Rời bàn cược thành công, số người tham gia hiện tại ${checkPs.length}`, event.threadID, event.messageID)
            break;
        case 'back':
            api.sendMessage(`Hủy bàn thành công!`, event.threadID, event.messageID)
            players = players.filter(item => item.threadID != event.threadID)
            api.unsendMessage(hdr.messageID);
            client.handleReply = client.handleReply.filter(item => item.name != this.config.name && event.threadID == item.threadID);
            break;
        case 'run':
            if(checkPs.length == 0) return api.sendMessage(`Cần tối thiểu 1 người để tham gia!`, event.threadID, event.messageID)
            const imgtx = [
                path.join(__dirname, '..','..','img','tx','mot.jpg'),
                path.join(__dirname, '..','..','img','tx','hai.jpg'),
                path.join(__dirname, '..','..','img','tx','ba.jpg'),
                path.join(__dirname, '..','..','img','tx','bon.jpg'),
                path.join(__dirname, '..','..','img','tx','nam.jpg'),
                path.join(__dirname, '..','..','img','tx','sau.jpg'),
        
            ];
        
            const r1 = Math.floor(Math.random() * 6) + 1;
            const r2 = Math.floor(Math.random() * 6) + 1;
            const r3 = Math.floor(Math.random() * 6) + 1;
            const imagePaths =[];
            imagePaths.push(imgtx[r1-1]);
            imagePaths.push(imgtx[r2-1]);
            imagePaths.push(imgtx[r3-1]);

            if (r1 == r2 && r2 == r3) {
                let msg = `chúc mừng các bạn ra bộ ba số ${r1}\n\n`
                checkPs.forEach(e =>{
                    let find = client.money.find(item => item.ID == e.ID && item.threadID == e.threadID)
                    find.money += e.money * 10
                    msg += `${find.name} nhận ${(e.money * 10).toLocaleString('en-US') }$\n`
                })
                const msgs = {
                    body: msg,
                    attachment: imagePaths.map(path => fs.createReadStream(path))
                }
                
                
                api.sendMessage(msgs, event.threadID, event.messageID);
            }else{
                const sum = r1+r2+r3
                let checkTX = 'Tài'
                let taixiu = 't'
                if(sum >= 4 && sum <= 10){
                    taixiu = 'x'
                    checkTX = 'Xỉu'
                }
                let msg = `Tổng: ${r1+r2+r3}\nKết quả: ${checkTX} \n\n`
                checkPs.forEach(e =>{
                    
                    msg += checkTXiu(client, taixiu, checkTX, e)
                })

                const msgs = {
                    body: msg,
                    attachment: imagePaths.map(path => fs.createReadStream(path))
                }
                
                
                api.sendMessage(msgs, event.threadID, event.messageID);
            }

            players = players.filter(item => item.threadID != event.threadID)
            api.unsendMessage(hdr.messageID);
            client.handleReply = client.handleReply.filter(item => item.name != this.config.name && event.threadID == item.threadID);
            break
        default:
            break;
    }
}
function checkTXiu(client, taixiu, checkTX, e){
    let find = client.money.find(item => item.ID == e.ID && item.threadID == e.threadID)
    if(e.tx != taixiu){
        find.money -= e.money
        return `${find.name} mất ${e.money.toLocaleString('en-US')}$\n`
    }else{
        find.money += e.money
        return `${find.name} nhận thêm ${e.money.toLocaleString('en-US')}$\n`
    }
}