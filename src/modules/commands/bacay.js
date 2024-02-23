let users = [];
const suits = ['Cơ', 'Rô', 'Tép', 'Bích'];
const values = ['Át', '2', '3', '4', '5', '6', '7', '8', '9'];
module.exports.config = {
    name: "bacay",
    version: "1.0.0",
    credits: "Ralph",
    description: "bài ba cây",
    tag: 'game',
    usage: "!bacay",
  };
  
  
module.exports.run = async function (api, event, args, client) {
    let check = client.handleReply.find(item => item.name == this.config.name);

    api.sendMessage('Thả tim tin nhắn này để xác nhận tham gia game!\n[start [số tiền cược]] để bắt đầu chơi!', event.threadID , (error, info) => {
        if (error) {
            console.log(error);
        } else {
            let a ={
                type: 'bacay',
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
            };
            if (check) {
                check.messageID = info.messageID;
                check.author = event.senderID;
                console.log(check);
            }else{
                client.handleReply.push(a)
            }
            
            
        }
    }, event.messageID);
    users.length == 0
    process.env.CHECK = 1;
}

module.exports.handleReply = async function (api, event, client) {
    if(!event) return
    if(event.type == 'message_reply'|| event.type == 'message_reaction'){
        const bacayReplies = client.handleReply.filter(reply => reply.type === 'bacay');

        // Lấy phần tử cuối cùng trong mảng sau khi lọc
        const lastBacayReply = bacayReplies.pop();

        if (event.type == 'message_reaction' && event.messageID == lastBacayReply.messageID) {
            if (users.length == 0) {
                users.push(event.userID)
            }else{
                const id = users.find(item => item == event.userID);
                if(id) return;
                users.push(event.userID);
            }
        }
        console.log('fghj'+users);
        let arrs =[];
        if (event.type == 'message_reply') {
            arrs = event.body.trim().split(' ');
        }
        if (arrs[0] =='start' || arrs[0] =='Start') {
            if(arrs.length == 1 || isNaN(arrs[1])) return api.sendMessage('Cú pháp không hợp lệ!', event.threadID, event.messageID);
            let money = parseInt(arrs[1]);
            let uJoin = [];
            users.forEach(e => {
                const id = client.money.find(item => item.ID == e && item.threadID == event.threadID&&item.money >=100);
                if (id) {
                    uJoin.push(id)
                }
            });
            if(uJoin.length < users.length) return api.sendMessage('Cần tối thiểu 100$ để bắt đầu!', event.threadID, event.messageID);
            const checkMN = uJoin.filter( item => item.money >= money);
            if(checkMN.length < users.length) return api.sendMessage('Có người dùng không đủ tiền trong tài khoản, thử lại với số tiền nhỏ hơn', event.threadID, event.messageID);

            if(event.senderID != lastBacayReply.author) return api.sendMessage('Chỉ người chủ trì mới có quyền bắt đầu!', event.threadID, event.messageID);
            if(users.length< 2 || users.length >12) return api.sendMessage('Cần tối thiểu 2 người và tối đa 12 người để chơi!', event.threadID, event.messageID);
            //chia bài
            const deck = shuffleDeck();
            const players = [];

            for (let i = 0; i < users.length; i++) {
                const hand = deck.splice(0, 3);
                const points = calculatePoints(hand);
                const highestSuit = hand.reduce((max, card) => {
                const maxIndex = suits.indexOf(max.suit);
                const cardIndex = suits.indexOf(card.suit);
                const valuesOrder = ['2', '3', '4', '5', '6', '7', '8', '9', 'Át'];
                if (maxIndex > cardIndex || (maxIndex === cardIndex && valuesOrder.indexOf(card.value) > valuesOrder.indexOf(max.value))) {
                    return card;
                }
                
                return max;
                }, hand[0]);
                const highestCard = highestSuit.value;
                console.log(highestCard, highestSuit);
                players.push({ hand, points, highestCard: highestCard.value, highestSuit });
            }
            const winner = determineWinner(players);

            
            users.forEach( async (e, i = 0) => {
                let v = players[i].hand.map(card => `${card.value} ${card.suit}`).join(', ');
                let point = players[i].points;
                await api.getUserInfo(e, (err, userInfo) => {
                    if (err) {
                    console.error(err);
                    return;
                    }

                    const msgbody = `${userInfo[e].name}: ${v} - Điểm: ${point}`;
                    const msg = {
                    body: msgbody,
                    mentions: [
                        {
                        tag: userInfo[e].name,
                        id: e
                        }
                    ]
                    };
                    api.sendMessage(msg, event.threadID, event.messageID);
                    sleep(800);
                });
                i++
            });

            //gửi tin nhắn thông báo người thắng
            users.forEach(e => {
                const id = client.money.find(item => item.ID == e && item.threadID == event.threadID);
                if (id.ID == users[players.indexOf(winner)]) {
                    id.money += money * users.length - 1;
                }else{
                    id.money -= money;
                }
            });
            await api.getUserInfo(users[players.indexOf(winner)], (err, userInfo) => {
                if (err) {
                console.error(err);
                return;
                }

                const msgbody = `Người chơi ${userInfo[users[players.indexOf(winner)]].name} là người thắng với ${players[players.indexOf(winner)].points} điểm\n-Bạn nhận được ${(money * users.length - 1).toLocaleString('en-US')}$, những người còn lại mỗi người mất ${money.toLocaleString('en-US')}$-`;
                const msg = {
                body: msgbody,
                mentions: [
                    {
                    tag: userInfo[users[players.indexOf(winner)]].name,
                    id: users[players.indexOf(winner)]
                    }
                ]
                };
                sleep((users.length + 1)*800);
                api.sendMessage(msg, event.threadID, event.messageID);
            });
            client.handleReply = client.handleReply.filter(item => item.name != this.config.name );
            users.length == 0
            process.env.CHECK = 0;
        }
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function shuffleDeck() {
    const deck = [];
    for (const suit of suits) {
      for (const value of values) {
        deck.push({ suit, value });
      }
    }
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }
  
  function calculatePoints(hand) {
    let points = 0;
    for (const card of hand) {
      const value = card.value === 'Át' ? 1 : isNaN(parseInt(card.value)) ? 10 : parseInt(card.value);
      points += value;
    }
    if (points % 10 == 0) {
      return 10;
    }else{
      return points % 10;
    }
  }
  
  
  
  function determineWinner(players) {
    let winner = players[0];
    for (let i = 1; i < players.length; i++) {
      if (players[i].points > winner.points ||
        (players[i].points === winner.points && suits.indexOf(players[i].highestSuit) > suits.indexOf(winner.highestSuit)) ||
        (players[i].points === winner.points && players[i].highestSuit === winner.highestSuit && values.indexOf(players[i].highestCard) > values.indexOf(winner.highestCard))) {
        winner = players[i];
      }
    }
    
    // Check for tiebreaker
    if (winner.points === players[0].points) {
      const suitsOrder = ['Cơ', 'Rô', 'Tép', 'Bích'];
      const valuesOrder = ['2', '3', '4', '5', '6', '7', '8', '9', 'Át'];
      
      const winnerSuitIndex = suitsOrder.indexOf(winner.highestSuit);
      const otherSuitIndex = suitsOrder.indexOf(players[0].highestSuit);
      
      if (winnerSuitIndex > otherSuitIndex || (winnerSuitIndex === otherSuitIndex && valuesOrder.indexOf(winner.highestCard) < valuesOrder.indexOf(players[0].highestCard))) {
        winner = players[0];
      }
    }
    
    return winner;
  }