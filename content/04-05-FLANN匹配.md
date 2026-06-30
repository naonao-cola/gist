---
title: 04-05-FLANN匹配
tags: ["OpenCV", "视觉", "计算机视觉"]
---

# 04-05-FLANN匹配

> 父节点: [[04-00-OpenCV视觉算法]]
> 源文件: `opencv/opencv.md`
> 相关: [[04-03-OPTICS聚类]] | [[12-00-算法集锦]]


## 相关笔记

[[04-06-LineMod]] [[07-04-特征提取]]

---

```c++
#include <opencv2/core.hpp>
#include <opencv2/flann/flann.hpp>
//单一搜索
void test_flann() {
    // 定义特征向量集合
    cv::Mat features = (cv::Mat_<float>(5, 2) << 1, 1, 2, 2, 3, 3, 4, 4, 5, 5);
    // 创建FLANN索引
    cv::flann::Index flannIndex(features, cv::flann::KDTreeIndexParams(),cvflann::FLANN_DIST_L2);
    // 定义查询点
    cv::Mat query = (cv::Mat_<float>(1, 2) << 3.1, 3.1);
    // 进行最近邻搜索
    cv::Mat indices, dists;
	//knn 的搜索,可以指定搜索个数，还有一个最邻近的搜索，只搜索一个
    flannIndex.knnSearch(query, indices, dists, 2, cv::flann::SearchParams());
    // 输出最近邻点的索引和距离
    std::cout << "最近邻点的索引：" << indices.at<int>(0, 0) << std::endl;
    //距离需要开方
    std::cout << "最近邻点的距离：" << std::sqrt(dists.at<float>(0, 0)) << std::endl;
}

//多组搜索
#include "opencv2/xfeatures2d.hpp"
void test_flannmatch() {

    //cv::Mat srcImage = cv::imread(R"(E:\demo\test\test_opencv\img\2.png)");
    //cv::Mat dstImage = cv::imread(R"(E:\demo\test\test_opencv\img\1.png)");

    //// surf 特征提取
    //int minHessian = 450;
    //cv::Ptr<cv::xfeatures2d::SURF> detector = cv::xfeatures2d::SURF::create(minHessian);
    //std::vector<cv::KeyPoint> keypoints_src;
    //std::vector<cv::KeyPoint> keypoints_dst;
    //cv::Mat descriptor_src, descriptor_dst;
    //detector->detectAndCompute(srcImage, cv::Mat(), keypoints_src, descriptor_src);
    //detector->detectAndCompute(dstImage, cv::Mat(), keypoints_dst, descriptor_dst);

    cv::Mat descriptor_src = (cv::Mat_<float>(5, 2) << 1, 1, 2, 2, 3, 3, 4, 4, 5, 5);
    cv::Mat descriptor_dst = (cv::Mat_<float>(1, 2) << 3.5, 3.5);

    // matching
    cv::FlannBasedMatcher matcher;
    std::vector<cv::DMatch> matches;
    matcher.match(descriptor_dst, descriptor_src, matches);

    // find good matched points
    double minDist = 0, maxDist = 0;
    for (size_t i = 0; i < matches.size(); i++)
    {
        double dist = matches[i].distance;
        if (dist > maxDist)
            maxDist = dist;
        if (dist < minDist)
            minDist = dist;
    }

    std::vector<cv::DMatch> goodMatches;
    for (size_t i = 0; i < matches.size(); i++)
    {
        double dist = matches[i].distance;
        if (dist < max(3 * minDist, 0.02))
        {
            goodMatches.push_back(matches[i]);
        }
    }
    //cv::Mat matchesImage;
    //cv::drawMatches(dstImage, keypoints_dst, srcImage, keypoints_src, goodMatches, matchesImage, cv::Scalar::all(-1),
    //cv::Scalar::all(-1), std::vector<char>(), cv::DrawMatchesFlags::NOT_DRAW_SINGLE_POINTS);
    //cv::imshow("matchesImage", matchesImage);
    return ;
}
```

## 聚类