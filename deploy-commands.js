const { REST, Routes } = require('discord.js');
const { clientId, token } = require('./auth.json');
const fs = require('fs');

const commands = [];
const commandFiles = ['test.js', 'setchannel.js'];

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('🔄 Refreshing slash commands...');
    await rest.put(Routes.applicationCommands(clientId), { body: commands });
    console.log('✅ Slash commands registered!');
  } catch (error) {
    console.error(error);
  }
})();
