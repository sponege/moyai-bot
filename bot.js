const { Client, Intents, MessageEmbed } = require("discord.js");
const client = new Client({
  intents: new Intents(32767), // all intents
  partials: [
    "CHANNEL", // Required to receive DMs
  ],
});

require("./config"); // bot configuration

client.login(process.env["TOKEN"] || global.bot_token);

async function updateStatus(client) {
  while (true) {
    client.user.setActivity(`${global.prefix}${global.activity.command}`, {
      type: global.activity.type,
    });
    await sleep(5 * 1000);
  }
}

client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  updateStatus(client); // keep status up to date
});

// constants
const codeEsc = "```";

client.on("messageCreate", async (msg) => {
  if (msg.partial) {
    msg = await msg.fetch();
  }

  if (
    msg.author.bot || // no bots!
    !(
      msg.channel.type == "DM" ||
      msg.guild.me.permissionsIn(msg.channel).has("SEND_MESSAGES")
    ) // if you don't have permission to send messages then dont
  ) {
    return 0;
  }

  if (msg.content.toLowerCase().startsWith(global.prefix)) {
    // only process messages with command prefix
    var command = msg.content.split(" ")[0].substr(global.prefix.length);
    var op = msg.content.split(" "); // operands
    var contents = msg.content.substr(
      msg.content.indexOf(op[0]) + op[0].length + 1
    );

    switch (
      command // commands for everyone
    ) {
      case "echo":
        var response = await msg.channel.send(
          contents ? contents : "You must supply a message to echo."
        );
        // await sleep(5000);
        // msg.delete();
        // response.delete();
        break;
    }

    if (msg.channel.type != "DM") {
      var user = msg.guild.members.cache.find(
        (member) => member.id == msg.author.id
      );
      if (user.permissions.has("MANAGE_MESSAGES")) {
        // commands for server moderators

        switch (command) {
        }
      }
    }

    if (admins.includes(msg.author.id)) {
      // commands for bot owners
      switch (command) {
        case "list":
          var messages = [];
          client.guilds.cache.forEach(async (guild) => {
            messages.push(
              await msg.channel.send({
                embeds: [
                  new MessageEmbed()
                    .setColor("RANDOM")
                    .setTitle(guild.name)
                    .setDescription(
                      [
                        `Members: ${guild.memberCount}`,
                        `ID: ${guild.id}`,
                        `Permissions: ${codeEsc}${guild.me.permissions.toArray()}${codeEsc}`,
                      ].join("\n")
                    )
                    .setThumbnail(guild.iconURL()),
                ],
              })
            );
          });
          /**
          await sleep(5000);
          msg.delete();
          for (m of messages) {
            m.delete();
          }
          **/
          break;
      }
    }
  }
});

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sleep(ms) {
  // very useful
  return new Promise((resolve) => setTimeout(resolve, ms));
}
