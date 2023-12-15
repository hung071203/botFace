module.exports.config = {
    name: "cuop",
    version: "1.0.0",
    credits: "Ralph",
    description: "Cướp tiền của 1 người dùng bất kì",
    usage: "!cuop [stk(nếu cần)]",
  };
  
  
module.exports.run = async function (api, event, args, client) {
    let arr =[];
    for (let i = 0; i < client.money.length; i++) {
        if (event.threadID == client.money[i].threadID&&event.senderID != client.money[i].ID) {
            arr.push(client.money[i])
        }
        
    }
    const rd = Math.floor(Math.random() * arr.length);
    const id = client.money.find(item => item.ID == event.senderID && item.threadID == event.threadID);
    if (id.time != 0 && id.time + 5*60*1000 > event.timestamp) {
        var date = new Date(id.time + 5*60*1000);
        
        var localeDate = date.toLocaleString('vi-VN', {timeZone: 'Asia/Ho_Chi_Minh'});
        api.sendMessage(`Vui lòng đợi đến ${localeDate} để có thể cướp tiền!`, event.threadID, event.messageID);
        return;
    }
    if (!id) {
        api.sendMessage('Có lỗi xảy ra, thử lại', event.threadID, event.messageID);
        return;
    }

    if (args.length < 2) {
      
        api.sendMessage(`Bạn đã cướp ${(arr[rd].money * 0.1).toLocaleString('en-US')}$ từ ${arr[rd].name}`, event.threadID, event.messageID);
        id.money += arr[rd].money * 0.1;
        if (event.senderID != process.env.ADMIN) {
            id.time = parseInt(event.timestamp);
        }
        
        for (let i = 0; i < client.money.length; i++) {
            if (arr[rd].threadID == client.money[i].threadID && arr[rd].ID == client.money[i].ID) {
                client.money[i].money -= arr[rd].money * 0.1;
            }
            
        }
    }else{
        const c = Math.floor(Math.random() * 20);
        const cu = client.money.find(item => item.ID == args[1] && item.threadID == event.threadID);
        if (!cu) {
            api.sendMessage('Người dùng không tồn tại', event.threadID, event.messageID);

        }else{
            if (c == 2) {
                api.sendMessage(`Bạn đã cướp ${(cu.money * 0.3).toLocaleString('en-US')}$ từ ${arr[rd].name}`, event.threadID, event.messageID);
                id.money += cu.money * 0.3;
                if (event.senderID != process.env.ADMIN) {
                    id.time = parseInt(event.timestamp);
                }
                cu.money -= cu.money * 0.3;
            }else{
                api.sendMessage('Bạn đen rồi, thử lại', event.threadID, event.messageID);
                if (event.senderID != process.env.ADMIN) {
                    id.time = parseInt(event.timestamp);
                }
            }
        }
    }

}