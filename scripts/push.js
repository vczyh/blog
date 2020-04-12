const shell = require('shelljs')

shell.exec(`git add -A`)
shell.exec(`git commit -m auto`)
shell.exec(`git push -u origin master`)