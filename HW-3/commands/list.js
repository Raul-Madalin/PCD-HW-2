require("../../opendsu-sdk/builds/output/openDSU");

const opendsu = require('opendsu');
const resolver = opendsu.loadAPI('resolver');

module.exports = {
    command: 'list <keySSI> <dir>',
    describe: 'List files in a DSU',
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
  
        dsuInstance.listFiles(dir, { recursive, ignoreMounts }, (err, files) => {
          if (err) {
            process.stdout.write(`Error listing files: ${err.message}`);
            return;
          }
          process.stdout.write(`Files in DSU: ${files}`);
        });
  
        if (!recursive) {
          dsuInstance.listFolders(dir, { recursive: false, ignoreMounts }, (err, folders) => {
            if (err) {
              process.stdout.write(`Error listing folders: ${err.message}`);
              return;
            }
            process.stdout.write(`Folders in DSU: ${folders}`);
          });
        }
      });
    }
  };