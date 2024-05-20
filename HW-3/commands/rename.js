require("../opendsu-sdk/builds/output/openDSU");

const opendsu = require('opendsu');
const resolver = opendsu.loadAPI('resolver');

module.exports = {
  command: 'rename <keySSI> <oldPath> <newPath>',
  describe: 'Rename a file or directory in a DSU',
  handler: (argv) => {
    const { keySSI, oldPath, newPath } = argv;

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

        dsuInstance.rename(oldPath, newPath, (err) => {
          if (err) {
            process.stdout.write(`Error renaming: ${err.message}`);
            return;
          }

          dsuInstance.commitBatch((err) => {
            if (err) {
              process.stdout.write(`Error committing batch: ${err.message}`);
              return;
            }
            process.stdout.write(`Successfully renamed ${oldPath} to ${newPath}`);
          });
        });
      });
    });
  }
};
