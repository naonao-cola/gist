---
title: 10-02-Commit规范
tags: ["Git", "GitHub", "版本控制"]
---

# 10-02-Commit规范

> 父节点: [[10-00-Git与GitHub]]
> 源文件: `git/git.md`
> 相关: [[10-01-Git场景速查]] | [[10-04-CICD]]


## 相关笔记

[[13-00-工具手册]]

---


```
https://github.moeyy.xyz/

#在前面加入  https://github.moeyy.xyz/
分支源码：https://github.moeyy.xyz/https://github.com/moeyy/project/archive/master.zip
release源码：https://github.moeyy.xyz/https://github.com/moeyy/project/archive/v0.1.0.tar.gz
release文件：https://github.moeyy.xyz/https://github.com/moeyy/project/releases/download/v0.1.0/example.zip
分支文件：https://github.moeyy.xyz/https://github.com/moeyy/project/blob/master/filename
Raw：https://github.moeyy.xyz/https://raw.githubusercontent.com/moeyy/project/archive/master.zip
使用Git: git clone https://github.moeyy.xyz/https://github.com/moeyy/project



https://gh-proxy.com/

# 原始链接 https://raw.githubusercontent.com/username/repo/main/file.txt
# 代理链接 https://gh-proxy.com/raw.githubusercontent.com/username/repo/main/file.txt
# 代理链接 https://gh-proxy.com/https://raw.githubusercontent.com/username/repo/main/file.txt

https://docker.xuanyuan.me/

# 原始链接 https://raw.githubusercontent.com/username/repo/main/file.txt
# 代理链接 (方法 1) https://github-file-download-proxy.hacks.tools/raw.githubusercontent.com/username/repo/main/file.txt
# 代理链接 (方法 2) https://github-file-download-proxy.hacks.tools/https://raw.githubusercontent.com/username/repo/main/file.txt

# 参考  https://blog.csdn.net/weixin_42693941/article/details/143583673
#查询配置
git config --global --list
#设置配置
git config --global url."https://hub.nuaa.cf".insteadOf https://github.com
#取消配置
git config --global --unset url."https://hub.nuaa.cf".insteadOf
```


## 提pr

先fork别人的项目，本地修改上传到自己的仓库，再向原始仓库提pr,参考链接:

https://blog.csdn.net/vim_wj/article/details/78300239

---


## gitee同步

```bash
# 参考这两篇，利用action 同步及更新page文档
https://gitee.com/heartaotime/gitee-pages-action
https://zhuanlan.zhihu.com/p/353862378
https://juejin.cn/post/7049317964281020446

##github 参考
## branch 参数默认是 master，如果你是部署在 gh-pages(或者 main) 分支等等，务必指定 branch: gh-pages(或者 branch: main)。
## 对于 gitee-repo 参数，如果你的项目在 Gitee 的地址为 https://gitee.com/用户名/xxx ，那么 gitee-repo 就填写为 用户名/xxx
https://github.com/yanglbme/gitee-pages-action

# 保持自己github的forks自动和上游仓库同步并推送到 gitee
https://zhuanlan.zhihu.com/p/461511123
```

---

## github action 持续集成