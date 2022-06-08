# MaterialDB 
## A NextJS app where you can collect useful links and resources that help you become a better developer/instructor.

### Purpose of MaterialDB:
In my journey as Developer/Instructor I often find myself struggling to save and organize my bookmarks. That's why I have decided to develop MaterialDB, a website that allows me to save links to videos/tutorials/articles/resources/documentation and organize them by topic. 

#### Features:
- The app allows admins to create new topics, update or delete existing ones. On each topic page admins can add/save links to useful resources. By using the link to the website, the app will automatically scrape the head of the document and save the link with its title information. Moreover, tags can be used and the type of resource should be specified.
 
- AdminS can share their own version on MaterialDB with colleAgues/students by appending following query parameter to the base url ```?userId={id}```
For instance [https://material-db.netlify.app/?userId=626faa6e6b1dbcd848d2eb44](https://material-db.netlify.app/?userId=626faa6e6b1dbcd848d2eb44) will show MaterialDB for user with id **626faa6e6b1dbcd848d2eb44**

- Each topic page has a search bar with a highlight query effect

- Next to each link a button is present with a "copy to clipboard" functionality

Current Status: MVP

Next features to be implemented: registration of new users in the Front-End
