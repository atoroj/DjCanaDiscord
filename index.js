const Discord = require('discord.js');
const bot = new Discord.Client();

const ytdl = require("ytdl-core");
const token = 'OTM1OTI1MjkzMDQ1MTQxNTE1.Gt8lM7.NASj5SKqv1flRuMVKNCcA5_fxmmpvbAKO8ZW8Y';
const PREFIX = '!';
var servers = {};

bot.on('ready', () =>{
    console.log('El Cañamaque esta despierto');
});

bot.on('message', (msg) => {
    if(msg.content == "Que pasa Caña"){
        msg.reply('Ponme un larios cola que empieza la sesion');
        console.log("Que pasa aqui kiyo")
    }

    let args = msg.content.substring(PREFIX.length).split(" ");

    switch(args[0]){
        case 'play':

            function play(connection, message){
                var server = servers[message.guild.id];

                server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));

                server.queue.shift();

                server.dispatcher.on("end", function(){
                    if(server.queue[0]){
                        play(connection, message);
                    }else{
                        connection.disconnect();
                    }
                });
            }

            if(!args[1]){
                msg.channel.send("Pero illo, dime que cancion quiere");
                return;
            }
            if(!msg.member.voice.channel){
                msg.channel.send("Quillo, tienes que estar en un canal");
                return;
            }
            if(!servers[msg.guild.id]) servers[msg.guild.id] = {
                queue: []
            }

            var server = servers[msg.guild.id];

            server.queue.push(args[1]);
            
            if(!msg.guild.voice.connection) {
                console.log("Aqui entra");
                msg.member.voice.channel.join().then(function(connection){
                    play(connection, msg);
                });
            } 
        break;
    }
})
bot.login(token);