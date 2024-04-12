const axios = require('axios');
const moment = require('moment');

module.exports.config = {
    name: 'wt',
    version: '1.0.0',
    credit: 'HungDz',
    description: 'Thời tiết',
    usage: '!wt (chia sẻ vị trí bạn trước rồi phản hồi lại bằng tin nhắn này!)',
};

module.exports.run = async function (api, event, args, client) {
    const apiKey = process.env.API_WEATHER;
    console.log(apiKey);
    
    let currentDateTime;
    let weatherData;
    if(event.type != 'message_reply' ){
        const location = 'Hanoi,VN';
        try {
            const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&lang=vi`);
            
            weatherData = response.data;

            // Lấy ngày giờ hiện tại
            currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
            console.log('Ngày giờ hiện tại:', currentDateTime);

            const celsiusTemperature = weatherData.main.temp - 273.15;
            // Hiển thị thông tin thời tiết
            console.log('Thông tin thời tiết:');
            console.log('Nhiệt độ:', celsiusTemperature.toFixed(2), '°C');
            console.log('Mô tả:', weatherData.weather[0].description);

            const message = `Địa điểm: Hà Nội, Việt Nam \nNgày giờ hiện tại: ${currentDateTime}\nThông tin thời tiết:\nNhiệt độ: ${celsiusTemperature.toFixed(2)} °C\nMô tả: ${weatherData.weather[0].description}\nĐộ ẩm: ${weatherData.main.humidity}%\nÁp suất: ${weatherData.main.pressure} hPa\nTốc độ gió: ${weatherData.wind.speed} m/s \nTầm nhìn xa: ${weatherData.visibility} m `;

            // Hàm được thực thi khi người dùng gửi tin nhắn theo cú pháp prefix + tên lệnh ở phần config
            api.sendMessage(message, event.threadID, event.messageID);
        } catch (error) {
            console.error('Lỗi khi lấy thông tin thời tiết:', error.message);
        }
    }else{
        if(event.messageReply.attachments[0].type != 'share')return api.sendMessage('Cú pháp không hợp lệ, thử lại!', event.threadID, event.messageID)
        if(!event.messageReply.attachments[0].target.coordinate) return api.sendMessage('Cú pháp không hợp lệ!', event.threadID, event.messageID)
        let lat = event.messageReply.attachments[0].target.coordinate.latitude
        let long = event.messageReply.attachments[0].target.coordinate.longitude

        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&lang=vi`);
            console.log(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&lang=vi`);
            weatherData = response.data;

            // Lấy ngày giờ hiện tại
            currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
            console.log('Ngày giờ hiện tại:', currentDateTime);

            const celsiusTemperature = weatherData.main.temp - 273.15;
            // Hiển thị thông tin thời tiết
            console.log('Thông tin thời tiết:');
            console.log('Nhiệt độ:', celsiusTemperature.toFixed(2), '°C');
            console.log('Mô tả:', weatherData.weather[0].description);

            const message = `Địa điểm: ${weatherData.name}, ${weatherData.sys.country} \nNgày giờ hiện tại: ${currentDateTime}\nThông tin thời tiết:\nNhiệt độ: ${celsiusTemperature.toFixed(2)} °C\nMô tả: ${weatherData.weather[0].description}\nĐộ ẩm: ${weatherData.main.humidity}%\nÁp suất: ${weatherData.main.pressure} hPa\nTốc độ gió: ${weatherData.wind.speed} m/s \nTầm nhìn xa: ${weatherData.visibility} m `;

            // Hàm được thực thi khi người dùng gửi tin nhắn theo cú pháp prefix + tên lệnh ở phần config
            api.sendMessage(message, event.threadID, event.messageID);
        } catch (error) {
            console.error('Lỗi khi lấy thông tin thời tiết:', error.message);
        }
    }
    
};

module.exports.noprefix = function (api, event, args, client) {
    // Tương tự như trên nhưng không cần prefix
    api.sendMessage("dell có gì đâu ping cc", event.threadID, event.messageID);
};

module.exports.onload = function (api, client) {
    // Hàm được thực thi khi bpt khởi chạy
    console.log('onload!');
};
