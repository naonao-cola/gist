---
title: 04-06-LineMod
tags: ["OpenCV", "视觉", "计算机视觉"]
---

# 04-06-LineMod

> 父节点: [[04-00-OpenCV视觉算法]]
> 源文件: `opencv/opencv.md`
> 相关: [[04-05-FLANN匹配]] | [[07-00-工业相机与HALCON]]


## 相关笔记

[[07-04-特征提取]]

---


参考链接

LineMod源码梳理

https://blog.csdn.net/Jinxiaoyu886/article/details/118994670

理解Linemod匹配算法

https://blog.csdn.net/weixin_50640987/article/details/124382837

https://github.com/meiqua/shape_based_matching


扩展思路：

1、 openmp的自定义多线程

2、 MIPP指令集的应用

3、 梯度边缘提取，以及梯度角度的计算

4、 量化梯度方向，对于每一个像素位置最终的梯度方向实际为 3 3×3邻域内统计梯度方向数量最多所对应的方向。

5、 提取特征点，选择的方法是只保留梯度幅值大于一定数值的点。如使用邻域非极大值抑制，控制特征点间的最小距离，保证选点尽量均匀。

6、 梯度拓展，使用二进制表示

7、线性内存


## 保存jpg png