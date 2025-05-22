import { type CommandsRegistry, registerCommand, runCommand } from "./commands/commands.js";
import { readConfig } from "./config";
import { handlerLogin } from "./commands/users.js";

function main() {
    const commandsRegistry: CommandsRegistry = {};
    if (process.argv.length < 3) {
        console.log("usage: cli <command> [args...]");
        process.exit(1);
    }
    const commandName = process.argv[2];
    const args = process.argv.slice(3);
    registerCommand(commandsRegistry, commandName, handlerLogin);

    try {
        runCommand(commandsRegistry, commandName, ...args);
    } catch (err) {
        console.log(`Error running command ${commandName}: ${(err as Error).message}`);
        process.exit(1);
    }
    console.log(readConfig());
}

main();