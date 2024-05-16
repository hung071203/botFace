const { it } = require("translate-google/languages");


module.exports.config = {
    name: "cm",
    version: "1.0.0",
    credits: "Ralph",
    description: "Coin Master",
    tag: 'game',
    usage: "!cm [help] để biết thêm chi tiết!",
};
  
  
module.exports.run = async function (api, event, args, client) {
    if(args.length < 2 ) return api.sendMessage('Cú pháp không hợp lệ!', event.threadID, event.messageID)
    let find = client.userCM.find(item => item.ID == event.senderID && item.threadID == event.threadID)
    let player = client.money.find(item => item.ID == event.senderID && item.threadID == event.threadID)
    if(!player) return 
    let Island
    if (find) {
        Island = client.coinMaster.find(item => item.level == find.level)
    }
    let msgs = ''
    switch (args[1]) {
        case 'help':
            msgs = 'create: Tạo tài khoản game\n'
            msgs += 'show: xem thông tin hiện tại của bản thân!\n'
            msgs += 'buy [spin/coin] [Số lượng!] ( 1$ -> 1 coin, 100$ -> 1 spin): Mua vật phẩm!\n'
            msgs += 'spin [số lần quay]: quay!\n'
            msgs += 'sell [số coin]: chuyển coin sang money(1000 coin -> 1$)!\n'
            msgs += 'update: Nâng cấp đảo!\n'
            api.sendMessage(msgs, event.threadID, event.messageID)
            break;

        case 'create':
            
            
            if(!find){
                client.userCM.push({
                    ID: event.senderID,
                    threadID: event.threadID,
                    spin: 20,
                    shield: 0,
                    coin: 0,
                    time: parseInt(event.timestamp),
                    level: 1,
                    tree: 0,
                    pet: 0,
                    house: 0,
                    car: 0,
                    pool: 0
                })
                api.sendMessage('Tạo acc thành công!', event.threadID, event.messageID)
            }else{
                api.sendMessage('Bạn đã có tài khoản rồi', event.threadID, event.messageID)
            }
            
            break;
    
        case 'show':
            if(!find) return api.sendMessage('Bạn chưa có tài khoản!', event.threadID, event.messageID)
            msgs = `Thông tin tài khoản: ${find.ID}\n\n`
            msgs += `Spin: ${find.spin}\n`
            msgs += `Shield: ${find.shield}/3\n`
            msgs += `Coin: ${find.coin.toLocaleString('en-US')}\n------------------------------------\n`
            msgs += `Island level: ${find.level}\n`
            msgs += `Island name: ${Island.name}\n`
            msgs += `Cây cảnh: ${find.tree}/5\n`
            msgs += `Thú cưng: ${find.pet}/5\n`
            msgs += `Xe: ${find.car}/5\n`
            msgs += `Bể bơi: ${find.pool}/5\n`
            msgs += `Nhà: ${find.house}/5\n`

            api.sendMessage(msgs, event.threadID, event.messageID)
            break;
        
        case 'spin':
            if(!find) return api.sendMessage('Bạn chưa có tài khoản!', event.threadID, event.messageID)
            if(args.length != 3) return api.sendMessage('Cú pháp không hợp lệ!', event.threadID, event.messageID)

            let spinn = 0
            if(isNaN(args[2])) return api.sendMessage('Giá trị không hợp lệ!', event.threadID, event.messageID)
            spinn = parseInt(args[2])
            if(spinn < 1) return api.sendMessage('Giá trị không hợp lệ!', event.threadID, event.messageID)
            if(find.spin < spinn) return api.sendMessage('Bạn không đủ lượt quay', event.threadID, event.messageID)
            find.spin -= spinn
            const result = [100000, 1000000, "Destroy", "Shield", "Rop", "10 spin"]
            // let rd1 = Math.floor(Math.random() * 6)
            // let rd2 = Math.floor(Math.random() * 6)
            // let rd3 = Math.floor(Math.random() * 6)
            let rd1 = rd2 = rd3 = Math.floor(Math.random() * 15)

            if (rd1 == rd2 && rd2 == rd3 && rd3 == 0) {
                find.coin += result[0] * spinn * (1 + 0.01 * find.level)
                api.sendMessage(`Bạn đã quay ${spinn} lần và nhận được ${(result[0] * spinn * (1 + 0.01 * find.level)).toLocaleString('en-US')} coin`, event.threadID, event.messageID)
            }else if (rd1 == rd2 && rd2 == rd3 && rd3 == 1) {
                find.coin += result[1] * spinn * (1 + 0.01 * find.level)
                api.sendMessage(`Bạn đã quay ${spinn} lần và nhận được ${(result[rd1] * spinn * (1 + 0.01 * find.level)).toLocaleString('en-US')} coin`, event.threadID, event.messageID)
            }else if (rd1 == rd2 && rd2 == rd3 && rd3 == 2) {
                let dess = client.userCM.filter(item => item.ID != event.senderID && item.threadID == event.threadID && (item.pool != 0 || item.car != 0 || item.house != 0 || item.pet != 0 || item.tree != 0));
                
                if (dess.length == 0) {
                    find.coin += 30000 * spinn * (1 + 0.01 * find.level)
                    api.sendMessage(`Phá hủy công trình thất bại! nhận được ${(30000 * spinn * (1 + 0.01 * find.level)).toLocaleString('en-US')} coin`, event.threadID, event.messageID)
                    return
                }

                let msgs = `Bạn đã quay ${spinn} lần và nhận được khả năng phá hủy công trình!\n-----------------------------------------\n`
                let i = 1
                dess.forEach(e => {
                    msgs += `${i}, ${e.ID}\n`
                    i++
                });
                api.sendMessage(msgs, event.threadID,(error, info) => {
                    if (error) {
                        console.log(error);
                    } else {
                        
                        client.handleReply.push({
                            type: 'destroy',
                            name: this.config.name,
                            messageID: info.messageID,
                            author: event.senderID,
                            data: dess,
                            spin: spinn
                        })
                    }
                },event.messageID); 

            }else if (rd1 == rd2 && rd2 == rd3 && rd3 == 3) {
                if(find.shield >= 3){
                    find.spin += spinn
                    return api.sendMessage('Bạn đã đủ 3 khiên, hoàn lại lượt quay!', event.threadID, event.messageID)
                }
                let spinA = 3 - find.shield
                if(spinn > spinA){
                    find.spin += spinn - spinA
                    find.shield = 3
                    return api.sendMessage(`Bạn đã thêm ${spinA} khiên, hoàn lại lượt quay!`, event.threadID, event.messageID)
                }
                find.shield += spinn
                api.sendMessage(`Bạn đã thêm ${spinn} khiên!`, event.threadID, event.messageID)
            }else if (rd1 == rd2 && rd2 == rd3 && rd3 == 4) {
                let rop = client.userCM.filter(item => item.ID != event.senderID && item.threadID == event.threadID && item.coin > 0)
                
                if(rop.length == 0){
                    find.coin += 100000 * spinn * (1 + 0.01 * find.level)
                    api.sendMessage(`Cướp đảo thành công! nhận được ${(100000 * spinn * (1 + 0.01 * find.level)).toLocaleString('en-US')} coin`, event.threadID, event.messageID)
                    return
                }
                let rdr = Math.floor(Math.random() * rop.length)
                let xu = rop[rdr].coin/2 * spinn * (1 + 0.01 * find.level)
                find.coin += xu
                rop[rdr].coin -= rop[rdr].coin/2
                api.sendMessage(`Cướp đảo ${rop[rdr].ID} thành công! nhận được ${xu.toLocaleString('en-US')} coin`, event.threadID, event.messageID)
            }else if (rd1 == rd2 && rd2 == rd3 && rd3 == 5) {
                find.spin += spinn * 10
                api.sendMessage(` Chúc mừng bạn nhận được ${(spinn * 10).toLocaleString('en-US')} spin`, event.threadID, event.messageID)
            }else{
                find.coin += 30000 * spinn * (1 + 0.01 * find.level)
                api.sendMessage(`Nhận được ${(30000 * spinn * (1 + 0.01 * find.level)).toLocaleString('en-US')} coin`, event.threadID, event.messageID)
                    
            }
            break;
        
        case 'buy':
            if(!find) return api.sendMessage('Bạn chưa có tài khoản!', event.threadID, event.messageID)
            if(args.length != 4) return api.sendMessage('Cú pháp không hợp lệ!', event.threadID, event.messageID)
            if(isNaN(args[3])) return api.sendMessage('Cú pháp không hợp lệ!', event.threadID, event.messageID)
            let number = parseInt(args[3])
            
            
            switch (args[2]) {
                case 'coin':
                    if(player.money < number || number < 0) return api.sendMessage('Bạn không đủ tiền!', event.threadID, event.messageID)
                    player.money -= number
                    find.coin += number
                    api.sendMessage(`Nạp thành công ${number.toLocaleString('en-US')} coin với tỉ lệ 1/1`, event.threadID, event.messageID)
                    break;
                
                case 'spin':
                    if(player.money < number * 100 || number < 0) return api.sendMessage('Bạn không đủ tiền!', event.threadID, event.messageID)
                    player.money -= number * 100
                    find.spin += number
                    api.sendMessage(`Nạp thành công ${number.toLocaleString('en-US')} spin với tỉ lệ 100/1`, event.threadID, event.messageID)
                    break;
                default:
                    api.sendMessage('Cú pháp không hợp lệ!!', event.threadID, event.messageID)
                    break;
            }
            
            break;
            
        case 'sell':
            if(!find) return api.sendMessage('Bạn chưa có tài khoản!', event.threadID, event.messageID)
            if(args.length != 3) return api.sendMessage('Cú pháp không hợp lệ!', event.threadID, event.messageID)
            if(isNaN(args[2])) return api.sendMessage('Cú pháp không hợp lệ!', event.threadID, event.messageID)
            let coin = parseInt(args[2])
            if(coin < 100000) return api.sendMessage('Cần tối thiểu 100,000 coin', event.threadID, event.messageID)
            if(find.coin < coin) return api.sendMessage('Bạn không đủ coin', event.threadID, event.messageID)
            find.coin -= coin
            player.money += coin/1000
            api.sendMessage(`Bạn đã rút thành công ${(coin/1000).toLocaleString('en-US')}$`, event.threadID, event.messageID)
            break;
            
        case 'update':
            if(!find) return api.sendMessage('Bạn chưa có tài khoản!', event.threadID, event.messageID)
            let msg = `Đảo ${Island.level}: ${Island.name}\n-----------------------------------------\nChọn mục cần nâng cấp!\n-----------------------------------------\n`
            msg += `1, Nhà (${find.house}/5) -${(Island.priceHouse/5).toLocaleString('en-US')}$-\n`
            msg += `2, Xe (${find.car}/5) -${(Island.priceCar/5).toLocaleString('en-US')}$-\n`
            msg += `3, Cây cảnh (${find.tree}/5) -${(Island.priceTree/5).toLocaleString('en-US')}$-\n`
            msg += `4, Thú cưng (${find.pet}/5) -${(Island.pricePet/5).toLocaleString('en-US')}$-\n`
            msg += `5, Bể bơi (${find.pool}/5) -${(Island.pricePool/5).toLocaleString('en-US')}$-\n`
            msg += `0, Hủy nâng cấp!\n`
            api.sendMessage(msg, event.threadID, (error, info) => {
                if (error) {
                    console.log(error);
                } else {
                    
                    client.handleReply.push({
                        type: 'update',
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        Island: Island
                    })
                }
            }, event.messageID)
            break;

        default:
            api.sendMessage('Cú pháp không hợp lệ!', event.threadID, event.messageID)
            break;
    }
}

