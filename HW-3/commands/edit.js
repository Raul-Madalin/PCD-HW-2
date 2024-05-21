require("../../opendsu-sdk/builds/output/openDSU");
const path = require("path");
const os = require("os");
const cp = require("child_process");

const opendsu = require('opendsu');
const resolver = opendsu.loadAPI('resolver');
const fs = require('fs');

module.exports = {
  command: 'edit <keySSI> <dsuFilePath>',
  describe: 'Edit a file in a DSU using local file content',
  handler: (argv) => {
    const { keySSI,  dsuFilePath: dsuFilePath} = argv;

    
    resolver.loadDSU(keySSI, (err, dsuInstance) => {
        if (err) {
          process.stdout.write(`Error loading DSU: ${err.message}\n`);
          return;
        }
  
        dsuInstance.readFile(dsuFilePath, (err, data) => {
          if (err) {
            process.stdout.write(`Error reading file from DSU: ${err.message}\n`);
            return;
          }
  
          const tempFilePath = path.join(os.tmpdir(), path.basename(dsuFilePath));
          fs.writeFileSync(tempFilePath, data);
          
          const editor = process.env.EDITOR || `notepad`;
          var editorSpawn = cp.spawn(editor, [tempFilePath], {
            stdio: `inherit`,
            detached: true
          });
  
          editorSpawn.on("error", (err) => {
            process.stdout.write(`Failed to start nano: ${err.message}\n`);
          });
  
          editorSpawn.on(`data`, (data) => {
            process.stdout.pipe(data);
          });
  
          editorSpawn.on(`close`, (code) => {
            if (code === 0){
              const editedData = fs.readFileSync(tempFilePath);
                dsuInstance.safeBeginBatch((err) => {
                    if (err) {
                        process.stdout.write(`Error starting batch operation: ${err.message}\n`);
                           return;
                       }
                    dsuInstance.writeFile(dsuFilePath, editedData, (err) => {
                        if (err) {
                          process.stdout.write(`Error writing file to DSU: ${err.message}\n`);
                          return;
                      }
                      
                      dsuInstance.commitBatch((err) => {
                        if (err) {
                          process.stdout.write(`Error committing batch operation: ${err.message}\n`);
                          return;
                        }
                        process.stdout.write(`Successfully edited and saved file: ${dsuFilePath}\n`);
                      });
              
                    });
                });
            }
          });
        });
      });
  }
};
