import { getNextFeedToFetch, markFeedFetched } from "../lib/db/queries/feeds.js";
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
    console.log("Fetched feeds:");
    const fetched = await fetchFeed(feed.url);
    for (const item of fetched.channel.items) {
        console.log(item.title);
    }
}

function handleError(error: unknown) {
    throw new Error(`Error scraping feeds: ${error instanceof Error ? error.message : error}`);
}
