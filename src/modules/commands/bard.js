const axios = require("axios");

module.exports.config = {
  name: "bard",
  version: "1.0.0",
  credits: "Ralph",
  description: "Trả lời câu hỏi bằng AI",
  usage: "!bard [câu hỏi]",
};


module.exports.run = async function (api, event, args, client) {
    console.log(args);
    let lastQuery = "";
    if (!args[1]) {
    api.sendMessage("Cho câu hỏi vào để tìm kiếm", event.threadID, event.messageID);
    return;
    }

    const query = args.slice(1).join(" ");
    if (query === lastQuery) {
        api.sendMessage("🕰️ | 𝘜𝘱𝘥𝘢𝘵𝘦𝘥 𝘢𝘯𝘴𝘸𝘦𝘳 𝘵𝘰 𝘱𝘳𝘦𝘷𝘪𝘰𝘶𝘴 𝘲𝘶𝘦𝘴𝘵𝘪𝘰𝘯", event.threadID, event.messageID);
        return;
    } else {
        lastQuery = query;
    }

    try {
        const response = await axios.get(`https://hazeyy-api-blackbox.kyrinwu.repl.co/ask?q=${encodeURIComponent(query)}`);

        if (response.status === 200 && response.data && response.data.message) {
        const answer = response.data.message;
        const formattedAnswer = formatFont(answer); // Apply font formatting
        api.sendMessage(formattedAnswer, event.threadID, event.messageID);
        } else {
        api.sendMessage("Sorry no relevant answers found", event.threadID, event.messageID);
        }
    } catch (error) {
        console.error(error);
        api.sendMessage("😿 𝖴𝗇𝖾𝗑𝗉𝖾𝖼𝗍𝖾𝖽 𝖤𝗋𝗋𝗈𝗋, 𝖶𝗁𝗂𝗅𝖾 𝗌𝖾𝖺𝗋𝖼𝗁𝗂𝗇𝗀 𝖺𝗇𝗌𝗐𝖾𝗋 𝗈𝗇 𝖠𝖨...", event.threadID, event.messageID);
        return;
    }

};

function formatFont(text) {
    const fontMapping = {
    a: "𝖺",
    b: "𝖻",
    c: "𝖼",
    d: "𝖽",
    e: "𝖾",
    f: "𝖿",
    g: "𝗀",
    h: "𝗁",
    i: "𝗂",
    j: "𝗃",
    k: "𝗄",
    l: "𝗅",
    m: "𝗆",
    n: "𝗇",
    o: "𝗈",
    p: "𝗉",
    q: "𝗊",
    r: "𝗋",
    s: "𝗌",
    t: "𝗍",
    u: "𝗎",
    v: "𝗏",
    w: "𝗐",
    x: "𝗑",
    y: "𝗒",
    z: "𝗓",
    A: "𝖠",
    B: "𝖡",
    C: "𝖢",
    D: "𝖣",
    E: "𝖤",
    F: "𝖥",
    G: "𝖦",
    H: "𝖧",
    I: "𝖨",
    J: "𝖩",
    K: "𝖪",
    L: "𝖫",
    M: "𝖬",
    N: "𝖭",
    O: "𝖮",
    P: "𝖯",
    Q: "𝖰",
    R: "𝖱",
    S: "𝖲",
    T: "𝖳",
    U: "𝖴",
    V: "𝖵",
    W: "𝖶",
    X: "𝖷",
    Y: "𝖸",
    Z: "𝖹"
  };

  let formattedText = "";
  for (const char of text) {
    if (char in fontMapping) {
      formattedText += fontMapping[char];
    } else {
      formattedText += char;
    }
  }
  return formattedText;
}
