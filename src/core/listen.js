let events =[]
let run = true
module.exports = (api, client) => {

    for (let i = 0; i < client.onload.length; i++) {

        client.onload[i].onload (api, client);
    };

    api.setOptions({ 
        listenEvents: true,
        forceLogin: true,
        selfListen: false,
        autoMarkRead: true,
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Mobile/15E148 Safari/604.1"
        });
    api.listenMqtt((err, event) => {
        if(!event) return
        if(event.type == 'presence') return

        client.events.forEach((value, key) => {
            client.events.get(key).run(api, event, client)
        });
        
        
        if (process.env.YT == 1 && event.type === 'message_reply' && client.handleReply != []) {
            
                
            client.handleReply.forEach(e => {
                if (e.name == 'yt') {
                    client.commands.get (e.name).handleReply(api, event, client, e)
                }
            });
            
        }

        if (client.handleReply.length>0) {
            console.log('hhhhh');
            client.handleReply.forEach(e => {
                if(e.name == 'yt')return;
                client.commands.get (e.name).handleReply(api, event, client, e);
            });
            
        }
        console.log(event);
        if (event.body) {
            
            // Sử dụng event.body sau khi kiểm tra
            let args = '';
            args = event.body.trim().split(' ');
        
            // Tiếp tục xử lý các thao tác khác với args
        
            listNoprefix= [];

            client.noprefix.forEach((value, key) => {
                listNoprefix.push(key);
            });

            if (listNoprefix.includes (args[0])) {
                client.noprefix.get(args[0]).noprefix(api, event, args, client);
            }
            
            
            if(!event.body.startsWith(client.config.PREFIX)) return;

            events.push(event)
            if (run == true) {
                run = false
                setInterval(() => {
                    processData(api, args, events, client); 
                }, 1500);
            }
            

            
        }
    })
}

function processData(api, args, events, client) {
    if(events.length == 0) return
    let event = events.shift()
    //checkAdminBot
    let adIDs = process.env.ADMIN
    arrAD = adIDs.trim().split(' ');
    let check = arrAD.find(item => item == event.senderID)

    if (!check) {
        //checkBoxTime
        let checkBT = client.QTVOL.find(e=> e.threadID == event.threadID)
        if(client.QTVOL.length == 0) return api.sendMessage('Có lỗi đã xảy ra, thử lại!', event.threadID, event.messageID);
        if(typeof checkBT == 'undefined' || checkBT.time < parseInt(event.timestamp)) return api.sendMessage('Nhóm này đã hết hạn dùng bot, liên hệ quản trị viên để gia hạn!', event.threadID, event.messageID);

        
        //QTV
        let checkQTV = client.QTVOL.find(item => item.threadID == event.threadID);
        if(client.QTV.length == 0) return api.sendMessage('Có lỗi xảy ra, thử lại!', event.threadID, event.messageID);

        let admin = client.QTV.find(item => item.threadID == event.threadID && event.senderID == item.adminID)
        console.log(checkQTV, admin);
        if(typeof checkQTV == 'undefined' || checkQTV.checkid == 1 && !admin) return api.sendMessage('Chỉ quản trị viên dùng được bot', event.threadID, event.messageID);
        
        //ban
        let checkBan = client.Ban.find(item => item.threadID == event.threadID && item.ID == event.senderID)
        if (checkBan) {
            if(checkBan.timestamp > parseInt(event.timestamp)){
                var d = new Date(checkBan.timestamp);
                var lDate = d.toLocaleString('vi-VN', {timeZone: 'Asia/Ho_Chi_Minh'});
                return api.sendMessage(`Bạn bị cấm sử dụng bot cho đến ${lDate}, Hãy đợi hết thời gian hoặc liên hệ admin để được mở khóa!`, event.threadID, event.messageID)
            }
        }
    }

    //code
    listCommands = [];
    args = event.body.slice (client.config.PREFIX.length).trim().split(' ');
    client.commands.forEach((value, key) => {
        listCommands.push(key);
    });
    
    if (!listCommands.includes(args[0])) return api.sendMessage('Lệnh của bạn không tồn tại!!', event.threadID, event.messageID);
    client.commands.get (args[0]).run(api, event, args, client);
}

