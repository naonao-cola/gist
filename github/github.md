## git 操作
45 个 git 合代码的经典操作场景,参考链接：

https://mp.weixin.qq.com/s/J8IByWMSQEj_y2xhhoz4sg

刘江git 命令速查,参考链接：

https://mp.weixin.qq.com/s/J8IByWMSQEj_y2xhhoz4sg

最全的git用法,参考链接：

https://mp.weixin.qq.com/s/VSnkoeWLu7D8c6d73LEAxQ

git图展示高频Git命令,参考链接：

https://mp.weixin.qq.com/s/DThGiP_fPG_szIZZ_3Jpdw

.gitkeep 文件是防止空目录不上传的文件
.gitattributes 文件是控制格式的文件，

```gitignore
# To shield the difference between Windows and Linux systems.
*.h text eol=native
*.cpp text eol=native
*.inl text eol=native
```

```cpp
//第一种方式，忽略本地修改，强拉远程,master为远程分支名字
git fetch --all
git reset --hard origin/master
git pull
//第二种方式，备份本地的工作，适用于别人提交的文件不是自己修改的文件。
git stash
git pull
git stash pop

//从提交中删除文件
git rm -r --cached vs2002/
```

    Git常见报错：Updates were rejected because the tip of your current branch is behind
    场景一：起初本地仓库和远程仓库是同步的，然后某一天你在远程仓库上直接做了修改，此时远程和本地就不同步了。过了几天你在本地仓库做了一些修改，修改完成后使用git push想要提交，此时就会报错。
    场景二：起初本地仓库和远程仓库是同步的，不过有多个人都在该分支上开发，另一个人在某一天做了修改并提交到远程库了。此时远程库和你的本地库就不同步了。后续同场景一。
    场景三： git commit --amend之后，本地仓库和远程仓库的log版本历史不一致了，此时想要git push，也会报这个错。个人理解： 使用该命令后，虽然所有提交记录的内容没变化，但最后一次提交的commit id变化了。git不允许push改变提交历史的操作，可以新增或者减少commit但不能改变原来的commit历史，因此会报冲突。

    //针对场景一和二，养成先pull最新代码再修改的习惯即可
    //在修改本地代码前，先使用git pull拉取远程最新代码，然后再进行修改（推荐--rebase）
    git pull 远程仓库名 远程分支名 --rebase
    //针对场景三，在确认代码无误的情况下，直接使用--force强制推送
    git push 远程仓库名 远程分支名 --force

---
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

基础知识讲解

参考链接: https://zhuanlan.zhihu.com/p/643085910

B站视频讲解，26分钟，1.5倍速观看即可

参考链接: https://www.bilibili.com/video/BV1RE411R7Uy/?vd_source=1d8a232b177c2a5e28ac445019114cec

本人yaml文件参考，需要在github与gitee添加令牌身份验证

```yaml
name: Sync

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - name: Sync to Gitee
      uses: wearerequired/git-mirror-action@master
      env:
          # 注意在 Settings->Secrets 配置 GITEE_RSA_PRIVATE_KEY
          SSH_PRIVATE_KEY: ${{ secrets.GITEE_RSA_PRIVATE_KEY }}
      with:
          # 注意替换为你的 GitHub 源仓库地址
          source-repo: "git@github.com:naonao-cola/gist.git"
          # 注意替换为你的 Gitee 目标仓库地址
          destination-repo: "git@gitee.com:naoano/gist.git"

    - name: Build Gitee Pages
      uses: yanglbme/gitee-pages-action@master
      with:
          # 注意替换为你的 Gitee 用户名
          gitee-username: 18581507112
          # 注意在 Settings->Secrets 配置 GITEE_PASSWORD
          gitee-password: ${{ secrets.GITEE_PASSWORD }}
          # 注意替换为你的 Gitee 仓库
          gitee-repo: naoano/gist
          branch: main
```

