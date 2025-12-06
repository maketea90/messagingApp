// setup_firebase.js
const firebase = require('firebase-tools');
const fs = require('fs');
const path = require('path');
const {execSync} = require('child_process');
const { default: AsyncStorage } = require('@react-native-async-storage/async-storage');

function createRandomPrefix(length) {
  let result = '';
  // Loop to append random base-36 strings until the desired length is met
  while (result.length < length) {
    // Generate a random number and convert it to a base-36 string (alphanumeric)
    // We slice from index 2 to remove the "0." prefix
    result += Math.random().toString(36).slice(2); 
  }
  // Return the exact length required
  return result.substring(0, length).toUpperCase(); // Optional: convert to uppercase
}

const prefix = createRandomPrefix(6); // e.g., "G7F8K3"

const PROJECT_NAME = "maketea90-chatapp-10"; // Use a unique name/ID
const APP_NICKNAME = "messaging-app-maketea90";
const ENV_FILE = path.join(process.cwd(), '.env');

function runCommand(command) {
    console.log(`Running command: ${command}`);
    return execSync(command, { encoding: 'utf-8', stdio: 'pipe' }).trim();
}


async function readFileContents(filePath) {
  try {
    // Read the file and automatically convert the Buffer to a UTF-8 string
    const data = await fs.readFileSync(filePath, 'utf8');
    console.log("File contents:", data);
    return data;

  } catch (err) {
    console.error("Error reading file:", err);
  }
}

async function setupFirebase() {
  try {
    // console.log('initialising firestore')
    // console.log('complete')
    // console.log("1. Ensuring Firebase login...");
    // The CLI handles local cached credentials; manual login required once initially via 'firebase login'
    // For CI/CD, use process.env.FIREBASE_TOKEN with firebase login:ci.
    const projectsListOutput = runCommand('firebase projects:list --json');
    const projects = JSON.parse(projectsListOutput);
    console.log(projects)
    const projectExists = projects.result.some(p => p.projectId === PROJECT_NAME);
    // console.log(projects)
    // let createResult
    
    // Note: projects:create returns the project ID on success
    if(!projectExists){
        console.log(`2. Creating project: ${PROJECT_NAME}...`);

        const createResult = await firebase.projects.create(PROJECT_NAME, {
            json: true,
            cwd: process.cwd(),
            });
        // const projectId = createResult.projectId || JSON.parse(createResult).projectId;

        console.log(`Project created with ID: ${PROJECT_NAME}`);
    
    }
    const projectId = PROJECT_NAME
    
    console.log(`3. Setting active project to: ${projectId}...`);

    await firebase.use(projectId, {
      project: projectId,
      cwd: process.cwd(),
    });
    const appListOutput = runCommand('firebase apps:list --json')
    const apps = JSON.parse(appListOutput)
    // console.log(apps)
    const appExists = apps.result.some(p => p.displayName === APP_NICKNAME)
    let appId
    if(!appExists){
        console.log(`4. Creating web app: ${APP_NICKNAME}...`);
        const appResult = await firebase.apps.create("web", APP_NICKNAME, {
        project: projectId,
        json: true,
        cwd: process.cwd(),
        });
        appId = appResult.appId || JSON.parse(appResult).appId;
        // console.log('app does not exist yet', appId)
    } else {
        const result = apps.result.filter(p => p.displayName === APP_NICKNAME)
        appId = result[0]['appId']
        // console.log('app exists', result, appId)
    }
    
    console.log(`App created with App ID: ${appId}`);
    console.log("5. Retrieving SDK credentials...");
    // apps:sdkconfig prints the config snippet
    runCommand(`firebase apps:sdkconfig WEB ${appId} > configOutput.json`);

    const fileContents = await readFileContents('configOutput.json')
    console.log(fileContents)
    const config = JSON.parse(fileContents)
    console.log(config)
    // const data = await fileContents
    // The output is a JS snippet string. We need to parse it and convert to .env format.
    // const configMatch = configOutput.match(/const firebaseConfig = (\{[^;]+\});/s);
    // if (configMatch && configMatch[1]) {
    //   const config = JSON.parse(configMatch[1].replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":').replace(/'/g, '"'));
      
      const envContent = [
        `EXPO_PUBLIC_FIREBASE_API_KEY="${config.apiKey}"`,
        `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN="${config.authDomain}"`,
        `EXPO_PUBLIC_FIREBASE_PROJECT_ID="${config.projectId}"`,
        `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET="${config.storageBucket}"`,
        `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="${config.messagingSenderId}"`,
        `EXPO_PUBLIC_FIREBASE_APP_ID="${config.appId}"`,
      ].join('\n');

      fs.writeFileSync(ENV_FILE, envContent);
      console.log(`✅ Successfully wrote credentials to ${ENV_FILE}`);
    // } else {
    //   throw new Error("Failed to parse configuration output.");
    // }
    // runCommand('firebase init firestore')
    // runCommand('firebase deploy --only firestore:rules')

  } catch (error) {
    console.error("❌ An error occurred during Firebase setup:", error.message || error);
    process.exit(1);
  }
}

setupFirebase();
