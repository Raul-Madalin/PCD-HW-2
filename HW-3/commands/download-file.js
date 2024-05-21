require("../../opendsu-sdk/builds/output/openDSU");

const opendsu = require('opendsu');
const resolver = opendsu.loadAPI('resolver');
const fs = require('fs');

module.exports = {
  command: 'download-file <keySSI> <dsuFilePath> <localFilePath>',
  describe: 'Download a file from a DSU',
  handler: (argv) => {
    const { keySSI, dsuFilePath, localFilePath } = argv;

    resolver.loadDSU(keySSI, (err, dsuInstance) => {
      if (err) {
        process.stdout.write(`Error loading DSU: ${err.message}`);
        return;
      }

      dsuInstance.readFile(dsuFilePath, (err, data) => {
        if (err) {
          process.stdout.write(`Error reading file from DSU: ${err.message}`);
          return;
        }

        fs.writeFile(localFilePath, data, (err) => {
          if (err) {
            process.stdout.write(`Error writing file to local path: ${err.message}`);
            return;
          }
          process.stdout.write(`File downloaded successfully to ${localFilePath}`);
        });
      });
    });
  }
};