module.exports.config = {
    name: "trano",
    version: "1.0.0",
    credits: "Ralph",
    description: "Thanh toan khoan vay",
    tag: 'Money',
    usage: "!trano",
};
  
  
module.exports.run = async function (api, event, args, client) {
    const id = client.money.find(item => item.ID == event.senderID && item.threadID == event.threadID);
    if(id.moneyV <= 0){
        api.sendMessage('Có nợ đâu mà trả!', event.threadID, event.messageID);
        return;
    }
    if (id.moneyV > id.money) {
        id.moneyV -= id.money;
        id.money = 0;
        
        api.sendMessage(`Bạn còn nợ ${id.moneyV.toLocaleString('en-US')}$`, event.threadID, event.messageID);
        return;
    }
    id.money -= id.moneyV;
    id.moneyV = 0;
    api.sendMessage(`Bạn còn nợ ${id.moneyV.toLocaleString('en-US')}$\nSố tiền hiện tại: ${id.money.toLocaleString('en-US')}$`, event.threadID, event.messageID);
    
}