import { setUser } from "../config.js";

export function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length < 1) {
        throw new Error(`usage: ${cmdName} <name>`);
    }

    setUser(args[0]);
    console.log(`User has been set to: ${args[0]}`);
}