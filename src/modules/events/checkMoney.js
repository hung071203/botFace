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
       
        if (!event.threadID) {
            return;
        }
        if (checkR == 0) {
            try {
                const duLieuHienTaiJSON = fs.readFileSync(filePath, 'utf8');
                client.money = JSON.parse(duLieuHienTaiJSON);
            } catch (err) {
                console.error('Lỗi khi đọc money file:', err);
            }
            checkR = 1;
        }

        

        if (event.type == 'message' || event.type == 'message_reply') {
            
        
        
            api.getThreadInfo(event.threadID, (err, info) => {
                if (err) {
                    console.log(err.error);
                } else {
                    if (info.isGroup == false) return;

                    client.money.forEach(e => {
                        if(e.threadID != event.threadID) return
                        let users = info.participantIDs;
                        if (!users.includes(e.ID)) {
                            client.money = client.money.filter(item =>item.ID != botID);
                            let money = client.money.filter(item => item.ID != e.ID && item.threadID == event.threadID)
                            client.money = client.money.filter(item =>item.threadID != event.threadID);
                            client.money.push(...money);
                        }
                    });
                        
                    for (let index = 0; index < info.participantIDs.length; index++) {
                        const mID = info.participantIDs[index];
                        api.getUserInfo(mID, (err, userInfo) => {
                            const id = client.money.find(item => item.ID == mID && item.threadID == event.threadID);
                            
                            
                            
                            if (!id) {
                                if(userInfo[mID].name == 'Người dùng Facebook' || mID == botID) return;
                                console.log('b');
                                let mn = 0;
                                
                                client.money.push({
                                    name: userInfo[mID].name,
                                    ID: mID,
                                    threadID: event.threadID,
                                    money: mn,
                                    moneyV: 0,
                                    moneyL: 0,
                                    timeL: 0,
                                    timeV: 0,
                                    time: 0
                                });
                            }
            
                            if (id) {
                                
                                if (id.timeV == 0) {
                                    if(!event.timestamp) return;
                                    id.timeV = parseInt(event.timestamp);
                                    // id.timeV = 0;
                                }
                                if (id.moneyV > 9999999999 && id.money > 0) {
                                    let a = id.money;
                                    if (id.money > id.moneyV) {
                                        a= id.money - id.moneyV + 9999999999;
                                        id.money = a;
                                        id.moneyV = 9999999999;
                                        
                                    }else{
                                        id.moneyV -= id.money;
                                        id.money = 0;
                                    }
                
                                    
                                    api.sendMessage(`Số nợ của người dùng ${id.name} vượt quá 9,999,999,999$, Nợ sẽ tự động được thanh toán.\nTKC trừ ${a.toLocaleString('en-US')}$\nSố nợ hiện tại: ${id.moneyV.toLocaleString('en-US')}$`, event.threadID, event.messageID);
                                }
                            }
                        
                            fs.writeFile(filePath, JSON.stringify(client.money, null, 2), { encoding: 'utf8', flag: 'w' }, (err) => {
                                if (err) {
                                    console.error('Lỗi khi lưu tien file:', err);
                                } else {
                                    
                                }
                            });
                        })
                        
                    } 
                    
                }

            })

            
        }
    }
   
}