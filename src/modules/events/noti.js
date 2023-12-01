module.exports.config = {
    name: 'noti',
    version: '1.0.0',
    credit: 'HungDz',
    description: 'Noti!',
    usage:''
}

module.exports.run = function (api, event, args, client) {
// Hàm được thực thi khico ev bat ki xay ra
console.log("event!!")

}


module.exports.onload = function (api, client) {
// Hàm được thực thi khi bpt khởi chay
console.log("noti@!")
}