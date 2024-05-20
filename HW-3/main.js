
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const readline = require('readline');

// Disable all console logs
console.log = () => {};
console.error = () => {};
console.warn = () => {};
console.info = () => {};
console.debug = () => {};

const parser = yargs(hideBin(process.argv))
  .command(require('./commands/create'))
  .command(require('./commands/list'))
  .command(require('./commands/read'))
  .command(require('./commands/upload'))
  .command(require('./commands/create-dir'))
  .command(require('./commands/download-file'))
  .command(require('./commands/download-folder'))
  .command(require('./commands/edit'))
  .command(require('./commands/mount'))
  .command(require('./commands/rename'))
  .command(require('./commands/unmount'))
  .command(require('./commands/new-file'))
  .command(require('./commands/display'))
  .help()

if (process.argv.length > 2) {
    parser.argv;
} else {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    async function promptUser(question) {
        return new Promise((resolve) => {
            rl.question(question, (answer) => {
                resolve(answer);
            });
        });
    }

    async function main() {
        while (true) {
            const command = await promptUser('Command: ');
            if (command.toLowerCase() === 'exit') {
                break;
            }
            const commandArray = command.split(/\s+/);
            parser.parse(commandArray);
            process.stdout.write("\n");
        }
        rl.close();
    }

    // Call the main function
    main();
}


