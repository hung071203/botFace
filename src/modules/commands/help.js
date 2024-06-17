// help.js

module.exports.config = {
    name: 'help',
    version: '1.0.0',
    credit: 'YourName',
    description: 'Hiển thị danh sách lệnh và cách sử dụng',
    usage: '!help'
  };
  
module.exports.run = async function (api, event, args, client) {
  
  const commandInfoByTag = {};
  const tagCommands = {};
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
        tagCommands[currentTag] = [];
      }

      // Thêm thông tin của lệnh vào danh sách của tag tương ứng
      commandInfoByTag[currentTag].push(`${name}: ${description} - Sử dụng: ${usage}\n`);
      tagCommands[currentTag].push(name)
      i++
    }
  });

  // Tạo một mảng chứa thông tin nhóm lại
  const groupedCommandInfo = [];
  const details = []
  // Lặp qua từng tag và tạo thông tin nhóm lại
  Object.keys(commandInfoByTag).forEach((tag, index) => {
    const tagCommandInfo = commandInfoByTag[tag];
    const tagCommand = tagCommands[tag];
    details.push(tagCommandInfo)
    const tagInfo = `-----------------------------------------------------------------------\n|${index + 1}. ${tag} có ${tagCommandInfo.length} lệnh:|\n-----------------------------------------------------------------------\n${tagCommand.join(', ')}`;
    groupedCommandInfo.push(tagInfo);
    
  });
  groupedCommandInfo.push(`----------------------------------------------------------------------\n Tổng có ${i} lệnh có thể hoạt động!\nRep tin nhắn kèm số thứ tự để hiện chi tiết lệnh!`);
  // Gửi thông điệp chứa thông tin về các lệnh đã nhóm lại theo tag
  api.sendMessage(groupedCommandInfo.join('\n\n'), event.threadID, (error, info) => {
    if (error) {
        console.log(error);
    } else {
        client.handleReply.push({
            name: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
            details: details
        })
        
    }
}, event.messageID);
};
  
module.exports.handleReply = async function (api, event, client, hdr) {
  if(event.type != 'message_reply') return
  if(!event.messageReply.messageID) return
  if(hdr.messageID != event.messageReply.messageID) return
  if(isNaN(event.body)) return api.sendMessage(`Phải nhập vào 1 số!`, event.threadID, event.messageID)
  let index = parseInt(event.body) - 1
  if(index < 0 || index >= hdr.details.length) return api.sendMessage(`số nhập vào không hợp lệ`, event.threadID, event.messageID)
  let detail = hdr.details[index]
  api.sendMessage(detail.join('\n'), event.threadID, (err, data) =>{
    if(err) console.log(err)
    api.unsendMessage(hdr.messageID);
    client.handleReply = client.handleReply.filter(item =>item.messageID != event.messageReply.messageID);
  }, event.messageID)
}
