# Build From Scratch Guide
This guide describes how to build a vtk-js sandbox project from scratch. 

This is a simplified version of the vtk-js official guide: https://kitware.github.io/vtk-js/docs/vtk_vanilla.html

### Pre-requisite
- A computer
- Install [node.js](https://nodejs.org/en)

### Project Init
This step helps creating a node.js project that uses `npm` to manage dependencies. 

```bash
cd your/project/dir
npm init
# You will be prompted to configure the project 
# or just hit the enter all the way for a prototype
```

### Install Dependencies
1. Install a JavaScript bundler and a server, which helps integrating and serve our code and all the dependencies into one optimized file, to improve performance. 
- We are using [webpack](https://webpack.js.org/) here, a popular bundeler. Run following command to install:
```bash
cd your/project/dir
npm install -D webpack-cli webpack webpack-dev-server
```
- In the command, `-D` means install the packages as a dev dependency, since we are not deploying the project to production server at this time.
- `webpack-dev-server` is installed to host our project on a development server. 
- We also installed `webpack-cli` to use the command line interface of the `webpack`


2. Install vtk-js by running following command:
```bash
cd your/project/dir
npm install @kitware/vtk.js
```

### Project Scaffolding
Project scaffolding is the process of creating necessary folder structure and files for the bundler and the server to run our project. 

1. First of all, we need to create a folder storing static content (content that doesn't change during the run). We name it `dist` for our project
```bash
cd /your/project/dir
mkdir dist
```
2. Then we create a `index.html` to specify the most basic structure of our website
```bash
cd /your/project/dir/dist
touch index.html
```
3. Copy and paste following code to `index.html`
```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
  </head>
  <body>
    <script src="./main.js"></script>
  </body>
</html>
```
- The `./main.js` file specified here is not the file we will be writing. It will be created by the bundler when running the server by bundling all the source code and dependencies.
4. Create a source folder for stroing our javascript code
```bash
cd /your/project/dir
mkdir src/
touch src/index.js
```
- All our code will be written in this file.
- You can test the project with this [example code](https://kitware.github.io/vtk-js/docs/vtk_vanilla.html#Using-vtk-js-in-your-app)
---
### Running the Project
To see our work in a browser, we need to host the project on a virtual web server. Here we need to add some shortcuts command for hosting the project using the webpack toolset.

1. Inside `package.json` add following lines to the `script` object
```json
"start": "webpack serve --progress --mode=development --static=dist",
```
- The `--static` option will specify the static folder in our project, which is the `dist` folder.

2. Then we can run the server by running following command
```bash
cd /your/project/dir
npm run start
```

- You will see something like this:
```
<i> [webpack-dev-server] Project is running at:
<i> [webpack-dev-server] Loopback: http://localhost:8080/
<i> [webpack-dev-server] On Your Network (IPv4): http://10.102.135.97:8080/
<i> [webpack-dev-server] On Your Network (IPv6): http://[fe80::1]:8080/
<i> [webpack-dev-server] Content not from webpack is served from 'dist' directory
```

- In a browser, type in either `http://localhost:8080/` or one of the IPv4 and IPv6 address, to play with the project
- You can also use the IPv4 and IPv6 address to share the project in the local network by typing in the addresses in any device browser. Just make sure the devices are connected to the same local network.