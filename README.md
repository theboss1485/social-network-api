# social-network-api
This repository contains the Social Network API for the Module 18 Challenge of the OSU Flex Web Development Bootcamp

## Note To Grader

Part of the assignment was to format the date of created thoughts and reactions using a 'getter', according to the assignment instructions.  I wasn't sure whether this meant I should use a virtual method or an instance method.  I spoke to the instructor, Matthew Miller, about it, and he said that there were comments, seemingly in the solution, that referred to the method that formatted the date as a virtual method.  Therefore, the consensus seems to be to use a virtual method to format the date.  Unfortunately, when using a virtual method, I can't make the name of the the formatted date be displayed as "createdAt".  This would conflict with the JSON property already named "createdAt" and therefore throw an error.
