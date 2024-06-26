require('dotenv').config()
const { Client } = require('./discord.js-selfbot');

const client = new Client();

client.on('ready', () => {
  console.log(`Connecté en tant que ${client.user.username}`);
});

client.on('messageCreate', (message) => {
  console.log(`Nouveau message de ${message.author.username} : ${message.content}`);
});

client.login(process.env.TOKEN);