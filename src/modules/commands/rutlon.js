module.exports.config = {
    name: "rut",
    version: "1.0.0",
    credits: "Ralph",
    description: "Thanh toan khoan vay",
    tag: 'Money',
    usage: "!rut [so tien]",
};
  
  
module.exports.run = async function (api, event, args, client) {
    const id = client.money.find(item => item.ID == event.senderID && item.threadID == event.threadID);
    if(id.moneyL <= 0){
        api.sendMessage('không đủ tiền để rút!', event.threadID, event.messageID);
        id.moneyL = 0;
        return;
    }
    money = 0
    if (isNaN(args[1]) && args[1] == 'all') {
        money = id.moneyL
        id.money += id.moneyL;
        id.moneyL = 0;
        id.timeL =0;
    }else if (!isNaN(args[1])) {
        if(id.moneyL < parseInt(args[1])) return api.sendMessage('không đủ tiền để rút!', event.threadID, event.messageID);
        money = parseInt(args[1])
        id.moneyL -= parseInt(args[1]);
        id.money += parseInt(args[1]);
        id.timeL = parseInt(event.timestamp);
    }else{
        api.sendMessage('Cú pháp không hợp lệ!', event.threadID, event.messageID);
        return;
    }
    
    api.sendMessage(`Bạn đã rút ${money.toLocaleString('en-US')}$`, event.threadID, event.messageID);
    
    
    
    
}