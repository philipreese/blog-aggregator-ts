import type { CommandHandler, UserCommandHandler } from "./commands/commands";
import { readConfig } from "./config";
import { getUser } from "./lib/db/queries/users";

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
    return async (cmdName: string, ...args: string[]) => {
        const config = readConfig();
        const user = await getUser(config.currentUserName);
        if (!user) {
            throw new Error(`User ${config.currentUserName} not found`);
        }
        await handler(cmdName, user, ...args);
    }
};