

module.exports.config = {
    name: 'noti',
    version: '1.0.0',
    credit: 'HungDz',
    description: 'Noti!',
    usage:''
}

let check = true
module.exports.run = function (api, event, client) {
    if(check){
        check = false
        processData(api, client); 
    }
    
    
    
}

module.exports.onload = function (api, client) {
    client.crypto = [{
        name: 'Bitcoin',
        originalPrice: 20000,
        price: 0,
    },
    {
        name: 'Ethereum',
        originalPrice: 1500,
        price: 0
    },
    {
        name: 'Ripple',
        originalPrice: 0.5,
        price: 0
    },
    {
        name: 'Litecoin',
        originalPrice: 200,
        price: 0
    },
    {
        name: 'Cardano',
        originalPrice: 0.3,
        price: 0
    }]
    client.crypto.forEach(crypto => {
        crypto.price = parseFloat(calculateNewPrice(crypto.originalPrice).toFixed(2))
    });
    setInterval(() => {
        processData(api, client); 
    }, 60000 * 2);

    setInterval(() => {
        client.crypto.forEach(crypto => {
            crypto.price = parseFloat(calculateNewPrice(crypto.originalPrice).toFixed(2))
        });
    }, 100000);


    // setTimeout(() => {
    //     clearInterval(interval); 
    //     console.log("Processing stopped after 7 seconds.");
    // }, 7000);
}
function processData(api, client) {
    api.getThreadList(999, null, [], (err, arr) => {
        if (err) return console.error(err);
        client.QTV = []
        arr.forEach(thread => {
            if (thread.isGroup) {
                let qtvIDs = thread.adminIDs
                qtvIDs.forEach(e => {
                    client.QTV.push({
                        threadID: thread.threadID,
                        adminID: e
                    })
                })

            }
        })
    });
}

function calculateNewPrice(originalPrice) {
    const baseVolatility = 0.03; // Độ biến động cơ sở
    let volatility = baseVolatility;

    let rd = Math.random()

    // Đôi khi tăng độ biến động
    if (rd < 0.2) { // 20% xác suất (không thay đổi từ 20%)
        volatility *= 10; // Tăng độ biến động lên 5 lần
    }else if (rd >= 0.2 && rd < 0.6) { 
        const crashFactor = Math.random() * 0.5 + 0.4; // Giảm giá từ 40% đến 90%
        return originalPrice * (1 - crashFactor);
    }
    const randomFactor = Math.random() * volatility * 2 - volatility; // Yếu tố ngẫu nhiên từ -volatility đến +volatility
    const change = originalPrice * randomFactor;
    const newPrice = originalPrice + change;
    return newPrice;
}