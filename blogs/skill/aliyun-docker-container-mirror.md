---
title: 阿里云容器镜像服务的基本使用
date: 2020-07-27
categories:
  - 技术
sidebar: false
tags:
  - Docker
---

## 注册阿里云容器镜像服务

远程仓库有很多，这里选用阿里云容器镜像服务，[登录填写密码就注册好了](https://cr.console.aliyun.com/cn-shenzhen/repositories)。

## 登录 Docker 仓库

```bash
$ docker login registry.cn-hangzhou.aliyuncs.com
Username: vczyh
Password: 
WARNING! Your password will be stored unencrypted in /home/vczyh/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credentials-store

Login Succeeded

```
| 参数                             | 说明                           |
| -------------------------------- | ------------------------------ |
| Username | 阿里云账号 |
| Password | 第一步注册的密码，不是阿里云登录密码 |

可以查看`~/.docker/config.json `

```bash
{
        "auths": {
        	// 每登录一个仓库，就会添加一条记录
        		// 官方默认仓库 如果没有登录过官方仓库就没有这条记录
                "https://index.docker.io/v1/": {
                        "auth": "xxxxxxxx"
                },
                // 阿里云杭州仓库
                "registry.cn-hangzhou.aliyuncs.com": {
                        "auth": "xxxxxxxx"
                }
        },
        "HttpHeaders": {
                "User-Agent": "Docker-Client/18.09.3 (linux)"
        }
}

```

## 创建命名空间

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190304000155465.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1RLREtfYm90,size_16,color_FFFFFF,t_70)

## Push镜像

push之前需要给镜像打标签，让镜像的格式符合push格式：`registry.cn-hangzhou.aliyuncs.com/acs/agent:0.8`

| 参数                             | 说明                           |
| -------------------------------- | ------------------------------ |
| registry.cn-hangzhou.aliyuncs.com | Registry的域名 |
| acs | 使用的命名空间名称 |
| agent | 使用的仓库名称 |
| 0.8 | 镜像标签（Tag）。非必须，默认为latest |

将这几个完全独立的概念组合一下，`registry.cn-hangzhou.aliyuncs.com/acs/agent` 称为仓库坐标，`acs/agent` 称为仓库全名（通常在API中使用）。

格式：

```bash
docker tag 镜像名或镜像ID Registry的域名/命名空间/仓库名称[:TAG]
```

比如：

```bash
docker tag friendlyhello:latest registry.cn-hangzhou.aliyuncs.com/zhangyuheng/hello:1.0
```

`friendlyhello`是本地镜像的名字，我想把它推送到阿里云杭州Registry的命名空间为`zhangyuehng`的仓库，并且把远程仓库名设置为`hello`，远程仓库的`TAG`为1.0

**push：**

```bash
$ docker push registry.cn-hangzhou.aliyuncs.com/zhangyuheng/hello

The push refers to repository [registry.cn-hangzhou.aliyuncs.com/zhangyuheng/hello]
6a16fc072b92: Pushed 
25207160ad9f: Pushed 
ea960483fa9a: Pushed 
4c17a5d758f3: Pushed 
7e6d2caa6460: Pushed 
ba1d5b7b438f: Pushed 
0a07e81f5da3: Pushed 
1.0: digest: sha256:0ce58a5951363980bf04af8ebbe43c3aeb5c7509b0cfc852cf05f6ee3f81c179 size: 1787
```

**为什么要在push之前先生成另一个镜像，原因就是在push的时候可以让Docker通过镜像名分辨出要推送到哪里**

## 查看远程仓库

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190304001922648.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1RLREtfYm90,size_16,color_FFFFFF,t_70)

## Pull镜像

```bash
docker pull registry.cn-hangzhou.aliyuncs.com/zhangyuheng/hello:1.0
```

## 运行远程仓库镜像

先删除本地镜像，不然会直接运行本地镜像

```bash
docker rmi registry.cn-hangzhou.aliyuncs.com/zhangyuheng/hello:1.0 
```

下载镜像并运行

```bash
$ docker run -p 4000:80 registry.cn-hangzhou.aliyuncs.com/zhangyuheng/hello:1.0

Unable to find image 'registry.cn-hangzhou.aliyuncs.com/zhangyuheng/hello:1.0' locally
1.0: Pulling from zhangyuheng/hello
Digest: sha256:0ce58a5951363980bf04af8ebbe43c3aeb5c7509b0cfc852cf05f6ee3f81c179
Status: Downloaded newer image for registry.cn-hangzhou.aliyuncs.com/zhangyuheng/hello:1.0
 * Serving Flask app "app" (lazy loading)
 * Environment: production
   WARNING: Do not use the development server in a production environment.
   Use a production WSGI server instead.
 * Debug mode: off
 * Running on http://0.0.0.0:80/ (Press CTRL+C to quit)

```



