require("../../opendsu-sdk/builds/output/openDSU");
const path = require("path");
const os = require("os");
const cp = require("child_process");
const fs = require('fs');
const opendsu = require('opendsu');
const resolver = opendsu.loadAPI('resolver');

module.exports = {
  command: 'new-file <keySSI> <dsuFilePath>',
  describe: 'Create a new file in a DSU using a text editor',
  handler: (argv) => {
    const { keySSI, dsuFilePath } = argv;

    resolver.loadDSU(keySSI, (err, dsuInstance) => {
        if (err) {
          process.stdout.write(`Error loading DSU: ${err.message}\n`);
          return;
        }
  
        const tempFilePath = path.join(os.tmpdir(), path.basename(dsuFilePath));
        
        fs.writeFileSync(tempFilePath, '');
  
        const editor = process.env.EDITOR || 'notepad';
        const editorSpawn = cp.spawn(editor, [tempFilePath], {
          stdio: 'inherit',
          detached: true,
        });
  
        editorSpawn.on('error', (err) => {
          process.stdout.write(`Failed to start editor: ${err.message}\n`);
        });
  
        editorSpawn.on('close', (code) => {
          if (code === 0) {
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
                  process.stdout.write(`Successfully created and saved file: ${dsuFilePath}\n`);
                });
              });
            });
          } else {
            process.stdout.write(`Editor exited with code ${code}\n`);
          }
        });
      });
  }
};