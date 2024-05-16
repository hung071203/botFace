
module.exports.config = {
    name: "masoi",
    version: "1.0.0",
    credits: "Ralph",
    description: "Ma sói",
    tag: 'game',
    usage: "!masoi (help)",
  };
  
const chucnang = [{
    game: 'Ma sói',
    skill: [{
        kill: 1
    }],
    mota: 'Mục tiêu của Ma Sói là loại bỏ hết Dân Làng để chiến thắng \nMỗi đêm, Ma Sói cùng nhau bỏ phiếu để chọn một người chơi để giết chết \nTrong thảo luận ban ngày, Ma Sói cố gắng lừa đảo Dân Làng để bảo vệ bản hân và đồng bọn' 
},
{
    game: 'Dân làng',
    skill: [],
    mota: 'Mục tiêu của Dân Làng là tìm ra và loại bỏ hết Ma Sói để chiến thắng.\nMỗi đêm, Dân Làng không có khả năng giết chết ai. Họ chỉ tham gia thảo luận ban ngày để tìm ra Ma Sói.\nDân Làng cố gắng sử dụng logic và suy luận để tìm ra Ma Sói và bảo vệ bản thân.'
},
{
    game: 'Phù thủy',
    skill: [{
        kill: 1,
        save: 1
    }],
    mota: 'Phù Thủy có khả năng cứu chữa người bị Ma Sói giết chết vào ban đêm hoặc giết 1 người nếu muốn.\nTuy nhiên, Phù Thủy chỉ có một lần cứu chữa và giết người duy nhất trong suốt trò chơi.'
},
{
    game: 'Tiên tri',
    skill: [{
        tuonglai: 1
    }],
    mota: "Tiên Tri có khả năng 'nhìn thấy' vai trò của một người chơi mỗi đêm.\nTiên Tri có thể chọn một người chơi mỗi đêm để xác định vai trò của họ (Ma Sói hoặc Dân Làng).\nThông tin từ Tiên Tri có thể giúp Dân Làng tìm ra Ma Sói hoặc giúp Ma Sói lừa đảo Dân Làng."
},
{
    game: 'Bảo vệ',
    skill: [{
        save: 1
    }],
    mota: 'Bảo Vệ có khả năng bảo vệ một người chơi khỏi sự tấn công của Ma Sói vào ban đêm.\nMỗi đêm, Bảo Vệ có thể chọn một người chơi để bảo vệ. Nếu người đó bị Ma Sói chọn để giết, họ sẽ sống sót.\nBảo Vệ không thể bảo vệ chính mình.'
},
{
    game: 'Kẻ báo thù',
    skill: [{
        baothu: 1
    }],
    mota: 'Nếu Kẻ Báo Thù bị loại bỏ trong bất kỳ lượt bỏ phiếu nào, họ sẽ có cơ hội "báo thù" bằng cách chọn một người chơi khác để "kéo theo" họ ra khỏi trò chơi\nKẻ Báo Thù thường là một người chơi Dân Làng.'
}]
module.exports.run = async function (api, event, args, client) {
    return api.sendMessage('Tính năng không khả dụng', event.threadID, event.messageID)
    if(args.length > 1) {
        if (args[1] != 'help') return api.sendMessage('cú pháp không hợp lệ!', event.threadID, event.messageID)
        let msgs = ''
        chucnang.forEach((item, i) => {
            msgs += `${i + 1}, ${item.game}\n${item.mota}\n\n`
        })
        return api.sendMessage(msgs, event.threadID, event.messageID)
    }
    let check = client.handleReply.find(item => item.name == this.config.name && item.threadID == event.threadID);
    if (check) {
        if(check.type != 'check') return api.sendMessage('Game đã bắt đầu, không thể lặp lại lệnh!', event.threadID, event.messageID)
        api.unsendMessage(check.messageID);
        client.handleReply = client.handleReply.filter(item =>item.name != this.config.name)
    }
    api.sendMessage('Rep tin nhắn này để xác nhận tham gia trò chơi\ny: tham gia\nn: để hủy tham gia\ns: Bắt đầu\nb: Hủy game\n-----------------------------------\nLưu ý: Người tham gia cần bật nhận tin nhắn từ người lạ và tối thiểu cần 5 người chơi!', event.threadID , (error, info) => {
        if (error) {
            console.log(error);
        } else {
            client.handleReply.push({
                type: 'check',
                name: this.config.name,
                messageID: info.messageID,
                threadID: event.threadID,
                author: event.senderID,
                join: [{
                    ID: event.senderID,
                    game: '',
                    skill: []
                },
                {
                    ID: event.senderID,
                    game: '',
                    skill: []
                },
                {
                    ID: event.senderID,
                    game: '',
                    skill: []
                },
                {
                    ID: event.senderID,
                    game: '',
                    skill: []
                },
                {
                    ID: '123454',
                    game: '',
                    skill: []
                }]
            })
        }
    }, event.messageID);
}


