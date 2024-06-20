const axios = require('axios');
const qs = require('qs');

module.exports.config = {
    name: 'bot',
    version: '1.0.0',
    credit: 'YourName',
    description: ' Tự trò chuyện',
    usage: 'bot'
};

module.exports.run = async function (api, event, args, client) {
    api.sendMessage(`${data[Math.floor(Math.random() * data.length)]}`, event.threadID, event.messageID);
}

module.exports.handleEvent = function (api, event, client) {
    if (event.type == 'message' || event.type == 'message_reply') {
        const inputURL = event.body.toLowerCase(); 
        if (!inputURL.includes('bot')) return;
        if (event.type == 'message_reply') {
            let find = client.handleReply.find(item => item.messageID == event.messageReply.messageID);
            if (find) return;
        }
        getmsg(api, event, client);
    }
}

module.exports.handleReply = async function (api, event, client, hdr) {
    if (event.type != 'message_reply') return;
    if (event.args[0].includes(process.env.PREFIX)) return;
    if (event.messageReply.messageID != hdr.messageID) return;
    console.log('bot');
    getmsg(api, event, client);
}

function getmsg(api, event, client) {
    const apiUrl = 'https://api.simsimi.vn/v1/simtalk';
    const params = new URLSearchParams();
    params.append('text', event.body);
    params.append('lc', 'vn');
    params.append('key', ''); // Replace with your actual API key if you have one

    axios.post(apiUrl, params)
    .then(response => {
        console.log(response.data);
        if (!response.data) return api.sendMessage('loi!', event.threadID, event.messageID);
        
        api.sendMessage(`${response.data.message}`, event.threadID, (err, info) => {
            if (err) return console.error(err);
            client.handleReply.push({
                type: 'sim',
                name: module.exports.config.name, // Sử dụng module.exports.config thay cho this.config
                messageID: info.messageID,
                author: event.senderID,
                timestamp: parseInt(info.timestamp)
            });
        }, event.messageID);
    })
    .catch(error => {
        console.error('Error:', error);
        api.sendMessage(error.message, event.threadID, event.messageID);
    });
}

