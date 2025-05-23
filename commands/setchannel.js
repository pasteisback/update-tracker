const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const config = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder().setName('setchannel').setDescription('Set this channel for update notifications'),
  async execute(interaction) {
    config.channelId = interaction.channel.id;
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
    await interaction.reply(`📡 Update channel set to <#${interaction.channel.id}>`);
  }
};
