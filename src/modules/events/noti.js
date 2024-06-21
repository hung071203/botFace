const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: 'noti',
    version: '1.0.0',
    credit: 'HungDz',
    description: 'Noti!',
    usage:''
}

let check = true
module.exports.run = async function (api, event, client) {
    if(check){
        check = false
        const appState = await api.getAppState()
        const appStateFilePath = path.join(__dirname,'..', '..', '..', 'src', 'appstate.json');
        fs.writeFileSync(appStateFilePath, JSON.stringify(appState, null, 2), 'utf8');
        console.log('App state updated successfully!');
        processData(api, client); 
    }
    client.handleReply.forEach(element => {
        if(!element.timestamp) return
        const currentDate = new Date()
        if(element.timestamp < currentDate + 10000){
            client.handleReply = client.handleReply.filter(item => item.messageID != element.messageID)
        }
    });
    if (event.logMessageType == 'log:subscribe' || event.logMessageType == 'log:unsubscribe') {
        processData(api, client); 
        if(event.logMessageData.leftParticipantFbId == api.getCurrentUserID()){
            client.message = client.message.filter(item => item.threadID != event.threadID)
            client.money = client.money.filter(item => item.threadID != event.threadID)
            client.QTVOL = client.QTVOL.filter(item => item.threadID != event.threadID)
        }
    }
    if(event.logMessageType == 'log:thread-admins'){
        if(event.logMessageData.ADMIN_EVENT == 'remove_admin'){
            client.QTV = client.QTV.filter(item => item.adminID != event.logMessageData.TARGET_ID && item.threadID == event.threadID)
        }else if(event.logMessageData.ADMIN_EVENT == 'add_admin'){
            client.QTV.push({
                threadID: event.threadID,
                adminID: event.logMessageData.TARGET_ID
            })
        }
    }
}

module.exports.onload = function (api, client) {
    client.crypto = [{
        name: 'Bitcoin',
        originalPrice: 20000,
        price: 0,
    },
    {
        name: 'Ethereum',
        originalPrice: 1500,
        price: 0
    },
    {
        name: 'Ripple',
        originalPrice: 0.5,
        price: 0
    },
    {
        name: 'Litecoin',
        originalPrice: 200,
        price: 0
    },
    {
        name: 'Cardano',
        originalPrice: 0.3,
        price: 0
    }]
    client.crypto.forEach(crypto => {
        crypto.price = parseFloat(calculateNewPrice(crypto.originalPrice).toFixed(2))
    });
    // setInterval(() => {
    //     processData(api, client); 
    // }, 60000 * 2);

    setInterval(() => {
        client.crypto.forEach(crypto => {
            crypto.price = parseFloat(calculateNewPrice(crypto.originalPrice).toFixed(2))
        });
    }, 100000);


    // setTimeout(() => {
    //     clearInterval(interval); 
    //     console.log("Processing stopped after 7 seconds.");
    // }, 7000);
}
function processData(api, client) {
    api.getThreadList(999, null, [], (err, arr) => {
        if (err) return console.error(err);
        client.members = []
        client.QTV = []
        arr.forEach(thread => {
            if (thread.isGroup) {
                thread.participants.forEach(e =>{
                    let find = client.members.find(item => item.userID == e)
                    if(find) return
                    client.members.push(e)
                })
                let qtvIDs = thread.adminIDs
                qtvIDs.forEach(e => {
                    let find = thread.participants.find(item => item.userID == e)
                    if(!find) return

                    client.QTV.push({
                        threadID: thread.threadID,
                        adminID: e
                    })
                })

            }
        })
    });
}

function calculateNewPrice(originalPrice) {
    const baseVolatility = 0.03; // Độ biến động cơ sở
    let volatility = baseVolatility;

    let rd = Math.random()

    // Đôi khi tăng độ biến động
    if (rd < 0.2) { // 20% xác suất (không thay đổi từ 20%)
        volatility *= 10; // Tăng độ biến động lên 5 lần
    }else if (rd >= 0.2 && rd < 0.6) { 
        const crashFactor = Math.random() * 0.5 + 0.4; // Giảm giá từ 40% đến 90%
        return originalPrice * (1 - crashFactor);
    }
    const randomFactor = Math.random() * volatility * 2 - volatility; // Yếu tố ngẫu nhiên từ -volatility đến +volatility
    const change = originalPrice * randomFactor;
    const newPrice = originalPrice + change;
    return newPrice;
}