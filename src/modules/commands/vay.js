module.exports.config = {
    name: "vay",
    version: "1.0.0",
    credits: "Ralph",
    description: "Vay tiền(10%/1h)",
    tag: 'Money',
    usage: "!vay [số tiền]",
};
  
  
module.exports.run = async function (api, event, args, client) {
    const id = client.money.find(item => item.ID == event.senderID && item.threadID == event.threadID);
    if(args.length > 2) return api.sendMessage('Cú pháp không hợp lệ!', event.threadID, event.messageID);
    if(args[1] == 'help') return api.sendMessage('Nếu tài sản nhỏ hơn 500,000 $ thì số tiền vay sẽ không quá 10,000$ còn lớn hơn sẽ không quá 20% số tiền hiện tại!', event.threadID, event.messageID)
    if (id.moneyV >= 10000) {
        api.sendMessage(`Vui lòng thanh toán ${id.moneyV.toLocaleString('en-US')}$ trước khi vay thêm!`, event.threadID, event.messageID);
        return;
    }
    if(id.money < 500000){
        if(id.moneyV >= 5000) return api.sendMessage(`Vui lòng thanh toán ${id.moneyV.toLocaleString('en-US')}$ trước khi vay thêm!`, event.threadID, event.messageID);

    }else{
        if(id.moneyV >= 0.2 * id.money) return api.sendMessage(`Vui lòng thanh toán ${id.moneyV.toLocaleString('en-US')}$ trước khi vay thêm!`, event.threadID, event.messageID)
    }


    if (args.length == 1 ) {
        id.money += 2500;
        id.moneyV += 2500;
        
        api.sendMessage('Bạn đã vay 2,500$ với lãi suất 10%/day', event.threadID, event.messageID);
        return;
    }

    if(id.money < 500000){
        if (args[1] > 10000 || isNaN(args[1]) || args[1] < 0 ) {
            api.sendMessage(`Số tiền không hợp lệ!`, event.threadID, event.messageID);
            return;
        }
    }else{
        if (args[1] > 0.2 * id.money || isNaN(args[1]) || args[1] < 0 ) {
            api.sendMessage(`Số tiền không vượt quá 20% tông tài sản!`, event.threadID, event.messageID);
            return;
        } 
    }
    
    id.money += parseInt(args[1]);
    id.moneyV += parseInt(args[1]);
    api.sendMessage(`Bạn đã vay ${id.moneyV.toLocaleString('en-US')}$ với lãi suất 10%/1h`, event.threadID, event.messageID);
    
}