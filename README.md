# Created by https://www.gitignore.io/api/node

### Node

# Logs

logs
_.log
npm-debug.log_
yarn-debug.log*
yarn-error.log*

# dependencies

/configs/configs.js

/node_modules

# IDEs and editors

/.idea
.project
.classpath
.c9/
_.launch
.settings/
_.sublime-workspace

# IDE - VSCode

.vscode/\*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json

# IndiaNIC Node Project

## Prequisites (Development):

| Module | Version |
| ------ | ------- |
| Node   | 8.15.1  |
| Npm    | 6.4.1   |

##### Take Clone of project

> git clone -b git_url folder_name
> git -b checkout dev
> git pull origin dev


##### Change the url of database and set credential if applicable

> vi configs.js

##### Install node modules

> npm install

##### Run Project

> node server.js   

##### Deployment

> pm2 start server.js --name="instanceName"
