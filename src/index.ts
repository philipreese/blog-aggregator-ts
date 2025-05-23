import { type CommandsRegistry, registerCommand, runCommand } from "./commands/commands.js";
import { handlerLogin, handlerRegister } from "./commands/users.js";

async function main() {
    const commandsRegistry: CommandsRegistry = {};
    if (process.argv.length < 3) {
        console.log("usage: cli <command> [args...]");
        process.exit(1);
    }
    const commandName = process.argv[2];
    const args = process.argv.slice(3);

    registerCommand(commandsRegistry, "login", handlerLogin);
    registerCommand(commandsRegistry, "register", handlerRegister);

    try {
        await runCommand(commandsRegistry, commandName, ...args);
    } catch (err) {
        console.log(`Error running command ${commandName}: ${(err as Error).message}`);
        process.exit(1);
    }
    process.exit(0);
}

main();