# Social Network API

## Description

My motivation for building this project was to gain experience with NoSQL and Mongoose.  I built this project so that I could practice creating my own API without using a SQL database.  I also wanted to practice building custom error messages for the API.  This project solves the problem of a web developer needing a social media API for his or her own website.  The intent would be for the developer to build a website and use this API, so that the developer doesn't need to create one himself (or herself).  In this project, I learned how to build the various routes for an API, and I also took on the optional task of adding custom error messages for various scenarios that the application may encounter, such as a developer providing a user ID that doesn't match any users in the database.
Provide a short description explaining the what, why, and how of your project. Use the following questions as a guide:

## Note To Grader

Part of the assignment was to format the date of created thoughts and reactions using a 'getter', according to the assignment instructions.  I wasn't sure whether this meant I should use a virtual method or an instance method.  I spoke to the instructor, Matthew Miller, about it, and he said that there were comments, seemingly in the solution, that referred to the method that formatted the date as a virtual method.  Therefore, the consensus seems to be to use a virtual method to format the date.  Unfortunately, when using a virtual method, I can't make the name of the the formatted date be displayed as "createdAt".  This would conflict with the JSON property already named "createdAt" in the Thought model, and therefore throw an error.

## Walkthrough Video Explanation

To view the walkthrough video for this application, please use the following link: [https://drive.google.com/file/d/1CKhCjM4e51BUJnBqn_KeYK1Hhu13htJC/view](https://drive.google.com/file/d/1CKhCjM4e51BUJnBqn_KeYK1Hhu13htJC/view)
