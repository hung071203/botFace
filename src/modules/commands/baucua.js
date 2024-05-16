const request = require('request');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

module.exports.config = {
    name: "baucua",
    version: "1.0.0",
    credits: "Ralph",
    description: "Kiếm tiền",
    tag: 'game',
    usage: "!baucua [bau(b), cua(c), tom(t), ca(ca), nai(n), ga(g)] [tiền cược]",
};
  
  
module.exports.run = async function (api, event, args, client) {
    const imgtx = [
        path.join(__dirname, '..','..','img','baucua','bau.png'),
        path.join(__dirname, '..','..','img','baucua','cua.jpg'),
        path.join(__dirname, '..','..','img','baucua','tom.jpg'),
        path.join(__dirname, '..','..','img','baucua','ca.jpg'),
        path.join(__dirname, '..','..','img','baucua','ga.jpg'),
        path.join(__dirname, '..','..','img','baucua','nai.png'),

    ];

    const r1 = Math.floor(Math.random() * 6);
    const r2 = Math.floor(Math.random() * 6);
    const r3 = Math.floor(Math.random() * 6);
    const imagePaths =[];
    imagePaths.push(imgtx[r1]);
    imagePaths.push(imgtx[r2]);
    imagePaths.push(imgtx[r3]);
    const n1 = convertToBauCua(r1);
    const n2 = convertToBauCua(r2);
    const n3 = convertToBauCua(r3);

    const a1 = cvtoBC(r1);
    const a2 = cvtoBC(r2);
    const a3 = cvtoBC(r3);
    let mn = 0;
    
    
    const id = client.money.find(item => item.ID == event.senderID && item.threadID == event.threadID);


    if (args.length != 3 || (args.length == 3 && isNaN(args[2]))) {
        api.sendMessage(`Cú pháp không hợp lệ!`, event.threadID, event.messageID);
        return;
    }
    const re = convertToBauCuaName(args[1]);
    if (args[2] == 'allin') {
        mn = id.money;
    }else{
        
        mn = parseInt(args[2]);
    }
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
        if (re == n1) {
            id.money +=(mn * 3);
            const msg = {
                body: `Ra 3 con ${a1}\n Bạn nhận được ${(mn * 3).toLocaleString('en-US')}$`,
                attachment: imagePaths.map(path => fs.createReadStream(path))
            }
            
            
            api.sendMessage(msg, event.threadID, event.messageID);
        }else{
            id.money -=(mn);
            const msg = {
                body: `Ra 3 con ${a1}\n Bạn mất ${(mn).toLocaleString('en-US')}$`,
                attachment: imagePaths.map(path => fs.createReadStream(path))
            }
            
            
            api.sendMessage(msg, event.threadID, event.messageID);
        }
    }else{
        let c1 =false,
            c2 = false,
            c3 = false;
        if (re == n1) {
            c1 =true;
        }
        if (re == n2) {
            c2 =true;
        }
        if (re == n3) {
            c3 =true;
        }
        if ((c1&&c2 || c2&&c3 || c3&&c1)) {
            id.money +=(mn * 2);
            const msg = {
                body: `Kết quả: ${a1}, ${a2}, ${a3}\n Bạn nhận được ${(mn * 2).toLocaleString('en-US')}$`,
                attachment: imagePaths.map(path => fs.createReadStream(path))
            }
            
            
            api.sendMessage(msg, event.threadID, event.messageID);
        }else if (c1 || c2 || c3) {
            id.money +=(mn * 1);
            const msg = {
                body: `Kết quả: ${a1}, ${a2}, ${a3}\n Bạn nhận được ${(mn * 1).toLocaleString('en-US')}$`,
                attachment: imagePaths.map(path => fs.createReadStream(path))
            }
            
            
            api.sendMessage(msg, event.threadID, event.messageID);
        }else{
            id.money -=(mn);
            const msg = {
                body: `Kết quả: ${a1}, ${a2}, ${a3}\n Bạn mất ${(mn).toLocaleString('en-US')}$`,
                attachment: imagePaths.map(path => fs.createReadStream(path))
            }
            
            
            api.sendMessage(msg, event.threadID, event.messageID);
        }
        
    }
}

function convertToBauCua(number) {
    switch (number) {
        case 0:
            return 'bau';
        case 1:
            return 'cua';
        case 2:
            return 'tom';
        case 3:
            return 'ca';
        case 4:
            return 'ga';
        case 5:
            return 'nai';
        default:
            return ''; // Trong trường hợp số không nằm trong khoảng từ 0 đến 5
    }
}

function cvtoBC(number) {
    switch (number) {
        case 0:
            return 'bầu';
        case 1:
            return 'cua';
        case 2:
            return 'tôm';
        case 3:
            return 'cá';
        case 4:
            return 'gà';
        case 5:
            return 'nai';
        default:
            return ''; // Trong trường hợp số không nằm trong khoảng từ 0 đến 5
    }
}

function convertToBauCuaName(letter) {
    const mapping = {
        'b': 'bau',
        'c': 'cua',
        't': 'tom',
        'ca': 'ca',
        'n': 'nai',
        'g': 'ga',
    };

    const lowerCaseLetter = letter.toLowerCase();
    return mapping[lowerCaseLetter] || ''; // Trả về tên tương ứng hoặc chuỗi trống nếu không tìm thấy
}