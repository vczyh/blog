`logrotate`可以管理日志文件，可以根据日期切割、根据日志文件大小切割、自动删除超过一定时间的归档日志。

## 安装

测试环境为 。

```
CentOS Linux release 8.2.2004 (Core) 
```

其他系统类似，请先检查`logrotate`是否安装，一切以文档为准。

```bash
man logrotate
```

## 使用

首先创建一个日志文件。

```shell
mkdir /var/log/logrotate-test

# 创建日志文件，并添加一些信息
seq 10 > /var/log/logrotate-test/access.log
```

创建`logrotate`配置文件，格式是这样的。

```
日志文件绝对路径（可以使用通配符*） {
	指令1
	指令2
	...
}
```

`logrotate`全局配置文件位于`/etc/logrotate.conf`，自定义配置文件位于`/etc/logrotate.d/`。

一个具体的例子，表示每天切割日志，并压缩存档，最多保存5份存档（按时间排序，较早的删除），切割日志后自动创建新的日志文件，存档日志以时间为后缀。

```shell
> vim /etc/logrotate.d/logrotate-test

/var/log/logrotate-test/access.log {
	daily
	compress
	rotate 5
	create
	dateext
}
```

由于定时任务未到，需要手动通知`logrotate`执行切割任务。

```bash
logrotate -vf /etc/logrotate.d/logrotate-test
```

```
> ll /var/log/logrotate-test

total 4
-rw-r--r--. 1 root root  0 Nov 13 20:17 access.log
-rw-r--r--. 1 root root 41 Nov 13 20:15 access.log-20201113.gz
```

基本使用就是这样，为了验证，你可以等待几天看看切割结果。除此之外，`logrotate`还有其他指令，比如可以在每次切割后执行命令，这里往日志文件添加新的记录。

```
/var/log/logrotate-test/access.log {
	daily
	compress
	rotate 5
	create
	dateext
	postrotate
        seq 10 > /var/log/logrotate-test/access.log
    endscript
}
```

## Logrotate 如何运行

`logrotate`是通过 `cron`定时任务实现的。

```shell
> cat /etc/cron.daily/logrotate

#!/bin/sh

/usr/sbin/logrotate /etc/logrotate.conf
EXITVALUE=$?
if [ $EXITVALUE != 0 ]; then
    /usr/bin/logger -t logrotate "ALERT exited abnormally with [$EXITVALUE]"
fi
exit $EXITVALUE
```

每天都会执行一次`/usr/sbin/logrotate /etc/logrotate.conf`，`/etc/logrotate.conf`文件包含了`/etc/logrotate.d/`，所以所有的配置文件都会执行一遍，执行时根据具体配置决定是否切割。

试着手动执行一下该命令。

```bash
logrotate -v /etc/logrotate.conf
```

在输出中显示。

```
rotating pattern: /var/log/logrotate-test/access.log  after 1 days (5 rotations)
empty log files are rotated, old logs are removed
considering log /var/log/logrotate-test/access.log
  Now: 2020-11-13 21:00
  Last rotated at 2020-11-13 20:31
  log does not need rotating (log has been rotated at 2020-11-13 20:31, that is not day ago yet)
```

提示该日志文件今日已切割过，切割记录在`/var/lib/logrotate/logrotate.status`。

修改切割记录为两天前。

```
"/var/log/logrotate-test/access.log" 2020-11-11-20:31:46
```

再次执行命令，生成切割日志。

## 指令

| 指令                 | 说明                               |
| -------------------- | ---------------------------------- |
| missingok            | 如果日志文件不存在，不报错。       |
| nocreate             | 切割完日志文件后，不创建新文件。   |
| notifempty           | 如果日志文件为空，不切割。         |
| postrotate/endscript | 执行完切割后执行的命令。           |
| prerotate/endscript  | 执行切割前执行的命令。             |
| sharedscripts        | prerotate 和 postrotate 只执行一次 |



