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

windows 终端设置代理

set https_proxy=http://127.0.0.1:33210 http_proxy=http://127.0.0.1:33210 all_proxy=socks5://127.0.0.1:33210

linux 终端设置代理

export https_proxy=http://127.0.0.1:33210 http_proxy=http://127.0.0.1:33210 all_proxy=socks5://127.0.0.1:33210

git 代理

git config --global http.proxy 'http://127.0.0.1:1080'
git config --global http.proxy 'socks5://127.0.0.1:1080'

取消代理
git config --global --unset http.proxy

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
//列出所有git正在跟踪的文件
git ls-files
//git不再跟踪名为FileName的文件，但是文件保留在工作区中
git rm --cached FileName
//删除名为FileName的文件
git rm FileName

//查看日志
// https://www.cnblogs.com/wutou/p/17490984.html
//按图表，画出一个ASCII图展示commit历史的分支结构
git log  --oneline --decorate --graph
//长路径显示
git log --stat=200 -1

// 回退变更
//1、变更已经提交到工作区，将文件恢复到最近一次提交的状态，撤销工作区的变动
git checkout -- FileName
//2、变更已经提交到暂存区，需要用连个命令进行回退
//将文件从暂存区移除，回到工作区,再从工作区回到上次提交状态
git reset HEAD FileName
git checkout -- FileName
//3、已经提交到仓库,提交到本地仓库的变更都会被撤销，回到指定提交状态。
git reset --hard commit_id

//在删除远程分支的时候，有可能会提示。remote ref does not exist。
// 先清除远程分支的本地缓存
git fetch -p origin

//使用git 管理项目的时候，编译过程中出现了很多中间文件
git clean -f



//代码review
//创建开发分支
git checkout -b xiaobo_dev
//将开发分支和master分支绑定，可以通过git pull拉取master分支最新代码
git branch --set-upstream-to=origin/master xiaobo_dev
//修改代码前拉取master最新代码到开发分支，在开发分支上拉
git pull
//- 推送代码到GitLab
git push origin xiaobo_dev
//  - 删除本地仓库中与已删除的远程分支关联的引用
git remote prune origin
//  - 强制将临时分支代码回退到master HEAD
git reset --hard master
```

git stash 命令

https://blog.csdn.net/cj_eryue/article/details/126631973

应用场景：

1 、临时存储已修改的代码：比如正在分支A上开发某个功能，还未完成，突然要切换到B分支上去修复一个bug。这时就可以用git stash命令将本地修改的内容保存至堆栈区，再切换到B分支修改bug，修复完成后，再切回到A分支，从堆栈中恢复刚刚保存的内容。

2 、同步代码：由于不小心，本来要在A分支上开发的功能代码，却写在了B分支上，这时就可以用git stash将本地代码保存至堆栈中，切回到A分支后，再次恢复内容即可。


```bash
# 保存当前工作进度，会把暂存区和工作区的改动保存起来
git stash save '备注'
# 显示保存进度的列表,git stash命令可以多次执行。
git stash list
# 恢复最新的进度到工作区。git默认会把工作区和暂存区的改动都恢复到工作区。
git stash pop
# 恢复指定的进度到工作区。通过git stash pop命令恢复进度后，会删除当前进度。
git stash pop stash@{1}
#除了不删除恢复的进度之外，其余和git stash pop 命令一样。
git stash apply stash@{stash_id}
#删除一个存储的进度。如果不指定stash_id，则默认删除最新的存储进度。
git stash drop
#删除所有存储的进度。
git stash clear
# 显示与当前分支差异 如：git stash show stash@{stash_id} 加上 -p 可以看详细差异
git stash show
#保存特定文件
# 方式一 (适合少数指定文件）
git stash -- filename
#方式二（适合大量指定文件）
git stash -p
```

git format-patch 打补丁

参考链接：

https://www.cnblogs.com/ArsenalfanInECNU/p/8931377.html
```bash
#生成最近的1次commit的patch
git format-patch HEAD^ 　
#生成最近的2次commit的patch
git format-patch HEAD^^　　
#生成最近的3次commit的patch　　　　　　　　　　　　
git format-patch HEAD^^^
#生成最近的4次commit的patch　　　　　　　　　　　　　
git format-patch HEAD^^^^ 　
#生成两个commit间的修改的patch（包含两个commit. <r1>和<r2>都是具体的commit号)　　　　　　　　　　
git format-patch <r1>..<r2>
#生成单个commit的patch
git format-patch -1 <r1>
#生成某commit以来的修改patch（不包含该commit）
git format-patch <r1>
#生成从根到r1提交的所有patch
git format-patch --root <r1>　


git am
# 查看patch的情况
git apply --stat 0001-limit-log-function.patch
# 检查patch是否能够打上，如果没有任何输出，则说明无冲突，可以打上 　　　　
git apply --check 0001-limit-log-function.patch   　　　
#git apply是另外一种打patch的命令，其与git am的区别是，git apply并不会将commit message等打上去，
#打完patch后需要重新git add和git commit，而git am会直接将patch的所有信息打上去，而且不用重新
#git add和git commit,author也是patch的author而不是打patch的人)
# 将名字为0001-limit-log-function.patch的patch打上
git am 0001-limit-log-function.patch
 # 添加-s或者--signoff，还可以把自己的名字添加为signed off by信息，作用是注明打patch的人是谁，因为有时打patch的人并不是patch的作者
