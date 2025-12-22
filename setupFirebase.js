const firebase = require('firebase-tools')
const fs = require('fs')
const path = require('path')
const {execSync} = require('child_process')
const { default: AsyncStorage } = require('@react-native-async-storage/async-storage')

const PROJECT_NAME = "maketea90-chatapp-10"
const APP_NICKNAME = "messaging-app-maketea90"
const ENV_FILE = path.join(process.cwd(), '.env')

function runCommand(command) {
    console.log(`Running command: ${command}`)
    return execSync(command, { encoding: 'utf-8', stdio: 'pipe' }).trim()
}


async function readFileContents(filePath) {
  try {
    
    const data = await fs.readFileSync(filePath, 'utf8')
    console.log("File contents:", data)
    return data

  } catch (err) {
    console.error("Error reading file:", err)
  }
}

async function setupFirebase() {
  try {
    // console.log('initialising firestore')
    // console.log('complete')
    
    const projectsListOutput = runCommand('firebase projects:list --json')
    const projects = JSON.parse(projectsListOutput)
    console.log(projects)
    const projectExists = projects.result.some(p => p.projectId === PROJECT_NAME)
    // console.log(projects)
    // let createResult
    
    if(!projectExists){
        console.log(`Creating project ${PROJECT_NAME}`)

        const createResult = await firebase.projects.create(PROJECT_NAME, {
            json: true,
            cwd: process.cwd(),
            })
       

        console.log(`Project created with id ${PROJECT_NAME}`)
    
    }
    const projectId = PROJECT_NAME
    
    console.log(`Setting active project to ${projectId}`)

    await firebase.use(projectId, {
      project: projectId,
      cwd: process.cwd(),
    })
    const appListOutput = runCommand('firebase apps:list --json')
    const apps = JSON.parse(appListOutput)
    // console.log(apps)
    const appExists = apps.result.some(p => p.displayName === APP_NICKNAME)
    let appId
    if(!appExists){
        console.log(`Creating web app ${APP_NICKNAME}`)
        const appResult = await firebase.apps.create("web", APP_NICKNAME, {
        project: projectId,
        json: true,
        cwd: process.cwd(),
        })
        appId = appResult.appId || JSON.parse(appResult).appId
        // console.log('app does not exist yet', appId)
    } else {
        const result = apps.result.filter(p => p.displayName === APP_NICKNAME)
        appId = result[0]['appId']
        // console.log('app exists', result, appId)
    }
    
    console.log(`App created with appid ${appId}`)

    console.log("Retrieving SDK credentials")
    
    runCommand(`firebase apps:sdkconfig WEB ${appId} > configOutput.json`)

    const fileContents = await readFileContents('configOutput.json')
    console.log(fileContents)
    const config = JSON.parse(fileContents)
    console.log(config)
      
      const envContent = [
        `EXPO_PUBLIC_FIREBASE_API_KEY="${config.apiKey}"`,
        `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN="${config.authDomain}"`,
        `EXPO_PUBLIC_FIREBASE_PROJECT_ID="${config.projectId}"`,
        `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET="${config.storageBucket}"`,
        `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="${config.messagingSenderId}"`,
        `EXPO_PUBLIC_FIREBASE_APP_ID="${config.appId}"`,
      ].join('\n')

      fs.writeFileSync(ENV_FILE, envContent)
      console.log(`Successfully wrote credentials to ${ENV_FILE}`)
    

  } catch (error) {
    console.error("An error occurred during Firebase setup:", error.message || error)
    process.exit(1)
  }
}

setupFirebase()
