---
title: RabbitMQ 集群
date: 2020-10-09
categories:
   - 后端
tags:
  - RabbitMQ
sidebar: auto
---



## 环境

| IP             | Hostname |
| -------------- | -------- |
| 192.168.30.128 | node1    |
| 192.168.30.129 | node2    |
| 192.168.30.130 | node3    |

## 1. 配置 Hosts

分别为每个节点配置Hosts，打开 `/etc/hosts`，添加以下内容。

```
192.168.30.128 node1
192.168.30.129 node2
192.168.30.130 node3
```

## 2. 安装 RabbitMQ

需要为每个节点安装 RabbitMQ 服务（指的是erlang服务）和应用（指的是rabbitMQ应用）。这里环境为 Ubuntu，直接使用官方提供的脚本安装。其他安装方式或者其他系统安装可以参考 [官方文档](https://www.rabbitmq.com/download.html)。

```sh
#!/bin/sh

## If sudo is not available on the system,
## uncomment the line below to install it
# apt-get install -y sudo

sudo apt-get update -y

## Install prerequisites
sudo apt-get install curl gnupg -y

## Install RabbitMQ signing key
curl -fsSL https://github.com/rabbitmq/signing-keys/releases/download/2.0/rabbitmq-release-signing-key.asc | sudo apt-key add -

## Install apt HTTPS transport
sudo apt-get install apt-transport-https

## Add Bintray repositories that provision latest RabbitMQ and Erlang 23.x releases
sudo tee /etc/apt/sources.list.d/bintray.rabbitmq.list <<EOF
## Installs the latest Erlang 23.x release.
## Change component to "erlang-22.x" to install the latest 22.x version.
## "bionic" as distribution name should work for any later Ubuntu or Debian release.
## See the release to distribution mapping table in RabbitMQ doc guides to learn more.
deb https://dl.bintray.com/rabbitmq-erlang/debian bionic erlang
## Installs latest RabbitMQ release
deb https://dl.bintray.com/rabbitmq/debian bionic main
EOF

## Update package indices
sudo apt-get update -y

## Install rabbitmq-server and its dependencies
sudo apt-get install rabbitmq-server -y --fix-missing
```

安装以后，服务自动启动，默认开启两个端口（同一个进程），`25672`为集群通信提供服务，`5672`为客户端提供服务，客户端连接的就是这个端口。

## 3. 配置 Cookie

集群通过 Cookie 进行验证，需要将所有节点的 Cookie 配置统一，这里将 node1 节点的 Cookie 值复制到其他节点。Cookie 文件的默认路径为 `/var/lib/rabbitmq/.erlang.cookie`，如果不是通过包管理器安装，路径为`$HOME/.erlang.cookie`。

## 4. 配置集群

这一步会将各个独立的节点配置成一个集群。在配置之前，可以通过`rabbitmqctl cluster_status`查看集群状态。

以 node2 节点为例，如果程序正在运行，你可以通过命令停止应用。

```bash
rabbitmqctl stop_app
```

将节点加入到集群当中，可以加入 node1 或者 node3，各个节点是平等的，这只会影响后面的操作顺序。

```bash
rabbitmqctl join_cluster rabbit@node1
```

启动应用。

```bash
rabbitmqctl start_app
```

再次通过`rabbitmqctl cluster_status`查看集群状态，与配置之前对比一下。

同理，可以通过以下命令将 node3 节点加入到集群当中。

```bash
rabbitmqctl stop_app
rabbitmqctl join_cluster rabbit@node1
rabbitmqctl start_app
```

## 5. Web Management

RabbitMQ 官方提供了 `rabbitmq_management`插件，方便通过 Web 页面进行管理。

通过命令安装。

```bash
rabbitmq-plugins enable rabbitmq_management
```

完成后，访问`http://IP:15672`即可。默认的`guest`用户只能在本地登录，远程登录需要创建新用户。如果是集群的话，只需要在任意一个节点设置用户，会自动同步到整个集群。

```bash
rabbitmqctl add_user admin admin
```

此时，并不能登录，需要为用户设置角色，`administrator`角色可以登录 Web 页面。

```bash
rabbitmqctl set_user_tags admin administrator
```

为了客户端使用该账号，需要赋予一定的权限。

```bash
rabbitmqctl set_permissions -p / admin ".*" ".*" ".*"
```

至此，一个简单的集群搭建完毕。