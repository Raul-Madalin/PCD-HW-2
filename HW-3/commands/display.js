require("../opendsu-sdk/builds/output/openDSU");

const opendsu = require('opendsu');
const resolver = opendsu.loadAPI('resolver');
const path = require('path');

module.exports = {
  command: 'display <keySSI> <dir>',
  describe: 'Display all files and their contents in a DSU',
  builder: (yargs) => {
    yargs
      .option('recursive', {
        alias: 'r',
        type: 'boolean',
        description: 'List files recursively',
        default: false
      })
      .option('ignoreMounts', {
        alias: 'im',
        type: 'boolean',
        description: 'Ignore mounts',
        default: false
      });
  },
  handler: (argv) => {
    const { keySSI, dir, recursive, ignoreMounts } = argv;

    resolver.loadDSU(keySSI, (err, dsuInstance) => {
      if (err) {
        process.stdout.write(`Error loading DSU: ${err.message}`);
        return;
      }

      const listAndReadFiles = (dir) => {
        dsuInstance.listFiles(dir, { recursive, ignoreMounts }, (err, files) => {
          if (err) {
            process.stdout.write(`Error listing files: ${err.message}`);
            return;
          }
          process.stdout.write(`Files: ${files}`);
          files.forEach((file) => {
            let filePath = path.posix.join(dir, file);
            dsuInstance.readFile(filePath, (err, data) => {
              if (err) {
                process.stdout.write(`Error reading file: ${err.message}`);
                return;
              }
              process.stdout.write(`\nFile: ${filePath}\nContent: ${data.toString()}`);
            });
          });
        });
      };

      listAndReadFiles(dir);
    });
  }
};
