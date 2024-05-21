require("../../opendsu-sdk/builds/output/openDSU");

const opendsu = require('opendsu');
const resolver = opendsu.loadAPI('resolver');

module.exports = {
  command: 'create-dir <keySSI> <dirPath>',
  describe: 'Create a new directory in a DSU',
  handler: (argv) => {
    const { keySSI, dirPath } = argv;

    resolver.loadDSU(keySSI, (err, dsuInstance) => {
      if (err) {
        process.stdout.write(`Error loading DSU: ${err.message}`);
        return;
      }

      dsuInstance.safeBeginBatch((err) => {
        if (err) {
          process.stdout.write(`Error starting batch: ${err.message}`);
          return;
        }

        dsuInstance.createFolder(dirPath, (err) => {
          if (err) {
            process.stdout.write(`Error creating directory: ${err.message}`);
            return;
          }

          dsuInstance.commitBatch((err) => {
            if (err) {
              process.stdout.write(`Error committing batch: ${err.message}`);
              return;
            }
            process.stdout.write(`Directory ${dirPath} created successfully in the DSU.`);
          });
        });
      });
    });
  }
};