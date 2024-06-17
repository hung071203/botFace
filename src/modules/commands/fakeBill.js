const axios = require('axios');
const fs = require('fs');

module.exports.config = {
    name: "fbill",
    version: "1.0.0",
    credits: "Ralph",
    description: "Giả gd chuyển khoản",
    tag: 'Công cụ',
    usage: "!fbill [Tên người gửi] | [số tài khoản ng gửi] | [ngân hàng ng nhận] | [số tk ng nhận] | [tên ng nhận] | [số tiền] | [nội dung]",
};
  
  
module.exports.run = async function (api, event, args, client) {
    let arrs = args.slice(1).join(" ")
    if (!arrs) return api.sendMessage("Vui lòng nhập thông tin theo định dạng [Tên người gửi] | [số tài khoản ng gửi] | [ngân hàng ng nhận] | [số tk ng nhận] | [tên ng nhận] | [số tiền] | [nội dung]", event.threadID, event.messageID)
    let arr = arrs.split(" | ")
    if(arr.length != 7) return api.sendMessage("Thiếu giá trị!", event.threadID, event.messageID)
    let name = arr[0]
    let stk = arr[1]
    let bank = arr[2]
    let stk1 = arr[3]
    let name_nhan = arr[4]
    let amount = parseInt(arr[5])
    let noidung = arr[6]
    
    
    const formattedTime = getCurrentFormattedTime()
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Accept-Language': 'vi,en;q=0.9,en-GB;q=0.8,en-US;q=0.7',
            'Cookie': 'cf_clearance=JZ2RE1Lo0yecS3zuG_EW876gIPUwS2QkFxVljgjXZg4-1717143863-1.0.1.1-HvbCuMCtx7g1sOxrVJ__nUXnZjN.mTrWb5N9ph3YlL2RBmsTKg15_04pqUKoEPKy6xrxVlyULAqS.CuIxDsVYw',
            'Origin': 'https://fakebill.thanhdieu.com',
            'Referer': 'https://fakebill.thanhdieu.com/fake-bill-mbbank',
            'Sec-Ch-Ua': '"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '"Windows"',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0',
            'X-Requested-With': 'XMLHttpRequest'
        }
    };
    
    const data = {
        forbank: 'mbbank',
        name_gui: name,
        stk_gui: stk,
        bank: bank,
        code1: 'Vietinbank',
        code: 'ICB',
        stk: stk1,
        name_nhan: name_nhan,
        amount: amount,
        noidung: noidung,
        magiaodich: 'FT2232686972',
        time1: formattedTime,
        hinhthucck: 'Trong MB',
        thoigianhientai: formattedTime.split(', ')[0] // Chỉ lấy phần thời gian
    };
    console.log(arr, data);
    try {
        const response = await axios.post('https://fakebill.thanhdieu.com/ajax/mb-bank.php', data, config);
        
        const data1 = response.data;
        const filePath = __dirname + "/../../img/" + Date.now() + ".jpg";
        fs.writeFileSync(filePath, data1, 'base64');

        api.sendMessage({ body: "Đánh giả chuyển khoản thành cảnh công", attachment: fs.createReadStream(filePath) }, event.threadID, (err, data) =>{
            fs.unlink(filePath, err => {
                if (err) {
                  console.error(`Error deleting file: ${err.message}`);
                }
              });
        }, event.messageID);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        api.sendMessage('Lỗi ' + error.message, event.threadID, event.messageID);
    }
}

function getCurrentFormattedTime() {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = now.getFullYear();

    return `${hours}:${minutes}:${seconds}, ${day}/${month}/${year}`;
}