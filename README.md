<h6 align="right">💻 Support Windows Only For Now</h6>
<h1 align="center">
  <img src="https://capsule-render.vercel.app/api?type=soft&fontColor=703ee5&text=Incredibleflamer/anime-batch-downloader&height=150&fontSize=40&desc=Ridiculously%20efficient,%20fast%20and%20light-weight.&descAlignY=75&descAlign=50&color=00000000&animation=twinkling">
</h1>

## Overview 🌐

This is a Node.js-based anime downloader that allows you to download anime episodes in bulk, quickly, and from the gogo source. Additionally, it has the functionality to automatically add the downloaded anime to your MyAnimeList plan-to-watch list. The downloader supports both dubbed (dub) and subtitled (sub) versions.

### Features ✨

- **Bulk Downloading:** Download multiple anime episodes in one go.
- **Fast and Efficient:** Enjoy a ridiculously efficient, fast, and light-weight downloader.
- **Dub and Sub Options:** Download either dubbed or subtitled versions based on your preference.
- **MyAnimeList Integration:** Automatically add downloaded anime to your MyAnimeList plan-to-watch list.

## System Requirements ⚙️

- **Operating System:** Windows (Support for other platforms coming soon)
- **Node.js:** Ensure you have Node.js installed on your machine.

## Installation 🚀

1. Clone the repository:

    ```bash
    git clone https://github.com/Incredibleflamer/anime-batch-downloader.git
    ```

2. Run the anime downloader:

    ```bash
    run start.bat from file explorer
    ```

## Usage 📘

1. Run `start.bat`.
2. Enter the name of the anime you want to install. If it says it can't find the anime, try adding the proper name or just the starting name (e.g., Overlord).
3. Select your anime from the results.
4. It will automatically add the selected anime to your MyAnimeList (if your ID and password are correct).
5. It will then prompt you to choose the download option:
    - **Download All Episodes:** Will download all episodes in the series.
    - **Download One Episode:** Will ask you which episode to download; you can specify only one episode.
    - **Download from Specific Episode Range:** Will ask you to specify the range, for example, 10 to 20.
6. Wait for the download to complete; you can keep the command prompt in the background.
7. Open the "Anime" folder where you will find your downloaded anime.

**Note:** Ensure that the MyAnimeList ID and password provided in the `config.yaml` file are correct for automatic addition to your MyAnimeList account.

## Video
🎥 Coming Soon..

## Configuration⚙️
Before using the anime downloader, make sure to configure the `config.yaml` file located in the project root.

### config.yaml

```yaml
mal:
  add_to_mal: false
  mal_id: __kowareta__
  mal_pass: ZAf9S4UHomfW

configs:
  # Options: 1080p, 720p, 360p, default, backup
  quality: 1080p
```

### MyAnimeList Configuration

- Set the add_to_mal option to true if you want to add anime to your MyAnimeList account.
- Provide your MyAnimeList ID and password in the mal_id and mal_pass fields.

### Quality
- Choose the desired quality to download by setting the quality option. Options include 1080p, 720p, 360p, default, and backup.

## Note
*Do not edit anything else in the code that can break its functionality.*
