require("../opendsu-sdk/builds/output/openDSU");

const opendsu = require('opendsu');
const resolver = opendsu.loadAPI('resolver');

module.exports = {
  command: 'mount <parentKeySSI> <childKeySSI> <mountPath>',
  describe: 'Mount a DSU',
  handler: (argv) => {
    const { parentKeySSI, childKeySSI, mountPath } = argv;

    resolver.loadDSU(parentKeySSI, (err, parentDSU) => {
      if (err) {
        process.stdout.write(`Error loading parent DSU: ${err.message}`);
        return;
      }
      process.stdout.write(`Successfully loaded parent DSU with KeySSI: ${parentKeySSI}`);

      resolver.loadDSU(childKeySSI, (err, childDSU) => {
        if (err) {
          process.stdout.write(`Error loading child DSU: ${err.message}`);
          return;
        }
        process.stdout.write(`Successfully loaded child DSU with KeySSI: ${childKeySSI}`);

        parentDSU.safeBeginBatch((err) => {
          if (err) {
            process.stdout.write(`Error starting batch: ${err.message}`);
            return;
          }

          parentDSU.mount(mountPath, childKeySSI, (err) => {
            if (err) {
              process.stdout.write(`Error mounting DSU: ${err.message}`);
              return;
            }

            parentDSU.commitBatch((err) => {
              if (err) {
                process.stdout.write(`Error committing batch: ${err.message}`);
                return;
              }
              process.stdout.write(`Successfully mounted DSU at: ${mountPath}`);
            });
          });
        });
      });
    });
  }
};
