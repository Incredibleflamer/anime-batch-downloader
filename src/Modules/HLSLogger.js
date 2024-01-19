const ProgressBar = require("progress");

class HLSLogger {
  constructor(caption = "downloading", indent = 0, quiet = false) {
    this.quiet = quiet;
    this.template = `${"".padStart(
      indent,
      " "
    )}${caption} [:bar] :current/:total (:percent) :etas`;
    this.startTime = null;
  }

  logger = (...args) => {
    if (!this.quiet && typeof args[0] === "string") {
      const matches = args[0].match(/Queueing (\d+) segment/);
      if (matches?.[1] && !this.startTime) {
        this.startTime = new Date();
        this.segmentCount = parseInt(matches[1]);
        this.bar = new ProgressBar(this.template, {
          total: this.segmentCount,
          width: 20,
          incomplete: " ",
        });
      }

      if (args[0] === "Received:") {
        this.bar?.tick();
        if (this.bar.complete) {
          const elapsedTime = (new Date() - this.startTime) / 1000;
          console.log(
            `Download completed in ${elapsedTime.toFixed(1)} seconds`
          );
        }
      }
    }
  };
}

module.exports = HLSLogger;
