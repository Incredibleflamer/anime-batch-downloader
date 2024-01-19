const { ANIME } = require("@consumet/extensions");
const gogoanime = new ANIME.Gogoanime();
const chalk = require("chalk");
const baseColour = chalk.yellow.bold;
const infoColour = chalk.cyanBright.bold;
const successColour = chalk.green.bold;
const notecolour = chalk.red.bold;
const readline = require("readline");
const fix = require("./Modules/fix");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const path = require("path");
const fs = require("fs").promises;
const maladd = require("./Modules/mal");
const clearConsole = require("./Modules/function");
const {
  downloadfromtosomewhere,
  download1Episode,
  downloadAllEpisodes,
} = require("./Modules/download");
// config
const yaml = require("js-yaml");
let config;

(async () => {
  const filePath = path.join(__dirname, "../config.yaml");
  const yamlFile = await fs.readFile(filePath, "utf8");
  config = yaml.load(yamlFile);

  console.log(
    baseColour(
      `
    ___   _   _ ________  ___ _____  ______ _____  _    _ _   _  _     _____  ___ ______ ___________ 
   / _ \\ | \\ | |_   _|  \\/  ||  ___| |  _  \\  _  || |  | | \\ | || |   |  _  |/ _ \\|  _  \\  ___| ___ \\
  / /_\\ \\| \\| | | | | .  . || |__   | | | | | | || |  | |  \\| || |   | | | / /_\\ \\ | | | |__ | |_/ /
  |  _  || . \` | | | | |\\/| ||  __|  | | | | | | || |\\| | . \` || |   | | | |  _  | | | |  __||    / 
  | | | || |\\  |_| |_| |  | || |___  | |/ /\\ \\_/ /\\  /\\  / |\\  || |___\\ \\_/ / | | | |/ /| |___| |\\ \\ 
  \\_| |_/\_| \\_/\\___/\\_|  |_/\____/  |___/  \\___/  \\/  \\/\\_| \\_/\\_____/\\___/\\_| |_/___/ \\____/\\_| \\_|
                                                                                    
                                                                                                  \nMade by - Incredible Flamers\nVersion: 3.0\n`
    )
  );

  rl.question(infoColour(`Enter Anime Name : `), (Anime_NAME) => {
    clearConsole();
    searchAnime(Anime_NAME);
  });
})();

