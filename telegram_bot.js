const TelegramBot = require('node-telegram-bot-api');
const {HttpsProxyAgent} = require('https-proxy-agent');
const {getPrice,getGas,input} = require("./getPrice")

// replace the value below with the Telegram token you receive from @BotFather
const token = '6850824722:AAHy0VfRjhE_g8vU28UDlbbkfsjEYL_D7Og';

// proxy configuration
const proxyAgent = new HttpsProxyAgent('http://127.0.0.1:7890');
// Create a bot that uses 'polling' to fetch new updates
// const bot = new TelegramBot(token, {polling: true});
// use proxy for Telegram Bot request
const bot = new TelegramBot(token, {
  polling: true,
  request: {
    agent: proxyAgent,
  },
});

bot.on('message',async (msg) => {
  const content = msg.text.toString().toLowerCase();
  const DepositPoolRegex = /input\s*(\d+)\s*(\d+)/;
  // console.log(msg)
  if (content.indexOf("hi") === 0) {
  bot.sendMessage(msg.chat.id,"Hello dear user");
  }

  if (content.includes("bye")) {
  bot.sendMessage(msg.chat.id, "Hope to see you around again , Bye");
  }

  if (content.includes("price")) {
    const response = await getPrice('all');
    bot.sendMessage(msg.chat.id, response);
  }

  if (content.includes("gas")) {
    const gas = await getGas();
    // console.log(msg.chat.id)
    bot.sendMessage(msg.chat.id,gas)
  }

  if (content.includes("input")) {
    const poolId = content.match(DepositPoolRegex)[1];
    const value = content.match(DepositPoolRegex)[2];
    const result = await input(poolId,value)
    if (result) {
      bot.sendMessage(msg.chat.id,`Inputed poolId:${poolId} value:${value} successfully!`)
    }else bot.sendMessage(msg.chat.id,'Failed, please try again later!')
  }

  if (msg.text.toString().toLowerCase().includes("listen")) {

  }
});
