# web

This package contains a frontend for users to check if a CMR document is valid.

### Architecture
In this package, a number of frameworks are being used:
* React for DOM manipulation and rendering
* Redux for state management
* Redux Saga for dispatching asynchronous actions
* React Bootstrap for unified UI components

### Usage
```shell script
// builds a self-contained distribution with features like logging
yarn build

// builds a self-contained distribution, suitable for production usage
yarn build:prod

// starts webpack in dev mode and watches for file changes
// also provides debugging features and logging
yarn dev
```

The history dependency is a fork of the react-router history, because the maintainer does not fix or merge a router issue that is fixed in this Github-repo.

#### Build Environment Variables
The following list of environment variables is used for the build process:
- **USE_HASH_HISTORY**: Whether the router information should be visible in the URLs. **Defaults** to `false`.
- **BACKEND_API**: URL of the backend. **Defaults** to `localhost:8083`.
- **BASE_PATH**: Path from which the application should be served. **Defaults** to `/`, resulting in the application being accessible via
`http://domain/`.

#### Docker Environment Variables
In order to make the application configurable, we employ environment variables. The following list presents all used and
aviable variables and their purpose.
- **BACKEND_PROXY_URL**: This variable is a url that specifies where requests to BACKEND_URL should be routed to.
E.g.: http://validator-api:8083 resolve docker-container or service named validator-api in the current docker-network.
- **BACKEND_URL**: URL Subpath which will be proxied to the backend of the current location. **Defaults** to `validator-api/`

**IMPORTANT**: Changing the backend url multiple times can break the application, since
the BACKEND_URL is replaced using String-Replace. If the URL must be changing multiple times it is recommended to start a fresh
container every time.
- **BASE_PATH**: see `Build Environment Variables`.BASE_PATH

#### Docker Image
To build the docker container for the frontend, the following command is executed in the project's root folder:
```shell script
docker build -f packages/web/Dockerfile -t web:<tag> 
```  
The new container can be started via:
```shell script
docker run -p "3082:3082" -e BACKEND_URL=<BACKENDURL> -e BACKEND_PROXY_URL: http://validator-api:8083 web:<tag>
```
The `-f` argument points docker to the frontend's Dockerfile, while `-p` sets up port forwarding of the host to the guest machine. The `BACKEND_URL` is used to set the
URL of the backend in the frontend.

### Frontend Documentation

To generate documentation for the `web` package , use
```
npx compodoc -p tsconfig.json
```

To serve the documentation at `http://localhost:8080` use
```
npx compodoc -s
```

For more information, see
* https://docs.nestjs.com/recipes/documentation#documentation
* https://compodoc.app/guides/usage.html

### Tips and Tricks
* If a feature is missing or should be implemented just google it or have a look at the npm-registry. Most of the time there already exits a package used by thousands, well tested and updated regularly.
* Use util-libraries like moment, lodash, uuid, validator, dotenv, request etc. for specific tasks as these are well tested and implement also edge-cases.

### How to add styles (default and css-modules)
* simply import all your style-files into a package-candidate file like index.tsx
* general styles must be named without "module.(css|scss|sass)", modules must end with "module.(css|scss|sass)"
* example of using styles/composing styles: https://github.com/electron-react-boilerplate/electron-react-boilerplate/blob/master/app/components/Counter.tsx#L30
* composing styles: https://github.com/webpack-contrib/css-loader/blob/master/README.md#composing
* composing sass-styles: https://stackoverflow.com/questions/37706812/can-i-import-scss-file-uses-the-composes-statement-with-webpack
* debugging of css-modules: https://stackoverflow.com/questions/40675108/how-to-debug-css-bundled-by-webpack
* when composing styles maybe make use of this: https://www.npmjs.com/package/classnames
* keep in mind: undefined css-classes will not throw errors
