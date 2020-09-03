## Ubuntu安装记录

### 切换镜像

[清华镜像](https://mirror.tuna.tsinghua.edu.cn/help/ubuntu/)

### MySQL

**安装**

```bash
sudo apt install mysql-server
```

默认账号密码位于 ` /etc/mysql/debian.cnf`

**设置远程登录(非ssh)**

- 修改`/etc/mysql/mysql.conf.d/mysqld.cnf`

  ```bash
  bind-address  = 0.0.0.0
  ```

- 设置mysql账号的host为%

###  安装JDK

```shell
sudo apt-get install openjdk-11-jdk
```

### 安装Reids

```shell
sudo apt install redis-server
```

