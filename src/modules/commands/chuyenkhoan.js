module.exports.config = {
    name: "ck",
    version: "1.0.0",
    credits: "Ralph",
    description: "Chuyển tiền",
    usage: "!ck [số tài khoản người nhận] [Số tiền]",
  };
  
  
module.exports.run = async function (api, event, args, client) {
    if (args.length == 1) {
        api.sendMessage('Vui lòng nhập số tài khoản người nhận!', event.threadID, event.messageID);
    }else{
        const check = client.money.find(item => item.ID == event.senderID && item.threadID == event.threadID);
        const idC = client.money.find(item => item.ID == args[1]);
        if (check) {
            if (!idC) {
                api.sendMessage('Số tài khoản không tồn tại, thử lại', event.threadID, event.messageID);
            }else{
                if (check.money<parseInt(args[2]) + parseInt(args[2]) * 0.1) {
                    api.sendMessage('Không đủ tiền để thực hiện hành động này!', event.threadID, event.messageID);
                }else{
                    api.sendMessage(`Giao dịch thành công đến chủ tk: ${idC.name}\nPhí dịch vụ 10% Số tiền giao dịch`, event.threadID, event.messageID);
                    check.money -= (parseInt(args[2]) + parseInt(args[2]) * 0.1);
                    idC.money += parseInt(args[2]);
                    
                }
            }
            
        }
    }
}