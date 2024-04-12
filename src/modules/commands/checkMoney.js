module.exports.config = {
    name: "ctk",
    version: "1.0.0",
    credits: "Ralph",
    description: "Kiểm tra số tiền hiện tại của bản thân",
    tag: 'Money',
    usage: "!ctk",
  };
  
  
module.exports.run = async function (api, event, args, client) {

    
    const id = client.money.find(item => item.ID == event.senderID && item.threadID == event.threadID);
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
            api.sendMessage('vui long thực hiện lại', event.threadID,event.messageID);

        }
}