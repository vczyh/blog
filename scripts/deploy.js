const shell = require(`shelljs`)

shell.exec(`yarn build`)
shell.cd(`public`)
shell.exec(`echo blog.zhangeek.com > CNAME`)

shell.exec(`git init`)
shell.exec(`git add -A`)
shell.exec(`git commit -m "deploy"`)

// shell.exec(`git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master`)
// shell.exec(`git push -f git@e.coding.net:vczyh/blog/static.git master`)
shell.exec(`git push -f git@gitee.com:vczyh/vczyh.git blog:blog`)
