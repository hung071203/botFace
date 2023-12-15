const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', '..', 'savefile', 'money.json');

module.exports.config = {
    name: 'money',
    version: '1.0.0',
    credit: 'HungDz',
    description: 'Noti!',
    usage: ''
}

module.exports.run = function (api, event, client) {

    
    try {
        const duLieuHienTaiJSON = fs.readFileSync(filePath, 'utf8');
        client.money = JSON.parse(duLieuHienTaiJSON);
    } catch (err) {
        console.error('Lỗi khi đọc money file:', err);
    }
    
    if (event) {
       
        if (!event.threadID) {
            return;
        }
        

        if (event.type == 'message' || event.type == 'message_reply') {
            
        
        
            // api.getThreadInfo(event.threadID, (err, info) => {
            //     if (err) {
            //         console.log(err.error);
            //     } else {
            //         if (info.isGroup == false) return;
                    
                        
            //             for (let index = 0; index < info.participantIDs.length; index++) {
            //                 console.log(info.participantIDs[index]);
            //                 const mID = info.participantIDs[index];
            //                 api.getUserInfo(mID, (err, userInfo) => {
            //                     const id = client.money.find(item => item.ID == mID && item.threadID == info.threadID);
            //                     if (id.ID == process.env.ADMIN) {
            //                         if (id.money == 0) {
            //                             id.money = 9999999999;
            //                         }
            //                     }
                                
                                
            //                     if (!id) {
            //                         client.money.push({
            //                             name: userInfo[mID].name,
            //                             ID: mID,
            //                             threadID: info.threadID,
            //                             money: 0
            //                         });
            //                     }
                            
            //                     fs.writeFile(filePath, JSON.stringify(client.money, null, 2), { encoding: 'utf8', flag: 'w' }, (err) => {
            //                         if (err) {
            //                             console.error('Lỗi khi lưu tien file:', err);
            //                         } else {
                                        
            //                         }
            //                     });
            //                 })
            //             } 
                    
            //     }

            // })

            console.log('a'+ event + client.money);
            const mID = event.senderID;
            api.getUserInfo(mID, (err, userInfo) => {
                const id = client.money.find(item => item.ID == mID && item.threadID == event.threadID);
                
                
                
                if (!id) {
                    console.log('b');
                    let mn = 0;
                    if (mID == process.env.ADMIN) {
                        mn = 999999999;
                    }
                    client.money.push({
                        name: userInfo[mID].name,
                        ID: mID,
                        threadID: event.threadID,
                        money: mn,
                        time: 0
                    });
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
   
}