import { db } from "..";
import { eq, sql } from "drizzle-orm";
import { feeds } from "../schema";
import { firstOrUndefined } from "./utils";

export async function createFeed(name: string, url: string, userId: string) {
    const result = await db.insert(feeds).values({ name: name, url: url, user_id: userId }).returning();
    return firstOrUndefined(result);
}

export async function getFeeds() {
    return await db.select().from(feeds);
}

export async function getFeedByUrl(url: string) {
    const result = await db.select().from(feeds).where(eq(feeds.url, url));
    return firstOrUndefined(result);
}

export async function markFeedFetched(feedId: string) {
    const result = await db.update(feeds)
        .set({ lastFetchedAt: new Date() })
        .where(eq(feeds.id, feedId)).returning();
    return firstOrUndefined(result);
}

export async function getNextFeedToFetch() {
    const result = await db.select()
        .from(feeds)
        .orderBy(sql`${feeds.lastFetchedAt} desc nulls first`)
        .limit(1);
    return firstOrUndefined(result);
}