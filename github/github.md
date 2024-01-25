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
```

## git 操作

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

## github仓库推荐

---

## 提pr

先fork别人的项目，本地修改上传到自己的仓库，再向原始仓库提pr

参考链接:https://blog.csdn.net/vim_wj/article/details/78300239

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

---

## git 操作

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

.gitkeep 文件是防止空目录不上传的文件
.gitattributes 文件是控制格式的文件，

```gitignore
# To shield the difference between Windows and Linux systems.
*.h text eol=native
*.cpp text eol=native
*.inl text eol=native
```

45 个 git 合代码的经典操作场景

参考链接： https://mp.weixin.qq.com/s/J8IByWMSQEj_y2xhhoz4sg

刘江git 命令速查

参考链接： https://mp.weixin.qq.com/s/J8IByWMSQEj_y2xhhoz4sg

最全的git用法

参考链接： https://mp.weixin.qq.com/s/VSnkoeWLu7D8c6d73LEAxQ

git图展示高频Git命令

参考链接： https://mp.weixin.qq.com/s/DThGiP_fPG_szIZZ_3Jpdw

---

## github仓库推荐

---

## vpn
