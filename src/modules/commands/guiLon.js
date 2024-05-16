module.exports.config = {
    name: "gui",
    version: "1.0.0",
    credits: "Ralph",
    description: "Gửi lợn",
    tag: 'Money',
    usage: "!gui [so tien]",
};
  
  
module.exports.run = async function (api, event, args, client) {
    if (args.length == 1 || isNaN(args[1]) || args.length > 2) {
        api.sendMessage('cú pháp không hợp lệ', event.threadID, event.messageID);
        return;
    }
    mn = parseInt(args[1]);
    if(mn < 0) return api.sendMessage('cú pháp k hợp lệ, số tiền k được âm', event.threadID, event.messageID);
    const id = client.money.find(item => item.ID == event.senderID && item.threadID == event.threadID);
    if (mn>id.money) {
        api.sendMessage('Bạn không đủ tiền', event.threadID, event.messageID);
        return;
    }
    id.moneyL += mn;
    id.money -= mn;
    if (id.timeL == 0) {
        id.timeL = parseInt(event.timestamp);
    }
    
    api.sendMessage(`Bạn đã gửi ${mn.toLocaleString('en-US')}$ với lãi suất 7%/day`, event.threadID, event.messageID);

}