# React-Native messaging app

This is a messaging app built in React-Native, with Firebase for storage/authentication.

## Project Description

*Please read the setup section before attempting to run the app*

The landing page for this app is an email/password sign up page. Users can sign up, log in, choose a username, and begin messaging any other signed up users. Once an account is created they can also log out, or delete their account entirely.

Messages load dynamically (20 most recent on initial render and 20 more at a time when you scroll to the top). When all messages have loaded the user is alerted and no more fetches are made.

Deleting your account deletes all associated records in the firestore database.

## Setup

There is a bit of setup so please read through all of this carefully.

### Create a firebase project

You will need to create a firebase project for use with the app. Go to https://console.firebase.google.com/ and click "get started by setting up a firebase project". Go through the process of setting up a new project/web app. 

Eventually firebase will present you with your project credentials. Add your new firebase project credentials (apiKey, authDomain, projectId, storageBucket, messaginSenderId, appId) to a new file called .env in the main project folder. Add the following lines to your .env file, replacing the placeholder strings with the credentials:

EXPO_PUBLIC_apiKey="yourapikeyhere"
  
EXPO_PUBLIC_authDomain="yourauthdomainhere"
  
EXPO_PUBLIC_projectId="yourprojectidhere"
  
EXPO_PUBLIC_storageBucket="yourstoragebuckethere"
  
EXPO_PUBLIC_messagingSenderId="yourmessagingsenderidhere"
  
EXPO_PUBLIC_appId="yourappidhere"

### Installing dependencies and starting/accessing the app

run the following commands in the terminal:

- *npm install*

- *npx expo start --tunnel*

Download the expo go app to your phone and use it to scan the qr code that appears in the terminal (alternatively open the app in the browser by typing w in the terminal).

You should now have access to the app on your phone (or web browser).

### Important: Create custom index (firebase console)

When you run the app for the first time at some point there will be an error, this is because one of the queries to firebase used requires a custom index that you must create. To do this, when prompted/the error occurs simply click the link in the terminal that appears to take you to the firebase console and create the index it provides for you (it takes a couple of minutes for firebase to create the index). You will need to restart the app (once the index has been created).

### Disclaimer

The "forgotten password" feature does not actually send a password reset email as it did not seem secure to configure the domain(s) expo uses to host the app as authorised domains for sending password reset emails in firebase.

### Sign up and start messaging

Since no users exist yet you should probably sign up some new accounts (at least two) to see if they can message each other!