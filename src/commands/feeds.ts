import { readConfig } from "../config";
import { createFeed, getFeeds } from "../lib/db/queries/feeds";
import { getUser, getUserById } from "../lib/db/queries/users";
import { Feed, User } from "../lib/db/schema";

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
    if (args.length < 2) {
        throw new Error(`usage: ${cmdName} <name> <url>`);
    }
    
    const config = readConfig();
    const user = await getUser(config.currentUserName ?? "");
    if (!user) {
        throw new Error(`User ${config.currentUserName} not found`);
    }

    const name = args[0];
    const url = args[1];
    const feed = await createFeed(name, url, user.id);
    if (!feed) {
        throw new Error("Failed to create feed");
    }

    console.log("Feed created successfully:");
    printFeed(feed, user);
}

export async function handlerListFeeds(_: string) {
    const feeds = await getFeeds();
    if (feeds.length === 0) {
        throw new Error("No feeds found");
    }

    for (const feed of feeds) {
        const user = await getUserById(feed.user_id);
        if (!user) {
            throw new Error(`User for feed ${feed.id} not found`);
        }

        printFeed(feed, user);
        console.log(`=====================================`);
    }
}

function printFeed(feed: Feed, user: User) {
    console.log(`* ID:      ${feed.id}`);
    console.log(`* Created: ${feed.createdAt}`);
    console.log(`* Updated: ${feed.updatedAt}`);
    console.log(`* name:    ${feed.name}`);
    console.log(`* URL:     ${feed.url}`);
    console.log(`* User:    ${user.name}`);
}