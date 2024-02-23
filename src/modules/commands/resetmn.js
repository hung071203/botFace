module.exports.config = {
    name: "remoney",
    version: "1.0.0",
    credits: "Ralph",
    description: "Reset tiền tài khoản",
    tag: 'ADMIN',
    usage: "!remoney (stk)",
  };
  
  
module.exports.run = async function (api, event, args, client) {
    let argsAD = process.env.ADMIN.trim().split(' ');
    let checkAD = argsAD.find(item => item == event.senderID)
    if (!checkAD) {
        api.sendMessage('bạn không có quyền dùng chức năng này!', event.threadID, event.messageID);
        return;
    }
    const id = client.money.find(item => item.ID == args[1] && item.threadID == event.threadID);
        if (id) {
          id.money = 0
          id.moneyL = 0
          id.moneyV = 0
          api.sendMessage('Reset thành công!', event.threadID,event.messageID);
            
        }else{
            api.sendMessage('Số tài khoản không tồn tại', event.threadID,event.messageID);

        }
}