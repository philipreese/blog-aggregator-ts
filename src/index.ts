import { type CommandsRegistry, registerCommand, runCommand } from "./commands/commands.js";
import { handlerReset } from "./commands/reset.js";
import { handlerAgg } from "./commands/aggregate.js";
import { handlerLogin, handlerRegister, handlerListUsers } from "./commands/users.js";
import { handlerAddFeed, handlerListFeeds } from "./commands/feeds.js";
import { handlerFollow, handlerFollowing, handlerUnfollow } from "./commands/feed-follows.js";
import { middlewareLoggedIn } from "./middleware.js";
import { handlerBrowse } from "./commands/browse.js";

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
    registerCommand(commandsRegistry, "addfeed", middlewareLoggedIn(handlerAddFeed));
    registerCommand(commandsRegistry, "feeds", handlerListFeeds);
    registerCommand(commandsRegistry, "follow", middlewareLoggedIn(handlerFollow));
    registerCommand(commandsRegistry, "following", middlewareLoggedIn(handlerFollowing));
    registerCommand(commandsRegistry, "unfollow", middlewareLoggedIn(handlerUnfollow));
    registerCommand(commandsRegistry, "browse", middlewareLoggedIn(handlerBrowse));

    try {
        await runCommand(commandsRegistry, commandName, ...args);
    } catch (err) {
        console.log(`Error running command ${commandName}: ${(err as Error).message}`);
        process.exit(1);
    }
    process.exit(0);
}

main();