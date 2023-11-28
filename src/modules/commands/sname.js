module.exports.config = {
    name: 'sname',
    version: '1.0.0',
    credit: 'YourName',
    description: 'Đổi biệt danh ',
    usage: '!sname [biệt danh]'
  };
  
  module.exports.run = async function (api, event, args, client) {
    // Check if the thread exists before attempting to change the user nickname
    
  
    // Extract arguments
    const name = args.slice(1).join(' ');
  
    // Change the user nickname
    api.changeNickname(name,event.threadID, event.senderID, (err) => {
      if (err) return console.error(err);
    });
  };
  