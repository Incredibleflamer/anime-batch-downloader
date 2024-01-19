const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

function fix() {
  const filePath = path.join(
    __dirname,
    "node_modules",
    "@consumet",
    "extensions",
    "dist",
    "providers",
    "anime",
    "gogoanime.js"
  );
  const searchString = "https://gogoanimehd.io";
  const replacementString = "https://anitaku.to";

  // Read the file
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(`Error reading file: ${err.message}`);
      return;
    }

    const updatedData = data.replace(
      new RegExp(searchString, "g"),
      replacementString
    );

    fs.writeFile(filePath, updatedData, "utf8", (err) => {
      if (err) {
        console.error(`Error writing to file: ${err.message}`);
        return;
      }
      console.clear();
      console.log("Fix applied. Restarting the script...");

      const node = process.argv[0];
      const script = process.argv[1];
      const args = process.argv.slice(2);

      const child = spawn(node, [script, ...args], {
        stdio: "inherit",
      });

      child.on("exit", (code) => {
        process.exit(code);
      });
    });
  });
}

module.exports = fix;
