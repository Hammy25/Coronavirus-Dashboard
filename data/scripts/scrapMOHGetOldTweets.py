import json
import GetOldTweets3 as got
from datetime import datetime

username = "MOH_Kenya"
today = datetime.today().strftime("%Y-%m-%d")

final_tweets = []
# Creation of query object
tweetCriteria = got.manager.TweetCriteria().setUsername(username)\
                                        .setSince("2020-03-13")\
                                        .setUntil(today)

# Creation of list that contains all tweets
tweets = got.manager.TweetManager.getTweets(tweetCriteria)

# Creating list of chosen tweet data
user_tweets = [{"date": tweet.date, "tweet": tweet.text} for tweet in tweets]

# Get dates
dates = []
for tweet in user_tweets:
    dates.append(tweet["date"].strftime("%Y-%m-%d"))
dates = set(dates)

# Put tweets in an object that groups them by date
for date in dates:
    obj = {}
    obj = {"date": date, "tweets": []}
    for tweet in user_tweets:
        if(date == tweet["date"].strftime("%Y-%m-%d")):
            obj["tweets"].append(tweet["tweet"])
    final_tweets.append(obj)

final_tweets.sort(key=lambda x: x["date"], reverse=True)

with open("tweets.json", "w") as outfile:
    json.dump(final_tweets, outfile)
