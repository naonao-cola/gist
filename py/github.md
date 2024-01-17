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

## ## git 操作

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
