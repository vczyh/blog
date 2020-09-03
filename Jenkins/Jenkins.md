## Jenkins基本安装

[清华镜像下载war包](https://mirrors.tuna.tsinghua.edu.cn/jenkins/war-stable/2.150.3/jenkins.war)

```bash
java -jar jenkins.war --httpPort=8080`
```

`http://localhost:8080`

**问题：**

> # Please wait while Jenkins is getting ready to work ...
>
> Your browser will reload automatically when Jenkins is ready.
>
>

**方案：**等一会儿，再不行重启试试

**问题：**

> It appears that your reverse proxy set up is broken.

**方案：**

这个问题一般是由反向代理造成的，我这里用的是Nginx，我的配置

```nginx
server {
        listen 443;
        server_name jenkins.vczyh.com;

        ssl on;
        ssl_certificate /etc/nginx/ssl/jenkins.vczyh.com/fullchain.pem; #（证书公钥）
        ssl_certificate_key /etc/nginx/ssl/jenkins.vczyh.com/privkey.pem; #（证书私钥）
        ssl_session_timeout 5m;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_ciphers AESGCM:ALL:!DH:!EXPORT:!RC4:+HIGH:!MEDIUM:!LOW:!aNULL:!eNULL;
        ssl_prefer_server_ciphers on;

        location / {
                proxy_pass http://127.0.0.1:9000;
                proxy_read_timeout  90;
        		# 以下几行是重点
                proxy_set_header X-Forwarded-Host $host:$server_port;
                proxy_set_header X-Forwarded-Server $host;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
                proxy_set_header X-Real-IP $remote_addr;

        }




```

[Jenkins says my reverse proxy setup is broken](https://wiki.jenkins.io/display/JENKINS/Jenkins+says+my+reverse+proxy+setup+is+broken)

### 初始化下载插件太慢

访问 `/pluginManager/advanced` ,修改 `Update Site` 为 https://mirrors.tuna.tsinghua.edu.cn/jenkins/updates/update-center.json

> 原来：https://updates.jenkins.io/update-center.json





