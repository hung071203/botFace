// tag.js

module.exports.config = {
    name: 'tag',
    version: '1.0.0',
    credit: 'TênCủaBạn',
    description: 'Gắn thẻ ai đó cùng với tin nhắn',
    usage: '!tag [tên người dùng] [nội dung] [số lần gắn thẻ]'
};

module.exports.run = async function (api, event, args, client) {
    console.log(event, args);
    // Kiểm tra xem số lượng đối số có đúng không
    if (Object.keys(event.mentions).length === 0) {
        api.sendMessage('Số lượng đối số không hợp lệ. Cách sử dụng: !tag [tên người dùng] [nội dung] [số lần gắn thẻ]', event.threadID, event.messageID);
        return;
    }
    

    // Trích xuất đối số
    const userID = Object.keys(event.mentions)[0];
    const name = event.mentions[userID];
    const username = name.slice("@");
    const countU = name.split(' ').length;
    const content = args.slice(countU + 1, -1).join(' ');
    let tagCount = parseInt(args[args.length - 1]);

    // Kiểm tra hợp lệ của tên người dùng
    if (!username || !username.trim()) {
        api.sendMessage('Tên người dùng không hợp lệ. Hãy đề cập đến một người dùng bằng cách sử dụng @tên_người_dùng.', event.threadID, event.messageID);
        return;
    }
    // Validate tagCount
    if (tagCount <= 0) {
        api.sendMessage('Số lần gắn thẻ không hợp lệ. Hãy cung cấp một số dương cho số lần gắn thẻ.', event.threadID, event.messageID);
        return;
    }

    if (isNaN(tagCount)) {
        tagCount = 1;
    }
    console.log(username, tagCount, content);

    for (let index = 0; index < tagCount; index++) {
        if (process.env.ATS == 1) {
            api.sendMessage('AntiSpam đang được kích hoạt', event.threadID);
            return;
        }
        const taggedMessage = `${username} ${content}`;
        msg = {
            body: taggedMessage,
            mentions: [
                {
                    tag: username,
                    id: userID
                }
            ]
        }
        api.sendMessage(msg, event.threadID);
        await sleep(800);
    }
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
