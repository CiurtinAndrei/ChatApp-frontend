The **ChatApp Project** is a multi-user web application that enables its users to create groups with the purpose of sending messages in the form of text and/or images.
Here are the main features of **ChatApp**:

* Groups can be either **private** (groups that will not be publicly visible or joinable by other users) or **public** (groups that can be searched by name and joined freely by users);
* Users can add each-other as **friends**. A user has to be friends with another user to include them in a group;
* Whenever a new account is created, its user will receive an auto-generated e-mail in order to confirm the creation of their account;
* If a user successfully logs into ChatApp, a **JWT** is created and assigned to them so that they can stay logged in and access the features of the application;
* Data is stored in a **MongoDB** non-relational database and is transmitted between the backend and frontend of the application with the use of APIs;
* Each message holds essential information like the sender's username and the timestamp;
* Images are encoded using **base64** for transmission between the frontend and backend, then they are decoded and reconstructed.

***

This repository represents the **frontend** part of **Chatapp** and was developed using **React** which facilitates the creation of dynamic web pages. 

* The UI is user-friendly and holds all essential user controls in one place;
* Message rendering is quick and the user can seamlessly switch between groups; 
* User and group search was also made easy as a result of the clean and responsive interface; 
* The creation of multiple web routes was made easy with the use of the **React Router-DOM** module; |
* **React hooks** ensure that the pages are updated dynamically and without page refresh, keeping the user experience uninterrupted.
