const crypto = require('crypto');
const axios = require('axios');

module.exports.config = {
    name: 'phatnguoi',
    version: '1.0.0',
    credit: 'YourName',
    description: ' Kiểm tra phạt nguội',
    tag: 'Công cụ',
    usage: '!phatnguoi (biển số xe) (1: ô tô, 2: xe máy)'
};

const hn = function(n) {
    if (!n || n === "") {
        return n;
    }
    let e = n;
    try {
        const i = n.split(" }@{ ")[1];
        const t = "HTTPS://PHATNGUOI.COM " + (function() {
            const n = new Date();
            if (n.getHours() === 23 && n.getMinutes() >= 50) {
                n.setDate(n.getDate() + 1);
            }
            const e = n.getUTCDate();
            const i = n.getUTCMonth() + 1;
            const t = n.getUTCFullYear();
            return `${dn(e)}${dn(i)}${t}`;
        })();
        
        const key = Buffer.alloc(32, t, 'utf-8');
        const iv = Buffer.from('0123456789abcdef0123456789abcdef', 'hex');
        const cipher = crypto.createCipheriv('aes-256-ctr', key, iv);
        
        e = cipher.update(i, 'hex', 'utf-8');
        e += cipher.final('utf-8');
    } catch (s) {
        console.error(s);
    }
    return e;
};

const dn = function(n) {
    return n < 10 ? `0${n}` : n.toString();
};

// Ví dụ sử dụng:
// console.log(hn("test }@{ 48656c6c6f20576f726c64")); // Thay thế bằng dữ liệu thực tế của bạn

// Hàm để giải mã một đối tượng
function decryptObject(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    
    const decrypted = {};
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string' && value.startsWith('https://phatnguoi.com }@{ ')) {
            decrypted[key] = hn(value);
        } else if (Array.isArray(value)) {
            decrypted[key] = value.map(item => decryptObject(item));
        } else if (typeof value === 'object') {
            decrypted[key] = decryptObject(value);
        } else {
            decrypted[key] = value;
        }
    }
    return decrypted;
}

function formatViolation(violation) {
  return `Loại phương tiện: ${violation.vehicleType}\nNgày vi phạm: ${violation.violationTime}\nĐịa điểm vi phạm: ${violation.violationAddress}\nHành vi vi phạm: ${violation.behavior}\nHình phạt: ${violation.fineAmount}\nTrạng thái: ${violation.status.toUpperCase()}\nĐơn vị phụ trách: ${violation.provider}\nĐT liên hệ: ${violation.contactPhone}\nĐịa điểm nộp phạt: ${violation.contactAddress}`;
}





module.exports.run = async function (api, event, args, client) {
    if(args.length != 3) return api.sendMessage('TIn nhắn sai cú pháp', event.threadID, event.messageID);
    const url = 'https://asia-east2-viphamgiaothong2019.cloudfunctions.net/national';

    const headers = {
    'authority': 'asia-east2-viphamgiaothong2019.cloudfunctions.net',
    'accept': '*/*',
    'accept-encoding': 'gzip, deflate, br, zstd',
    'accept-language': 'vi,en;q=0.9,en-GB;q=0.8,en-US;q=0.7',
    'content-type': 'application/json',
    'origin': 'https://phatnguoi.com',
    'referer': 'https://phatnguoi.com/',
    'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'cross-site',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    'x-firebase-appcheck': 'eyJraWQiOiJNbjVDS1EiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxOjMxMzIwNTE1MTg3Mzp3ZWI6NjcyM2FhYTg1MGZjN2FiOWJkZDU4MCIsImF1ZCI6WyJwcm9qZWN0c1wvMzEzMjA1MTUxODczIiwicHJvamVjdHNcL3ZpcGhhbWdpYW90aG9uZzIwMTkiXSwicHJvdmlkZXIiOiJyZWNhcHRjaGFfdjMiLCJpc3MiOiJodHRwczpcL1wvZmlyZWJhc2VhcHBjaGVjay5nb29nbGVhcGlzLmNvbVwvMzEzMjA1MTUxODczIiwiZXhwIjoxNzE5NjA3NTg3LCJpYXQiOjE3MTk1ODU5ODcsImp0aSI6InMwb1F6YUJETnVHTEYyS2RxTWs3UTVySmlFUlpYSXhldnVKTlZCV0YzMVUifQ.Y_3ja_9YzWcChLwo3eslu8TSqPGTRb11I90-JMC-jtf-0biWSrV9ecs7iHyY1Z4zEav8b1yUo-d8RaH1RCA503uOFpz-6ZuP39FnjebSKQnJV-DBY34WSug-DJlLXPITagmJSwd4vIl5PcFSlN1GmxAOvr3cJWcZAaM2uKW-NzbvQYjp7JucHfgKLDGF9reZNDfZrchIFhYe0WsfUXYlA0t4BH1FqpHTC3Hw_w_Lsw0rFWhUm5fe5MWrFPwj-Mkc-2Yp5tlZ2cha4S6fAt9o6LgDTtXYME2MMYG6hVMQHabU3pCOkX3Y5PWUSTltVglXpVtarYxdA69Tx_jbH9jg5nxDW1ecBjdencD9BaI0qnig6QhFGmMJhrm9VZL09r0nssgoyS53U5K82cudjsS7SaNcZk6D-URWUTwURoiBk2fGefeqthWrlIPG1prxBdLt1Bdkzwqk2Riy9s655j_SHW1SSpI4iSRD0AW4gxKPaSJ41EphG67tAnYjH4vhlBtd'
    };
    
    const data = {
    data: {
        BienKS: args[1],
        Xe: args[2],
        Cert: "",
        MauXe: "T",
        Refresh: false
    }
    };

    axios.post(url, data, { headers: headers })
    .then(response => {
        console.log('Response:', response.data);
        let encryptedJson = response.data;
        if(!encryptedJson.result.isSuccess) return
        if(encryptedJson.result.violations.length == 0) return api.sendMessage('Không tìm thấy vi phạm', event.threadID, event.messageID)
        const decryptedJson = decryptObject(encryptedJson.result.violations);
        let text = '';
        Object.entries(decryptedJson).forEach(([key, violation]) => {
        text += `Lỗi ${key}: \n`
        text += formatViolation(violation) + '\n';
        });
        api.sendMessage(text, event.threadID, event.messageID);
    })
    .catch(error => {
        console.error('Error:', error);
        api.sendMessage(error.message, event.threadID, event.messageID);
    });
}