const axios = require('axios');

module.exports.config = {
    name: "riot",
    version: "1.0.0",
    credits: "Ralph",
    description: "Chi tiết thông tin tài khoản riot",
    tag: 'RIOT',
    usage: "!riot [puuid]",
};
const APIKEY = process.env.RIOT_TFT
  
module.exports.run = async function (api, event, args, client) {
    let id = args[1]
    
    axios.get(`https://vn2.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/${id}?api_key=${APIKEY}`)
        .then(response => {
            console.log(response.data);
            let msgs = `ID: ${response.data.id}\n\n`
            msgs += `account ID: ${response.data.accountId}\n\n`
            msgs += `Name: ${response.data.name}\n\n`
            msgs += `Cấp độ triệu hồi sư: ${response.data.summonerLevel}\n\n`
            var d = new Date(response.data.revisionDate);
            var lDate = d.toLocaleString('vi-VN', {timeZone: 'Asia/Ho_Chi_Minh'});
            msgs += `Ngày sửa đổi cuối cùng: ${lDate}`

            api.sendMessage(msgs, event.threadID, event.messageID)
        })
        .catch(error => {
            console.error('Lỗi khi gửi yêu cầu API:', error);
            api.sendMessage(error.message, event.threadID, event.messageID)
        })
}