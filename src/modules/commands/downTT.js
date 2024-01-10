

exports.config = {
  name: 'tiktok',
  version: '0.0.1',
  hasPermssion: 2,
  credits: 'DC-Nam',
  description: '.',
  usage: 'Gửi đường dẫn video Tiktok',
  tag: 'Công cụ',
  cooldowns: 3
};
module.exports.run = async function (api, event, args, client) {
    api.sendMessage('Gửi đường dẫn video Tiktok là được ', event.threadID, event.messageID);
};
