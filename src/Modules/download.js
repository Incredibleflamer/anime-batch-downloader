const fs = require("fs").promises;
const download = require("node-hls-downloader").download;
const path = require("path");
const { ANIME } = require("@consumet/extensions");
const gogoanime = new ANIME.Gogoanime();
const HLSLogger = require("./HLSLogger");
let epsdownloaded = 0;
// dir maker
async function directoryMaker(title, ep) {
  //Anime dir
  const animeDirectory = "../Anime";
  try {
    await fs.access(animeDirectory);
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.mkdir(animeDirectory);
    } else {
      throw error;
    }
  }
  //Anime Name Dir
  const directoryName = title.replace(/[^a-zA-Z0-9]/g, "_");
  const directoryPath = path.join(animeDirectory, directoryName);
  await fs.mkdir(directoryPath).catch((err) => {
    if (err.code !== "EEXIST") throw err;
  });
  //Temp of eps
  const tempeps = path.join(animeDirectory, directoryName, `Temp_${ep}/`);
  try {
    await fs.access(tempeps);
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.mkdir(tempeps);
    } else {
      throw error;
    }
  }
  return [directoryName, tempeps];
}

async function fetchEpisodeSources(episodeId) {
  const sources = await gogoanime.fetchEpisodeSources(episodeId);
  return Array.isArray(sources) ? sources[0].sources : sources.sources;
}

async function downloadEpisodeByQuality(
  sourcesArray,
  userSelectedQuality,
  preferredQualities,
  episodeNumber,
  directoryName,
  tempname
) {
  let selectedSource = sourcesArray.find(
    (source) => source.quality === userSelectedQuality
  );

  if (!selectedSource) {
    for (const quality of preferredQualities) {
      selectedSource = sourcesArray.find(
        (source) => source.quality === quality
      );
      if (selectedSource) {
        break;
      }
    }
  }

  if (selectedSource) {
    await downloadVideo(
      selectedSource.url,
      directoryName,
      episodeNumber,
      tempname,
      selectedSource.quality
    );
  } else {
    console.log(`No Video found for episode ${episodeNumber}`);
  }
}

// download 1 ep
async function download1Episode(animeInfo, eptodownload, config) {
  const targetEpisode = animeInfo.episodes.find(
    (episode) => episode.number === eptodownload
  );
  if (targetEpisode) {
    const [directoryName, tempname] = await directoryMaker(
      animeInfo.title,
      eptodownload
    );
    const sourcesArray = await fetchEpisodeSources(targetEpisode.id);
    await downloadEpisodeByQuality(
      sourcesArray,
      config.configs.quality,
      ["1080p", "720p", "360p", "default", "backup"],
      targetEpisode.number,
      directoryName,
      tempname
    );
    return epsdownloaded;
  } else {
    console.log(`Episode ${eptodownload} not found`);
    return epsdownloaded;
  }
}

// download from ep to ep
async function downloadfromtosomewhere(animeInfo, from, till, config) {
  for (const currentEpisode of animeInfo.episodes) {
    if (currentEpisode.number >= from && currentEpisode.number <= till) {
      const [directoryName, tempname] = await directoryMaker(
        animeInfo.title,
        currentEpisode.number
      );
      const sourcesArray = await fetchEpisodeSources(currentEpisode.id);
      await downloadEpisodeByQuality(
        sourcesArray,
        config.configs.quality,
        ["1080p", "720p", "360p", "default", "backup"],
        currentEpisode.number,
        directoryName,
        tempname
      );
    }
  }
  return epsdownloaded;
}

// download all ep
async function downloadAllEpisodes(animeInfo, config) {
  for (const currentEpisode of animeInfo.episodes) {
    const [directoryName, tempname] = await directoryMaker(
      animeInfo.title,
      currentEpisode.number
    );
    const sourcesArray = await fetchEpisodeSources(currentEpisode.id);
    await downloadEpisodeByQuality(
      sourcesArray,
      config.configs.quality,
      ["1080p", "720p", "360p", "default", "backup"],
      currentEpisode.number,
      directoryName,
      tempname
    );
  }
  return epsdownloaded;
}

// download ep
async function downloadVideo(
  Url,
  directoryName,
  episodeNumber,
  tempname,
  quality
) {
  const hlsLogger = new HLSLogger(
    `Downloading EP ${episodeNumber} [  ${quality}  ]`,
    0,
    false
  );

  const outputFile = path.join(
    __dirname,
    "../",
    "..",
    "/Anime",
    directoryName,
    `${episodeNumber}Ep.mp4`
  );

  await download({
    quality: "best",
    concurrency: 9,
    maxRetries: 10,
    outputFile,
    streamUrl: Url,
    ffmpegPath: "./Modules/ffmpeg.exe",
    logger: hlsLogger.logger,
    segmentsDir: tempname,
  });
  epsdownloaded += 1;
}
// time calculation
async function timeittook(title, startTime, epsdownloaded) {
  const endTime = performance.now();
  const elapsedTime = endTime - startTime;

  const seconds = Math.floor((elapsedTime / 1000) % 60);
  const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
  const hours = Math.floor(elapsedTime / (1000 * 60 * 60));

  const formattedSeconds = seconds.toFixed(2);

  let timeMessage = `Downloaded ${title} | ( ${epsdownloaded} Eps ) in : `;

  if (hours > 0) {
    timeMessage += `${hours} hour${hours > 1 ? "s" : ""} `;
  }

  if (minutes > 0) {
    timeMessage += `${minutes} minute${minutes > 1 ? "s" : ""} `;
  }

  timeMessage += `${formattedSeconds} second${
    formattedSeconds !== "1.00" ? "s" : ""
  }`;

  return timeMessage;
}
module.exports = {
  downloadfromtosomewhere,
  download1Episode,
  downloadAllEpisodes,
  timeittook,
};
