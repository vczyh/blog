const shell = require('shelljs')

shell.cd('docs')
shell.exec(`git init`)
shell.exec(`git remote add origin https://github.com/vczyh/docs.git`)
shell.exec(`git add -A`)
shell.exec(`git commit -m auto`)
shell.exec(`git push -u origin master:blog`)