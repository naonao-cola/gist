---
title: 10-03-cherry-pick
tags: ["Git", "GitHub", "版本控制"]
---

# 10-03-cherry-pick

> 父节点: [[10-00-Git与GitHub]]
> 源文件: `git/git.md`
> 相关: [[10-01-Git场景速查]]

---

<!-- from line 316 -->
git cherry-pick

<!-- from line 322 -->
  只需要某一个分支的部分代码变动（某几个提交），这时可以采用 Cherry pick

<!-- from line 325 -->
git cherry-pick <commitHash>

<!-- from line 333 -->
# Cherry pick 操作

<!-- from line 334 -->
git cherry-pick f

<!-- from line 340 -->
# git cherry-pick命令的参数，不一定是提交的哈希值，分支名也是可以的，表示转移该分支的最新提交。

<!-- from line 341 -->
git cherry-pick feature