async function maladd(title, id, pass) {
  try {
    title = await title.replace("(Dub)", "");
    const axios = require("axios");
    const { Mal } = require("node-myanimelist");
    const { ANIME } = require("@consumet/extensions");
    const auth = Mal.auth("d0b22d129a541dac4d28207f77b15b5f");
    const acount = await auth.Unstable.login(id, pass);
    const accessToken = acount.user.acount.malToken.access_token;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const chalk = require("chalk");
    const successColour = chalk.green.bold;
    const notecolour = chalk.red.bold;
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

    await axios
      .get(`${tocheckanime}?fields=${fields.join(",")}`, { headers })
      .then((response) => {
        if (response.data.my_list_status) {
          console.log(
            notecolour(`${animename} Already exist in your list [ skipping ]`)
          );
        } else {
          const data = new URLSearchParams();
          data.append("status", "plan_to_watch");
          axios
            .put(toaddanime, data, { headers })
            .then((response) => {
              console.log(
                successColour(`Added : ${animename} to plan to watch list`)
              );
              i++;
            })
            .catch((error) => {
              console.log(error);
              console.log(
                notecolour(`Couldnt Add ${title} [ skipping this step.. ]`)
              );
            });
        }
      });
  } catch (error) {
    console.log(error);
    console.log(notecolour(`Couldnt Add ${title} [ skipping this step.. ]`));
  }
}

module.exports = maladd;
