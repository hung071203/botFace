module.exports.config = {
    name: "mmn",
    version: "1.0.0",
    credits: "Ralph",
    description: "make money",
    tag: 'ADMIN',
    usage: "!mmn [số tài khoản người nhận] [Số tiền]",
  };
  
  
module.exports.run = async function (api, event, args, client) {
    let argsAD = process.env.ADMIN.trim().split(' ');
    let checkAD = argsAD.find(item => item == event.senderID)
    if (!checkAD) {
        api.sendMessage('bạn không có quyền dùng chức năng này!', event.threadID, event.messageID);
        return;
    }
    if (args.length == 1) {
        api.sendMessage('Vui lòng nhập số tài khoản người nhận!', event.threadID, event.messageID);
    }else{
        const check = client.money.find(item => item.ID == event.senderID && item.threadID == event.threadID);
        const idC = client.money.find(item => item.ID == args[1] && item.threadID == event.threadID);
        console.log(check);
        console.log(idC);
        if (check) {
            if (!idC) {
                api.sendMessage('Số tài khoản không tồn tại, thử lại', event.threadID, event.messageID);
            }else{
                api.sendMessage(`Chuyển thành công ${parseInt(args[2]).toLocaleString('en-US')}$ đến chủ tk: ${idC.name}`, event.threadID, event.messageID);
                idC.money += parseInt(args[2]);
                console.log(idC);
                
                
            }
            
        }
    }
}