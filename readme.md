<h1>sy-trans [Symphony Transfer]</h1>

<h4>Sy-Trans V2 now supports writing an array of files. It also implements a built-in queue for better stability and reliability. The new version requires only one connection per array of files.</h4>

<h3>Description</h3>
sy-trans is being developed as a library (like other npm modules like node-symphony, symphony-db, and any other module that you 'require' during the development process).</br>
Developers will be able to require sy-trans, and this will expose promise-based file transfer methods for the most common protocols (e.g. FTP, SFTP) to read directories, read files, and write files.

<h3>Table of Contents</h3>
<ul>
<li><a href="#getting-started">Getting Started</a></li>
<li><a href="#sftp-methods">SFTP Methods</a>
  <ul>
    <li><a href="#sftp-read-directory">Read directory</a></li>
    <li><a href="#sftp-read-file">Read file</a></li>
    <li><a href="#sftp-write-file">Write file</a></li>
    <li><a href="#sftp-multiple-files">Multiple files</a></li>
  </ul>
</li>
<li><a href="#ftp-methods">FTP Methods</a>
  <ul>
    <li><a href="#ftp-read-directory">Read directory</a></li>
    <li><a href="#ftp-read-file">Read file</a></li>
    <li><a href="#ftp-write-file">Write file</a></li>
    <li><a href="#ftp-move-file">Move a file</a></li>
  </ul>
</li></ul>

<a name="getting-started"></a>
<h3>Getting Started</h3>
Add sy-trans to your app's package.json in the 'dependencies' section.

```
{
  "dependencies": {
    "sy-trans": "symphony-integrations/sy-trans"
  }
}
```

Run npm update from the command line.

```
npm update sy-trans
```

Require sy-trans in your script.

```
const transfer = require('sy-trans');
```

Accessing protocol methods

```
const sftp = transfer(connection_options).sftp;
const ftp = transfer(connection_options).ftp;
```

<a name="sftp-methods"></a>
<h3>SFTP Methods</h3>

Establish connection options. These will typically be stored as environment variables so that you're not explicity storing sensitive information in a repo.

```
const options = {
  host: process.env.sftp_host,
  port: process.env.sftp_port,
  username: process.env.sftp_user,
  password: process.env.sftp_password
}
```

Compile individual file information (each sftp method takes in one file at a time. Read further for examples of asynchronously transferring an array of files in one go.

```
const file = {
  content: <This is a STRING. sy-trans currently supports transfering txt, xml, csv, tsv, json, etc.>
  path: </directory/sub-directory/filename + extension>
}
```

<a name="sftp-read-directory"></a>
<h4>Read directory.</h4>

Acquire a list of files in a directory (folder) on the sftp server.

```
sftp.readDir (path: string) 
  .then((list) => {
    console.log(list.length)
    return list;
  });
```

<a name="sftp-read-file"></a>
<h4>Read a file.</h4>

Use the options and file objects as inputs. This will return your file object with the 'content' property filled in!

```
sftp.readFile (file)
  .then((file) => {
    <file = {
      content: <your new content>,
      path: <the filepath from where this file was read>
    }>
  });
```

<a name="sftp-write-file"></a>
<h4>Write a file.</h4>

Let's say you've converted a data object to a csv formatted string. This string will be the the 'content' within your file object. You can pass a single file object or an array of formatted file objects into the writeFile method.

```
//Single file
sftp.writeFile (file: object)
  .then((file) => {
    <file = {
      content: <the content you wrote>,
      path: <the filepath from where this file was read, with a .csv extension in this case>
    }>
  });
  
//Array of files
sftp.writeFile (files: array)
  .then((files) => {
    <files = [{
      content: <content of file 1>,
      path: <path of file 1>
    }, 
    {
      content: <content of file 2>,
      path: <path of file 2>
    }, 
    { 
      and so forth ....
    }]>
  });
```

<a name="ftp-methods"></a>
<h3>FTP Methods</h3>

Establish connection options. These will typically be stored as environment variables so that you're not explicity storing sensitive information in a repo.

```
const options = {
  host: process.env.sftp_host,
  port: process.env.sftp_port,
  username: process.env.sftp_user,
  password: process.env.sftp_password
}
```

Compile individual file information (each ftp method takes in one file at a time.

```
const file = {
  content: <This is a STRING. sy-trans currently supports transfering txt, csv, tsv, xml, json, etc.>
  path: </directory/sub-directory/filename + extension>
}
```

<a name="ftp-read-directory"></a>
<h4>Read directory.</h4>

Acquire a list of files in a directory (folder) on the sftp server.

```
ftp.readDir (path: string) 
  .then((list) => {
    console.log(list.length)
    return list;
  });
```

<a name="ftp-read-file"></a>
<h4>Read a file.</h4>

Use the options and file objects as inputs. This will return your file object with the 'content' property filled in!

```
ftp.readFile (file: object)
  .then((file) => {
    <file = {
      content: <your new content>,
      path: <the filepath from where this file was read>
    }>
  });
```

<a name="ftp-write-file"></a>
<h4>Write a file.</h4>

Let's say you've converted a data object to a tsv formatted string. This string will the the 'content' within your file object.

```
//Single file
ftp.writeFile (file: object)
  .then((file) => {
    <file = {
      content: <the content you wrote>,
      path: <the filepath from where this file was read, with a .csv extension in this case>
    }>
  });
  
//Array of files
ftp.writeFile (files: array)
  .then((files) => {
    <files = [{
      content: <content of file 1>,
      path: <path of file 1>
    }, 
    {
      content: <content of file 2>,
      path: <path of file 2>
    }, 
    { 
      and so forth ....
    }]>
  });
```

<a name="ftp-move-file"></a>
<h4>Move a file.</h4>

Move (and/or rename) a file within your FTP server.

```
ftp.moveFile (fromPath: string, toPath: string)
  .then((file) => {
      // file moved to new location, new filename, or both
  });
```

