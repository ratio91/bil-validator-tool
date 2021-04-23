# api

This package contains a NodeJS application using NestJS for proxying REST-API requests to the frontend. Associated with this task, processing and preparation of fetched or user provided data is necessary.

### Architecture
The core of this package is an application using the NestJS framework. Similar to Spring boot in Java, NestJS abstracts setup and configuration of the underlying web server (in our case NodeJS with Express) while providing some best-practice abstractions following the motto convention over configuration.
If your're not familiar with NestJS, their architecture and approaches for testing, logging and security, you can directly dig into their documentation [here](https://docs.nestjs.com). Also a nice point to start is the example folder in their official Github-Repository [here](https://github.com/nestjs/nest/tree/master/sample).

### Usage
To develop and test the backend, simply look at the `package.json` in the scripts section to get
inspired for possible usage-scenarios. For development purposes, the commands starting with `nest:`
are preferred as tooling and ease of use are better than the commands utilizing webpack. Webpack
kicks in, when it comes to shipping and deployment. While it is more convenient to ship the whole
project on a server and run the process of building and running the application with node or nest
directly from the folder, it is essential for a desktop application to bundle all the files and
create a self-contained JS-application. The reason for this is that npm or yarn is installed on most
 servers but rarely on PCs. Even though the webpack-packaging should take care of deploying a
 self-contained app, one should check how native-dependencies like bcrypt for node behave when
 bundled.

The minification and compression from webpack is disabled here to not minify the variables and
endpoint names in the SwaggerAPI-docs that are generated from TypeScript. Additionally, static file
 assets like swagger-ui-dist are copied by webpack into the dist folder while bundling, so the
 features are still working on a different machine like the one it was bundled. Bundling
 and packaging brings some challenges and it may be easier to start with these commands:

```shell script
// build a NestJS application 
yarn nest:build

// starts a dev-server that watches for file-changes
yarn nest:dev

// starts a dev-server that watches for file-changes and provides some debugging features
yarn nest:debug
```

#### Environment Variables
In order to make the application configurable, we employ environment variables. The following list
presents all used and available variables and their purpose.

- **SWAGGER_PATH**: This variable is used to set the URL of the served swagger documentation. E.g.: Setting this variable to 
`swagger/` will make the documentation available at `http://localhost:8083/swagger/`. **Defaults** to `/swagger`.
- **LOGDIR_PATH**: This variable points to the location where log files should be placed. E.g.:
Setting it to `/tmp/`, results in
log files being saved in the `tmp` folder. **Defaults** to `./logs/`.

#### Docker Image
To build the docker container for the api, the following command is executed in the project's root folder:
```shell script
docker build -f packages/api/Dockerfile -t api:<tag> .
```  
After the container is built, it can be started via:
```shell script
docker run -p "3083:3083" --name api api:<tag>
```
The `-f` argument points docker to the api's Dockerfile, while `-p` sets up port forwarding of the host to the guest machine. 
The default REST configuration can be overwritten by supplying a custom configuration using the `-v` parameter:
```shell script
docker run -p "3083:3083" -v <PATH TO CUSTOM API ENDPOINT JSON>=/app/restConfiguration.json --name api api:<tag>
```
After starting the container the empty <PATH TO REST CONFIGURATION> folder should be filled with an example REST configuration.
You can simply change the configuration and restart the container for it to take effect.
```json
{
    "100": "https://example.rest.system.com",
    "200": "http://other.rest.system.com"
}

```
Additionally, the given environment variables can be set via the `-e` parameter. For example:
```shell script
docker run -p "3083:3083" -e SWAGGER_PATH=new-swagger-path --name api api:<tag>
```

### Ethereum Node Configuration
The application uses the Ethereum blockchain to retrieve the hash values of an eCMR document. To
interact with the Ethereum network we use `web3.js` and Infura. The web3 endpoint and the address of
 the contract used for accessing the documents can be configured in the
 `packages/api/src/config/config.ts` file. There you will find the default configuration, which
 contains the following.
```
    {
      infuraEndpoint: <ENDPOINT>,
      contractAddress: <ADDRESS>,
    }
```
Changing the configuration requires the project and the docker containers to be rebuilt.

### API Documentation
To generate API documentation, use
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

### Notes
We use awesome-typescript-loader instead of ts-loader in our webpack config because ts-loader does not work on Windows 10. Paths are not resolved correctly.

### Tips and Tricks
* Read the NestJS docs carefully and use their approaches for cross-cutting concerns.
* If a feature is missing or should be implemented just google it or have a look at the npm-registry. Most of the time there already exits a package used by thousands, well tested and updated regularly.
* Use util-libraries like moment, lodash, uuid, validator, dotenv, request etc. for specific tasks as these are well tested and implement also edge-cases.

