require("../../opendsu-sdk/builds/output/openDSU");

const opendsu = require('opendsu');
const KeySSISpace = opendsu.loadAPI('keyssi');
const resolver = opendsu.loadAPI('resolver');
const fs = require('fs');

module.exports = {
  command: `upload <keySSI> <localFilePath> <dsuFilePath>`,
  describe: `Upload a file to a DSU`,
  handler: (argv) => {
    const { keySSI: keySSI, localFilePath: localFilePath, dsuFilePath: dsuFilePath } = argv;
    fs.readFile(localFilePath, (err, data) => {
        if (err) {
          process.stdout.write(`Error reading local file: ${err.message}\n`);
          return;
        }
        
        
        resolver.loadDSU(keySSI, (err, dsuInstance) => {
          if (err) {
            process.stdout.write(`Error loading DSU: ${err.message}\n`);
            return;
          }
          dsuInstance.safeBeginBatch((err) => {
              if (err) {
                  process.stdout.write(`Error starting batch operation: ${err.message}\n`);
                     return;
                 }
              dsuInstance.writeFile(dsuFilePath, data, (err) => {
                  if (err) {
                    process.stdout.write(`Error writing file to DSU: ${err.message}\n`);
                    return;
                }
                
  
                dsuInstance.commitBatch((err) => {
                  if (err) {
                    process.stdout.write(`Error committing batch operation: ${err.message}\n`);
                    return;
                  }
                  process.stdout.write(`File uploaded successfully to ${dsuFilePath}\n`);
                });
              
              });
          });
        });
      });
  }
};