module.exports.handleReply = async function (api, event, client, hdr) {
    if(event.type != 'message_reply') return
    if(hdr.messageID != event.messageReply.messageID) return
    switch (hdr.type) {
        case 'check':
            let findJ = hdr.join.find(item => item.ID == event.senderID)
            switch (event.body.toLowerCase()) {
                case 'y':
                    if(!findJ){
                        hdr.join.push({
                            ID: event.senderID,
                            game: '',
                            skill: []
                        })
                        api.sendMessage(`Tham gia thành công, hiện tại có ${hdr.join.length} người tham gia!`, event.threadID, event.messageID)
                    }else{
                        api.sendMessage('M tham gia rồi!', event.threadID, event.messageID)
                    }
                    break;
                case 'n':
                    if(!findJ){
                        api.sendMessage('Bạn chưa tham gia game!', event.threadID, event.messageID)
                    }else{
                        hdr.join = hdr.join.filter(item => item.ID != event.senderID)
                        if(hdr.join.length == 0){
                            api.unsendMessage(hdr.messageID);
                            client.handleReply = client.handleReply.filter(item =>item.messageID != hdr.messageID)
                            api.sendMessage('Game bị hủy vì không còn ai tham gia!', event.threadID, event.messageID)
                        }else{
                            api.sendMessage(`Hủy slot thành công, hiện tại còn ${hdr.join.length} người tham gia!`, event.threadID, event.messageID)
                        }
                    }
                    break;
                case 's':
                    if(hdr.author != event.senderID) return api.sendMessage('Chỉ người tạo game mới dùng dc', event.threadID, event.messageID)
                    if(hdr.join.length < 5) return api.sendMessage('Chưa đủ số người để tham gia!', event.threadID, event.messageID)
                    let player =[{
                        game: 'Ma sói',
                        sl: 0
                    },
                    {
                        game: 'Dân làng',
                        sl: 0 
                    },
                    {
                        game: 'Phù thủy',
                        sl: 0 
                    },
                    {
                        game: 'Tiên tri',
                        sl: 0 
                    },
                    {
                        game: 'Bảo vệ',
                        sl: 0 
                    },
                    {
                        game: 'Kẻ báo thù',
                        sl: 0 
                    }]
                    if(hdr.join.length == 5){
                        player[0].sl = 1
                        player[1].sl = 3
                        player[3].sl = 1
                    }else if(hdr.join.length > 5, hdr.join.length <= 7){
                        player[0].sl = 2
                        player[3].sl = 1
                        player[1].sl = hdr.join.length - 3
                    }else if(hdr.join.length > 7, hdr.join.length <= 9){
                        player[0].sl = 2
                        player[3].sl = 1
                        player[4].sl = 1
                        player[1].sl = hdr.join.length - 4
                    }else if(hdr.join.length > 9, hdr.join.length <= 11){
                        player[0].sl = 2
                        player[2].sl = 1
                        player[3].sl = 1
                        player[4].sl = 1
                        player[1].sl = hdr.join.length - 5
                    }else{
                        player[0].sl = 2
                        player[2].sl = 1
                        player[3].sl = 1
                        player[4].sl = 1
                        player[5].sl = 1
                        player[1].sl = hdr.join.length - 6
                    }

                    let arr = []
                    let checkCN = hdr.join.filter(item => item.game == '')
                    if(checkCN){
                        player.forEach(item => {
                            for(;item.sl > 0;) {
                                let num = Math.floor(Math.random() * hdr.join.length)
                                hdr.join[num].game = item.game
                                let find = chucnang.find(item => item.game == hdr.join[num].game)
                                hdr.join[num].skill = find.skill
                                arr.push(hdr.join[num])
                                hdr.join = hdr.join.filter(item => item.game == '')
                                item.sl -= 1
                            }
                        });
                    }
                    arr.forEach( e => {
                        
                        api.sendMessage(`Game bắt đầu, vai trò trận này của bạn là: ${e.game}`, e.ID, (error, info) =>{
                            if(error){
                                console.log(error);
                                return api.sendMessage(`Không thể gửi tin nhắn đến người dùng có ID = ${e.ID}\n Có thể đã bị chặn hoặc người dùng cấm nhận tin nhắn từ người lạ!`, event.threadID, event.messageID)
                            }
                        })
                    })
                    api.sendMessage(`Game bắt đầu, hãy check tin nhắn cá nhân để xem vai trò!`, event.threadID, event.messageID)
                    client.handleReply = client.handleReply.filter(item =>item.messageID != hdr.messageID)
                    //code o day
                    
                    break

                case 'b':
                    if(hdr.author != event.senderID) return api.sendMessage('Chỉ người tạo game mới dùng dc', event.threadID, event.messageID)
                    api.unsendMessage(hdr.messageID);
                    client.handleReply = client.handleReply.filter(item =>item.messageID != hdr.messageID)
                    api.sendMessage('Hủy game thành công!', event.threadID, event.messageID)
                    
                    break
                default:
                    api.sendMessage('Cú pháp không hợp lệ!', event.threadID, event.messageID)
                    break;
            }
            break;
    
        default:
            break;
    }
}