git am --signoff 0001-limit-log-function.patch
# 将路径~/patch-set/*.patch 按照先后顺序打上
git am ~/patch-set/*.patch　
# 当git am失败时，用以将已经在am过程中打上的patch废弃掉(比如有三个patch，打到第三个patch时有冲突，那么这条命令会把打上的前两个patch丢弃掉，返回没有打patch的状　　　　　　　　
$ git am --abort
 #当git am失败，解决完冲突后，这条命令会接着打patch　　　　
$ git am --resolved                                                            　　　　　　　
```

git cherry-pick

参考： https://blog.csdn.net/weixin_44799217/article/details/128279250

应用场景：
  需要将某一个分支的所有代码变动，那么就采用合并（git merge）
  只需要某一个分支的部分代码变动（某几个提交），这时可以采用 Cherry pick
```bash
#上面命令会将指定提交的commitHash应用于当前分支。此时在当前分支产生一个新的提交，新提交代码的哈希值会和之前的不一样。
git cherry-pick <commitHash>
# 比如下面两个分支：
a - b - c - d   Master
    \
      e - f - g Feature
# 将提交f应用到master分支：
# 切换到 master 分支
git checkout master
# Cherry pick 操作
git cherry-pick f
# 上面的操作完成以后，代码库就变成了下面的样子。
a - b - c - d - f   Master
    \
      e - f - g Feature

# git cherry-pick命令的参数，不一定是提交的哈希值，分支名也是可以的，表示转移该分支的最新提交。
git cherry-pick feature
```
git diff 配置

参考：https://stackoverflow.com/questions/1881594/use-winmerge-inside-of-git-to-file-diff

  - 设置gitconfig

```
C:\myGitRepo>git config --replace --global diff.tool winmerge
C:\myGitRepo>git config --replace --global difftool.winmerge.cmd "winmerge.sh \"$LOCAL\" \"$REMOTE\""
C:\myGitRepo>git config --replace --global difftool.prompt false
```
  - winmerge.sh
  放在 system32 统计目录下
```
#!/bin/sh
echo Launching WinMergeU.exe: $1 $2
"$PROGRAMFILES/WinMerge/WinMergeU.exe" -e -u -dl "Remote" -dr "Local" "$2" "$1"
```

  - 设置环境变量
```
set GIT_EXTERNAL_DIFF=winmerge.sh
```

常用命令

```bash
初始化仓库：
git init

查看仓库状态：
git status

查看历史提交记录：
git log

如果历史记录太多，可以加如下参数：
git log --pretty=oneline

添加一个文件：
git add 文件名1 文件名2

提交添加的文件：
git commit -m '注释内容'

回退上一个版本：
(HEAD代表当前版本,^代表当前版本的上一个版本,回退到N个之前的版本可以使用:HEAD~100)
git reset --hard HEAD^
git reset --hard HEAD~100

记录使用过的历史命令：
git reflog

回退到任意版本(无论是之前，还是将来)：
git reset --hard commit_id

强制推送到远程
git push origin HEAD --force

用版本库里的版本替换工作区的版本：
git checkout -- test.txt

从版本库中删除文件：
git rm 文件名

生成SSH密钥：
ssh-keygen -t rsa -C "youremail@example.com"

添加一个远程仓库(可以使用多种协议,此处使用GIT协议)：
git remote add origin git@github.com:michaelliao/learngit.git

将本地仓库内容推送到远程仓库：
(我们第一次推送master分支时，加上了-u参数，
Git不但会把本地的master分支内容推送的远程新的master分支，
还会把本地的master分支和远程的master分支关联起来，
在以后的推送或者拉取时就可以简化命令)
git push -u origin master

从远程仓库获取内容到本地仓库：
git pull origin master
git pull提示“no tracking information”，则说明本地分支和远程分支的链接关系没有创建，
用命令git branch --set-upstream branch-name origin/branch-name


克隆远程仓库到本地：
git clone git@github.com:michaelliao/gitskills.git

创建并切换分支：
git checkout -b dev

创建分支：
git branch dev

切换分支：
git checkout dev

查看分支状态：
git branch

将当前分支和指定分支合并：
git merge dev
git merge --no-ff -m "merge with no-ff" dev


删除本地分支(英文大写-D参数)：
git branch -D dev

删除远程分支：
git push origin --delete dev

比较差异：
git diff -- filename 文件

查看分支合并图：
git log --graph

隐藏当前工作分区：
git stash

查看隐藏工作分区：
git stash list

恢复工作分区：
git stash apply

删除stash内容：
git stash drop

恢复并删除工作分区：
git stash pop

从远程仓库剪切分支：
git checkout -b dev origin/dev

打一个新标签
git tag v1.0

查看标签
git tag

在指定commit的时候打标签，比如它对应的commit id是f52c633：
$ git tag v0.9 f52c633

创建带有说明的标签，用-a指定标签名，-m指定说明文字：
git tag -a v0.1 -m "version 0.1 released" 1094adb


标签打错了，也可以删除：
git tag -d v0.1

推送某个标签到远程：
git push origin v1.0

一次性推送全部尚未推送到远程的本地标签：
git push origin --tags

远程删除，删除命令也是push：
git push origin :refs/tags/v0.9

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



## 仓库推荐

    本项目旨在分享大模型相关技术原理以及实战经验。LLM训练实战
    https://github.com/liguodongiot/llm-action

    书生·浦语大模型实战营
    https://github.com/InternLM/tutorial

    基于 ChatGLM 等大语言模型与 Langchain 等应用框架实现，开源、可离线部署的检索增强生成(RAG)大模型知识库项目。
    https://github.com/chatchat-space/Langchain-Chatchat

    ChatGLM3 series: Open Bilingual Chat LLMs | 开源双语对话语言模型
    https://github.com/THUDM/ChatGLM3

    MMDeploy 是 OpenMMLab 模型部署工具箱，为各算法库提供统一的部署体验。基于 MMDeploy，开发者可以轻松从训练 repo 生成指定硬件所需 SDK，省去大量适配时间
    https://github.com/open-mmlab/mmdeploy/tree/main

    PPL Quantization Tool (PPQ)
    https://github.com/openppl-public/ppq

    awesome-python
    https://github.com/vinta/awesome-python

    Hydra is a framework for elegantly configuring complex applications，Python程序配置文件
    https://github.com/facebookresearch/hydra

    TensorRT for YOLOv8、YOLOv8-Pose、YOLOv8-Seg、YOLOv8-Cls、YOLOv7、YOLOv6、YOLOv5、YOLONAS
    https://github.com/FeiYull/TensorRT-Alpha

    带你从零实现一个高性能的深度学习推理库，支持Unet、Yolov5、Resnet等模型的推理。带有视频教程
    https://github.com/zjhellofss/KuiperInfer

    深度学习docker环境
    https://github.com/ufoym/deepo

    官方yolo仓库
    https://github.com/ultralytics/ultralytics

    Transformers 提供了数以千计的预训练模型，支持 100 多种语言的文本分类、信息抽取、问答、摘要、翻译、文本生成。它的宗旨是让最先进的 NLP 技术人人易用。
    https://github.com/huggingface/transformers/tree/main

    英伟达 tensorRT 官方仓库
    https://github.com/NVIDIA/TensorRT

    Simplify your onnx model，修改onnx模型
    https://github.com/daquexian/onnx-simplifier

    矩阵乘法优化，gemm
    https://github.com/flame/how-to-optimize-gemm

    c++ vscode项目模板
    https://github.com/Codesire-Deng/TemplateRepoCxx

    《麻省理工公开课：线性代数》中文笔记
    https://github.com/MLNLP-World/MIT-Linear-Algebra-Notes

    深度学习500问
    https://github.com/scutan90/DeepLearning-500-questions

    线性代数的艺术
    https://github.com/kf-liu/The-Art-of-Linear-Algebra-zh-CN

    Modern C++ Tutorial: C++11/14/17/20
    https://github.com/changkun/modern-cpp-tutorial

    c++那些事
    https://github.com/Light-City/CPlusPlusThings

    AI实战-practicalAI 中文版
    https://github.com/MLEveryday/practicalAI-cn

    使用C++实现了各种算法，这些算法涵盖了计算机科学、数学和统计学、数据科学、机器学习、工程等多个主题。
    https://github.com/TheAlgorithms/C-Plus-Plus

    Pytorch-Lightning-Template 模板
    https://github.com/miracleyoo/pytorch-lightning-template

    c++ 协程，风神写的
    https://github.com/Codesire-Deng/co_context

    TensorRTx aims to implement popular deep learning networks with TensorRT network definition API.
    https://github.com/wang-xinyu/tensorrtx

    C++ library based on tensorrt integration
    https://github.com/shouxieai/tensorRT_Pro

    TensorRT c++ api
    https://github.com/cyrusbehr/tensorrt-cpp-api

    cuda 图像处理库
    https://github.com/CVCUDA/CV-CUDA

    色图
    https://github.com/ChunelFeng/CGraph

    图优化库
    https://github.com/RainerKuemmerle/g2o

    linux 工具
    https://github.com/me115/linuxtools_rst

    docsify 参考仓库
    https://github.com/docsifyjs/awesome-docsify

    lua c++交互仓库
    https://github.com/ThePhD/sol2

    smid 仓库包
    https://github.com/xtensor-stack/xsimd
    https://github.com/aff3ct/MIPP


    异常检测仓库
    https://github.com/Markin-Wang/MGANet

    https://github.com/cnulab/RealNet

    https://github.com/openvinotoolkit/anomalib

    ppq 代码示例仓库

    https://github.com/naonao-cola/model_deployment

    腾讯 ncnn 的库，包含pnnx库

    https://github.com/Tencent/ncnn