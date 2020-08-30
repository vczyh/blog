---
title: 安装 WordPress
date: 2019-03-05
categories:
  - 后端
tags:
  - wordpress
---

## 系统

Ubuntu 16.04

## 安装所需环境

 **PHP**

```bash
sudo apt install php7.0
```

**MySQL**

```bash
sudo apt install mysql-server
```

设置数据库`root`密码：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190304224713475.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1RLREtfYm90,size_16,color_FFFFFF,t_70)

**PHP-MySQL**

```bash
sudo apt install php-mysql
```

## 下载 WordPress 压缩包

**方法一**

- 从`http://wordpress.org/download/`下载压缩包

- 解压后放到`Ubuntu`系统

**方法二**

- ```bash
  wget http://wordpress.org/latest.tar.gz
  ```

- ```bash
  tar -xzvf latest.tar.gz
  ```

## Mysql 配置

WordPress需要`Mysql`存储用户、评论以及博客的各种信息，所以需要一个一定权限的账号密码，直接给WordPress使用`root`账号也是可以的，但是权限太大不安全，所以这里创建一个新用户：

**连接数据库：** 

```bash
$ mysql -u root -p
Enter password: 

Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 4
Server version: 5.7.25-0ubuntu0.16.04.2 (Ubuntu)

Copyright (c) 2000, 2019, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> 
```

**创建`wordpress`数据库存放数据：**

```mysql
mysql> CREATE DATABASE database;
```

`database`：数据库名，这里假设使用`wordpress`

添加一个`wordpress`用户，它只有操作`wordpress`数据库的权限：

```bash
mysql> GRANT ALL PRIVILEGES ON database.* TO "wordpressuser"@"localhost" IDENTIFIED BY "password";
```

| 参数          | 说明                                      |
| ------------- | ----------------------------------------- |
| database      | 和上一步相同                              |
| wordpressuser | 新创建的用户名，这里假设使用`wordpress`   |
| password      | 新创建用户的密码，这里假设使用`wordpress` |

**刷新使新用户生效：**

```mysql
mysql> FLUSH PRIVILEGES;
```

## 配置`wp-config.php`文件

复制`wp-config-sample.php`为`wp-config.php`

```bash
cp wp-config-sample.php wp-config.php
```

编辑`wp-config.php`:

```bash
vi wp-config.php 
```

修改三行内容：

```php
// 上面设置的database
define( 'DB_NAME', 'wordpress' );

// 上面设置的wordpressuser
define( 'DB_USER', 'wordpress' );

// 上面设置的password
define( 'DB_PASSWORD', 'wordpress' );

```

## 配置服务器

这里使用`Nginx`

安装`Nginx`:

```bash
sudo apt install nginx
```

将解压的`wordpress`文件复制到`Nginx`目录：

```bash
sudo cp wordpress/ -R /var/www/html/
```

修改`Nginx`配置：

```bash
sudo vi /etc/nginx/sites-enabled/default 
```

在`server_name _;`一行下添加以下内容：

```nginx
        location ~ \.php$ {
                root           /var/www/html;
                fastcgi_pass   unix:/var/run/php/php7.0-fpm.sock;
                fastcgi_index  index.php;
                fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
                include        fastcgi_params;
        }
```

然后保存退出

验证`Nginx`配置格式是否正确：

```shell
$ sudo nginx -t

// 输出以下内容说明没问题，否则排查哪步出问题
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

重启`Nginx`：

```bash
 sudo nginx -s reload
```

## 运行脚本

浏览器访问：`http://server2.com/wordpress/wp-admin/install.php`

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190305002301692.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1RLREtfYm90,size_16,color_FFFFFF,t_70)

然后安装完成登录

**这时候可能出现：**

> 403 Forbidden

**解决：**

修改`Nginx`配置：

```shell
sudo vi /etc/nginx/sites-enabled/default 
```

在`index`后添加`index.php`：

```nginx
index index.html index.htm index.nginx-debian.html index.php;
```

最后重启`Nginx`：

```shell
sudo nginx -t
sudo nginx -s reload
```

