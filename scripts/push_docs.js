const shell = require('shelljs')

// shell.cd('docs')
// shell.exec(`git init`)
// shell.exec(`git remote add origin git@github.com:vczyh/docs.git`)
console.log('1111')
shell.exec(`git add -A`)
shell.exec(`git commit -m auto`)
shell.exec(`git push -u origin master:vuepress-something`)