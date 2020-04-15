const shell = require('shelljs')

// shell.exec('set -e')
shell.exec('npm run build')
shell.cd('docs/.vuepress/dist')
//  echo 'www.example.com' > CNAME
shell.exec("git init && git add -A && git commit -m deploy")
shell.exec('git push -f git@github.com:vczyh/vczyh.github.io.git master')