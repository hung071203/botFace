const path = require('path');
const fs = require('fs');
const axios = require('axios');
const levenshtein = require('fast-levenshtein');

let thathinh = []
const filePath = path.join(__dirname, '..', '..', 'src', 'savefile', 'thathinh.json');
try {
    const duLieuHienTaiJSON = fs.readFileSync(filePath, 'utf8');
    thathinh = JSON.parse(duLieuHienTaiJSON);
} catch (err) {
    console.error('Lỗi khi đọc tt file:', err);
}

let events =[]
let run = true
const timeRun = Date.now()
global.timeRun = timeRun

module.exports = (api, client) => {

    for (let i = 0; i < client.onload.length; i++) {

        client.onload[i].onload (api, client);
    };

    api.setOptions({ 
        listenEvents: true,
        forceLogin: true,
        selfListen: false,
        autoMarkRead: true,
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.79 Safari/537.36"
    });
    api.listenMqtt((err, event) => {
        global.events = event
        global.api = api
        
        if(!event) return
        if(event.type == 'presence') return

        client.events.forEach((value, key) => {
            client.events.get(key).run(api, event, client)
        });
        client.commands.forEach((value, key) => {
            if (!client.commands.get(key).handleEvent) return;
            client.commands.get(key).handleEvent(api, event, client);
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
        console.log(event, 'djgcifash');
        if (event.body) {
            
            // Sử dụng event.body sau khi kiểm tra
            let args = event.args.filter(item => item !== "");
            // let args = '';
            // args = event.body.trim().split(' ');
            
            // Tiếp tục xử lý các thao tác khác với args
        
            listNoprefix= [];

            client.noprefix.forEach((value, key) => {
                listNoprefix.push(key);
            });

            if (listNoprefix.includes (args[0].toLowerCase())) {
                client.noprefix.get(args[0].toLowerCase()).noprefix(api, event, args, client);
            }
            
            let check = client.QTVOL.find(item => item.threadID == event.threadID)
            if(!check) return
            
            if(!args[0].startsWith(check.prefix)) return;
            console.log('gdygfhjdis');
            events.push(event)
            if (run == true) {
                run = false
                setInterval(() => {
                    processData(api, args, events, client); 
                }, 1000);
            }
            

            
        }
    })
}

async function processData(api, args, events, client) {
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
                return api.sendMessage(`🔒Bạn đã bị cấm sử dụng bot!\n🎄Lý do: ${checkBan.des} \n⌚Thời gian mở: ${lDate}\nHãy đợi hết thời gian hoặc liên hệ admin để được mở khóa!`, event.threadID, event.messageID)
            }
        }
    }
    
    

    //code
    listCommands = [];

    let checkpf = client.QTVOL.find(item => item.threadID == event.threadID)
    if(event.body == checkpf.prefix) {
        const timeNow = Date.now(); // Thời điểm hiện tại
        const timeElapsed = timeNow - timeRun; // Thời gian đã trôi qua tính bằng mili giây

        // Chuyển đổi thời gian từ mili giây sang giờ, phút và giây
        const seconds = Math.floor((timeElapsed / 1000) % 60);
        const minutes = Math.floor((timeElapsed / (1000 * 60)) % 60);
        const hours = Math.floor((timeElapsed / (1000 * 60 * 60)) % 24); // Giới hạn lại giờ từ 0 đến 23

        let msgs = `⛔Bạn chưa nhập tên lệnh\n`;
        

        // Nếu bạn muốn hiển thị ngày nếu thời gian vượt quá 1 ngày
        const days = Math.floor(timeElapsed / (1000 * 60 * 60 * 24));
        if (days > 0) {
            msgs += `⏱Tổng thời gian hoạt động: ${days} ngày, ${hours}:${minutes}:${seconds}\n`;
        }else{
            msgs += `⏱Tổng thời gian hoạt động: ${hours}:${minutes}:${seconds}\n`;
        }

        
        

        const pingURL = async (url) => {
            try {
            
                const startTime = Date.now();
                await axios.get(url);
                const endTime = Date.now();
                const pingTime = endTime - startTime;
                msgs += `🪫Ping: ${pingTime}ms`
            } catch (error) {
                console.error(`Ping to ${url} failed: ${error.message}`);
                msgs += `🪫Ping: false`
            }
            
            msgs += `\n\n${thathinh[Math.floor(Math.random() * thathinh.length)]}\n\n`
            return api.sendMessage(msgs, event.threadID, event.messageID)
        };
        
        return pingURL('https://www.google.com');
        
        
    }

    args = event.body.slice (checkpf.prefix.length).trim().split(' ');
    client.commands.forEach((value, key) => {
        listCommands.push(key);
    });
    
    let command = args[0].toLowerCase();
    if (!listCommands.includes(command)) {
        let find = findClosestCommand(command, listCommands);
        return api.sendMessage (`⛔Lệnh bạn nhập không tồn tại!\n♟️Lệnh gần giống nhất là: ${find}`, event.threadID, event.messageID);
    }
    client.commands.get (command).run(api, event, args, client);
}

function findClosestCommand(input, commands) {
    let closestCommand = null;
    let closestDistance = Infinity;

    commands.forEach(command => {
        const distance = levenshtein.get(input, command);
        if (distance < closestDistance) {
            closestDistance = distance;
            closestCommand = command;
        }
    });

    return closestCommand;
}
