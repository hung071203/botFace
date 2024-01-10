const request = require('request');
const translate = require('translate-google');

module.exports.config = {
    name: 'quizvi',
    version: '1.0.0',
    credit: 'YourName',
    description: 'Quiz',
    tag: 'game',
    usage: '!quizvi [easy/medium/hard]'
};

module.exports.run = async function (api, event, args, client) {
    let url ='';
    if (args.length == 1) {
        url = 'https://opentdb.com/api.php?amount=1&type=multiple'
    }else {
        if(args[1] == 'easy' || args[1] == 'medium' || args[1] == 'hard'){
            url = `https://opentdb.com/api.php?amount=1&difficulty=${args[1]}&type=multiple`
        }else{
            return api.sendMessage('Chỉ hỗ trợ ba độ khó là easy, medium, hard', event.threadID, event.messageID);
        }
    }
    request(url, async (err, response, body) => {
        if (err) {
            console.error(err);
            return;
        }
        let answer =[];
        let cAnswer = '';
        const data = JSON.parse(body);
        const answerLetters = ["A", "B", "C", "D", "E", "F"];
        
        console.log(data.results[0]);
        const question = data.results[0].question;
        answer = data.results[0].incorrect_answers;
        answer.push(data.results[0].correct_answer);
        console.log(answer, data.results[0].correct_answer);
        shuffleArray(answer)
        const option = answer.map((option, index) => {
            const optionLetter = answerLetters[index];
            if (data.results[0].correct_answer == option) {
                cAnswer = optionLetter
            }
            return `${optionLetter}: ${option} \n`;
        });
        const message = option.join(', ');
        const msg = `Độ khó: ${data.results[0].difficulty}\n${question} \n ${message}`;
        const translation = await translate(msg, { from: 'en', to: 'vi' });
        console.log(translation,'a');
        api.sendMessage(translation, event.threadID,(error, info) => {
        if (error) {
            console.log(error);
        } else {
            
            client.handleReply.push({
                type: 'quiz',
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                dokho: data.results[0].difficulty,
                dapan: cAnswer
            })
        }
        },event.messageID); 

    });
}

module.exports.handleReply = async function (api, event, client, hdr) {
    if(!event) return;
    if(event.type != 'message_reply') return;
    let check = hdr;
    console.log('hahi',check);
    if(!check) return;
  
    const dp = check.dapan.toLowerCase();
    console.log('hismd', event);
  
    const id = client.money.find(item => item.ID == event.senderID&&item.threadID == event.threadID);
    if (id) {
      if (event.messageReply.messageID == check.messageID) {
        if (event.body.toLowerCase() == dp) {
            let money = 0
          if (check.dokho == 'easy') {
            money = 130;
          }else if (check.dokho == 'medium') {
            money = 200;
          }else{
            money = 500;
          }
          api.getUserInfo(event.senderID, (err, userInfo) => {
            msgbody = `Chúc mừng ${userInfo[event.senderID].name} đã trả lời đúng(${money}$)`;
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
            api.unsendMessage(check.messageID);
            client.handleReply = client.handleReply.filter(item =>item.messageID != event.messageReply.messageID);
            id.money += money;
          })
        }else{
          api.sendMessage('Sai rồi, đoán lại(-130$)', event.threadID,event.messageID);
          id.money -= 130;
        }
      }
    }
}



function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
}