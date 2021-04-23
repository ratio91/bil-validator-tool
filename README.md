# BIL Validator Tool

The BIL Validator Tool is a web based validation tool for eCMR documents notarized by the BIL eCMR platform.
Furthermore, the tool can be built as native App using the Electron framework.

![Screenshot](img/screenshot.png "Screenshot")

## Requirements

```
git ^2.24.0
node ^12.16.1
npm  ^6.13.4 - included with node version 12.16.1
yarn ^1.22.4
bash ^5.0.11 or similar shell engine to call scripts
```

## Project setup

```shell script
// clone repository:
git clone <this-repo>

// move into project folder
cd ./validator-tool

// install dependencies
yarn
```

## Structure

The project is divided into the following three packages:

- backend  
- frontend  
- native  

The `backend` handles fetching of the eCMR data, resolving the CMR Nr. and Pin-Code and checking the validity of the given document.  

The `frontend` sends the given PDF document or the CMR No. and Pin-Code to the backend and then displays the result of the validation and the data inside the CMR document.  

The `native` package contains the required electron files. Each package contains its own README, which should be carefully read before using the application.   


### Folder structure

- to easily manage the monorepo-structure, the project is setup with yarn workspaces and lerna and the setup follows best-practices from the lerna and yarn documentation pages. If you don't know about lerna and yarn workspaces you can start with an introduction and a comparison to other approaches [here](https://doppelmutzi.github.io/monorepo-lerna-yarn-workspaces).  
- the mentioned tooling divides our project in a root-project and 3 sub-packages in the packages folder  
- these sub projects are divided in:  
  - api: contains a nodeJS application using the NestJS framework for serving a REST-backend. This package is responsible for proxying eCMR-REST APIs and providing additional functionalities for the frontend. Additionally this module can be deployed as single backend using docker.  
  - web: contains a SPA (S ingle P age A pplication) written in React. This part represent the main-view of our application and can be deployed with a webserver like nginx (docker) or as single html/js/css-package.  
   native: contains a wrapper application with electron that bundles the api package and web package into a full native desktop application for Windows, Linux and macOS.  
- additional information regarding single packages can be taken from the README in the respective package-folder  
- one additional folder in the root package is e2e: this contains testing logic for e2e tests of backend/api/native packages  

## Usage

- there is a root `package.json` containing useful scripts utilizing lerna for e.g. linting, building or testing of the whole project - just have a look at the defined scripts in root `package.json`.
- every package contains its own `package.json` file with its own naming scheme and can be deployed
and run individually. Further information on running and building subpackages can be taken from the respective README or `package.json`.
- to run a command in a subpackage, simply `cd` into a package and run the specific commands.
- in the root `package.json` file also Docker scripts are configured to run and deploy docker containers providing the backend and web package. To use these scripts, docker and docker-compose must be installed.
- Docker-images have to be built from the root directory as the whole monorepo is copied from `cwd` into the Docker build context and access to parent folders is denied when starting a build from a specific subfolder.

### Development commands

The project's `package.json` contains predefined commands for running and deploying the project for development. These commands
need to be executed from the root folder of the project. The subpackages located in the `packages` folder contain additional commands 
for the individual packages.
The api package can be started using the following command:

```shell script
yarn dev:api
```

For running the frontend the following command should be used:

```shell script
yarn dev:web
```

Furthermore, starting the desktop application can be done via the following command:

```shell script
yarn dev:native
```

### Docker Deployment

#### Frontend

```shell script
docker create \
  --name=frontend \
  -e BASEPATH=/ \
  -e BACKEND_URL=<URL_OF_BACKEND> \ 
  -p 8082:8082 \
  ss20aseqse01/web:latest
```

##### Environment-Variables

| Parameter | Function |
|-----------|----------|
|BASEPATH|Used to set the URL of the frontend. Should start with '/' and should not end with '/'.|
|BACKEND_URL|Used to give the container the URL or IP of the backend system|

#### Backend

```shell script
docker create \
  --name=backend \
  -v <PATH_TO_LOGS>:/tmp/validator/logs/
  -e LOGDIR_PATH=/tmp/validator/logs/ \
  -e SWAGGER_PATH=/swagger \
  -p 8083:8083 \
  --restart unless-stopped \
  ss20aseqse01/api:latest
```

##### Environment-Variables

| Parameter | Function |
|-----------|----------|
|LOGDIR_PATH|Used to set the location for log files inside the container|
|SWAGGER_PATH|Used to set the URL for the swagger backend|

#### Docker-compose

In order to run the application in a dockerized manner, please use the given `docker-compose.yml` file. The file contains further
docker-specific comments for the deployment.
Using Docker Compose the application with default values can be started using:  

```shell script
docker-compose up
```

If you want to supply a custom configuration for REST-Endpoints, add the following line to the `api` container in the `docker-compose.yml`:

