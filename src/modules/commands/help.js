// help.js

module.exports.config = {
    name: 'help',
    version: '1.0.0',
    credit: 'YourName',
    description: 'Hiển thị danh sách lệnh và cách sử dụng',
    usage: '!help'
  };
  
  module.exports.run = async function (api, event, args, client) {
    // Tạo một danh sách để lưu thông tin về các lệnh và cách sử dụng
    const commandInfo = [];
  
    // Lặp qua danh sách lệnh
    client.commands.forEach((cmd) => {
      // Kiểm tra xem lệnh có thông tin cấu hình không
      if (cmd.config) {
        const { name, description, usage } = cmd.config;
        commandInfo.push(`${name}: ${description} - Sử dụng: \ ${usage} \ \n`);
      }
    });
    commandInfo.push(`Gửi link video tiktok để tải! \n`);

    // Gửi thông điệp chứa thông tin về các lệnh
    api.sendMessage(commandInfo.join('\n'), event.threadID, event.messageID);
  };
  