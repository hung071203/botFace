const { ms } = require("translate-google/languages");

module.exports.config = {
    name: 'tmess',
    version: '1.0.0',
    credit: 'YourName',
    description: 'Hiện những người nhắn tin nhiều nhất từ trên xuống dưới',
    tag: 'system',
    usage: '!tmess',
};

module.exports.run = async function (api, event, args, client) {
    let arrMess = client.message.filter(item => item.threadID == event.threadID);

    api.getThreadInfo(event.threadID, (err, inf) => {
        if (err) {
            console.log(err);
        } else {
            console.log(inf);
            const earliestMessage = arrMess.reduce((earliest, current) => {
              return earliest.timestamp < current.timestamp ? earliest : current;
            });
            var date = new Date(parseInt(earliestMessage.timestamp));
        
            var localeDate = date.toLocaleString('vi-VN', {timeZone: 'Asia/Ho_Chi_Minh'});

            // Sử dụng hàm với dữ liệu đã cung cấp
            generateLeaderboard(arrMess, inf.participantIDs, api).then((leaderboard) => {
              let msg = `-----------------------------------------------------------------------\n|BXH những người lắm mồm nhất nhóm ${inf.threadName} kể từ ${localeDate}:|\n-----------------------------------------------------------------------\n${leaderboard}`;
              
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
            });
        }
    });


}
async function generateLeaderboard(messages, participantIDs, api) {
  // Tạo một đối tượng để lưu số tin nhắn của từng người
  const messageCount = {};

  // Lặp qua mỗi tin nhắn trong mảng messages
  messages.forEach((message) => {
    const senderID = message.senderID;

    // Kiểm tra xem người gửi tin nhắn có trong danh sách participantIDs không
    if (participantIDs.includes(senderID)) {
      // Tăng số lượng tin nhắn của người gửi
      messageCount[senderID] = (messageCount[senderID] || 0) + 1;
    }
  });

  // Thêm các thành viên chưa có tin nhắn vào đối tượng messageCount
  participantIDs.forEach((participantID) => {
    if (!messageCount.hasOwnProperty(participantID)) {
      messageCount[participantID] = 0;
    }
  });

  // Sắp xếp đối tượng theo số tin nhắn giảm dần
  const sortedMessageCount = Object.entries(messageCount).sort((a, b) => b[1] - a[1]);

  // Tạo một mảng Promise để lưu các Promise từ việc lấy thông tin người dùng
  const leaderboardPromises = sortedMessageCount.map(async (entry, index) => {
    const [userID, count] = entry;

    // Lấy thông tin người dùng từ API (sử dụng Promise)
    const userInfo = await getUserInfo(api, userID);

    // Tạo tên người dùng để sử dụng trong BXH
    const participantName = userInfo ? `${userInfo.name}` : `Không xác định`;

    return `${index + 1}. ${participantName}: ${count} tin nhắn`;
  });

  // Chờ tất cả các Promise hoàn thành
  const leaderboardStrings = await Promise.all(leaderboardPromises);

  // Trả về chuỗi BXH đã được kết hợp
  return leaderboardStrings.join('\n\n');
}
async function getUserInfo(api, userID) {
  return new Promise((resolve, reject) => {
    api.getUserInfo(userID, (err, info) => {
      if (err) {
        console.error(err);
        resolve(null);
      } else {
        resolve(info[userID]);
      }
    });
  });
}


