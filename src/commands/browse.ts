import { getPostsForUser } from "../lib/db/queries/posts";
import { User } from "../lib/db/schema";

export async function handlerBrowse(cmdName: string, user: User, ...args: string[]) {
    let limit = 2;
    if (args.length === 1) {
        let givenLimit = parseInt(args[0]);
        if (givenLimit) {
            limit = givenLimit;
        } else {
            throw new Error(`usage: ${cmdName} [limit]`);
        }
    }

    const posts = await getPostsForUser(user.id, limit);

    console.log(`Found ${posts.length} posts for user ${user.name}`);
    for (const post of posts) {
        console.log(`${post.publishedAt} from ${post.feedName}`);
        console.log(`--- ${post.title} ---`);
        console.log(`    ${post.description}`);
        console.log(`Link: ${post.url}`);
        console.log("=====================================");
    }
}
