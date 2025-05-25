import { XMLParser } from "fast-xml-parser";

export async function fetchFeed(feedURL: string) {
    const response = await fetch(feedURL, {
        headers: {
            "User-Agent": "gator"
        },
    });
    if (!response.ok) {
        throw new Error(`failed to fetch feed: ${response.status} ${response.statusText}`);
    }

    const xmlString = await response.text();
    const xmlParser = new XMLParser();
    const parsedXml = xmlParser.parse(xmlString);
    const channel = parsedXml.rss.channel;
    if (!channel) {
        throw new Error("failed to parse channel");
    }

    const title = channel.title;
    const link = channel.link;
    const description = channel.description;
    if (!title || !link || !description) {
        throw new Error("failed to parse channel");
    }
    let items = channel.item;
    if (!Array.isArray(items)) {
        items = [];
    }

    const rssItems: RSSItem[] = [];
    for (const item of items) {
        if (item.title && item.link && item.description && item.pubDate) {
            const rssItem: RSSItem = {
                title: item.title,
                link: item.link,
                description: item.description,
                pubDate: item.pubDate,
            }
            rssItems.push(rssItem);
        }
    }

    const rssFeed: RSSFeed = {
        channel: {
            title,
            link,
            description,
            items: rssItems
        }
    }
    return rssFeed;
}

type RSSFeed = {
    channel: {
      title: string;
      link: string;
      description: string;
      items: RSSItem[];
    };
};
  
type RSSItem = {
    title: string;
    link: string;
    description: string;
    pubDate: string;
};