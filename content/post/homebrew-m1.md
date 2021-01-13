---
title: Apple M1 安装 Homebrew
date: 2021-01-12
tags:
  - Homebrew
---

[Homebrew 2.6.0 ](https://brew.sh/2020/12/01/homebrew-2.6.0/)已经支持Apple M1，这次更新有几个重点

- Homebrew 已经原生支持Apple M1。
- 为了与Intel架构区分，Homebrew M1安装路径为`/opt/homebrew`，原Intel架构安装路径为`/usr/local`。
- 推荐使用Intel架构的Homebrew，然后经过Rosetta转译使用，目前M1版本支持有限。

下面会介绍这两种架构的安装方法。

## Apple M1

按照[官方文档](https://brew.sh/)执行安装脚本。

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

需要设置环境。

```shell
export PATH=$PATH:/opt/homebrew/bin
alias brew=/opt/homebrew/bin/brew
```

试试wget。

```bash
brew search wget
```

> Error: No formulae or casks found for "wget".

可见，虽然Homebrew已支持M1，但还有大量的软件没有适配。

## Intel

安装脚本相同，只是需要指定架构。

```bash
arch -x86_64 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

为了避免和M1版本发生冲突，设置环境。

```bash
alias brew_x86="arch -x86_64 /usr/local/bin/brew"
```

再试试wget。

```sh
brew_x86 search wget
```

> ==> Formulae
> wget ✔                                                                      wgetpaste

使用这种方式安装的应用，全部会被Rosetta转译。

目前比较理想的使用方式是：先使用brew安装原生的应用，若不存在则使用brew_x86安装，经Rosetta转译使用，等原生支持后，卸载转译版本，再安装原生版本。原生版本安装在`/opt/homebrew`，转译版本安装在`/usr/local`，分开管理。

最后，推荐一个装逼工具screenfetch的替代品：neofetch。

