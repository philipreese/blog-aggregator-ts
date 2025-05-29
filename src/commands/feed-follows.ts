import { createFeedFollow, deleteFeedFollow, getFeedFollowsForUser } from "../lib/db/queries/feed-follows";
import { getFeedByUrl } from "../lib/db/queries/feeds";
import { User } from "../lib/db/schema";

export async function handlerFollow(cmdName: string, user: User, ...args: string[]) {
    if (args.length < 1) {
        throw new Error(`usage: ${cmdName} <url>`);
    }

    const feed = await getFeedByUrl(args[0]);
    if (!feed) {
        throw new Error(`Feed with url ${args[0]} not found`);
    }

    const feedFollow = await createFeedFollow(user.id!, feed.id);
    console.log("Feed follow created:");
    printFeedFollow(feedFollow.userName, feedFollow.feedName);
}

export async function handlerFollowing(_: string, user: User) {
    const feedNames = await getFeedFollowsForUser(user.id!);
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

export async function handlerUnfollow(cmdName: string, user: User, ...args: string[]) {
    if (args.length < 1) {
        throw new Error(`usage: ${cmdName} <feed_url>`);
    }

    const url = args[0];
    const feed = await getFeedByUrl(url);
    if (!feed) {
        throw new Error(`Feed with url ${url} not found`);
    }
    
    const result = await deleteFeedFollow(feed.id, user.id!);
    if (!result) {
        throw new Error(`Failed to unfollow feed: ${url}`);
    }

    console.log(`${feed.name} deleted successfully`);
}