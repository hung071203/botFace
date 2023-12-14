const request = require('request');

module.exports.config = {
    name: 'dhbc',
    version: '1.0.0',
    credit: 'YourName',
    description: 'Đuổi hình bắt chữ  ',
    usage: '!dhbc '
};

module.exports.run = async function (api, event, args, client) {
  request(`https://docs-api.jrtxtracy.repl.co/game/dhbcemj`, (err, response, body) => {
    if (err) {
        console.error(err);
        return;
    }

    console.log(body);
    const data = JSON.parse(body);
    const msg = `Nhìn vào những emj sau và đoán từ: ${data.emoji1} ${data.emoji2}`
    process.env.CHECK = 1;
    api.sendMessage(msg, event.threadID,(error, info) => {
      if (error) {
          console.log(error);
      } else {
          client.handleReply.push({
              type: 'emj',
              name: this.config.name,
              messageID: info.messageID,
              author: event.senderID,
              dapan: data.wordcomplete
          })
          
      }
    },event.messageID);

  });

}

module.exports.handleReply = async function (api, event, client) {
  const dp = client.handleReply[client.handleReply.length - 1].dapan.toLowerCase();
  console.log('hismd', event);

  const id = client.money.find(item => item.ID == event.senderID&&item.threadID == event.threadID);
  if (id) {
    if (event.messageReply.messageID == client.handleReply[client.handleReply.length - 1].messageID) {
        if (event.body.toLowerCase() == dp) {
        console.log('kkkkkkk');
        process.env.CHECK = 0;
        console.log(process.env.CHECK);
        api.getUserInfo(event.senderID, (err, userInfo) => {
          msgbody = `Chúc mừng ${userInfo[event.senderID].name} đã trả lời đúng\n Bạn đã được thêm 150$ vào tài khoản`;
          msg = {
              body: msgbody,
              mentions: [
                  {
                      tag: userInfo [event.senderID].name,
                      id: event.senderID
                  }
                  
              ]
          }
          api.sendMessage(msg, event.threadID,event.messageID);
          id.money += 150;
        })
      }else{
        api.sendMessage('Sai rồi, đoán lại!\nBạn mất 150$', event.threadID,event.messageID);
        id.money -= 150;
      }
    }
  }
}
