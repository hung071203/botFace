module.exports.config = {
    name: "cuop",
    version: "1.0.0",
    credits: "Ralph",
    description: "Cướp tiền của 1 người dùng bất kì",
    usage: "!cuop [stk(nếu cần)]",
  };
  
let checkArr =[];
module.exports.run = async function (api, event, args, client) {
    let arr =[];
    for (let i = 0; i < client.money.length; i++) {
        if (event.threadID == client.money[i].threadID&&event.senderID != client.money[i].ID) {
            arr.push(client.money[i])
        }
        
    }
    const rd = Math.floor(Math.random() * arr.length);
    const id = client.money.find(item => item.ID == event.senderID && item.threadID == event.threadID);
    
    if (!id) {
        api.sendMessage('Có lỗi xảy ra, thử lại', event.threadID, event.messageID);
        return;
    }
    checkArr.push({
        ID: event.senderID,
        threadID: event.threadID,
        timeST: event.timestamp
    })
    let cArr =[]
    for (let i = 0; i < checkArr.length; i++) {
        if (checkArr[i].ID == event.senderID && checkArr[i].threadID == event.threadID) {
            cArr.push(checkArr[i]);
        }
        
    }
    if (cArr[cArr.length - 1].timeST - cArr[cArr.length - 1].timeST <= 15* 60 *1000) {
        if (cArr.length >= 10) {
            if (parseInt(event.timestamp) - parseInt(cArr[9].timeST) < 3*60*1000) {
                var date = new Date(parseInt(cArr[9].timeST) + 3*60*1000);
        
                var localeDate = date.toLocaleString('vi-VN', {timeZone: 'Asia/Ho_Chi_Minh'});
                api.sendMessage(`Spam ít thôi, bạn sẽ có thể sử dụng chức năng này lúc ${localeDate}`, event.threadID, event.messageID);
                return;
            }else{
                let sarr = [];
                sarr.push(checkArr[checkArr.length -1]);
                for (let i = 0; i < checkArr.length; i++) {
                    if (checkArr[i].ID == event.senderID && checkArr[i].threadID == event.threadID) {
                        
                    }else{
                        sarr.push(checkArr[i]);
                    }
                    
                }
                checkArr.length = 0;
                checkArr = sarr;
            }
            
            
        }
    }
    

    if (args.length < 2) {
        const c = Math.floor(Math.random() * 10);
        if (c == 2) {
            id.money += arr[rd].money * 0.1;
            api.sendMessage(`Bạn đã cướp ${(arr[rd].money * 0.1).toLocaleString('en-US')}$ từ ${arr[rd].name}`, event.threadID, event.messageID);
            
            for (let i = 0; i < client.money.length; i++) {
                if (arr[rd].threadID == client.money[i].threadID && arr[rd].ID == client.money[i].ID) {
                    client.money[i].money -= arr[rd].money * 0.1;
                }
                
            }
        }else{
            api.sendMessage('Số bạn đen như chó, thử lại', event.threadID, event.messageID);
            
        }
    }else{
        const c = Math.floor(Math.random() * 15);
        const cu = client.money.find(item => item.ID == args[1] && item.threadID == event.threadID);
        if (!cu) {
            api.sendMessage('Người dùng không tồn tại', event.threadID, event.messageID);

        }else{
            if (c == 2) {
                id.money += cu.money * 0.2;
                api.sendMessage(`Bạn đã cướp ${(cu.money * 0.2).toLocaleString('en-US')}$ từ ${cu.name}`, event.threadID, event.messageID);
                
                
                cu.money -= cu.money * 0.2;
            }else{
                api.sendMessage('Số bạn đen như chó, thử lại', event.threadID, event.messageID);
                
            }
        }
    }

}