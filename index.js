require('dotenv/config');
const { Client, IntentsBitField } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

console.log('\x1b[33m%s\x1b[0m', `
__  __      _      
|  \\/  |    | |     
| \\  / | ___| |__   
| |\\/| |/ _ \\ '_ \\  
| |  | |  __/ | | | 
|_|  |_|\\___|_| |_|               
`);

console.log('\x1b[31m%s\x1b[0m','Meh','By Albertin#8802');

client.on('ready', () => {
  console.log('\x1b[33m%s\x1b[0m', `
  ❧ Bot is Online ✅
  `);


  client.user.setActivity('Yape: 931070197'); //Aqui puede editar el estado de actividad del bot

  setInterval(() => {
    const message = process.env.AUTO_MESSAGE;
    const channel = client.channels.cache.get(process.env.CHANNEL_ID);
    channel.send(message);
  }, 7200000); // Esto es para los auto mensajes que puede modificar en el archivo .env, 
              //en caso que no quieras el auto mensaje solo desactivalo eliminando la linea 32 hasta la 38 " setInterval"
});

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.channel.id !== process.env.CHANNEL_ID) return;
  if (message.content.startsWith('!')) return;

  let conversationLog = [{ role: 'system', content: 'Soy tu amigo :b si quieres donarme aqui esta mi yape: 931070197.' }];

  try {
    await message.channel.sendTyping();

    let prevMessages = await message.channel.messages.fetch({ limit: 15 });
    prevMessages.reverse();

    prevMessages.forEach((msg) => {
      if (message.content.startsWith('!')) return;
      if (msg.author.id !== client.user.id && message.author.bot) return;
      if (msg.author.id !== message.author.id) return;

      conversationLog.push({
        role: 'user',
        content: msg.content,
      });
    });

    const result = await openai
      .createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: conversationLog,
        // max_tokens: 256, // limit token usage
      })
      .catch((error) => {
        console.log(`OPENAI ERR: ${error}`);
      });

    message.reply(result.data.choices[0].message);
  } catch (error) {
    console.log(`ERR: ${error}`);
  }
});

client.login(process.env.TOKEN);
