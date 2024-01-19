async function maladd(title, id, pass) {
  title = await title.replace("(Dub)", "");
  const axios = require("axios");
  const { Mal } = require("node-myanimelist");
  const { ANIME } = require("@consumet/extensions");
  const auth = Mal.auth("d0b22d129a541dac4d28207f77b15b5f");
  const chalk = require("chalk");
  const successColour = chalk.green.bold;
  const notecolour = chalk.red.bold;
  const fs = require("fs").promises;
  const path = require("path");
  const yaml = require("js-yaml");
  try {
    const acount = await auth.Unstable.login(id, pass);
    console.log(acount);
    if (
      !acount ||
      !acount.user ||
      !acount.user.acount ||
      !acount.user.acount.malToken ||
      !acount.user.acount.malToken.access_token
    ) {
      throw new Error(
        "Invalid credentials. Please check your MyAnimeList ID and password."
      );
    }

    const accessToken = acount.user.acount.malToken.access_token;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const zoro = new ANIME.Zoro();
    let malid;
    let animename;
    const fields = ["my_list_status"];
    await zorosearch(title, 1);

    async function zorosearch(title, page) {
      await zoro.search(title, page).then(async (data) => {
        match = false;
        for (const result of data.results) {
          if (match === true) break;
          if (result.title === title) {
            await zoro.fetchAnimeInfo(result.id).then((data2) => {
              malid = data2.malID;
              animename = data2.title;
            });
            match = true;
          }
        }
        if (match === false && data.hasNextPage === true) {
          await zorosearch(title, page + 1);
        }
      });
    }

    if (!animename)
      return console.log(
        notecolour(`Couldnt Add ${title} [ skipping this step.. ]`)
      );

    const tocheckanime = `https://api.myanimelist.net/v2/anime/${malid}`;
    const toaddanime = `https://api.myanimelist.net/v2/anime/${malid}/my_list_status`;

    try {
      const response = await axios.get(
        `${tocheckanime}?fields=${fields.join(",")}`,
        { headers }
      );

      console.log(response);

      if (response.data.my_list_status) {
        console.log(
          notecolour(`${animename} Already exists in your list [ skipping ]`)
        );
      } else {
        const data = new URLSearchParams();
        data.append("status", "plan_to_watch");
        await axios.put(toaddanime, data, { headers });
        console.log(successColour(`Added: ${animename} to plan to watch list`));
      }
    } catch (error) {
      console.log(error);
      console.log(notecolour(`Couldnt Add ${title} [ skipping this step.. ]`));
    }
  } catch (error) {
    (async () => {
      const filePath = path.join(__dirname, "../../config.yaml");
      const yamlFile = await fs.readFile(filePath, "utf8");
      let config = yaml.load(yamlFile);
      if (config && config.mal) {
        config.mal.add_to_mal = false;
      }
      const commentLines = [
        "# Set to true if you want to add anime to your MyAnimeList account.",
        "# Your MyAnimeList ID.",
        "# Your MyAnimeList password.",
        "# Set the quality to download.",
        "# Options: 1080p, 720p, 360p, default, backup",
      ];
      const updatedYaml = commentLines.join("\n") + "\n" + yaml.dump(config);
      await fs.writeFile(filePath, updatedYaml, "utf8");
    })();

    console.log(notecolour(`Your Id or Pass is incorrect`));
    console.log(
      notecolour(
        `Disabled this feature for now. you can update your id and pass and set mal to true to re-enable it.`
      )
    );
  }
}

module.exports = maladd;
