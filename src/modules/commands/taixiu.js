const request = require('request');
const fs = require('fs');
const path = require('path');
const axios = require('axios');


module.exports.config = {
    name: "tx",
    version: "1.0.0",
    credits: "Ralph",
    description: "Tài xỉu",
    usage: "!tx [tài(t)/xỉu(x)] [số tiền cược(>=100$)(allin nếu muốn cược toàn bộ)]",
};
  
  
module.exports.run = async function (api, event, args, client) {
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

    
    const id = client.money.find(item => item.ID == event.senderID && item.threadID == event.threadID);
    let mn = 0;
    if (args[2] == 'allin') {
        mn = id.money;
    }else{
        mn = parseInt(args[2]);
    }
    console.log(args, args.length);
    if (args.length == 3 && (args[1] == 't' || args[1] == 'x')) {
        if (mn< 100 ) {
            api.sendMessage('Tối thiểu cần 100$', event.threadID, event.messageID);
            return;
        }
        if (!id) return;
        if (id.money < mn) {
            api.sendMessage('Bạn quá nghèo để thực hiện hành động này!', event.threadID, event.messageID);
            return;
        }
        if (r1 == r2 && r2 == r3) {
            id.money +=(mn * 10);
            const msg = {
                body: `chúc mừng bạn ra bộ ba số ${r1}\nBạn nhận được ${(mn * 10).toLocaleString('en-US')}$`,
                attachment: imagePaths.map(path => fs.createReadStream(path))
            }
            
            
            api.sendMessage(msg, event.threadID, event.messageID);
                
            
        }else if ((args[1] == 't' && (r1+r2+r3>=11 &&r1+r2+r3<=17)) || (args[1] == 'x' && (r1+r2+r3>=4 &&r1+r2+r3<=10))) {
            if ((r1 == r2 &&r2 != r3) || (r1==r3 && r1 != r2) || (r2== r3 & r1!=r2)) {
                id.money +=(mn * 2);
                const msg = {
                    body: `chúc mừng bạn ra 1 cặp số giống nhau \nBạn nhận được ${(mn * 2).toLocaleString('en-US')}$`,
                    attachment: imagePaths.map(path => fs.createReadStream(path))
                }
                
                
                    api.sendMessage(msg, event.threadID, event.messageID);
                    
                
            }else{
                id.money +=mn;
                let checktx = 'Tài';
                if ((r1+r2+r3>=4 &&r1+r2+r3<=10)) {
                    checktx = 'Xỉu';
                }
                const msg = {
                    body: `Tổng: ${r1+r2+r3}\nKết quả: ${checktx} \nBạn nhận được ${(mn).toLocaleString('en-US')}$`,
                    attachment: imagePaths.map(path => fs.createReadStream(path))
                }
                
                
                    api.sendMessage(msg, event.threadID, event.messageID);
                    
                
            }
        }else{
            id.money -=mn;
            let checktx = 'Tài';
            if ((r1+r2+r3>=4 &&r1+r2+r3<=10)) {
                checktx = 'Xỉu';
            }
            const msg = {
                body: `Tổng: ${r1+r2+r3}\nKết quả: ${checktx} \nBạn mất ${(mn).toLocaleString('en-US')}$`,
                attachment: imagePaths.map(path => fs.createReadStream(path))
            }
            
            
                api.sendMessage(msg, event.threadID, event.messageID);
                
            
        }
    }else{
        api.sendMessage('Cú pháp không hợp lệ!', event.threadID, event.messageID);
 
    }

}