// Functions
function searchAnime(Anime_NAME) {
  const formattedAnimeName = Anime_NAME.replace(/\w\S*/g, (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

  gogoanime
    .search(formattedAnimeName, 1)
    .then((data) => {
      clearConsole();
      if (data.results.length <= 0) {
        return searchWithOriginalName(Anime_NAME, 1);
      }
      console.log(infoColour(`Select Anime Which You Wanna Download\n`));

      for (let i = 0; i < data.results.length; i++) {
        const title = data.results[i].title;
        console.log(successColour(`[${i + 1}] ${title}`));
      }

      resultsshow = data.results.length;
      let next, back;
      if (data.hasNextPage) {
        resultsshow++;
        console.log(baseColour(`[${resultsshow}] Next page`));
        next = resultsshow;
      }

      if (data.currentPage > 1) {
        resultsshow++;
        console.log(baseColour(`[${resultsshow}] Back page`));
        back = resultsshow;
      }

      promptUser(data, Anime_NAME, next, back);
    })
    .catch((error) => {
      rl.close();
      clearConsole();
      if (error.message === "getaddrinfo ENOTFOUND gogoanimehd.io") {
        return fix();
      } else {
        return console.error(
          notecolour(`Error searching for anime: ${error.message}`)
        );
      }
    });
}

function searchWithOriginalName(Anime_NAME, page) {
  gogoanime
    .search(Anime_NAME, page)
    .then((data) => {
      clearConsole();
      if (data.results.length <= 0) {
        rl.close();
        return console.log(notecolour(`No Anime Found With This Name`));
      }

      console.log(infoColour(`Select Anime Which You Wanna Download\n`));

      for (let i = 0; i < data.results.length; i++) {
        const title = data.results[i].title;
        console.log(successColour(`[${i + 1}] ${title}`));
      }

      resultsshow = data.results.length;
      let next, back;
      if (data.hasNextPage) {
        resultsshow++;
        console.log(baseColour(`[${resultsshow}] Next page`));
        next = resultsshow;
      }

      if (data.currentPage > 1) {
        resultsshow++;
        console.log(baseColour(`[${resultsshow}] Back page`));
        back = resultsshow;
      }

      promptUser(data, Anime_NAME, next, back);
    })
    .catch((error) => {
      rl.close();
      clearConsole();
      return console.error(
        notecolour(`Error searching for anime: ${error.message}`)
      );
    });
}

function promptUser(data, Anime_NAME, next, back) {
  rl.question(
    infoColour(
      `\nEnter the number corresponding to the anime you want to download: `
    ),
    async (userInput) => {
      const index = parseInt(userInput, 10);
      if (!isNaN(index) && index >= 1 && index <= data.results.length) {
        const selectedAnime = data.results[index - 1];
        clearConsole();
        if (config?.mal?.add_to_mal === true) {
          console.log(
            infoColour(
              "Trying To Add Anime In My Anime List.. ( You can disable this in config.yaml )"
            )
          );
          id = config.mal.mal_id;
          pass = config.mal.mal_pass;
          await maladd(selectedAnime.title, id, pass);
        }
        geteps(selectedAnime.id);
      } else if (next && userInput == next && data.hasNextPage) {
        searchWithOriginalName(Anime_NAME, data.currentPage + 1);
      } else if (back && userInput == back && data.currentPage > 1) {
        searchWithOriginalName(Anime_NAME, data.currentPage - 1);
      } else {
        console.error(notecolour(`Invalid input. Please enter a valid number`));
        promptUser(data, Anime_NAME, next, back);
      }
    }
  );
}

async function geteps(Anime_ID) {
  const animeInfo = await gogoanime.fetchAnimeInfo(Anime_ID);
  if (animeInfo.totalEpisodes <= 0) {
    return console.log("there are no valid links to download this anime");
  }
  console.log(
    successColour(
      `There Are ${animeInfo.totalEpisodes} Episodes in ${animeInfo.title}\n`
    )
  );

  if (rl.closed) {
    console.error(notecolour(`Readline interface is closed.`));
    return;
  }

  console.log(infoColour(`1] Download All Eps`));
  console.log(infoColour(`2] Download one Ep`));

  if (animeInfo.totalEpisodes > 2) {
    console.log(infoColour(`3] Download From Specific Ep`));
  }

  rl.question(
    successColour(`\nEnter Number what you wanna do: `),
    async (userChoice) => {
      switch (userChoice) {
        case "1":
          console.log(infoColour(`Downloading all episodes...`));
          downloadAllEpisodes(animeInfo, config);
          break;
        case "2":
          if (!rl.closed) {
            let isValidInput = false;

            const askForEpisode = async () => {
              const epNumber = await new Promise((resolve) => {
                rl.question(
                  infoColour(
                    `Enter the episode number (1 - ${animeInfo.totalEpisodes}): `
                  ),
                  resolve
                );
              });

              const episode = parseInt(epNumber, 10);

              if (
                !isNaN(episode) &&
                episode >= 1 &&
                episode <= animeInfo.totalEpisodes
              ) {
                download1Episode(animeInfo, episode, config);
                isValidInput = true;
              } else {
                console.error(
                  notecolour(
                    `Invalid input. Please enter a valid episode number.`
                  )
                );
                await askForEpisode();
              }
            };

            await askForEpisode();
          }
          break;

        case "3":
          if (animeInfo.totalEpisodes < 2) {
            clearConsole();
            geteps(Anime_ID);
            break;
          }
          if (!rl.closed) {
            let isValidInput = false;

            const askForStartEpisode = async () => {
              const startNumber = await new Promise((resolve) => {
                rl.question(
                  infoColour(
                    `Enter the starting episode number (1 - ${animeInfo.totalEpisodes}): `
                  ),
                  resolve
                );
              });

              const startEpisode = parseInt(startNumber, 10);

              if (
                !isNaN(startEpisode) &&
                startEpisode >= 1 &&
                startEpisode <= animeInfo.totalEpisodes
              ) {
                const askForEndEpisode = async () => {
                  const endNumber = await new Promise((resolve) => {
                    rl.question(
                      infoColour(
                        `Enter the ending episode number (${startEpisode} - ${animeInfo.totalEpisodes}): `
                      ),
                      resolve
                    );
                  });

                  const endEpisode = parseInt(endNumber, 10);

                  if (
                    !isNaN(endEpisode) &&
                    endEpisode >= startEpisode &&
                    endEpisode <= animeInfo.totalEpisodes
                  ) {
                    console.log(
                      infoColour(
                        `Downloading episodes from ${startEpisode} to ${endEpisode}...`
                      )
                    );
                    downloadfromtosomewhere(
                      animeInfo,
                      startEpisode,
                      endEpisode,
                      config
                    );
                    isValidInput = true;
                  } else {
                    console.error(
                      notecolour(
                        `Invalid input. Please enter a valid ending episode number.`
                      )
                    );
                    await askForStartEpisode();
                  }
                };

                await askForEndEpisode();
              } else {
                console.error(
                  notecolour(
                    `Invalid input. Please enter a valid starting episode number.`
                  )
                );
                rl.close();
              }
            };

            await askForStartEpisode();
          }
          break;

        default:
          console.error(
            notecolour(`Invalid input. Please enter a valid number.`)
          );
          clearConsole();
          geteps(Anime_ID);
          break;
      }
    }
  );
}
