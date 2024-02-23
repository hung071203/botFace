module.exports.config = {
    name: 'sname',
    version: '1.0.0',
    credit: 'YourName',
    description: 'Đổi biệt danh ',
    tag: 'system',
    usage: '!sname [Người dùng(nếu cần)] [biệt danh]'
  };
  
  module.exports.run = async function (api, event, args, client) {
    // Check if the thread exists before attempting to change the user nickname
    if (Object.keys(event.mentions).length === 0) {
      // Extract arguments
      const name = args.slice(1).join(' ');
    
      // Change the user nickname
      api.changeNickname(name,event.threadID, event.senderID, (err) => {
        if (err) return console.error(err);
      });
    }else if (Object.keys(event.mentions).length === 1) {
      
      const userID = Object.keys(event.mentions)[0];
      const n = event.mentions[userID];
      const countU = n.split(' ').length;
      const name = args.slice(countU + 1).join(' ');
    
      // Change the user nickname
      api.changeNickname(name,event.threadID, userID, (err) => {
        if (err) return console.error(err);
      });
    }else{
      api.sendMessage('Cú pháp không hợp lệ, sử dụng !sname [Người dùng(nếu cần)] [biệt danh] ',event.threadID, event.messageID);
    }
  
    
  };
  