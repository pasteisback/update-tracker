const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder().setName('test').setDescription('Send test update notification'),
  async execute(interaction) {
    const channel = interaction.client.channels.cache.get(config.channelId);
    if (!channel) return await interaction.reply({ content: '❌ Update channel not set.', ephemeral: true });

    const version = '0.999.0.1234567';
    const versionTag = `${version}-testhash`;

    const embed = new EmbedBuilder()
      .setTitle('Roblox updated!')
      .setDescription(`🆕 Roblox Windows Player has updated to **${versionTag}**`)
      .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/6/6b/Roblox_Logo_2022.svg')
      .setColor(0x00ff00)
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('⬇ Download Update')
        .setStyle(ButtonStyle.Link)
        .setURL(`https://rdd.weao.xyz/?channel=LIVE&binaryType=WindowsPlayer&version=${versionTag}`)
    );

    await interaction.reply('✅ Test notification sent!');
    channel.send({ embeds: [embed], components: [row] });
  }
};
