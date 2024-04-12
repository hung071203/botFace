const axios = require('axios');

module.exports.config = {
    name: "riotacc",
    version: "1.0.0",
    credits: "Ralph",
    description: "Lấy thông tin tài khoản RIOT",
    tag: 'RIOT',
    usage: "!riotacc [nhập puuid/riotid]",
};
const APIKEY = process.env.RIOT_TFT
  
module.exports.run = async function (api, event, args, client) {
    let id = args.slice(1).join(' ')
    if(id.includes('#')){
        const riotID = id.replace(/#/g, '/')
        axios.get(`https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${riotID}?api_key=${APIKEY}`)
            .then(response => {
                console.log(response);
                api.sendMessage(`puuid: ${response.data.puuid}`, event.threadID, event.messageID)
            })
            .catch(error => {
                console.error('Lỗi khi gửi yêu cầu API:', error);
                api.sendMessage(error.message, event.threadID, event.messageID)
            });
    }else{
        axios.get(`https://asia.api.riotgames.com/riot/account/v1/accounts/by-puuid/${id}?api_key=${APIKEY}`)
            .then(response => {
                api.sendMessage(`RiotID: : ${response.data.gameName}#${response.data.tagLine}`, event.threadID, event.messageID)
            })
            .catch(error => {
                console.error('Lỗi khi gửi yêu cầu API:', error);
                api.sendMessage(error.message, event.threadID, event.messageID)
            });
    }
}