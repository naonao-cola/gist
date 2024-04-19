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
//列出所有git正在跟踪的文件
git ls-files
//git不再跟踪名为FileName的文件，但是文件保留在工作区中
git rm --cached FileName
//删除名为FileName的文件
git rm FileName

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