const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const search = require("youtube-search");
const queue = new Map();
module.exports = async (client, message, args) => {
  const queue = new Map();
 const serverQueue = queue.get(message.guild.id);
 const voiceChannel = message.member.voice.channel;

  //verificamos que el usuario solicitante este conectado en un canal de voz.
    if (!voiceChannel) return message.channel.send('¡Necesitas unirte a un canal de voz para reproducir música!');

    const permissions = voiceChannel.permissionsFor(message.client.user);

  //verificamos que el bot tenga permisos de conectar y de hablar en el canal de voz.
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
      return message.channel.send('¡Necesito permisos para unirme y hablar en el canal de voz!');
    }
  
  // <-- Capturamos la información de la música a reproducir -->


  

 var opts = {
    maxResults: 1, //Maximo de resultados a encontrar
    key: 'AIzaSyAbikE-1Yj32P9GDGaH8dm7tYgz0jeE72k', //Necesitas una CLAVE de la API de youtube. 
    type: "video" // Que tipo de resultado a obtener.
  };

  const songArg = await search(args.join(' '), opts);
  const songURL = songArg.results[0].link;
  const songInfo = await ytdl.getInfo(songURL);

  const song = {
    title: songInfo.videoDetails.video_url,
    url: songInfo.videoDetails.video_url,
    author: message.author.tag
  };

if (!serverQueue) {
  // Si NO hay una lista de música.
  // <-- Creamos nuestra cola de música a reproducir  -->

}else {
  // Si HAY una lista de música reproduciendo.

  serverQueue.songs.push(song);
  console.log(serverQueue.songs);
  return message.channel.send(`**${song.title}** ha sido añadido a la cola!, __por: ${message.author.tag}__`);

}

const queueObject = {
 textChannel: message.channel, //guardamos el canal de texto
 voiceChannel: voiceChannel, // guardamos el canal de voz
 connection: null, // un objeto para la conexión 
 songs: [], // creamos la lista de canciones
 volume: 5, // volumen al iniciar la cola
 playing: true, // un objeto para validar la cola de música en reproducción.
};

queue.set(message.guild.id, queueObject);

// Agregamos las canciones al conjunto de datos
queueObject.songs.push(song);

try {
 // Aquí unimos el bot al canal de voz y guardar nuestra conexión en nuestro objeto.
 var connection = await voiceChannel.join();
 queueObject.connection = connection;

 message.channel.send(`Reproduciendo ahora: **${song.title}**`);

 // Llamar a la función de reproducción para comenzar una canción.
 play(message.guild, queueObject.songs[0]);

} catch (err) {

 // Imprimir el mensaje de error si el bot no puede unirse al chat de voz
 console.log(err);
 queue.delete(message.guild.id);
 return message.channel.send(err);

}

function play(guild, song) {
 const serverQueue = queue.get(guild.id);
 // verificamos que hay musica en nuestro objeto de lista
 if (!song) {
  serverQueue.voiceChannel.leave(); // si no hay mas música en la cola, desconectamos nuestro bot
  queue.delete(guild.id);
  return;
 }

 // <-- Reproducción usando play()  -->

}

}