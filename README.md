# Gator CLI for RSS Feed aggregation
Gator is a CLI application that allows users to register and login and follow RSS feeds. It allows specific RSS feeds to be gathered, and can aggregate posts to be stored.

## CLI usage
To run the CLI:

``` npm run start <command> [args...] ```

The list of commands with their usage:
- ``` login <name_of_user> ```
  - sets the currently logged-in user to specified user if they have already registered with gator
- ``` register <name_of_user> ```
  - registers the specified user if they have not already registered with gator
- ``` reset ```
  - deletes all users from gator
- ``` users ```
  - lists all registered users of gator and indicates which is currently logged-in
- ``` agg <time_between_requests> ```
  - fetches posts from RSS feed urls at a specified rate
- ``` addfeed <name_of_user> <feed_url> ```
  - creates an RSS feed from a url for a registered user
- ``` feeds ```
  - lists all RSS feeds
- ``` follow <feed_url> ```
  - follows a specified RSS feed from a url for the logged-in user
- ``` following ```
  - lists all RSS feeds that are followed by the logged-in user
- ``` unfollow <feed_url> ```
  - unfollows an RSS feed for the logged-in user
- ``` browse [post_limit] ```
  - gets a specified number of posts for the logged-in user. If no post limit is provided, default is 2
