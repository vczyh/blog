---
title: 树莓派安装系统
date: 2020-07-27
categories:
  - 后端
tags: 
  - Raspberry Pi
  - Ubuntu
---
## 安装 Ubuntu Server

可以参考[ Ubuntu 官方文档]( https://ubuntu.com/tutorials/how-to-install-ubuntu-on-your-raspberry-pi#1-overview)，安装注意以下几点：

1. 使用到了 `Raspberry Pi Imager`，这个是树莓派官方提供的制作工具 ，其提供了在线安装以及离线安装，建议先把需要的镜像下载下来，然后使用离线安装，这样速度快。

2. 联网问题，Ubuntu 提供了修改配置文件，然后启动即可连接 WIFI 的方式，这样不需要显示器和键盘。但是我没成功过，可能步骤不对，这个之后再尝试。所以还是建议第一次安装最好外接个显示器，这样有什么问题一目了然。

3. 登录进去设置 WIFI，打开 `/etc/netplan/*-cloud-init.yaml` ，听说这是 Ubuntu 17.10 之后新的网络配置方式，修改内容：

   ```yaml
   network:
       ethernets:
           eth0:
               dhcp4: true
               optional: true
       wifis:
           wlan0:
               dhcp4: true
               optional: true
               access-points:
                   "wifi名称":
                       password: "wifi密码"
   
       version: 2
   ```

   然后重启，使用 `ping` 测试。

4. 插入**HDMI**、 **TF卡**、**其他外设**后再给树莓派通电。



![](https://p.vczyh.com/blog/d42acf9e675d8485675bd71b6d3d78e.jpg)