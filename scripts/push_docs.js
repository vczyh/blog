const shell = require('shelljs')

// shell.exec(`git init`)
// shell.exec(`git remote add origin git@github.com:vczyh/docs.git`)
shell.cd('docs')
shell.exec(`git add -A`)
shell.exec(`git commit -m auto`)
shell.exec(`git push -u origin master:vuepress-something`)