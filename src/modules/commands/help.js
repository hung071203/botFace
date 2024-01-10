// help.js

module.exports.config = {
    name: 'help',
    version: '1.0.0',
    credit: 'YourName',
    description: 'Hiển thị danh sách lệnh và cách sử dụng',
    usage: '!help'
  };
  
module.exports.run = async function (api, event, args, client) {
  // Tạo một đối tượng để lưu thông tin về các lệnh và cách sử dụng theo tag
  const commandInfoByTag = {};
  let i = 0;
  // Lặp qua danh sách lệnh
  client.commands.forEach((cmd) => {
    // Kiểm tra xem lệnh có thông tin cấu hình không
    if (cmd.config) {
      const { name, description, tag, usage } = cmd.config;

      // Nếu tag không tồn tại, đặt giá trị là "OTHER"
      const currentTag = tag ? tag.toUpperCase() : 'OTHER';
      // Tạo key từ tag nếu chưa tồn tại
      if (!commandInfoByTag[currentTag]) {
        commandInfoByTag[currentTag] = [];
      }

      // Thêm thông tin của lệnh vào danh sách của tag tương ứng
      commandInfoByTag[currentTag].push(`${name}: ${description} - Sử dụng: ${usage}\n`);
      i++
    }
  });

  // Tạo một mảng chứa thông tin nhóm lại
  const groupedCommandInfo = [];

  // Lặp qua từng tag và tạo thông tin nhóm lại
  Object.keys(commandInfoByTag).forEach((tag) => {
    const tagCommandInfo = commandInfoByTag[tag];
    const tagInfo = `-----------------------------------------------------------------------\n|${tag} có ${tagCommandInfo.length} lệnh:|\n-----------------------------------------------------------------------\n${tagCommandInfo.join('\n')}`;
    groupedCommandInfo.push(tagInfo);
  });
  groupedCommandInfo.push(`----------------------------------------------------------------------\n Tổng có ${i} lệnh có thể hoạt động!`);
  // Gửi thông điệp chứa thông tin về các lệnh đã nhóm lại theo tag
  api.sendMessage(groupedCommandInfo.join('\n\n'), event.threadID, event.messageID);
};
  

