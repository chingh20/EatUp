# EatUp
## Jan-Ching AfterFood Orbital 2021

- [1. Introduction and Guides](#introducton)
- [2. User Stories](#user-stories)
- [3. Scope of Project and Timeline of Implementations](#scope-of-project)
- [4. Program Flow, Tech Stack and Software Testing](#program-flow)
- [5. Project Log](#project-log)


## <a name="introducton"></a>1. Introduction and Guides

**Proposed Level of Achievement:**
Apollo 11

**Deployed EatUp Andriod Phone Application**

Link to our application:
https://expo.io/@ching123/eatUp


https://exp.host/@ching123/eatUp/index.exp?sdkVersion=41.0.0 


**User and Developer Guides:**
https://docs.google.com/document/d/1C-qkibHh_wFY6i3Nr2pELqJOzTjlWIeYwV8EUnvGHwI/edit?usp=sharing


Recommended to use on Android Mobile Phone.
![EatUp-poster](https://github.com/chingh20/EatUp/blob/c1eefc2638259cd979d6c06b3cab7fa4ce3e6423/Images/EATUP%20Poster%20(1).png)

**Motivation**

As food lovers, we like to explore new foods and share food that we love with other people. 

Oftentimes, we are unable to decide on where to go for our meals, or we cannot remember where to get certain types of food. For the first problem, we can only google search "food near me" to let google list out all the foods available nearby and see if there’s anything that suits our tastes. For the latter problem, our current options are to search google on the limited information we have on that specific food as well as to ask our friends and families, hoping that they know what food we are looking for. We are also keen to share good food places with our loved ones, but to keep recommending the same food over and over again to different people… it takes a long time to do that.

It is not uncommon for us to get unsatisfactory recommendations from the list of nearby food places by google, due to our own food preferences. Moreover, it could almost be impossible to search for a specific kind of food when we do not have the necessary keywords to search it up. So, we decided to make a platform where it can recommend food based on our taste and preferences as well as be able to find the food that we have been looking for! Moreover, if the platform acts like a social media platform, it would allow us to share good food with others conveniently too.  


**Aim**

We hope to make a social media platform that allows people to conveniently share and get food recommendations based on their tastes and preferences.


**How are we different from other similar platforms?**

1. Google 
    - Our search engine returns results based on the popularity of food places instead of the distance the food places are from the user. 

2. Instagram
    - Our posts are focused on the food places instead of just the pictures.
    - Posts are collated into a flag on the user’s map, hence showing the approximate food locations all over Singapore where the user has been to, rather than showing the user’s posts.
    - Able to set a post as “Want to go!” to add the food place on to the user’s map as saved places to go next.




## <a name="user-stories"></a>2. User Stories
**Core**

1. As a food lover, I want to have my own personalized food map, so that I can save destinations containing my reviews/memories (posts) of food places.
2. As a food lover, I want to post and share the food places I visited, so that I can share my food map with my friends. 
3. As a food lover, I want follow other users, so that I can see their posts in the feed to find more food places to try out.

**Possible Extensions**

4. As a food lover, I want to get food recommendations that are similar to my tastes from the app’s algorithm or from public feeds, so that I can try out new food/ places.
5. As a food lover, I want to conveniently search about restaurants and food, so that I can check the basic information from others' posts.
6. As a food lover, I want to enter competitions or complete quests by visiting food places, so that I can compete with my fellow friends or earn rewards related to food. (Eg. conquering food maps or eating foods with certain themes.)
7. As a food lover, I want to help and obtain help from other users about where to get certain kinds of food, so that I can find out more information about the food-in-question. 



## <a name="scope-of-project"></a>3. Scope of Project and Timeline of Implementations

**Core Features**

1. Food map
    - Map is placed under the user's homepage. 
    - Users can choose their own color of the map and types of labels, and make their map/account public, private, or friends only. 
    - Each flag on the map would encapsulate/link to the user’s posts regarding that food place.
    - Users can save places they want to go on their food map. They can filter out their posts’ flags from the saved places’ flags.
    - Users can zoom in and out of their maps. 
    - Users can visit their friends’ maps.

2. Posts/ Feeds
    - Users can post images and reviews of food/ food places. Once they post about a food, their food map will be updated. 
    - Users can tag friends, include tags for type of cuisines or their own personalized tags.
    - Users will see individual posts from friends/public in their feeds.
    - Users can like others’ posts and save it as food places they want to go.
    - *(Extension) Users will be redirected to a modal window that shows: location of that food place, reviews of that place(from their friends/ public), and other basic information when they tap on the post.*

3. Search engine
    - Keywords: Types of cuisine, Locations, Type of places (cafe/ restaurant/ hawker center), User names
    - Return a list of matching food places and users. Indicate if their friends have been there before. 
    - *(Extension) Results can come in order of: Ratings, Price, Distance from user’s location.*


**Extensions Features**

4. Recommendations
    - Love of the Day: Recommend food places based on the Top public feed for three random types of cuisines.
    - Try Now: Recommend one random food place where the user marked as want to go.
    - Cuisine Mix: Recommend three new food places weekly, based on users’ preferences.
    - Eat Again: Recommend three food places that users’ have been before.
    - Tagging Insights:
         - Recommend new food places to go with friends (friends that have been tagged in their previous posts).
         - Recommend friends to go to a food place together (notify users that their friends also frequently visit a certain food place, but the user has not been there together with them).

5. Competition system
    - Two types of Challenge of the Week:
        - Conquer a food map.
        - Try as many food places of a certain cuisine as possible.
    - Users will be able to see how they compete with other users/friends.
    - Users will be awarded points for their participation, which they can change to food coupons later.

6. Lost & Found Section
    - Users can post images or descriptions to search for certain food, other users and web owners will help to respond. 
    - Users are able to vote for answers they think are correct.


**Timeline of Implementations**

_Features completed by end of June:_

Login page
- “Reset Password” function where a link will be sent to the user’s email to change their password. 
- Email and password used to log into user account 
- Only verified accounts can log in. 
- Logout Function


Signups
- Email, password and username used to signup a new account
- Checks if email and username are available to use
- Checks if email and password are valid


Home page
- Customised map markers that contains user's posts linked to that location
- Map markers for user's "Want to go!" places
- Able to filter the markers on the user's map
- Map markers show the Location name and cuisine tag of the post when pressed
- Display Picture available
- Show number of friends
- Able to return to initial position for the map
- Show full post linked to that marker when pressed
- Able to like and comment on the post 
- Able to remove "Want to go!" markers and delete own posts


Change Display Picture
- Able to change display picture from Gallery or Camera
- Able to remove display Picture


Add Post
- Able to publish posts from Gallery or Camera with Live Location saved
- Able to add new customized tags
- Able to choose the previously added customized tags for future posts


Feeds
- Complete public post feeds view
- Able to set posts as "Want to go!" places and like posts
- Able to delete own post
- Able to comment on posts, delete own comments and like other's comments
- Able to view other users' maps if they are friends by pressing the username from feed/ comments


Search engine
- Deploy search engine to other users, post Location and post Cuisine Tag
- Returns a list of Posts for Location/ Cuisine tag Search, sorted by most Likes
- Returns a list of username for User Search
- Able to send friend request the result of the user search if the target has not been added to user's friend list
- Able to unfreind current friends
- Able to retrieve friend requests
- Able to accept/ decline friend requests
- Able to navigate to other user's maps if they are friends, by pressing on the username


Friends
- Deploy search engine to filter friends
- Able to unfollow following users
- Able to view incoming friend requests





## <a name="program-flow"></a>4. Program Flow, Tech Stack and Software Testing
![EatUp-basic-program-flow](https://github.com/chingh20/EatUp/blob/45451ac7522bfb81830ef3faffdd5e3b274d6ec1/Images/Flow%20chart.jpg)


**Tech Stack**
- React Native
- Firebase
- Expo

**Software Testing Log:** https://docs.google.com/document/d/1KN7-z4OmE3RCq2xjzpzlJn_nDtMBuuAtnF9YVwhNHvc/edit?usp=sharing


## <a name="project-log"></a>5. Project Log



**Milestone 1 - Ideation:** https://docs.google.com/document/d/1bwHSE8-z5ftegvH8m3DMPwBO0ncLpUE5cHEylacY_N0/edit?usp=sharing


**Milestone 2 - Prototyping:** https://docs.google.com/document/d/1A_5HZFt_O3Rno-n-tJrWsMFIjSOIkOtLiBsFgz32H5o/edit?usp=sharing


**Milestone 3 - Refinement:** https://docs.google.com/document/d/14jwHwYiffIhQjgfFEVOpPy8GlKfALfLxFTeMME5MiME/edit?usp=sharing
