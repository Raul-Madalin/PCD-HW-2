require("../../opendsu-sdk/builds/output/openDSU");

const opendsu = require('opendsu');
const resolver = opendsu.loadAPI('resolver');
const fs = require('fs');
const path = require('path');

module.exports = {
  command: 'download-folder <keySSI> <dsuFolderPath> <localFolderPath>',
  describe: 'Download a folder from a DSU',
  handler: (argv) => {
    const { keySSI, dsuFolderPath, localFolderPath } = argv;

    resolver.loadDSU(keySSI, (err, dsuInstance) => {
      if (err) {
        process.stdout.write(`Error loading DSU: ${err.message}`);
        return;
      }

      dsuInstance.listFiles(dsuFolderPath, { recursive: true }, (err, files) => {
        if (err) {
          process.stdout.write(`Error listing files: ${err.message}`);
          return;
        }

        files.forEach((file) => {
          let filePath = path.posix.join(dsuFolderPath, file);
          dsuInstance.readFile(filePath, (err, data) => {
            if (err) {
              process.stdout.write(`Error reading file from DSU: ${err.message}`);
              return;
            }
            let localPath = path.join(localFolderPath, file);
            fs.mkdirSync(path.dirname(localPath), { recursive: true });
            fs.writeFileSync(localPath, data);
          });
        });

        process.stdout.write(`Folder downloaded successfully to ${localFolderPath}`);
      });
    });
  }
};
