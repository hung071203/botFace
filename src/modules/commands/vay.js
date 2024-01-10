module.exports.config = {
    name: "vay",
    version: "1.0.0",
    credits: "Ralph",
    description: "Vay tiền(10%/1h)",
    tag: 'Money',
    usage: "!vay [số tiền không quá 500k$]",
};
  
  
module.exports.run = async function (api, event, args, client) {
    const id = client.money.find(item => item.ID == event.senderID && item.threadID == event.threadID);
    if (id.money > 150) {
        api.sendMessage('Bạn không đủ điều kiện để thực hiện hành động này', event.threadID, event.messageID);
        return;
    }
    if (id.moneyV > 1000000) {
        api.sendMessage(`Vui lòng thanh toán ${id.moneyV.toLocaleString('en-US')}$ trước khi vay thêm!`, event.threadID, event.messageID);
        return;
    }
    if (args.length == 1 ) {
        id.money += 250000;
        id.moneyV += 250000;
        
        api.sendMessage('Bạn đã vay 250,0000$ với lãi suất 10%/1h', event.threadID, event.messageID);
        return;
    }
    if (args[1] > 500000 || isNaN(args[1])) {
        api.sendMessage(`Số tiền không hợp lệ!`, event.threadID, event.messageID);
        return;
    }
    id.money += parseInt(args[1]);
    id.moneyV += parseInt(args[1]);
    api.sendMessage(`Bạn đã vay ${id.moneyV.toLocaleString('en-US')}$ với lãi suất 10%/1h`, event.threadID, event.messageID);
    
}