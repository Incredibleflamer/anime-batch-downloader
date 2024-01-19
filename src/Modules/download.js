const fs = require("fs").promises;
const download = require("node-hls-downloader").download;
const path = require("path");
const { ANIME } = require("@consumet/extensions");
const gogoanime = new ANIME.Gogoanime();
const HLSLogger = require("./HLSLogger");
// dir maker
async function directoryMaker(title) {
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
  //Temp Dir
  const tempdir = "./Temps";
  try {
    await fs.access(tempdir);
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.mkdir(tempdir);
    } else {
      throw error;
    }
  }
  return [directoryName];
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
  directoryName
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
    await downloadVideo(selectedSource.url, directoryName, episodeNumber);
  } else {
    console.log(`No Video found for episode ${episodeNumber}`);
  }
}

// download 1 ep
async function download1Episode(animeInfo, eptodownload, config) {
  const [directoryName] = await directoryMaker(animeInfo.title);
  const targetEpisode = animeInfo.episodes.find(
    (episode) => episode.number === eptodownload
  );

  if (targetEpisode) {
    const sourcesArray = await fetchEpisodeSources(targetEpisode.id);
    await downloadEpisodeByQuality(
      sourcesArray,
      config.configs.quality,
      ["1080p", "720p", "360p", "default", "backup"],
      targetEpisode.number,
      directoryName
    );
  } else {
    console.log(`Episode ${eptodownload} not found`);
  }
}

// download from ep to ep
async function downloadfromtosomewhere(animeInfo, from, till, config) {
  const [directoryName] = await directoryMaker(animeInfo.title);

  for (const currentEpisode of animeInfo.episodes) {
    if (currentEpisode.number >= from && currentEpisode.number <= till) {
      const sourcesArray = await fetchEpisodeSources(currentEpisode.id);
      await downloadEpisodeByQuality(
        sourcesArray,
        config.configs.quality,
        ["1080p", "720p", "360p", "default", "backup"],
        currentEpisode.number,
        directoryName
      );
    }
  }
}

// download all ep
async function downloadAllEpisodes(animeInfo, config) {
  const [directoryName] = await directoryMaker(animeInfo.title);

  for (const currentEpisode of animeInfo.episodes) {
    const sourcesArray = await fetchEpisodeSources(currentEpisode.id);
    await downloadEpisodeByQuality(
      sourcesArray,
      config.configs.quality,
      ["1080p", "720p", "360p", "default", "backup"],
      currentEpisode.number,
      directoryName
    );
  }
}

// download ep
async function downloadVideo(Url, directoryName, episodeNumber) {
  const hlsLogger = new HLSLogger(`Downloading EP ${episodeNumber}`, 0, false);

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
    segmentsDir: "./Temps/",
  });
}

module.exports = {
  downloadfromtosomewhere,
  download1Episode,
  downloadAllEpisodes,
};
