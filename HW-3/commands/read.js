require("../../opendsu-sdk/builds/output/openDSU");

const opendsu = require('opendsu');
const KeySSISpace = opendsu.loadAPI('keyssi');
const resolver = opendsu.loadAPI('resolver');
const fs = require('fs');

module.exports = {
  command: 'read <keySSI> <filePath>',
  describe: 'Read content of a file in a DSU',
  handler: (argv) => {
    const { keySSI: keySSI, filePath: filePath } = argv;
    resolver.loadDSU(keySSI, (err, dsuInstance) => {
      if (err) {
        process.stdout.write(`Error loading DSU: ${err.message}\n`);
        return;
      }
      dsuInstance.readFile(filePath, (err, data) => {
        if (err) {
          process.stdout.write(`Error reading file: ${err.message}\n`);
          return;
        }
        process.stdout.write(`File content: ${data.toString()}\n`);
      });
    });
  }
};
