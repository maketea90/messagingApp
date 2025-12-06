# React-Native messaging app

This is a messaging app built in React-Native, with Firebase for storage/authentication.

## Project Description

*Please read the setup section before attempting to run the app*

The landing page for this app is an email/password sign up page. Users can sign up, log in, choose a username, and begin messaging any other signed up users. Once an account is created they can also log out, or delete their account entirely.

Messages load dynamically (20 most recent on initial render and 20 more at a time when you scroll to the top). When all messages have loaded the user is alerted and no more fetches are made.

Deleting your account deletes all associated records in the firestore database.

## Setup

There is a bit of setup so please read through this carefully.

### Installing dependencies

first run the following commands in the terminal to install necessary dependencies:

- *npm i -g firebase-tools*

- *npm install*

### Create firebase project

The makefile handles creating a firebase project. Run the following command in the terminal:

- *make login*

You will be prompted a couple of times. Follow the instructions below:

1. The Firebase CLI will ask you if you want to enable gemini in firebase. Choose y or n, it doesn't really matter.

2. It will ask you if you consent for it to collect data. Again choose y or n, it doesn't really matter.

3. Follow the instructions in the terminal/browser to login to the Firebase CLI using your google account.

4. If you have successfully logged in, run the following command:

- *make create-project*

The Firebase CLI will create a project and web app.

5. Now run (in the terminal):

- *make rules*

This may not work for a few tries, if it errors out just give it some time and rerun, repeating as necessary until it manages to run properly.

### allow email/password signup

The final bit of setup is to enable sign up by email/password in the firebase project/app.

You must manually enable this in the Firebase Console:

    - Go to console.firebase.google.com, login via google if necessary and select your project (the default name should be "maketea90-chatapp-10").
    
    - In the left navigation menu, find the Build section and click Authentication.

    - Click get started.
    
    - Select the Sign-in method tab.
    
    - Click the provider we need ("Email/Password").
    
    - Toggle the Enable switch to the on position, and then click Save.

### Starting/accessing the app

to start the app:

- *npx expo start --tunnel*

Download the expo go app on your phone and use it to scan the qr code that appears in the terminal (alternatively open the app in the browser by typing w in the terminal).

You should now have access to the app on your phone (or web browser).

### Sign up and start messaging

Since no users exist yet you should probably sign up some new accounts (at least two) to see if they can message each other!

### Disclaimer

The "forgotten password" feature does not actually send a password reset email as it did not seem secure to configure the domain(s) expo uses to host the app as authorised domains for sending password reset emails in firebase.