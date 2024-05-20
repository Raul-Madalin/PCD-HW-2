require("../../opendsu-sdk/builds/output/openDSU");

const opendsu = require('opendsu');
const KeySSISpace = opendsu.loadAPI('keyssi');
const resolver = opendsu.loadAPI('resolver');
const fs = require('fs');

module.exports = {
  command: 'create <path>',
  describe: 'Create a new DSU and save its keySSI to a file',
  handler: (argv) => {
    const { path: filePath } = argv;
    process.stdout.write(`Creating DSU and saving KeySSI to: ${filePath}`);
    
    const seedSSI = KeySSISpace.createSeedSSI('default');
    resolver.createDSU(seedSSI, (err, dsuInstance) => {
      if (err) {
        process.stdout.write(`Error creating DSU: ${err.message}`);
        return;
      }

      dsuInstance.getKeySSIAsString((err, dsussi) => {
        if (err) {
          process.stdout.write(`Error getting KeySSI as string: ${err.message}`);
          return;
        }

        fs.writeFileSync(filePath, dsussi, 'utf8');
        process.stdout.write(`DSU created successfully. KeySSI saved to: ${filePath}`);
      });
    });
  }
};