```dockerfile
volumes:
- <PATH TO YOUR REST CONFIG JSON FILE>:/app/restConfiguration.json
```

After executing `docker-compose up` again the new config should be injected and overrides the initial configuration file.

#### Tips and Tricks

- use an IDE like IntelliJ/Webstorm/VSCode and install plugins for development like prettier, eslint, npm-scripts, browser-debugging etc.
- use tooling like IntelliSense and language support for TypeScript, React, JS and config files like babel, eslint, editorconfig etc.
- disable IDE-indexing of node_modules as every change cases a reindex on the whole node_modules folder
- web-apps can be debugged by attaching a debugger to the dev-server started by most of the packages in background
- disable save-writes and switch to manual-saves in the IDE as the dev-servers watch file changes and build changed parts instantly - a write from IDE on every letter may cause the dev-server to build uninterrupted (activate also asterx to don't forget unsaved files)
- turn on eslint auto-detection as all eslint-config files are present in the project and the eslint is contained in the project, so there is no need to specify an extra instance with own linting-rules
- if some linting-rules are not useful, make a suggestion in a merge-request, maybe the current eslint-rules are too messy and should be sorted out

#### Resources

##### Debugging

- [Client side debugging with JetBrains IDEs like IntelliJ](https://www.jetbrains.com/help/idea/running-and-debugging-typescript.html)
- Disable safe writes: [here](http://thehunk.blogspot.com/2015/07/disable-auto-save-in-jetbrains-ide.html) or [here](https://parceljs.org/hmr.html#safe-write)

##### Lerna and Yarn Workspaces

- [Configuration of typescript with lerna](https://medium.com/@NiGhTTraX/how-to-set-up-a-typescript-monorepo-with-lerna-c6acda7d4559)
- [Lerna Typescript structure - also describing module resolution with Typescript (ts references)](https://github.com/Quramy/lerna-yarn-workspaces-example)
- [Lerna managed multi-sdk project](https://medium.com/mitterio/multirepo-to-lerna-js-monorepo-80f6657cb443)
- [Another Lerna managing a frontend/backend app](https://medium.com/the-andela-way/using-lerna-to-manage-js-monorepos-b7b8611f2ff3)

##### React

- [React Bootstrap UI](https://react-bootstrap.netlify.com)
- [Electron React Boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate)

##### Electron

- [Electron](https://www.electronjs.org/)
- [Electron builder](https://www.electron.build/)

##### Bundler

- [Webpack](https://webpack.js.org/concepts/)
- [How to Set Up a React TypeScript Project from Scratch with Babel and Webpack](https://medium.com/@dahvinchee/how-to-set-up-a-react-typescript-project-from-scratch-with-babel-and-webpack-6b069881229d): also describes how babel can be used to transform typescript.
- [Bundler decision/Parcel vs Webpack](https://blog.jakoblind.no/parcel-webpack)

##### NestJS

- [NestJS docs](https://docs.nestjs.com/)
- [NestJS examples](https://github.com/nestjs/nest/tree/master/sample)

##### Codequality

- [ESLint and Prettier in Typescript project](https://dev.to/robertcoopercode/using-eslint-and-prettier-in-a-typescript-project-53jb)
- [Migrating from TSLint to ESLint](https://medium.com/@cosmvs/painless-migration-from-tslint-to-eslint-for-react-with-typescript-4befb4918ba8)
- [Enable Prettier](https://prettier.io/docs/en/webstorm.html#running-prettier-on-save-using-file-watcher)
- [Preferred style guidelines (contains links to airbnb)](https://blog.geographer.fr/eslint-guide)
- [TypeScript types vs interfaces](https://pawelgrzybek.com/typescript-interface-vs-type/)
- [TypeScript cheat sheet](https://github.com/typescript-cheatsheets/react-typescript-cheatsheet)

##### Documentation

- [Markdown Cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)
- [Gitlab Markdown](https://reset.inso.tuwien.ac.at/repo/help/user/markdown)
- [jsdoc](https://jsdoc.app/)
- [NestJS code-documentation](https://docs.nestjs.com/recipes/documentation)

##### Testing

- [Testing Typescript applications](https://journal.artfuldev.com/unit-testing-node-applications-with-typescript-using-mocha-and-chai-384ef05f32b2)
- [4 ways of structure tests in your application](https://stackoverflow.com/questions/20548723/how-do-you-structure-your-tests-for-your-server-applications-in-node-js)
- [Debugging/Testing NodeJS app](https://scalified.com/2017/11/01/nodejs-typescript-intellij-debug/)
- [NestJS](https://docs.nestjs.com/fundamentals/testing)
- [NestJS unit tests article](https://medium.com/@jackallcock97/unit-testing-with-nestjs-and-jest-a-comprehensive-tutorial-464910f6c6ba)
