import { type CommandsRegistry, registerCommand, runCommand } from "./commands/commands.js";
import { handlerReset } from "./commands/reset.js";
import { handlerAgg } from "./commands/aggregate.js";
import { handlerLogin, handlerRegister, handlerListUsers } from "./commands/users.js";
import { handlerAddFeed, handlerListFeeds } from "./commands/feeds.js";
import { handlerFollow, handlerFollowing } from "./commands/follows.js";

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
    registerCommand(commandsRegistry, "reset", handlerReset);
    registerCommand(commandsRegistry, "users", handlerListUsers);
    registerCommand(commandsRegistry, "agg", handlerAgg);
    registerCommand(commandsRegistry, "addfeed", handlerAddFeed);
    registerCommand(commandsRegistry, "feeds", handlerListFeeds);
    registerCommand(commandsRegistry, "follow", handlerFollow);
    registerCommand(commandsRegistry, "following", handlerFollowing);

    try {
        await runCommand(commandsRegistry, commandName, ...args);
    } catch (err) {
        console.log(`Error running command ${commandName}: ${(err as Error).message}`);
        process.exit(1);
    }
    process.exit(0);
}

main();