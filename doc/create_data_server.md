# Create an Experimental Data Server

### Pre-requisite
- A computer
- Install [node.js](https://nodejs.org/en)
- Run:
  ```bash
  npm install http-server -g
  ```
### Create a http file server
- Run:
  ```bash
  cd /Your/Data/Dir
  http-server --cors
  ```
  - The `--cors` is bypassing an important feature for hosting data for web application access. It was designed to protect the data server from the malicious requests sent by unrecognized senders. But it needs configurations to work correctly with our applications. As a quick-and-dirty data server example, we use `--cors` to workaround the protection so our app can access the data. But do use CORS to protect your data when configuring real data servers that are open to the public. Reference: https://developer.mozilla.org/en-US/docs/Glossary/CORS

- You will be prompted with following info
  ```
  Starting up http-server, serving ./

    http-server version: 14.1.1

    http-server settings: 
    CORS: true
    Cache: 3600 seconds
    Connection Timeout: 120 seconds
    Directory Listings: visible
    AutoIndex: visible
    Serve GZIP Files: false
    Serve Brotli Files: false
    Default File Extension: none

    Available on:
    http://x.x.x.x:8081
    http://x.x.x.x:8081
  ```
  Type `http://x.x.x.x:8081/you/file/name` in a browser, it should start downloading the file.

