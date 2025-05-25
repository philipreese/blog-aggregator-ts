import { fetchFeed } from "../lib/rss.js";

export async function handlerAgg(_: string) {
    const feedURL = "https://www.wagslane.dev/index.xml";
    const feedData = await fetchFeed(feedURL);
    console.log(JSON.stringify(feedData, null, 2));
}