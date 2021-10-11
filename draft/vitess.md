![](https://cdn.zhangeek.com/images/vitess-architecture.svg)



## 组件

### Topo Server

vitess支持Topo Server的实现方式有：

- etcd
- zookeeper
- consul

Topo Server分为**Global Topo**和**Local Topo**：

- **Global Topo**不会频繁改变，主要包含`keyspace`信息，`shard`信息，以及每个`shard`中`master`的信息
- **Local Topo**和`cell`对应，存储比**Global Topo**更详细的信息。

因此，规模比较大的vitess集群会有一个**Global Topo**和多个**Local Topo**，这样的话，某个`cell`挂掉，不会影响其他`cell`，但是如果**Global Topo**挂掉，那么会影响整个vitess集群，所以不要将**Global Topo**的所有节点部署在同一个`cell`。

参考：

- https://vitess.io/docs/concepts/topology-service

- https://vitess.io/docs/reference/features/topology-service

### MySQL

vitess没有对MySQL进行任何源码级别的修改，安装时直接从MySQL官方下载即可。

### VTTablet

`VTTablet`作`为MySQL`的前置代理：

- 接收`DDL`和`DML`，然后由指定的用户执行
- 备份恢复
- 将`MySQL`和`VTTablet`的信息注册到`Topo Server`

### VTGate

暴露给用户的组件，用户可以连接`VTGate`，但对某些`DDL`和`DML`不支持。

参考：

- https://vitess.io/docs/reference/compatibility/mysql-compatibility

### vtorc

`vtorc`是vitess团队fork的[orchestrator](https://github.com/openark/orchestrator)项目，负责`MySQL`

- failover
- 手动takeover（通过api或者在可视化界面拖拽）

### vtctld

`vtctld`提供可视化界面，可以查看`Topo Server`上的信息。可以通过`vtctlclient`cli工具将命令发送到`vtctld`让其处理，比如备份操作。

### vtctl

同`vtctlclient`类似，但是不需要`vtctld`，官方建议使用`vtctld`和`vtctlclient`。

> `vtctl` is a command-line tool used to administer a Vitess cluster. It is available as both a standalone tool (`vtctl`) and client-server (`vtctlclient` in combination with `vtctld`). Using client-server is recommended, as it provides an additional layer of security when using the client remotely.

## 逻辑概念

### keyspace

相当于`database`，只不过数据会分布到多个`shard`。

### Shard

每个`shard`包含多个`MySQL`实例，这些实例组成一个主从集群，数据同步使用`MySQL`本身提供的功能，比如`异步`,`半同步`。

## 创建

| 组件           | 作用                           |
| -------------- | ------------------------------ |
| etcd           | etcd集群，存储整个集群的元数据 |
| vtctld         | 处理命令，管理整个集群         |
| vtorc          | failover takeover（手动切换）  |
| mysql+vttablet | MySQL实例和代理                |
| vtgate         | 接收客户端请求，比如JDBC       |

