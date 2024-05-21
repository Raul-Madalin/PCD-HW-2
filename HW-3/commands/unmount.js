require("../../opendsu-sdk/builds/output/openDSU");

const opendsu = require('opendsu');
const resolver = opendsu.loadAPI('resolver');

module.exports = {
  command: 'unmount <keySSI> <mountPath>',
  describe: 'Unmount a DSU',
  handler: (argv) => {
    const { keySSI, mountPath } = argv;

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

        dsuInstance.unmount(mountPath, (err) => {
          if (err) {
            process.stdout.write(`Error unmounting DSU: ${err.message}`);
            return;
          }

          dsuInstance.commitBatch((err) => {
            if (err) {
              process.stdout.write(`Error committing batch: ${err.message}`);
              return;
            }
            process.stdout.write(`DSU unmounted successfully from: ${mountPath}`);
          });
        });
      });
    });
  }
};