+++
author = "Hugo Authors"
title = "Emoji Support"
date = "2019-03-05"
description = "Guide to emoji usage in Hugo"
tags = [
    "emoji",
]

+++

# `UNI_DBAAS_UCA_BIGDATA_V2.0.1`_安装与部署配置流程

​	

## 1. 配置 `OSS`

首先创建`bucket`，例如`moove-bigdata-server`，然后将`/release/oss`下所有目录拷贝到`bucket`下，此时的目录是这样的。

```tr
moove-bigdata-server
└── upgrade
    ├── guest-agent 
    ├── upgrade-agent
    ├── upgrade.sh    -- upgrade-agent升级脚本
    └── upgrade_ga.sh -- guest-agent升级脚本
```



## 2. 初始化数据库

创建数据库`uni_bigdata`，然后运行初始化脚本`/release/sql/uni_bigdata_origin.sql`。



## 3. 配置镜像

1. 上传`/release/images/`目录中的镜像到镜像仓库，例如`rabbitmq-3.8-88`。为了发现镜像，需要在`immortality`库中插入一条记录。如果镜像名称不同，需要替换语句中的镜像名称。

	```sql
INSERT INTO `uni_uca_storage`.`image`(`image_id`, `status`, `name`, `architecture`, `os`, `description`, `min_cpu`, `min_disk`, `min_ram`, `region`, `zone`, `format`, `user_id`, `checksum_type`, `checksum`, `size`, `os_type`, `storage_type`, `cluster_id`, `created_at`, `updated_at`, `deleted_at`, `deleted`, `type`, `file_name`, `three_par_wwn`, `three_par_status`) VALUES ('rabbitmq-3.8-132', 2, 'rabbitmq-3.8-132', 2, 'Other Linux', 'qcow2', 0, 0, 0, 'cn-tianjin', 'cn-tianjin-a', 1, 'public', 0, '800', 3995336704, 1, 'nfs', '', '2020-03-30 09:51:55', '2020-03-30 09:51:58', NULL, 0, 1, 'rabbitmq-3.8-132', '1', '1');
	```

2. 语句执行成功后，需要确认表`uni_bigdata.tb_config_node`的`image_uuid`与上传的镜像名称相同。



## 4. 部署 `UCA` 到 `k8s`

部署`UCA`需要的文件位于`\release\deployments`：

- `uca-dbaas-bigdata-deployment.yaml`
- `uca-dbaas-bigdata-service.yaml`
- `bigdata-production-config.yaml`（`configmap`：配置`oss`，`mysql`，`rabbitmq`等）

### 4.1 配置 `uca-dbaas-bigdata-deployment.yaml`

只需要修改`image`为要使用的版本，目前最新的`tag`为：`UCA-DBAAS-BIGDATA-V1.0.0-30`

```
image: harbor-local.unicloudsrv.com/muye/uca-dbaas-bigdata:UCA-DBAAS-BIGDATA-V1.0.0-30
```

### 4.2 配置 `bigdata-production-config.yaml`

根据环境修改以下配置。

```yaml
data:
  # 配置oss
  OSS_BASE: oss://moove-bigdata-server # 步骤1中创建的bucket名称
  OSS_ACCESS_KEY_ID: zEl1os171Wsc9L9L # access_key
  OSS_SECRET_ACCESS_KEY: RzsPEDLWQzsSaJhVdmoZZfw7G5jG6z # secret_key
  OSS_ENDPOINT: https://oss-cn-north-1.unicloudsrv.com
  OSS_IP: 103.252.251.33 # oss IP
  OSS_HOST: oss-cn-north-1.unicloudsrv.com
  # mysql
  MYSQL_USER: moove
  MYSQL_PWD: unic-moove
```



## 5. 运行

```shell
# 修改后的 config map
kubectl apply -f bigdata-production-config.yaml
kubectl apply -f uca-dbaas-bigdata-deployment.yaml
kubectl apply -f uca-dbaas-bigdata-service.yaml
```

