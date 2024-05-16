module.exports.config = {
    name: "setmn",
    version: "1.0.0",
    credits: "Ralph",
    description: "set money",
    tag: 'ADMIN',
    usage: "!setmn [số tài khoản người nhận] [Số tiền]",
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
    }else if(args.length == 3){
        const check = client.money.find(item => item.ID == event.senderID && item.threadID == event.threadID);
        const idC = client.money.find(item => item.ID == args[1] && item.threadID == event.threadID);
        let mn = 0
        if(!isNaN(args[2])) {
            if(parseInt(args[2]) > 999999999) return api.sendMessage('Số tiền không được vượt quá 999,999,999$', event.threadID, event.messageID);
            mn = parseInt(args[2]);
        }else{
            
            if(args[2] != 'inf'){
                return api.sendMessage('Số tiền phải là 1 số', event.threadID, event.messageID);
            }else{
                mn = Infinity
            }
        }
        console.log(check);
        console.log(idC);
        if (check) {
            if (!idC) {
                api.sendMessage('Số tài khoản không tồn tại, thử lại', event.threadID, event.messageID);
            }else{
                
                api.sendMessage(`Chuyển thành công ${parseInt(args[2]).toLocaleString('en-US')}$ đến chủ tk: ${idC.name}`, event.threadID, event.messageID);
                idC.money = mn
                console.log(idC);
                
                
            }
            
        }
    }else{
        api.sendMessage('cú pháp không hợp lệ!', event.threadID, event.messageID);
    }
}