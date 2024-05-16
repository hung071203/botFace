const figlet = require('figlet');
module.exports.config = {
    name: "test",
    version: "1.0.0",
    credits: "Ralph",
    description: "Tài xỉu nhiều người chơi",
    tag: 'game',
    usage: "!taixiu [join [t/x] [Mức tiền cược]: tham gia phòng /out: rời phòng /run: Bắt đầu ]",
};
  
  
module.exports.run = async function (api, event, args, client) {
    console.log('dagdy1234rf');
    api.getUserInfoV2('100087613896422')
}