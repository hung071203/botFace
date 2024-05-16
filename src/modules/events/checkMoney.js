const { log } = require('console');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', '..', 'savefile', 'money.json');
let checkR = 0;

module.exports.config = {
    name: 'money',
    version: '1.0.0',
    credit: 'HungDz',
    description: 'Noti!',
    usage: ''
}

module.exports.run = function (api, event, client) {

    
    
    const botID = api.getCurrentUserID();
    if (event) {
        
       if (checkR == 0) {
            try {
                const duLieuHienTaiJSON = fs.readFileSync(filePath, 'utf8');
                client.money = JSON.parse(duLieuHienTaiJSON, function(key, value) {
                    if (value === null) {
                      return Infinity;
                    }
                    return value;
                });
            } catch (err) {
                console.error('Lỗi khi đọc money file:', err);
            }
            checkR = 1;
        }

        if (!event.threadID) {
            return;
        }
        if(!event.senderID) return
        if(!event.timestamp) return;

        if (event.type == 'message' || event.type == 'message_reply') {
                
            const mID = event.senderID;
            if(mID == botID) return
            const id = client.money.find(item => item.ID == mID && item.threadID == event.threadID);
            if (!id) {
                api.getUserInfo(mID, (err, userInfo) => {
                    if(err) return console.log(err.error);
                    
                    client.money.push({
                        name: userInfo[mID].name,
                        ID: mID,
                        threadID: event.threadID,
                        money: 0,
                        moneyV: 0,
                        moneyL: 0,
                        timeL: parseInt(event.timestamp),
                        timeV: parseInt(event.timestamp),
                        time: parseInt(event.timestamp),
                        crypto: []
                    });
                })
            }
            if (id) {
                id.money += 1
                if (id.money < 0) {
                    id.money = 0
                }
                if(isNaN(id.money)) {
                    id.money = 0
                }
                if (id.timeV == 0) {
                    
                    id.timeV = parseInt(event.timestamp);
                    // id.timeV = 0;
                }
                if (id.moneyV > 9999999 && id.money > 0) {
                    let a = id.money;
                    if (id.money > id.moneyV) {
                        a= id.money - id.moneyV + 9999999;
                        id.money = a;
                        id.moneyV = 9999999;
                        
                    }else{
                        id.moneyV -= id.money;
                        id.money = 0;
                    }

                    
                    api.sendMessage(`Số nợ của người dùng ${id.name} vượt quá 9,999,999$, Nợ sẽ tự động được thanh toán.\nTKC trừ ${a.toLocaleString('en-US')}$\nSố nợ hiện tại: ${id.moneyV.toLocaleString('en-US')}$`, event.threadID, event.messageID);
                }
            }
            
            fs.writeFile(filePath + '.tmp', JSON.stringify(client.money, null, 2), { encoding: 'utf8' }, (err) => {
                if (err) {
                    console.error('Lỗi khi lưu tien file:', err);
                } else {
                    fs.rename(filePath + '.tmp', filePath, (err) => {
                        if (err) {
                            console.error('Lỗi khi đổi tên file:', err);
                        }
                    });
                }
            });
            
        }
    }
   
}