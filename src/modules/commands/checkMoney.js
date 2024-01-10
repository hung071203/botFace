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
           api.sendMessage(`Tên người dùng: ${id.name} \nSố tài khoản: ${id.ID} \nsố tiền hiện tại: ${id.money.toLocaleString('en-US')}$\nsố tiền hiện tại trong lợn: ${id.moneyL.toLocaleString('en-US')}$\nsố nợ hiện tại: ${id.moneyV.toLocaleString('en-US')}$(+10%/1h)`, event.threadID,(error, info) => {
                if (error) {
                    console.log(error);
                } else {
                    
                }
            },event.messageID);
            
        }else{
            api.sendMessage('vui long thực hiện lại', event.threadID,event.messageID);

        }
}