const data = [
    "Mỹ nhân trên thiên hạ đều tầm thường chỉ có vợ kẻ thù mới làm ta hứng thú",
    "Mông, dú là chân lý",
    "Gái gú chỉ là phù du, vợ bạn mới là bất diệt.",
    "Admin là 1 người cute dzai s1tg",
    "Bạn đang thở.",
    "Trái đất hình vuông.",
    "Kẹo sữa Milkita được làm từ sữa.",
    "Chim cánh cụt có thể bay.",
    "con bot này thông minh hơn bạn",
    "tôi không có khả năng hiểu con gái",
    "con bot này giúp bạn hỗ trợ trong việc học?",
    "spam bot tôi sẽ ban bạn khỏi người dùng bot",
    "đừng để tôi cáu nhé!",
    "việc bạn đang làm là vô nghĩa",
    "cái gì chưa biết chỉ cần biết là được",
    "con chuột bị ốm uống thuốc chuột thì tại sao con chuột lại chết ?",
    "chảy máu cam nhưng sao màu máu là màu đỏ ?",
    "Thời gian là câu nói hay nhất, đúng nhất cho một tình yêu.",
    "Dù tình yêu có lớn đến mấy cũng chẳng ngăn được thời gian.",
    "Đừng để thời gian biến nỗi nhớ thành gánh nặng của bạn.",
    "Tuổi trẻ chúng ta đang trôi qua không ngừng.",
    "Tuổi trẻ là hữu hạn - Hãy ngừng lãng phí thời gian và tập trung kiến tạo bản thân ngày một tốt hơn.",
    "Thời gian không chờ đợi một ai cả, chớp mắt một cái thanh xuân đã qua nhanh như một giấc mộng.",
    "Thời gian tuổi trẻ không phụ thuộc vào guồng quay của thế giới mà nó phụ thuộc vào chính mỗi người chúng ta.",
    "Bầu trời sẽ xanh trở lại, nhưng thời gian sẽ không quay trở lại. Nơi ấy sẽ vẫn thế, nhưng tuổi trẻ thì không...",
    "Biết mình còn trẻ và biết tuổi trẻ không hề kéo dài.",
    "Trên đời này có hai thứ không thể quay trở lại đó là: thời gian và tuổi trẻ.",
    "Rồi sẽ có một ngày bạn thức dậy và không còn đủ thời gian để làm những điều hàng ngày mình mong muốn. Hãy làm ngay bây giờ. - Paulo Coelho",
    "Điều hối tiếc nhất trong cuộc đời là không được làm những điều mình thích, là đã không trân trọng thời gian tuổi trẻ của chính mình.",
    "Nếu thời gian là thứ đáng giá nhất, phí phạm thời gian hẳn phải là sự lãng phí ngông cuồng nhất",
    "Cuộc đời đã ngắn ngủi như vậy mà chúng ta vẫn rút ngắn nó thêm khi bất cẩn lãng phí thời gian.",
    "Chúng ta cần phải đi ngang với thời gian chứ không phải để thời gian đi ngang qua.",
    "Nếu bạn yêu đời, hãy đừng phung phí thời gian, vì chất liệu của cuộc sống làm bằng thời gian.",
    "Có những lúc, không có lần sau, không có cơ hội bắt đầu lại. Có những lúc, bỏ lỡ hiện tại, vĩnh viễn không còn cơ hội nữa",
    "Người nào dám lãng phí một giờ đồng hồ hãy còn chưa phát hiện ra giá trị của cuộc sống",
    "Cuộc sống quá ngắn ngủi. Hận thù chỉ tàn phá những hạnh phúc tuyệt vời bạn đang có. Hãy cười khi bạn có thể và quên đi những gì bạn không thể thay đổi.",
    "Kẻ tầm thường chỉ lo tìm cách giết thời gian, còn người có tài thì tìm mọi cách tận dụng thời gian.",
    "Một tuần lễ với người chăm chỉ có 7 ngày, còn với kẻ lười biếng có 7 ngày mai.",
    "Tôi chỉ còn lại một ít thời gian, và tôi không muốn lãng phí nó với Chúa.",
    "Thương hại chính mình và điều kiện hiện tại của mình không chỉ lãng phí thời gian mà là thói quen tồi tệ nhất mà bạn có thể.",
    "Con người không bao giờ được lãng phí thời gian vô ích để nuối tiếc quá khứ hay phàn nàn về những thay đổi khiến mình khó chịu, bởi thay đổi là bản chất của cuộc sống",
    "Hầu hết mọi người lãng phí phần nào đó của cuộc đời cố gắng thể hiện những phẩm chất mình không có",
    "Ngày đi, tháng chạy, năm bay. Thời gian nước chảy, chẳng quay được về.",
    "Giúp bạn bè khi họ cần thật dễ dàng, nhưng dành cho họ thời gian không phải lúc nào cũng thuận lợi.",
    "Người khôn ngoan là người học được những sự thật này: Rắc rối là tạm thời. Thời gian là thuốc bổ. Khổ đau là ống nghiệm.",
    "Thời gian mà bạn hưởng thụ để phung phí, không lãng phí.",
    "Lòng kiên nhẫn và thời gian làm được nhiều hơn là sức mạnh hay nhiệt huyết.",
    "Cuộc đời đã ngắn ngủi như vậy mà chúng ta vẫn rút ngắn nó thêm khi bất cẩn lãng phí thời gian.",
    "Anh có thể trì hoãn, nhưng thời gian thì không",
    "Anh có yêu cuộc sống không? Vậy đừng lãng phí thời gian, vì đó là vật liệu của cuộc sống",
    "Giống như tuyết mùa đông trên bãi cỏ mùa hè, thời gian đã qua là thời gian đã mất.",
    "Tiền bạc và thời gian là những gánh nặng ghê gớm nhất của cuộc đời… và những kẻ bất hạnh nhất là những người sở hữu chúng nhiều hơn mình có thể sử dụng.",
    "Thời gian thay đổi tất cả, chỉ trừ thứ bên trong chúng ta luôn luôn khiến ta thấy ngạc nhiên vì thay đổi.",
    "Tính cách là kết quả của hai thứ: thái độ tinh thần và cách chúng ta sử dụng thời gian",
    "Nếu một người cho bạn thời gian của mình, anh ta không thể cho bạn món quà nào quý giá hơn nữa.",
    "Người nào dám lãng phí một giờ đồng hồ hãy còn chưa phát hiện ra giá trị của cuộc sống",
    "Hãy sống thật xứng đáng để những tháng ngày thanh xuân không trở nên lãng phí.",
    "Tuổi thanh xuân tươi đẹp, thời gian quý báu của cuộc đời, hãy sống tự do hết mình.",
    "Khi thanh xuân, người ta vui chơi, yêu đương và làm những điều rồ dại. Người ta vẫn lớn lên mỗi ngày, sai lầm, đứng dậy, đi tiếp.",
    "Tuổi trẻ của mỗi chúng ta chẳng ai giống nhau, có thể tươi đẹp hoặc sóng gió triền miên nhưng đọng lại là những kí ức mãi mãi không thể nào xóa nhòa."
];
