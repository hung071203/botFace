module.exports.config = {
    name: "ctk",
    version: "1.0.0",
    credits: "Ralph",
    description: "Kiểm tra số tiền hiện tại của bản thân",
    tag: 'Money',
    usage: "!ctk []",
  };
  
  
module.exports.run = async function (api, event, args, client) {
    let uid = event.senderID
    if (event.type == 'message_reply'){
        let arrADs = process.env.ADMIN.trim().split(' ');
        let find = arrADs.find(item => item = event.senderID)
        if(!find) return api.sendMessage('Chỉ quản trị viên mới có thể dùng chức năng này!', event.threadID,event.messageID)
        uid = event.messageReply.senderID
    }
    const id = client.money.find(item => item.ID == uid && item.threadID == event.threadID);
        if (id) {
            let msgs = `Tên người dùng: ${id.name} \n-------------------------------------------------------------\nSố tài khoản: ${id.ID} \n-------------------------------------------------------------\nsố tiền hiện tại: ${id.money.toLocaleString('en-US')}$\n-------------------------------------------------------------\nsố tiền hiện tại trong lợn: ${id.moneyL.toLocaleString('en-US')}$(+7%/day, tối đa 999,999,999$)\n-------------------------------------------------------------\nsố nợ hiện tại: ${id.moneyV.toLocaleString('en-US')}$(+10%/1day)\n-------------------------------------------------------------\n`
            msgs += '\n Thông tin các đồng crypto đang sở hữu!\n\n'
            if(id.crypto.length == 0){
                msgs += 'Trống'
            }else{
                id.crypto.forEach(element => {
                    msgs += `Tên: ${element.name}, Số lượng: ${element.amount}\n`
                });
            }
           api.sendMessage(msgs, event.threadID,(error, info) => {
                if (error) {
                    console.log(error);
                } else {
                    
                }
            },event.messageID);
            
        }else{
            api.sendMessage('Người dùng không tồn tại!', event.threadID,event.messageID);

        }
}