

module.exports.config = {
    name: 'checktt',
    version: '1.0.0',
    credit: 'YourName',
    description: 'Hiện những người nhắn tin nhiều nhất từ trên xuống dưới',
    tag: 'system',
    usage: '!checktt [day/week]',
};

module.exports.run = async function (api, event, args, client) {
    let arrMess = client.message.filter(item => item.threadID == event.threadID);
    let msg = ''
    switch (args[1]) {
      case 'day':
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0)
        api.getThreadInfo(event.threadID, (err, inf) => {
          if (err) {
              console.log(err);
          } else {
              console.log(inf);
              
              var date = new Date(currentDate.getTime());
          
              var localeDate = date.toLocaleDateString('vi-VN', {timeZone: 'Asia/Ho_Chi_Minh'});
              let msgs = generateLeaderboard(arrMess, inf.participantIDs, 'day', client)
              msg = `-----------------------------------------------------------------------\n|Top tuơng tác ngày hôm nay ${localeDate}:|\n-----------------------------------------------------------------------\n${msgs}\n`;
              api.sendMessage(msg, event.threadID, (error, info) => {
                if (error) {
                    console.log(error);
                } else {
                    client.umessage.push({
                        type: 'unsend',
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                    })
                    
                }
            }, event.messageID);
          }
        });
        break;

      case 'week':
        const today = new Date();

        const startOfWeek = new Date(today);
        startOfWeek.setDate(startOfWeek.getDate() - today.getDay());
        const timestampInMilliseconds = startOfWeek.getTime();
        
        api.getThreadInfo(event.threadID, (err, inf) => {
          if (err) {
              console.log(err);
          } else {
              console.log(inf);
              
              var date = new Date(timestampInMilliseconds);
          
              var localeDate = date.toLocaleDateString('vi-VN', {timeZone: 'Asia/Ho_Chi_Minh'});
  
              let msgs = generateLeaderboard(arrMess, inf.participantIDs, 'week', client)
              msg = `-----------------------------------------------------------------------\n|Top tuơng tác tuần kể từ ngày ${localeDate}:|\n-----------------------------------------------------------------------\n${msgs}\n`;
              api.sendMessage(msg, event.threadID, (error, info) => {
                if (error) {
                    console.log(error);
                } else {
                    client.umessage.push({
                        type: 'unsend',
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                    })
                    
                }
            }, event.messageID);
          }
        });
        break;
    
      default:
        api.getThreadInfo(event.threadID, (err, inf) => {
          if (err) {
              console.log(err);
          } else {
              console.log(inf);
              let msgs = generateLeaderboard(arrMess, inf.participantIDs, 'all', client)
              msg = `-----------------------------------------------------------------------\n|BXH những người lắm mồm nhất nhóm ${inf.threadName}:|\n-----------------------------------------------------------------------\n${msgs}\n`;
              api.sendMessage(msg, event.threadID, (error, info) => {
                if (error) {
                    console.log(error);
                } else {
                    client.umessage.push({
                        type: 'unsend',
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                    })
                    
                }
            }, event.messageID);
          }
        });
        break;
    }
    
    


}
function generateLeaderboard(messages, participantIDs, dwa, client) {
  let msgs = ''
  let sum = 0
  if(dwa == 'day'){
    messages.sort((a, b) => b.day - a.day);
    messages.forEach((e, index) => {
      sum += e.day
      const usIF = getUserInfo(client, e.senderID)
      msgs += `\n${index + 1}, ${usIF ? usIF.name : 'Không xác định'}: ${e.day} tin nhắn`
    });
  }else if(dwa == 'week'){
    messages.sort((a, b) => b.week - a.week);
    messages.forEach((e, index) => {
      sum += e.week
      const usIF = getUserInfo(client, e.senderID)
      msgs += `\n${index + 1}, ${usIF ? usIF.name : 'Không xác định'}: ${e.week} tin nhắn`
    });
  }else{
    messages.sort((a, b) => b.all - a.all);
    let i =1
    
    messages.forEach((e, index) => {
      participantIDs = participantIDs.filter(item => item != e.senderID)
      const usIF = getUserInfo(client, e.senderID)
      sum += e.all
      msgs += `\n${i}, ${usIF ? usIF.name : 'Không xác định'}: ${e.all} tin nhắn`
      i++
    });
    participantIDs.forEach(e => {
      const usIF = getUserInfo(client, e)
      msgs += `\n${i}, ${usIF ? usIF.name : 'Không xác định'}: 0 tin nhắn`
      i++
    })
    
  }
  msgs += `\n=> Tổng số tin nhắn: ${sum}`
  console.log(msgs);
 return msgs
}
function getUserInfo(client, userID) {
  
  let find = client.members.find(item => item.userID == userID)
  if(!find){
    return null
  }
  return find
}


