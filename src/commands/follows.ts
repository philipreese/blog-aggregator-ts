import { readConfig } from "../config";
import { createFeedFollow, getFeedFollowsForUser } from "../lib/db/queries/feed-follows";
import { getFeedByUrl } from "../lib/db/queries/feeds";
import { getUser } from "../lib/db/queries/users";

export async function handlerFollow(cmdName: string, ...args: string[]) {
    if (args.length < 1) {
        throw new Error(`usage: ${cmdName} <url>`);
    }

    const config = readConfig();
    const user = await getUser(config.currentUserName);
    if (!user) {
        throw new Error(`User ${config.currentUserName} not found`);
    }

    const feed = await getFeedByUrl(args[0]);
    if (!feed) {
        throw new Error(`Feed with url ${args[0]} not found`);
    }

    const feedFollow = await createFeedFollow(user.id, feed.id);
    console.log("Feed follow created:");
    printFeedFollow(feedFollow.userName, feedFollow.feedName);
}

export async function handlerFollowing(_: string) {
    const config = readConfig();
    const user = await getUser(config.currentUserName);
    if (!user) {
        throw new Error(`User ${config.currentUserName} not found`);
    }

    const feedNames = await getFeedFollowsForUser(user.id);
    if (feedNames.length === 0) {
        console.log(`No feed follows found for user ${user.name}.`);
        return;
    }

    console.log(`Feed follows for user ${user.name}:`);
    for (const feedName of feedNames) {
        console.log(`* ${feedName.feedName}`);
    }
}

export function printFeedFollow(username: string, feedname: string) {
    console.log(`* User: ${username}`);
    console.log(`* Feed: ${feedname}`);
}