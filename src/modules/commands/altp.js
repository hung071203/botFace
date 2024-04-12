const request = require('request');
const translate = require('translate-google');

module.exports.config = {
    name: 'altp',
    version: '1.0.0',
    credit: 'YourName',
    description: 'ai la trieu phu',
    tag: 'game',
    usage: '!altp'
};

module.exports.run = async function (api, event, args, client) {
    let url ='https://opentdb.com/api.php?amount=1&difficulty=easy&type=multiple';
    
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
        const msg = `Câu 1: ${question} \n ${message}\n `;
        let translation = await translate(msg, { from: 'en', to: 'vi' });
        console.log(translation,'a');
        translation += '\n[Bạn có 10 giây để trả lời câu hỏi]';
        api.sendMessage(translation, event.threadID,(error, info) => {
        if (error) {
            console.log(error);
        } else {
            
            client.handleReply.push({
                type: 'altp',
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                q: 1,
                dapan: cAnswer,
                time: info.timestamp
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
    if(check.author != event.senderID) return;
    if(check.messageID != event.messageReply.messageID) return
    if (event.timestamp > check.time + 10 * 1000) {
        api.sendMessage('Đã hết thời gian cho phép, bạn đã thua!', event.threadID, event.messageID);
        client.handleReply = client.handleReply.filter(item =>item.messageID != event.messageReply.messageID);
        api.unsendMessage(check.messageID);
        return;
    }

    const dp = check.dapan.toLowerCase();
    console.log('hismd', event);
  
    const id = client.money.find(item => item.ID == event.senderID&&item.threadID == event.threadID);
    if (id) {

       
      if (event.messageReply.messageID == check.messageID) {
        if (event.body.toLowerCase() == dp) {
           
          api.getUserInfo(event.senderID, (err, userInfo) => {
            
            api.unsendMessage(check.messageID);
            client.handleReply = client.handleReply.filter(item =>item.messageID != event.messageReply.messageID);
            if (check.q <= 4) {
                let url = 'https://opentdb.com/api.php?amount=1&difficulty=easy&type=multiple';

                Quiz(url, event, api, check.q + 1, client);
            }else if (check.q >4 && check.q <= 9) {
                if (check.q == 5) {
                    id.money += 100000;
                    api.sendMessage('Bạn đã hoàn thành câu số 5, nhận 100.000$ vào tài khoản', event.threadID, event.messageID);
                } 
                let url = 'https://opentdb.com/api.php?amount=1&difficulty=medium&type=multiple';

                Quiz(url, event, api, check.q + 1, client);
            }else if (check.q >9 && check.q <= 15) {
                if (check.q == 10) {
                    id.money += 300000;
                    api.sendMessage('Bạn đã hoàn thành câu số 10, nhận 300.000$ vào tài khoản', event.threadID, event.messageID);
                } 
                if (check.q == 15) {
                    id.money += 1000000;
                    api.sendMessage('Chúc mừng bạn đã chiến thắng, nhận 1.000.000$ vào tài khoản', event.threadID, event.messageID);
                    return
                } 
                let url = 'https://opentdb.com/api.php?amount=1&difficulty=hard&type=multiple';

                Quiz(url, event, api, check.q + 1, client);
            }
          })
        }else{
          api.sendMessage('Sai rồi, đáp án đúng là ' + check.dapan, event.threadID,event.messageID);
          client.handleReply = client.handleReply.filter(item =>item.messageID != event.messageReply.messageID);
          api.unsendMessage(check.messageID);
        }
      }
    }
}

async function Quiz(url, event, api, q, client){
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
        const msg = `Câu ${q}: ${question} \n ${message}\n `;
        let translation = await translate(msg, { from: 'en', to: 'vi' });
        console.log(translation,'a');
        translation += '\n[Bạn có 10 giây để trả lời câu hỏi]';
        api.sendMessage(translation, event.threadID,(error, info) => {
        if (error) {
            console.log(error);
        } else {
            
            client.handleReply.push({
                type: 'altp',
                name: 'altp',
                messageID: info.messageID,
                author: event.senderID,
                q: q,
                dapan: cAnswer,
                time: info.timestamp
            })
        }
        },event.messageID); 

    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
}