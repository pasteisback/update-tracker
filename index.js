const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection } = require('discord.js');
const fetch = require('node-fetch');
const fs = require('fs');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const config = require('./config.json');
const commandFiles = ['test.js', 'setchannel.js'];

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  checkForUpdates();
  setInterval(checkForUpdates, 60 * 1000); // check every 60s
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (command) {
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '❌ There was an error.', ephemeral: true });
    }
  }
});

async function checkForUpdates() {
  try {
    const res = await fetch('https://clientsettingscdn.roblox.com/v2/client-version/WindowsPlayer');
    const data = await res.json();

    const versionTag = `${data.version}-${data.clientVersionUpload}`;
    const isFuture = versionTag !== config.lastVersion;

    if (isFuture) {
      config.lastVersion = versionTag;
      fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));

      if (config.channelId) {
        const channel = await client.channels.fetch(config.channelId);
        const embed = new EmbedBuilder()
          .setTitle(data.version.includes("0.") ? "Roblox updated!" : "Future Roblox update!")
          .setDescription(
            data.version.includes("0.")
              ? `🆕 Roblox Windows Player has updated to **${versionTag}**`
              : `Roblox has released a **pre-version**: ${versionTag}`
          )
          .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/6/6b/Roblox_Logo_2022.svg')
          .setColor(data.version.includes("0.") ? 0x00ff00 : 0xff9900)
          .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel('⬇ Download Update')
            .setStyle(ButtonStyle.Link)
            .setURL(`https://rdd.weao.xyz/?channel=LIVE&binaryType=WindowsPlayer&version=${versionTag}`)
        );

        channel.send({ embeds: [embed], components: [row] });
      }
    }
  } catch (err) {
    console.error('❌ Failed to check update:', err);
  }
}

client.login('MTM3NTI3NzM1NDk1NTMxMzE3Mw.G3F2MX.TNiCWnZyjoPN-229XjRmhw9eAbrD4Qq-TaWW_0');
