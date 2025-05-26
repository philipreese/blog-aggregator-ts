import { db } from "..";
import { eq, and } from "drizzle-orm";
import { feedFollows, feeds, users } from "../schema";

export async function createFeedFollow(userId: string, feedId: string) {
    const [newFeedFollow] = await db.insert(feedFollows).values({ userId: userId, feedId: feedId}).returning();
    const [feedFollowInfo] = await db.select({
      id: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAt: feedFollows.updatedAt,
      feedName: feeds.name,
      userName: users.name,
    }).from(feedFollows)
      .innerJoin(feeds, eq(feeds.id, feedFollows.feedId))
      .innerJoin(users, eq(users.id, feedFollows.userId))
      .where(and(eq(feedFollows.id, newFeedFollow.id), eq(users.id, newFeedFollow.userId)));
    return feedFollowInfo;
}

export async function getFeedFollowsForUser(userId: string) {
    const result = await db.select({ feedName: feeds.name }).from(feedFollows)
        .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
        .where(eq(feedFollows.userId, userId));
    return result;
}