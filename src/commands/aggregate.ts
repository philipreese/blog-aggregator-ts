import { getNextFeedToFetch, markFeedFetched } from "../lib/db/queries/feeds.js";
import { createPost } from "../lib/db/queries/posts.js";
import { fetchFeed } from "../lib/rss.js";
import { parseDuration } from "../lib/time.js";

export async function handlerAgg(cmdName: string, ...args: string[]) {
    if (args.length < 1) {
        throw new Error(`usage: ${cmdName} <time_between_reqs>`);
    }

    const timeArg = args[0];
    const timeBetweenReq = parseDuration(timeArg);
    if (!timeBetweenReq) {
        throw new Error(`invalid duration: ${timeArg} - use format 1h 30m 15s or 3500ms`);
    }

    console.log(`Collecting feeds every ${timeArg}`);

    scrapeFeeds().catch(handleError);

    const interval = setInterval(() => {
        scrapeFeeds().catch(handleError);
    }, timeBetweenReq);

    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
            console.log("Shutting down feed aggregator...");
            clearInterval(interval);
            resolve();
        });
    });
}

export async function scrapeFeeds() {
    const feed = await getNextFeedToFetch();
    if (!feed) {
        console.log("No new feeds to fetch");
        return;
    }

    await markFeedFetched(feed.id);
    const feedData = await fetchFeed(feed.url);
    for (const item of feedData.channel.items) {
        console.log(`Found post: ${item.title}`);
        await createPost({
            createdAt: new Date(),
            updatedAt: new Date(),
            title: item.title,
            url: item.link,
            description: item.description,
            publishedAt: new Date(item.pubDate),
            feedId: feed.id
        });
    }

    console.log(`Feed ${feed.name} collected, ${feedData.channel.items.length} posts found`);
}

function handleError(error: Error) {
    if (error.message.includes("posts_url_unique")) {
        return;
    }
    
    console.error(`Error scraping feeds: ${error instanceof Error ? error.message : error}`);
}
