Deployed app: https://iqfitness-92d34.web.app/

# DH2642-group-project
Group project for DH2642

# Overview
This is a personal trainer website where clients can search for different workout plans and get information about each exercise. The website features search functionality for workouts where they can specify different search filter parameters such as the name, muscle group and difficulty of the exercise. Based on these parameters the website will fetch up to 10 exercises which matches the parameters from an API. Clients will then be able to create a new workout plan by adding as many of these exercises from the search as possible. The workout plan will be stored in the users account and will be accessible at any time.

Additionally, the website features a chatbot called IQTrainer that can answer questions about specific workouts. The chatbot is powered by ChatGPT, an AI language model, and can provide clients with information about anything training and health related, as well as getting tips on dietary plans etc. The point of the IQChat is to provide very personalized and always available personal training without the need of paying large and unnecessary amounts of money on real personal trainers. 

NOTE: IQChat is limited to a 5 dollar free trial. Please, do not write too many prompts as the limit might be reached.


## Commands

Useful commands for setting up

| Command         | Description                                |
| --------------- | ------------------------------------------ |
| `npm install ci`| Install all packages in package-lock.json  |
| `npm start`     | Starts app in development mode             |
| `npm run build` | Builds the app for production              |


# Technologies
This website is built using the following technologies:
* ReactJS
* Redux
* HTML
* CSS
* Material-UI
* Firebase Authentication
* Firebase Cloud Firestore

# Features

* Workout search functionality
* Ability to save workouts to a personal account
* Log workout progress by date
* See workout progress history based on the logs
* IQChat for getting nuanced and personalized training advice

# Project file structure
The project file structure is constructed by 7 different folders which contain important files, as well as ReactRoot.js and index.js (whose use are self explanatory). The different folders and their uses are:
* actions: This folder contains javascript files related to different actions. For instance, exercises.js contains the action functions when one does something related to the workouts in the add workouts page. In these functions, we both call the functions that make the api requests, as well as change the application state in the redux.
* api: This folder contains javascript files for the different api calls. For isntance exerciseApi.js contains the functions that make the api calls to the exercise api (mentioned in the point above).
* components: This folder contains components that might possibly be reused in multiple views, or components that contain a lot of code and are placed in a separate js file to improve the readability of the code for the viewer. 
* img: This folder contains images that are used in the web app
* presenters: This folder contains all the presenters of the web app
* views: This folder contains all the views used in the various presenters of the web app.
* store: Keep all the files relating to the redux store and firebase connectivity (persistance)


# Using the app
Using the app is very straight forward. You are met by a landing page where you can login, either by pressing the login button visible on the page, or by opening up the sidebar menu and pressing login. If you dont have an account, one can be created by pressing the "Try it for free now" button or by navigating through the register link on the login page. The login page also includes a forgot password link if one has forgotten it. Once logged in, you will have access to the entire website. You can use the IQTrainer chat from anywhere by clicking its tab in the bottom right corner. On the home page you can see the different pages. IQWorkouts is where you see your saved workout routines, as well as where you can navigate to the page where you can create new, or edit old routines. The log workouts page is where you will log your progress, how much stronger you have gotten in each exercise, etc. IQHistory is a page where your logs will be used to generate plots for visual representation of your progress. Lastly, there is a profile page, where you can change your name, email address as well as password. Keep in mind that if you signed in a while ago, you will be asked to reauthenticate yourself by entering your password before you are able to change the email and/or password. 

NOTE: IQChat is limited to a 5 dollar free trial. Please, do not write too many prompts as the limit might be reached.

## Developers  
Farhad Madadzade 77451
Dinh Vu 114702
Abdirahman Roble Omar 94586
Damien Bouet 146982
  
  
 