const axios = require('axios');

module.exports.config = {
    name: "ip",
    version: "1.0.0",
    credits: "Ralph",
    description: "Tìm vị trí dựa trên địa chỉ ip",
    usage: "!ip <địa chỉ ip>",
};
  
  
module.exports.run = async function (api, event, args, client) {
    if(args.length == 1) return api.sendMessage('Nhập địa chỉ ip đã', event.threadID, event.messageID)
    const ip = args.slice(1).join(" ");
    const apiUrl = `http://ip-api.com/json/${ip}?fields=66846719`;

    axios.get(apiUrl)
    .then(response => {
        console.log(response.data);
        const data = response.data
        let msgs = ''
        if(data.status == 'success'){
            msgs += `Khu vực: ${data.continent}\n`
            msgs += `Quốc gia: ${data.country}\n`
            msgs += `Tỉnh/Thành phố: ${data.regionName}\n`
            msgs += `Quận/huyện: ${data.district}\n`
            msgs += `Zip: ${data.zip}\n`
            msgs += `Kinh độ: ${data.lat}\n`
            msgs += `Vĩ độ: ${data.lon}\n`
            msgs += `Timezone: ${data.timezone}\n`
            msgs += `Múi giờ: +${data.offset / 60 / 60}\n`
            msgs += `Nhà mạng: ${data.isp}\n`
        }else{
            msgs += `Địa chỉ ip không hợp lệ!\n`
        }
        api.sendMessage(msgs, event.threadID, event.messageID)
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        api.sendMessage('Xảy ra lỗi khi thực hiện truy vấn!', event.threadID, event.messageID)
    });
};