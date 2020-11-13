---
title: RabbitMQ 网络分区
date: 2020-11-09
categories:
   - 后端
tags:
  - RabbitMQ
sidebar: auto
---


| Hostname | IP         |
| -------- | ---------- |
| node1    | 10.0.44.91 |
| node2    | 10.0.44.92 |
| node3    | 10.0.44.93 |

## 模拟网络分区

### 1. 让 node2 脱离集群

在 `node2`执行命令，关闭网卡。

```sh
ifdown ens3
```

### 2. 查看各节点状态

等待一分钟左右，在 `node1`查看集群状态，执行`rabbitmqctl cluster_status`，此时`node1`认为`node2`已经脱离集群。`node3`情况一样。

```
[root@node1 ~]# rabbitmqctl cluster_status
Cluster status of node rabbit@node1 ...
Basics

Cluster name: rabbit@node1

Disk Nodes

rabbit@node1
rabbit@node2
rabbit@node3

Running Nodes

rabbit@node1
rabbit@node3

Maintenance status

Node: rabbit@node1, status: not under maintenance
Node: rabbit@node3, status: not under maintenance

Network Partitions

(none)
```

在`node2`上执行`rabbitmqctl cluster_status`，显示信息，此时还没有出现网络分区。

![](https://p.vczyh.com/blog/20201110093507.png)

### 3. 让 node2 恢复

`node2`恢复网卡。

````
ifup ens3
````

### 4. 查看各节点状态

查看 `node1`集群状态，检测到网络分区。`node3`情况一样。

```
[root@node1 ~]# rabbitmqctl cluster_status
Cluster status of node rabbit@node1 ...
Basics

Cluster name: rabbit@node1

Disk Nodes

rabbit@node1
rabbit@node2
rabbit@node3

Running Nodes

rabbit@node1
rabbit@node3

Maintenance status

Node: rabbit@node1, status: not under maintenance
Node: rabbit@node3, status: not under maintenance

Network Partitions

Node rabbit@node1 cannot communicate with rabbit@node2
Node rabbit@node3 cannot communicate with rabbit@node2
```

`json`格式。

```json
"partitions":{
    "rabbit@node1":[
        "rabbit@node2"
    ],
    "rabbit@node3":[
        "rabbit@node2"
    ]
},
```

`node1` web界面。

![](https://p.vczyh.com/blog/20201110102504.png)

查看`node2`集群状态。

```
[root@node2 ~]# rabbitmqctl cluster_status
Cluster status of node rabbit@node2 ...
Basics

Cluster name: rabbit@node1

Disk Nodes

rabbit@node1
rabbit@node2
rabbit@node3

Running Nodes

rabbit@node2

Versions

rabbit@node2: RabbitMQ 3.8.9 on Erlang 22.3.4.11

Maintenance status

Node: rabbit@node2, status: not under maintenance

Network Partitions

Node rabbit@node2 cannot communicate with rabbit@node1, rabbit@node3
```

`json`格式。

```json
"partitions":{
    "rabbit@node2":[
        "rabbit@node1",
        "rabbit@node3"
    ]
},
```

`node2`web 界面。

![](https://p.vczyh.com/blog/20201110102906.png)

## 网络分区恢复

// TODO