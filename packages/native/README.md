# native

This package contains an electron application, wrapping the api and web packages in a single application that can be executed with no effort or admin-rights.

### Architecture
In its core, the electron framework is a modified version of the chromium project with some additional features and tools for developers. In this package, the outcome of the other packages api and web is used to build a single, slef-contined application.

### Usage
As the electron framework takes care of finding and downloading the right dependencies for each host-os, we simply can call the start and package commands of the electron framework. But before we can do this, we have to build and integrate the outcome of the dependent packages. For this, a prepare-command builds and copies necessary outcomes into the app-folder of this project. Even though, the src-folder contains the source, the content in the app folder is packaged into the electron-app. For this reason, the files in the src folder are compield into a single main.prod.js file in the app-folder before electron is started.

```shell script
// is automatically called at start-up/yarn install
// builds the dependent packages and copies their dist folder into this project
yarn prepare

// builds the electron script
yarn build:prod

// builds a production-ready electron application for windows
yarn package:win

// builds a production-ready electron application for linux
yarn package:linux

// builds a production-ready electron application for mac
yarn package:mac

```

The prepare script makes use of the USE_HASH_HISTORY env-variable in the web package for using a router with hash-history in builds. Explanation: a default browser-history uses domain resolution like https://domain.at/route while a hash history uses https://domain.at/#/route. This is necessary because electron does all routes on a single html-file and specifying a different route is like searching a different paths, while the web package can be configured with nginx to route all traffic to the single html file on the server-side.

This could be enhanced with 2 possibilities:
* serve the frontend from the bundled NestJS backend as static files
* catch requests in electron and redirect to the html file

For now, the history-switching is sufficient.

### Development 
For development it is recommended to use the build and deployment commands given in the subpackage's `package.json`. Additional information can be found in this README file. 

### Tips and Tricks
* Because the dist folders are only copied once, changes in the respective packages do not take effect when electron is started again. Call yarn prepare beforehand.
* If a feature is missing or should be implemented just google it or have a look at the npm-registry. Most of the time there already exits a package used by thousands, well tested and updated regularly.
* Use util-libraries like moment, lodash, uuid, validator, dotenv, request etc. for specific tasks as these are well tested and implement also edge-cases.
* Take care of native dependencies and look at the electron-builder documentation how to integrate and build them.

### Build
Electron-builder seems to have problems at cross compiling, thus when packaging the application for a specific platform, this has to
be done on the corresponding platform. 
