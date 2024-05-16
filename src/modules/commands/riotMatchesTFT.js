const axios = require('axios');

module.exports.config = {
    name: "tft",
    version: "1.0.0",
    credits: "Ralph",
    description: "Xem id trận đấu TFT, lịch sử đâu tft",
    tag: 'RIOT',
    usage: "!tft [id/detail/new] [puuid/(matchID puuid)/puuid]",
};
const APIKEY = process.env.RIOT_TFT
  
module.exports.run = async function (api, event, args, client) {
    let id = args[2]
    let check = args[1]
    switch (check) {
        case 'id':
            let msgs = await getMatchID(id)
            console.log(msgs);
            api.sendMessage(msgs, event.threadID, event.messageID)
            break;
        case 'detail':
            
            id2 = args[3]
            let message = await getMatch(id, id2)
            api.sendMessage(message, event.threadID, event.messageID)
            break;
        case 'new':
            let ids = await getMatchID(id)
            arr = ids.trim().split('\n');
            let mess = await getMatch(arr[0], id)
            api.sendMessage(mess, event.threadID, event.messageID)
            break;
        default:
            api.sendMessage('Cú pháp không hợp lệ!', event.threadID, event.messageID)
            break;
    }
    
}

async function getMatchID(id){
    try {
        let msg = ''
        const response = await axios.get(`https://sea.api.riotgames.com/tft/match/v1/matches/by-puuid/${id}/ids?start=0&count=10&api_key=${APIKEY}`)
        response.data.forEach(element => {
            msg += `${element}\n`
        });
        return msg;
    } catch (error) {
        console.error('Lỗi khi gửi yêu cầu API:', error);
        return error.message;
    }
}

async function getMatch(id, id2){
    try {
        let msg = ''
        const responses = await axios.get(`https://sea.api.riotgames.com/tft/match/v1/matches/${id}?api_key=${APIKEY}`);
        const response = responses.data
        console.log(response);
        msg += `Thông tin trận đấu:\n`
        msg += `Trạng thái game: ${response.info.endOfGameResult}\n`
        var d = new Date(response.info.gameCreation);
        var lDate = d.toLocaleString('vi-VN', {timeZone: 'Asia/Ho_Chi_Minh'});
        msg += `Thời gian tạo trận: ${lDate}\n`
        msg += `Tổng thời gian ván đấu: ${(response.info.game_length / 60).toFixed(2)} phút\n------------------------------------------------------------------\n`
        
        let uName = await getUserName(id2)

        msg += `Chi tiết ván đấu của người chơi ${uName}:  \n`
        let find = response.info.participants.find(item => item.puuid == id2)
        if(!find) {msg += 'Trống!!\n------------------------------------------------------------------\n'}else{
            msg += `Số vàng lúc chết: ${find.gold_left}\n`
            msg += `Số màn đã vượt qua: ${find.last_round}\n`
            msg += `Cấp: ${find.level}\n`
            msg += `Thứ hạng: ${find.placement}\n`
            msg += `Số người chơi bị loại bỏ: ${find.players_eliminated}\n`
            msg += `Tổng sát thương gây ra cho người chơi khác: ${find.total_damage_to_players}\n------------------------------------------------------------------\n`

        }

        msg += `Những người tham gia:\n\n`
        for (const e of response.metadata.participants) {
            let a = await getUserName(e);
            msg += `${a}\n\n`
        }
        msg += '------------------------------------------------------------------\n'
        return msg;
    } catch (error) {
        console.error('Lỗi khi gửi yêu cầu API:', error);
        return error.message;
    }
}

async function getUserName(id) {
    try {
        const response = await axios.get(`https://asia.api.riotgames.com/riot/account/v1/accounts/by-puuid/${id}?api_key=${APIKEY}`);
        let msg = `${response.data.gameName}#${response.data.tagLine}`;
        console.log(msg);
        return msg;
    } catch (error) {
        console.error('Lỗi khi gửi yêu cầu API:', error);
        return error.message;
    }
}