module.exports.handleReply = async function (api, event, client, hdr) {
    if(!event) return
    if(event.type != 'message_reply') return;
    if(hdr.author != event.senderID) return;
    if(event.messageReply.messageID != hdr.messageID) return
    let User = client.userCM.find(item => item.ID == event.senderID && item.threadID == event.threadID)
    
    switch (hdr.type) {
        case 'destroy':
            arr = hdr.data
            if(isNaN(event.body)) return api.sendMessage('Số đã chọn không hợp lệ, chọn lại!', event.threadID, event.messageID)
            num = parseInt(event.body)
            if(num < 1 || num > arr.length) return api.sendMessage('Số đã chọn không hợp lệ, chọn lại!', event.threadID, event.messageID)
            uID = arr[num - 1].ID
            
            let find = client.userCM.find(item => item.ID == uID && item.threadID == event.threadID)
            if (find.shield > 0) {
                find.shield -= 1
                User.coin += 30000 * hdr.spin * (1 + 0.01 * User.level)
                api.sendMessage(`Phá hủy công trình thất bại! nhận được ${(30000 * hdr.spin * (1 + 0.01 * User.level)).toLocaleString('en-US')} coin`, event.threadID, event.messageID)
                
            }
            else if (find.pet > 0) {
                find.pet -= 1
                User.coin += 500000 * hdr.spin * (1 + 0.1 * User.level)
                api.sendMessage(`Phá hủy công trình thành công! nhận được ${(500000 * hdr.spin * (1 + 0.01 * User.level)).toLocaleString('en-US')} coin`, event.threadID, event.messageID)
                
            }else if (find.tree > 0) {
                find.tree -= 1
                User.coin += 500000 * hdr.spin * (1 + 0.1 * User.level)
                api.sendMessage(`Phá hủy công trình thành công! nhận được ${(500000 * hdr.spin * (1 + 0.01 * User.level)).toLocaleString('en-US')} coin`, event.threadID, event.messageID)
                
            }else if (find.house > 0) {
                find.house -= 1
                User.coin += 500000 * hdr.spin * (1 + 0.1 * User.level)
                api.sendMessage(`Phá hủy công trình thành công! nhận được ${(500000 * hdr.spin * (1 + 0.01 * User.level)).toLocaleString('en-US')} coin`, event.threadID, event.messageID)
                
            }else if (find.car > 0) {
                find.car -= 1
                User.coin += 500000 * hdr.spin * (1 + 0.1 * User.level)
                api.sendMessage(`Phá hủy công trình thành công! nhận được ${(500000 * hdr.spin * (1 + 0.01 * User.level)).toLocaleString('en-US')} coin`, event.threadID, event.messageID)
                
            }else if (find.pool > 0) {
                find.pool -= 1
                User.coin += 500000 * hdr.spin * (1 + 0.1 * User.level)
                api.sendMessage(`Phá hủy công trình thành công! nhận được ${(500000 * hdr.spin * (1 + 0.01 * User.level)).toLocaleString('en-US')} coin`, event.threadID, event.messageID)
                
            }
            client.handleReply = client.handleReply.filter(item =>item.messageID != event.messageReply.messageID);
            break;
            
        case 'update':
            let player = client.money.find(item => item.ID == event.senderID && event.threadID == item.threadID)
            let data = hdr.Island
            switch (event.body) {
                case '1':
                    if(User.house >= 5 )return api.sendMessage('Công trình này đã đạt cấp tối đa!', event.threadID, event.messageID)
                    if (player.money < data.priceHouse/5) return api.sendMessage('Bạn không đủ tiền, thử lại!', event.threadID, event.messageID)
                    User.house ++ 
                    player.money -= data.priceHouse/5
                    api.sendMessage('Nâng cấp thành công!', event.threadID, event.messageID)
                    break;

                case '2':
                    if(User.car >= 5 )return api.sendMessage('Công trình này đã đạt cấp tối đa!', event.threadID, event.messageID)
                    if (player.money < data.priceCar/5) return api.sendMessage('Bạn không đủ tiền, thử lại!', event.threadID, event.messageID)
                    User.car ++ 
                    player.money -= data.priceCar/5
                    api.sendMessage('Nâng cấp thành công!', event.threadID, event.messageID)
                    break;

                case '3':
                    if(User.tree >= 5 )return api.sendMessage('Công trình này đã đạt cấp tối đa!', event.threadID, event.messageID)
                    if (player.money < data.priceTree/5) return api.sendMessage('Bạn không đủ tiền, thử lại!', event.threadID, event.messageID)
                    User.tree ++ 
                    player.money -= data.priceTree/5
                    api.sendMessage('Nâng cấp thành công!', event.threadID, event.messageID)
                    break;

                case '4':
                    if(User.pet >= 5 )return api.sendMessage('Công trình này đã đạt cấp tối đa!', event.threadID, event.messageID)
                    if (player.money < data.pricePet/5) return api.sendMessage('Bạn không đủ tiền, thử lại!', event.threadID, event.messageID)
                    User.pet ++ 
                    player.money -= data.pricePet/5
                    api.sendMessage('Nâng cấp thành công!', event.threadID, event.messageID)
                    break;

                case '5':
                    if(User.pool >= 5 )return api.sendMessage('Công trình này đã đạt cấp tối đa!', event.threadID, event.messageID)
                    if (player.money < data.pricePool/5) return api.sendMessage('Bạn không đủ tiền, thử lại!', event.threadID, event.messageID)
                    User.pool ++ 
                    player.money -= data.pricePool/5
                    api.sendMessage('Nâng cấp thành công!', event.threadID, event.messageID)
                    break;
                
                case '0':
                    client.handleReply = client.handleReply.filter(item =>item.messageID != event.messageReply.messageID);
                    api.unsendMessage(hdr.messageID);
                    api.sendMessage('Nâng cấp đã bị hủy!', event.threadID, event.messageID)
                    break;

                default:
                    return api.sendMessage('Cú pháp không hợp lệ, thử lại!', event.threadID, event.messageID)
            }
            if(User.house == 5 && User.car == 5 && User.pet == 5 && User.tree == 5 && User.pool == 5 && User.level < client.coinMaster.length){
                User.level ++ 
                User.house = User.pet = User.car = User.tree = User.pool = 0
            }
            client.handleReply = client.handleReply.filter(item =>item.messageID != event.messageReply.messageID);
            api.unsendMessage(hdr.messageID);
            break;
        default:
            api.sendMessage('Cú pháp không hợp lệ, thử lại!', event.threadID, event.messageID)
            break;
    }
}
