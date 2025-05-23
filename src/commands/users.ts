import { readConfig, setUser } from "../config.js";
import { createUser, getUser, getUsers } from "../lib/db/queries/users.js";

export async function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length < 1) {
        throw new Error(`usage: ${cmdName} <name>`);
    }

    const name = args[0];
    const user = await getUser(name)
    if (!user) {
        throw new Error("user does not exist");
    }

    setUser(name);
    console.log(`User has been set to: ${args[0]}`);
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
    if (args.length < 1) {
        throw new Error(`usage: ${cmdName} <user>`);
    }

    const name = args[0];
    const user = await getUser(name);
    if (user) {
        throw new Error("user already exists");
    }
    const createdUser = await createUser(name);
    setUser(name);
    console.log("User created successfully!");
}

export async function handlerListUsers(_: string) {
    const users = await getUsers();
    const config = readConfig();
    
    for (const user of users) {
        let output = `* ${user.name}`;
        if (user.name === config.currentUserName) {
            output += " (current)";
        }
        console.log(output);
    }
}