# LimbForge 

This is a tool for enabling easy sizing of e-NABLE device files by a web client. The files can then be inspected in the browser's 3D canvas and downloaded as a single zip file.

For more information about the project, the approach, and on-boarding new device designs into LimbForge, [__please visit the wiki__](https://github.com/e-nable/LimbForge/wiki).

### Setting up your dev environment
#### (Note: these instructions are for Linux and OS X)
Install Node. My personal favorite way of installing and managing node is with NVM (Node Version Manager).  
Copy this script into your terminal
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash
```

Now we're going to run a few steps to get NVM up and running.  
**Copy and paste** the code below into your terminal. It will do the following:
- Set nvm to run whenever you open a terminal
```
sudo echo ". ~/.nvm/nvm.sh" >> ~/.bashrc
```
- Run nvm for this terminal window instance
```
. ~/.nvm/nvm.sh
```
- Download your favorite version of Node. For this project, we will be using Node V5.10  
```
nvm install v5.10
nvm alias default v5.10
```

As of now, the dev environment is only a Sass compiler and a file server. To download the required tools, type:  
```
npm install
```

Okay, all the tough stuff is done.
To run our server type:  
```
npm start
```

Go to [localhost:2368](http://localhost:2368 ) to check out the site!
