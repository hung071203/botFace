module.exports.config = {
    name: "ats",
    version: "1.0.0",
    credits: "Ralph",
    description: "Chan spam tag",
    tag: 'system',
    usage: "!ats",
};
  
  
module.exports.run = async function (api, event, args, client) {
  if (process.env.ATS == 0) {
    process.env.ATS = 1;
    api.sendMessage('AntiSpam đang được kích hoạt', event.threadID);

  }else{
    process.env.ATS = 0;
    api.sendMessage('AntiSpam đã tắt', event.threadID);

  }
}