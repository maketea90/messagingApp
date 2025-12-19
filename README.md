# React-Native messaging app

This is a messaging app built in React-Native (bundled using expo), with Firebase for storage/authentication.

## Project Description

*Please read the setup section before attempting to run the app*

The landing page for this app is an email/password sign up page. Users can sign up, log in, choose a username, and begin messaging any other signed up users. Once an account is created they can also log out, or delete their account entirely.

Passwords are validated, and signup/login are handled by Firebase Auth. Once the user has logged in and chosen a username they are navigated to a page with two tabs, "chats" and "profile".

The "chats" tab contains a list of message threads with other users (any other signed up user). When an item in this list is tapped, the user is taken to the message thread with the other user.

The message threads consist of a message box and send button (at the bottom of the screen) allowing the user to send a message in the thread.

Messages sent appear in real-time, and the message box and send button stick to the top of the keyboard when it appears. Messages persist and are stored in the firestore database.

To return to the list of other users tap the chats tab.

If messages exist already, they are loaded dynamically (20 most recent on initial render and 20 more at a time when you scroll to the top). When all messages have loaded the user is alerted and no more fetches are made.

Finally, the profile tab consists of two buttons allowing the user to either log out or delete their account entirely. If the user elects to delete their account a pop up appears asking them to type the word "delete" and click confirm if they truly want to delete their account.

Deleting an account deletes all associated records in the firestore database, including messages sent by the user in any conversation, and records of any conversation they were a part of.

## Firestore Database Schema

Firestore is NoSQL so strictly speaking there is no schema, however the database structure is shown in the file "database_schema.png".

# Tech stack

The main language used was JavaScript.

I chose React-Native as the main framework as I wanted to build specifically a mobile messaging app, that uses React-like architecture. In short I wanted to practice my React skills.

I used Firebase for the backend as it allowed easy sign up and authentication via email and password, with persistent auth access. Also, Firestore being NoSQL allowed for a flexible database design. Finally, it integrates well with JavaScript/React-Native built with expo.

## Choices

One of the less obvious choices made was database design, specifically deciding to keep a record of all pairs of users which have a message thread with each other (the "conversations" table), and linking messages sent, to the specific conversation they were a part of, via the conversationId.

# Setup

There is a lot of setup so please read through this carefully.

### Installing dependencies

first run the following commands in the terminal to install necessary dependencies:

- *npm i -g firebase-tools*

- *npm install*

### Creating the firebase project

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

This may not work for a few tries, if it errors out just give it some time and rerun, repeating as necessary until it manages to run properly. This is because it takes firebase some time to fully create the project before adding rules and indexing.

### Allowing signup via email/password

The final bit of setup is to enable sign up by email/password in the firebase project/app.

You must manually enable this in the Firebase Console:

- Go to console.firebase.google.com, login via google if necessary and select the project (the default name should be "maketea90-chatapp-10").
    
- In the left navigation menu, find the Build section and click Authentication.

- Click get started.
    
- Select the Sign-in method tab.
    
- Click the provider needed ("Email/Password").
    
- Toggle the Enable switch to the on position, and then click Save.

### Starting/accessing the app

To start the app:

- *npx expo start --tunnel*

Download the expo go app on your phone and use it to scan the qr code that appears in the terminal (alternatively open the app in the browser by typing w in the terminal).

You should now have access to the app on your phone (or web browser).

### Sign up and start messaging

Since no users exist yet you should probably sign up some new accounts (at least two) to see if they can message each other!

### Disclaimer

There is a "forgotten password" feature but it doesn't actually send a password reset email because it wasn't viable to configure the domain(s) expo uses to host the app as authorised domains for sending password reset emails in Firebase (these change every time you rerun the app).