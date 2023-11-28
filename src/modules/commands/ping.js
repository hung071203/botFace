const axios = require('axios');
const moment = require('moment');


module.exports.config = {
    name: 'ping',
    version: '1.0.0',
    credit: 'HungDz',
    description: 'Ping!',
    usage: '!ping hoặc ping',
};

module.exports.run = async function (api, event, args, client) {
    const apiKey = process.env.API_WEATHER;
    console.log(apiKey);
   
    
    let currentDateTime;
    let weatherData;

    const location = 'Hanoi,VN';
    try {
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`);
        console.log(response);
        weatherData = response.data;

        // Lấy ngày giờ hiện tại
        currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
        console.log('Ngày giờ hiện tại:', currentDateTime);

        const celsiusTemperature = weatherData.main.temp - 273.15;
        // Hiển thị thông tin thời tiết
        console.log('Thông tin thời tiết:');
        console.log('Nhiệt độ:', celsiusTemperature.toFixed(2), '°C');
        console.log('Mô tả:', weatherData.weather[0].description);

        const message = `Ngày giờ hiện tại: ${currentDateTime}\nThông tin thời tiết:\nNhiệt độ: ${celsiusTemperature.toFixed(2)} °C\nMô tả: ${weatherData.weather[0].description}\nĐộ ẩm: ${weatherData.main.humidity}%\nÁp suất: ${weatherData.main.pressure} hPa\nTốc độ gió: ${weatherData.wind.speed} m/s`;

        // Hàm được thực thi khi người dùng gửi tin nhắn theo cú pháp prefix + tên lệnh ở phần config
        api.sendMessage(message, event.threadID, event.messageID);
    } catch (error) {
        console.error('Lỗi khi lấy thông tin thời tiết:', error.message);
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
