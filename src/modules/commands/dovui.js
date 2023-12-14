const request = require('request');

module.exports.config = {
    name: 'dovui',
    version: '1.0.0',
    credit: 'YourName',
    description: 'Đố vui  ',
    usage: '!dovui '
};

module.exports.run = async function (api, event, args, client) {
  request(`https://docs-api.jrtxtracy.repl.co/game/dovui`, (err, response, body) => {
    if (err) {
        console.error(err);
        return;
    }

    console.log(body);
    let answer ='';
    const data = JSON.parse(body);
    const answerLetters = ["A", "B", "C", "D", "E", "F"];
    const option = data.data.option.map((option, index) => {
        const optionLetter = answerLetters[index];
        if (data.data.correct == option) {
            answer = optionLetter
        }
        return `${optionLetter}: ${option} \n`;
    })
    
    const msg = `${data.data.question} \n ${option}`;
    process.env.CHECK = 1;
    api.sendMessage(msg, event.threadID,(error, info) => {
      if (error) {
          console.log(error);
      } else {
          client.handleReply.push({
              type: 'dv',
              name: this.config.name,
              messageID: info.messageID,
              author: event.senderID,
              dapan: answer
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
          msgbody = `Chúc mừng ${userInfo[event.senderID].name} đã trả lời đúng(+130$)`;
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
          id.money += 130;
        })
      }else{
        api.sendMessage('Sai rồi, đoán lại(-130$)', event.threadID,event.messageID);
        id.money -= 130;
      }
    }
  }
}
