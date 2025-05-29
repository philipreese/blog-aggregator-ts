import { createFeedFollow } from "../lib/db/queries/feed-follows";
import { createFeed, getFeeds } from "../lib/db/queries/feeds";
import { getUserById } from "../lib/db/queries/users";
import { Feed, User } from "../lib/db/schema";
import { printFeedFollow } from "./feed-follows";

export async function handlerAddFeed(cmdName: string, user: User, ...args: string[]) {
    if (args.length < 2) {
        throw new Error(`usage: ${cmdName} <name> <url>`);
    }

    const name = args[0];
    const url = args[1];
    const feed = await createFeed(name, url, user.id);
    if (!feed) {
        throw new Error("Failed to create feed");
    }

    const feedFollow = await createFeedFollow(user.id, feed.id);
    printFeedFollow(user.name, feedFollow.feedName);
    
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