
## opencv与eigen 基础
参考链接： https://blog.csdn.net/expert_joe/article/details/122521168

## 漫水填充

```c++
//https://learnopencv.com/filling-holes-in-an-image-using-opencv-python-c/
#include "opencv2/opencv.hpp"
using namespace cv;
int main(int argc, char **argv)
{
    // Read image
    Mat im_in = imread("nickel.jpg", IMREAD_GRAYSCALE);
    // Threshold.
    // Set values equal to or above 220 to 0.
    // Set values below 220 to 255.
    Mat im_th;
    threshold(im_in, im_th, 220, 255, THRESH_BINARY_INV);
    // Floodfill from point (0, 0)
    Mat im_floodfill = im_th.clone();
    floodFill(im_floodfill, cv::Point(0,0), Scalar(255));
    // Invert floodfilled image
    Mat im_floodfill_inv;
    bitwise_not(im_floodfill, im_floodfill_inv);
    // Combine the two images to get the foreground.
    Mat im_out = (im_th | im_floodfill_inv);
    // Display images
    imshow("Thresholded Image", im_th);
    imshow("Floodfilled Image", im_floodfill);
    imshow("Inverted Floodfilled Image", im_floodfill_inv);
    imshow("Foreground", im_out);
    waitKey(0);
}
```

## 颜色空间提取

```c++
//https://blog.csdn.net/u011754972/article/details/121533505
#include <iostream>
#include <string>
#include <vector>

#include "opencv2/highgui/highgui.hpp"
#include "opencv2/opencv.hpp"

//g++ test.cpp `pkg-config opencv --libs --cflags` -std=c++11 -o test

int main() {
  cv::Mat origin_bgr_img = cv::imread("pic.png");

  // 将BGR空间的图片转换到HSV空间
  cv::Mat hsv;
  // hsv为3通道，hsv.channels==3
  cv::cvtColor(origin_bgr_img, hsv, cv::COLOR_BGR2HSV);
  std::cout << "hsv.channels=" << hsv.channels() << std::endl;

  // 在HSV空间中定义蓝色
  cv::Scalar lower_blue = cv::Scalar(100, 50, 50);
  cv::Scalar upper_blue = cv::Scalar(124, 255, 255);
  // # 在HSV空间中定义绿色
  cv::Scalar lower_green = cv::Scalar(35, 50, 50);
  cv::Scalar upper_green = cv::Scalar(77, 255, 255);
  // # 在HSV空间中定义红色,红色的h值有两个范围[0,10]和[156,180]
  cv::Scalar lower_red_1 = cv::Scalar(0, 50, 50);
  cv::Scalar upper_red_1 = cv::Scalar(10, 255, 255);
  cv::Scalar lower_red_2 = cv::Scalar(156, 50, 50);
  cv::Scalar upper_red_2 = cv::Scalar(180, 255, 255);

  // 从HSV图像中截取出蓝色、绿色、红色，即获得相应的掩膜
  // cv::inRange()函数是设置阈值去除背景部分，得到想要的区域
  cv::Mat blue_mask, green_mask, red_mask, red_mask_1, red_mask_2;

  // 把hsv中的像素值在范围内的置255，不在范围内的置0，输出为掩模mask
  // blue_mask为单通道，blue_mask.channels==1
  cv::inRange(hsv, lower_blue, upper_blue, blue_mask);
  std::cout << "blue_mask.channels=" << blue_mask.channels() << std::endl;
  //   std::cout << blue_mask << std::endl;

  cv::inRange(hsv, lower_green, upper_green, green_mask);

  cv::inRange(hsv, lower_red_1, upper_red_1, red_mask_1);
  cv::inRange(hsv, lower_red_2, upper_red_2, red_mask_2);
  red_mask = red_mask_1 + red_mask_2;

  // 将原图像和mask(掩膜)进行按位与
  cv::Mat blue_res;
  // 三通道图像进行单通道掩模操作后，输出图像还是三通道。相当于对三通道都做了掩模。
  cv::bitwise_and(origin_bgr_img, origin_bgr_img, blue_res, blue_mask);
  cv::Mat green_res;
  cv::bitwise_and(origin_bgr_img, origin_bgr_img, green_res, green_mask);
  cv::Mat red_res;
  cv::bitwise_and(origin_bgr_img, origin_bgr_img, red_res, red_mask);

  cv::Mat background_img = cv::Mat::zeros(1000, 1900, CV_8UC3);

  // #最后得到要分离出的颜色图像
  cv::Mat res = blue_res + green_res + red_res;

  {
    int x = 100, y = 40;
    cv::Rect roi(x, y, origin_bgr_img.cols, origin_bgr_img.rows);
    cv::putText(background_img, "origin", cv::Point(x, y - 10),
                cv::FONT_HERSHEY_PLAIN, 1, CV_RGB(255, 255, 255), 1);
    //将background_img复制到img中roi指定的矩形位置
    origin_bgr_img.copyTo(background_img(roi));
  }

  {
    int x = 500, y = 40;
    cv::Rect roi(x, y, res.cols, res.rows);
    cv::putText(background_img, "hsv", cv::Point(x, y - 10),
                cv::FONT_HERSHEY_PLAIN, 1, CV_RGB(255, 255, 255), 1);
    hsv.copyTo(background_img(roi));
  }

  {
    int x = 900, y = 40;
    cv::Rect roi(x, y, res.cols, res.rows);
    cv::putText(background_img, "res", cv::Point(x, y - 10),
                cv::FONT_HERSHEY_PLAIN, 1, CV_RGB(255, 255, 255), 1);
    res.copyTo(background_img(roi));
  }

  {
    int x = 100, y = 500;
    cv::Rect roi(x, y, blue_res.cols, blue_res.rows);
    cv::putText(background_img, "blue", cv::Point(x, y - 10),
                cv::FONT_HERSHEY_PLAIN, 1, CV_RGB(255, 255, 255), 1);
    blue_res.copyTo(background_img(roi));
  }

  {
    int x = 500, y = 500;
    cv::Rect roi(x, y, green_res.cols, green_res.rows);
    cv::putText(background_img, "green", cv::Point(x, y - 10),
                cv::FONT_HERSHEY_PLAIN, 1, CV_RGB(255, 255, 255), 1);
    green_res.copyTo(background_img(roi));
  }

  {
    int x = 900, y = 500;
    cv::Rect roi(x, y, red_res.cols, red_res.rows);
    cv::putText(background_img, "red", cv::Point(x, y - 10),
                cv::FONT_HERSHEY_PLAIN, 1, CV_RGB(255, 255, 255), 1);
    red_res.copyTo(background_img(roi));
  }

  cv::imwrite("pppp.png", background_img);
  std::string win_name = "background_img";
  cv::namedWindow(win_name, cv::WINDOW_KEEPRATIO);
  cv::imshow(win_name, background_img);
  cv::waitKey(0);
}
```

## 生成随机颜色
```c++
cv::RNG rng(12345);
std::vector<cv::Vec3b> colors;
cv::Vec3b vec3 = cv::Vec3b(rng.uniform(0, 256), rng.uniform(0, 256), rng.uniform(0, 256));
colors.push_back(vec3);
```

## 自动曝光
```c++

 int GetLightAvg(LightRange* lr, cv::Mat& image) {
	 memset(lr, 0, sizeof(LightRange));
	 //uchar v;
	 unsigned long color = 0;
	 int count = 0;
	 // 计算各个灰度值的计数
	 for (int i = 0; i < image.cols / 10; i++) {
		 for (int j = 0; j < image.rows / 10; j++) {
			 uchar v = image.data[image.step[0] * j * 10 + i * 10];
			 lr->rang[v]++;//计算0-255色彩的直方分布图
			 color = color + v;//对各个像素点的灰度值求和
			 count++;
		 }
	 }
	 if (count == 0)
		 return 0;
	 lr->avg = color / count;//计算灰度平均值

	 int count_low = 0;
	 double num = 0.02;
	 num += lr->avg / 40.0 * 0.01;

	 for (int i = 0; i < 256; i++) {
		 count_low += lr->rang[i];
		 if (count_low > count * num) {
			 lr->avg_low = i;
			 if (lr->avg_low > 50) lr->avg_low = 50;
			 break;
		 }
	 }
	 int count_height = 0;
	 for (int i = 255; i >= 0; i--) {
		 count_height += lr->rang[i];
		 if (count_height > count * num) {
			 lr->avg_hight = i; /* + (255-i)*0.8;*/ // zoujiayun 不改变原有的设置
			 break;
		 }
	 }
	 return lr->avg;
 }

 void test_auto_expo(cv::Mat src, cv::Mat& dst, float* alpha, float* beta) {

	 if (alpha != nullptr)
		 *alpha = 0;
	 if (beta != nullptr)
		 *beta = 0;

	 cv::Mat srcMat = src.clone();
	 auto dstMat = dst.clone();
	 //如果是BGR图，转Y U V
	 bool isBGR = src.channels() != 1;
	 cv::Mat U, V;
	 if (isBGR)
	 {
		 //分离yuv
		 cv::Mat yuv;
		 cv::cvtColor(srcMat, yuv, cv::COLOR_BGR2YUV);
		 cv::Mat YUV[3];
		 cv::split(yuv, YUV);

		 //srcMat gray
		 srcMat = YUV[0];
		 //暂存数据
		 U = YUV[1];
		 V = YUV[2];

		 //dstMat gray
		 dstMat = cv::Mat(srcMat.rows, srcMat.cols, CV_8UC1);
	 }

	 LightRange lr = { 0 };
	 GetLightAvg(&lr, srcMat);
	 double min = lr.avg_low;
	 double max = lr.avg_hight;
	 if (lr.avg_low != lr.avg_hight)
	 {
		 double rate = 220 / (max - min);
		 if (rate > 5)
			 rate = 5;

		 //根据算法生成新旧像素值对应表
		 cv::Mat table(1, 256, CV_8UC1);
		 for (int i = 0; i < 256; ++i)
		 {
			 int newPixel = (int)((i - min) * rate * (1 + (255 - i) * lr.avg / (255.0 * 255.0)));
			 (table.data)[i] = newPixel < 0 ? 0 : (newPixel > 255 ? 255 : newPixel);
		 }

		 //计算一个近似alpha beta: 去掉 低值强制为0和高值强制为255的部分，剩下的曲线取两端当作直线计算alpha beta
		 if (alpha != nullptr || beta != nullptr)
		 {
			 //计算被设置为0的最大像素值
			 int low = 254;
			 double lowAim = table.data[254];
			 for (int i = 0; i < 255; ++i)
			 {
				 if (table.data[i + 1] > 0)
				 {
					 low = i;
					 lowAim = table.data[i];
					 break;
				 }
			 }
			 //计算被设置为255的最小像素值
			 int high = 1;
			 double highAim = table.data[1];
			 for (int i = 255; i > 0; --i)
			 {
				 if (table.data[i - 1] < 255)
				 {
					 high = i;
					 highAim = table.data[i];
					 break;
				 }
			 }
			 //两点连线当作转换关系，计算alpha beta
			 if (high > low)
			 {
				 if (alpha != nullptr)
					 *alpha = (255.0f - high + low) / (high - low);
				 if (beta != nullptr)
					 *beta = -(*alpha + 1) * low;
			 }
			 else {
				 if (alpha != nullptr)
					 *alpha = 0;
				 if (beta != nullptr)
					 *beta = 0;
			 }
		 }
		 //根据像素变换表，转换图像。
		 cv::LUT(srcMat, table, dstMat);

		 //如果是BGR图，融合UV数据。
		 if (isBGR){
			 cv::Mat YUV[3];
			 YUV[0] = dstMat;
			 YUV[1] = U;
			 YUV[2] = V;
			 cv::Mat yuv;
			 cv::merge(YUV, 3, yuv);
			 cv::cvtColor(yuv, dst, cv::COLOR_YUV2BGR);
		 }
	 }
	 else {
		 //直接复制图像
		 if (isBGR)
			 dstMat = dst;
		 srcMat.copyTo(dstMat);
		 if (alpha != nullptr)
			 *alpha = 0;
		 if (beta != nullptr)
			 *beta = 0;
	 }
	 return;
 }
```

## vtk
```c++
#include "opencv2/viz.hpp"
 //https://www.freesion.com/article/85591447912/
 //https://blog.csdn.net/qq_48034474/article/details/120455843
 void test_vtk() {
	 cv::Mat point_cloud = cv::Mat::zeros(500, 500, CV_32FC3);
	 int k = 0;
	 for (int i = 0; i < 500;i++) {
		 for (int j = 0; j < 500;j++) {
				 point_cloud.at<cv::Vec3f>(i, j)[0] = rand()/500  ;
				 point_cloud.at<cv::Vec3f>(i, j)[1] = rand()/500 ;
				 point_cloud.at<cv::Vec3f>(i, j)[2] = rand()/500;
		 }
		 k++;
	 }


	 cv::viz::Viz3d window("window");
	 window.showWidget("Coordinate Widget", cv::viz::WCoordinateSystem(20));
	 //第二个参数设置颜色
	 cv::viz::WCloud cloud(point_cloud,cv::viz::Color::blue());
	 //第三个参数的，可以设置旋转矩阵
	 window.showWidget("cloud", cloud);


	 // 构造平面    cv::viz::WPlane
	 // 构造线      cv::viz::WLine
	 // 构造球体    cv::viz::WSphere
	 // 构造箭头    cv::viz::WArrow
	 // 构建平面圆(圆环属性) cv::viz::WCircle
	 // 点云		cv::viz::WPaintedCloud
	 // 多段线		cv::viz::WPolyLine
	 // 网格        cv::viz::WGrid
	 // 立方体      cv::viz::WCube
	 // 文本2D      cv::viz::WText
	 // 文本3D		cv::viz::WText3D
	 while (!window.wasStopped()){
		 window.spinOnce(1, false);
		 // 设置新的位姿 window.setWidgetPose("plane", pose);
	 }
 }

```

## 区域生长

```c++
#include <opencv2\highgui\highgui.hpp>
#include <iostream>
#include "math.h"

using namespace cv;
using namespace std;

Mat RegionGrow(Mat src, Point2i pt, int th)
{
	Point2i ptGrowing;						//待生长点位置
	int nGrowLable = 0;								//标记是否生长过
	int nSrcValue = 0;								//生长起点灰度值
	int nCurValue = 0;								//当前生长点灰度值
	Mat matDst = Mat::zeros(src.size(), CV_8UC1);	//创建一个空白区域，填充为黑色
	//生长方向顺序数据
	int DIR[8][2] = { { -1, -1 }, { 0, -1 }, { 1, -1 }, { 1, 0 }, { 1, 1 }, { 0, 1 }, { -1, 1 }, { -1, 0 } };
	Vector<Point2i> vcGrowPt;						//生长点栈
	vcGrowPt.push_back(pt);							//将生长点压入栈中
	matDst.at<uchar>(pt.y, pt.x) = 255;				//标记生长点
	nSrcValue = src.at<uchar>(pt.y, pt.x);			//记录生长点的灰度值

	while (!vcGrowPt.empty())						//生长栈不为空则生长
	{
		pt = vcGrowPt.back();						//取出一个生长点
		vcGrowPt.pop_back();

		//分别对八个方向上的点进行生长
		for (int i = 0; i<9; ++i)
		{
			ptGrowing.x = pt.x + DIR[i][0];
			ptGrowing.y = pt.y + DIR[i][1];
			//检查是否是边缘点
			if (ptGrowing.x < 0 || ptGrowing.y < 0 || ptGrowing.x >(src.cols - 1) || (ptGrowing.y > src.rows - 1))
				continue;

			nGrowLable = matDst.at<uchar>(ptGrowing.y, ptGrowing.x);		//当前待生长点的灰度值

			if (nGrowLable == 0)					//如果标记点还没有被生长
			{
				nCurValue = src.at<uchar>(ptGrowing.y, ptGrowing.x);
				if (abs(nSrcValue - nCurValue) < th)					//在阈值范围内则生长
				{
					matDst.at<uchar>(ptGrowing.y, ptGrowing.x) = 255;		//标记为白色
					vcGrowPt.push_back(ptGrowing);					//将下一个生长点压入栈中
				}
			}
		}
	}
	return matDst.clone();
}
int main() //区域生长
{
	Mat src = imread("E:\\QT text\\image processing\\delineation\\image\\1.jpg");
	namedWindow("原图", 0);
	imshow("原图", src);

	Point pt = (514,510); //待生长点位置
	int th = 10;
	src = RegionGrow(src, pt, th);
	namedWindow("RegionGrow", 0);
	imshow("RegionGrow", src);
	waitKey(0);
	return 0;
}


```

## flann搜索
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

```c++
//cluster.h
#include <limits>
#include <set>
#include <vector>
#include <opencv2/opencv.hpp>

namespace nao::algorithm::cluster {

	/** @brief   最大最小距离算法
	 @param data  输入样本数据，每一行为一个样本，每个样本可以存在多个特征数据
	 @param Theta 阈值，一般设置为0.5，阈值越小聚类中心越多
	 @param centerIndex 聚类中心的下标
	 @return 返回每个样本的类别，类别从1开始，0表示未分类或者分类失败
	*/
	cv::Mat MaxMinDisFun(cv::Mat data, float Theta, std::vector<int>& cerIndex);


//optics 聚类
namespace optics{
		//数据结构
		typedef double real;
		const real UNDEFINED = std::numeric_limits<real>::max();
		//点类型
		class DataPoint;
		//用于根据数据点的可达距离对其进行比较。
		//对于左手侧和右手侧操作数，可达性距离值都不能为UNDEFINED。
		struct comp_datapoint_ptr_f{
			bool operator()(const DataPoint* lhs,const DataPoint* rhs)const;
		};

		//数据集
		typedef std::set<DataPoint*, comp_datapoint_ptr_f> DataSet;
		typedef std::vector<DataPoint*> DataVector;


		 /** Performs the classic OPTICS algorithm.
		  * @param db All data points that are to be considered by the algorithm. Changes their values.
		  * @param eps The epsilon representing the radius of the epsilon-neighborhood.
		  * @param min_pts The minimum number of points to be found within an epsilon-neigborhood.
		  * @return Return the OPTICS ordered list of Data points with reachability-distances set.
		  */
		DataVector optics(DataVector& db, const real eps, const unsigned int min_pts);

	}//namespace optics
}
```

```c++
#include "cluster.h"

nao::algorithm::cluster {
    /*计算欧式距离*/

float calcuDistance(uchar * ptr, uchar* ptrCen, int cols)
{
	float d = 0.0;
	for (size_t j = 0; j < cols; j++) {
		d += (double)(ptr[j] - ptrCen[j]) * (ptr[j] - ptrCen[j]);
	}
	d = std::sqrt(d);
	return d;
}
// https://blog.csdn.net/guyuealian/article/details/80255524
cv::Mat MaxMinDisFun(cv::Mat data, float Theta, std::vector<int>& cerIndex)
{
    double maxDistance = 0;
    // 初始选一个中心点
    int start = 0;
    // 相当于指针指示新中心点的位置
    int index = start;
    // 中心点计数，也即是类别
    int k = 0;
    // 输入的样本数
    int dataNum = data.rows;
    // vector<int>	centerIndex;//保存中心点
    // 表示所有样本到当前聚类中心的距离
    cv::Mat distance = cv::Mat::zeros(cv::Size(1, dataNum), CV_32FC1);
    // 取较小距离
    cv::Mat minDistance = cv::Mat::zeros(cv::Size(1, dataNum), CV_32FC1);
    // 表示类别
    cv::Mat classes = cv::Mat::zeros(cv::Size(1, dataNum), CV_32SC1);
    // 保存第一个聚类中心
    centerIndex.push_back(index);

    for (size_t i = 0; i < dataNum; i++) {
        uchar* ptr1 = data.ptr<uchar>(i);
        uchar* ptrCen = data.ptr<uchar>(centerIndex.at(0));
        float d = calcuDistance(ptr1, ptrCen, data.cols);
        distance.at<float>(i, 0) = d;
        classes.at<int>(i, 0) = k + 1;
        if (maxDistance < d) {
            maxDistance = d;
            // 与第一个聚类中心距离最大的样本
            index = i;
        }
    }

    minDistance = distance.clone();
    double minVal;
    double maxVal;
    cv::Point minLoc;
    cv::Point maxLoc;
    maxVal = maxDistance;
    while (maxVal > (maxDistance * Theta)) {
        k = k + 1;
        // 新的聚类中心
        centerIndex.push_back(index);
        for (size_t i = 0; i < dataNum; i++) {
            uchar* ptr1 = data.ptr<uchar>(i);
            uchar* ptrCen = data.ptr<uchar>(centerIndex.at(k));
            float d = calcuDistance(ptr1, ptrCen, data.cols);
            distance.at<float>(i, 0) = d;
            // 按照当前最近临方式分类，哪个近就分哪个类别
            if (minDistance.at<float>(i, 0) > distance.at<float>(i, 0)) {
                minDistance.at<float>(i, 0) = distance.at<float>(i, 0);
                classes.at<int>(i, 0) = k + 1;
            }
        }
        // 查找minDistance中最大值
        cv::minMaxLoc(minDistance, &minVal, &maxVal, &minLoc, &maxLoc);
        index = maxLoc.y;
    }
    return classes;
}

namespace optics {
// https://zhuanlan.zhihu.com/p/408243818
class DataPoint {
private:
    std::vector<real> data_;
    real reachability_distance_;
    bool is_processed_;

public:
    DataPoint()
        : data_(std::vector<real>())
        , reachability_distance_(UNDEFINED)
        , is_processed_(false)
    {
    }
    virtual ~DataPoint() { }

public:
    inline void reachability_distance(real d)
    {
        assert(d >= 0 && "Reachability distance must not be negative.");
        reachability_distance_ = d;
    }
    inline real reachability_distance() const { return reachability_distance_; }
    inline void processed(bool b) { is_processed_ = b; }
    inline bool is_processed() const { return is_processed_; }
    inline std::vector<real>& data() { return data_; }
    inline const std::vector<real>& data() const { return data_; }
    inline real operator[](const std::size_t idx) const
    {
        assert(data_.size() > idx && "Index must be within OPTICS::DataPoint::data_'s range.");
        return data_[idx];
    }
} // class DataPoint

template <typename T = int>
class LabelledDataPoint : public DataPoint {

private:
    T label_;

public:
    // 将可达性距离设置为OPTICS:：UNDEFINED，并将已处理的标志设置为false。
    LabelledDataPoint(T label)
        : DataPoint()
        , label_(label)
    {
    }
    ~LabelledDataPoint() { }

public:
    inline void label(const T& l) { label_ = l; }
    inline const T& label() const { return label_ };

} // class LabelledDataPoint

/// A Comp_DataPoint_f comparison functor ()-operator implementation.
bool
comp_datapoint_ptr_f::operator()(const DataPoint* lhs, const DataPoint* rhs) const
{
    assert(lhs != nullptr && "nullptr objects are not allowed");
    assert(rhs != nullptr && "nullptr objects are not allowed");
    assert(lhs->data().size() == rhs->data().size() && "Comparing DataPoints requires them to have same dimensionality");

    // return lhs->reachability_distance() < rhs->reachability_distance();
    if (lhs->reachability_distance() < rhs->reachability_distance())
        return true;
    else if (lhs->reachability_distance() == rhs->reachability_distance() && lhs < rhs)
        return true;
    else /*lhs->reachability_distance() == rhs->reachability_distance() && lhs >= rhs || lhs->reachability_distance() > rhs->reachability_distance()*/
        return false;
}

/** Retrieves the squared euclidean distance of two DataPoints.
 * @param a The first DataPoint.
 * @param b The second DataPoint. Both data points must have the same dimensionality.
 */
real squared_distance(const DataPoint* a, const DataPoint* b)
{
    const std::vector<real>& a_data = a->data();
    const std::vector<real>& b_data = b->data();
    const unsigned int vec_size = static_cast<unsigned int>(a_data.size());
    assert(vec_size == b_data.size() && "Data-vectors of both DataPoints must have same dimensionality");
    real ret(0);

    for (unsigned int i = 0; i < vec_size; ++i) {
        ret += std::pow(a_data[i] - b_data[i], 2);
    }
    // return std::sqrt( ret);
    return ret;
}

/** Updates the seeds priority queue with new neighbors or neighbors that now have a better
 * reachability distance than before.
 * @param N_eps All points in the the epsilon-neighborhood of the center_object, including p itself.
 * @param center_object The point on which to start the update process.
 * @param c_dist The core distance of the given center_object.
 * @param o_seeds The seeds priority queue (aka set with special comparator function) that will be modified.
 */
void update_seeds(const DataVector& N_eps, const DataPoint* center_object, const real c_dist, DataSet& o_seeds)
{
    assert(c_dist != OPTICS::UNDEFINED && "the core distance must be set <> UNDEFINED when entering update_seeds");
    for (DataVector::const_iterator it = N_eps.begin(); it != N_eps.end(); ++it) {
        DataPoint* o = *it;

        if (o->is_processed())
            continue;

        const real new_r_dist = std::max(c_dist, squared_distance(center_object, o));
        // *** new_r_dist != UNDEFINED ***

        if (o->reachability_distance() == OPTICS::UNDEFINED) {
            // *** o not in seeds ***
            o->reachability_distance(new_r_dist);
            o_seeds.insert(o);

        } else if (new_r_dist < o->reachability_distance()) {
            // *** o already in seeds & can be improved ***
            o_seeds.erase(o);
            o->reachability_distance(new_r_dist);
            o_seeds.insert(o);
        }
    }
}

/** Finds the squared core distance of one given point.
 * @param p The point to be examined.
 * @param min_pts The minimum number of points to be found within an epsilon-neigborhood.
 * @param N_eps All points in the the epsilon-neighborhood of p, including p itself.
 * @return The squared core distance of p.
 */
real squared_core_distance(const DataPoint* p, const unsigned int min_pts, DataVector& N_eps)
{
    assert(min_pts > 0 && "min_pts must be greater than 0");
    real ret(UNDEFINED);
    if (N_eps.size() > min_pts) {
        std::nth_element(N_eps.begin(),
            N_eps.begin() + min_pts,
            N_eps.end(),
            [p](const DataPoint* a, const DataPoint* b) { return squared_distance(p, a) < squared_distance(p, b); });
        ret = squared_distance(p, N_eps[min_pts]);
    }
    return ret;
}

/** Retrieves all points in the epsilon-surrounding of the given data point, including the point itself.
 * @param p The datapoint which represents the center of the epsilon surrounding.
 * @param eps The epsilon value that represents the radius for the neigborhood search.
 * @param db The database consisting of all datapoints that are checked for neighborhood.
 * @param A vector of pointers to datapoints that lie within the epsilon-neighborhood
 *        of the given point p, including p itself.
 */
DataVector get_neighbors(const DataPoint* p, const real eps, DataVector& db)
{
    assert(eps >= 0 && "eps must not be negative");
    DataVector ret;
    const real eps_sq = eps * eps;
    for (auto q_it = db.begin(); q_it != db.end(); ++q_it) {
        DataPoint* q = *q_it;
        if (squared_distance(p, q) <= eps_sq) {
            ret.push_back(q);
        }
    }
    return ret;
}

/** Expands the cluster order while adding new neighbor points to the order.
 * @param db All data points that are to be considered by the algorithm. Changes their values.
 * @param p The point to be examined.
 * @param eps The epsilon representing the radius of the epsilon-neighborhood.
 * @param min_pts The minimum number of points to be found within an epsilon-neigborhood.
 * @param o_ordered_vector The ordered vector of data points. Elements will be added to this vector.
 */
void expand_cluster_order(DataVector& db, DataPoint* p, const real eps, const unsigned int min_pts, DataVector& o_ordered_vector)
{
    assert(eps >= 0 && "eps must not be negative");
    assert(min_pts > 0 && "min_pts must be greater than 0");

    DataVector N_eps = get_neighbors(p, eps, db);
    p->reachability_distance(UNDEFINED);
    const real core_dist_p = squared_core_distance(p, min_pts, N_eps);
    p->processed(true);
    o_ordered_vector.push_back(p);

    if (core_dist_p == UNDEFINED)
        return;

    DataSet seeds;
    update_seeds(N_eps, p, core_dist_p, seeds);

    while (!seeds.empty()) {
        DataPoint* q = *seeds.begin();
        seeds.erase(seeds.begin()); // remove first element from seeds

        DataVector N_q = get_neighbors(q, eps, db);
        const real core_dist_q = squared_core_distance(q, min_pts, N_q);
        q->processed(true);
        o_ordered_vector.push_back(q);
        if (core_dist_q != OPTICS::UNDEFINED) {
            // *** q is a core-object ***
            update_seeds(N_q, q, core_dist_q, seeds);
        }
    }
}

DataVector optics(DataVector& db, const real eps, const unsigned int min_pts)
{
    assert(eps >= 0 && "eps must not be negative");
    assert(min_pts > 0 && "min_pts must be greater than 0");
    DataVector ret;
    for (auto p_it = db.begin(); p_it != db.end(); ++p_it) {
        DataPoint* p = *p_it;

        if (p->is_processed())
            continue;

        expand_cluster_order(db, p, eps, min_pts, ret);
    }
    return ret;
}

} // namespace optics
}
;

```
## 高斯拟合求光斑

```c++
#include <iostream>
#include <Eigen/Dense>
#include "opencv2/opencv.hpp"
#include "opencv2/highgui.hpp"
#include "opencv2/imgproc/imgproc.hpp"
#include <algorithm>
#ifndef __GAUSS_SPOT__H__
#define __GAUSS_SPOT__H__


namespace nao {
	namespace algorithm{
		namespace gauss_spot {

			/**
			* @brief 初始化数据矩阵
			* @param img      单通道float型数据
			* @param vector_A 向量A
			* @param matrix_B 矩阵B
			* @return
			* @参考链接 https://blog.csdn.net/houjixin/article/details/8490653
			*/
			bool initData(cv::Mat img, Eigen::VectorXf& vector_A, Eigen::MatrixXf& matrix_B) {
				if (img.empty())
					return false;
				int length = img.cols * img.rows;
				Eigen::VectorXf tmp_A(length);
				Eigen::MatrixXf tmp_B(length, 5);
				int i = 0, j = 0, iPos = 0;

				while (i < img.cols) {
					j = 0;
					while (j < img.rows) {
						float value = *img.ptr<float>(i, j);
						if (value <= 0.5) value = 1;
						tmp_A(iPos) = value * log(value);
						tmp_B(iPos, 0) = value;
						tmp_B(iPos, 1) = value * i;
						tmp_B(iPos, 2) = value * j;
						tmp_B(iPos, 3) = value * i * i;
						tmp_B(iPos, 4) = value * j * j;
						++iPos;
						++j;
					}
					++i;
				}
				vector_A = tmp_A;
				matrix_B = tmp_B;
			}
			/**
			 * @brief 获取光斑中心
			 * @param x0
			 * @param y0
			 * @param vector_A
			 * @param matrix_B
			 * @return
			*/
			bool getCentrePoint(float& x0, float& y0, const Eigen::VectorXf vector_A, const Eigen::MatrixXf matrix_B) {
				//QR分解
				Eigen::HouseholderQR<Eigen::MatrixXf> qr;
				qr.compute(matrix_B);
				Eigen::MatrixXf R = qr.matrixQR().triangularView<Eigen::Upper>();
				Eigen::MatrixXf Q = qr.householderQ();

				//块操作，获取向量或矩阵的局部
				Eigen::VectorXf S;
				S = (Q.transpose() * vector_A).head(5);
				Eigen::MatrixXf R1;
				R1 = R.block(0, 0, 5, 5);

				Eigen::VectorXf C;
				C = R1.inverse() * S;

				x0 = -0.5 * C[1] / C[3];
				y0 = -0.5 * C[2] / C[4];
				return true;
			}

			/**
			 * @brief 高斯拟合求光斑,求光斑的中心，测试函数
			 * @param src
			*/
			void gauss_spot_center(const cv::Mat src, std::vector<cv::Point2f> & dst_pt) {
				//cv::Mat src = cv::imread("1650.bmp", 0);
				cv::Mat img = src.clone();
				cv::Mat dis_img;
				cv::cvtColor(img, dis_img, cv::COLOR_GRAY2BGR);

				cv::Mat thresh_img;

				//二值化
				double dCurdwTh = 200;
				cv::threshold(img, thresh_img, dCurdwTh, 255, cv::THRESH_BINARY);
				//cv::Mat element = cv::getStructuringElement(cv::MORPH_RECT, cv::Size(3, 3));;//X腐蚀
				//cv::Mat elementP = cv::getStructuringElement(cv::MORPH_RECT, cv::Size(5, 5));//膨胀
				//cv::erode(thresh_img, thresh_img, element);//腐蚀操作
				//cv::dilate(thresh_img, thresh_img, elementP);//膨胀操作

				std::vector<std::vector<cv::Point>> contours;
				std::vector<cv::Vec4i> hierarchy;

				cv::findContours(thresh_img, contours, hierarchy, cv::RETR_CCOMP, cv::CHAIN_APPROX_NONE);
				std::vector<cv::Point2f> pt;
				for (int i = 0; i < contours.size(); i++) {
					cv::Rect rect = cv::boundingRect(contours.at(i));
					if (rect.width < 4 || rect.width > 65 || rect.height < 4)
						continue;

					cv::Mat tmp = img(cv::Rect(rect.x - 5, rect.y - 5, rect.width + 10, rect.height + 10)).clone();
					tmp.convertTo(tmp, CV_32F);
					Eigen::VectorXf vector_A;
					Eigen::MatrixXf matrix_B;

					initData(tmp, vector_A, matrix_B);
					float x0 = 0;
					float y0 = 0;
					getCentrePoint(x0, y0, vector_A, matrix_B);
					cv::Point2f p;

					if (x0 != 0 && y0 != 0) {
						p.x = x0 + rect.tl().x - 5;
						p.y = y0 + rect.tl().y - 5;
						pt.emplace_back(p);
						cv::circle(dis_img, p, 1, cv::Scalar(0, 0, 255), -1);
					}
				}
				for (int i = 0; i < pt.size();i++) {
					dst_pt.emplace_back(pt[i]);
				}
				cv::waitKey(0);
			}
		}//namespace gauss_spot
	}//algorithm
}//namespace nao
#endif // !__GAUSS_SPOT__H__

```

## 海森矩阵求光斑

```c++
#include <iostream>
#include "opencv2/opencv.hpp"
#include "opencv2/highgui.hpp"

namespace nao {
	namespace algorithm {
		namespace hessen_light {

			/**
			 * @brief https://blog.csdn.net/dangkie/article/details/78996761
			*/
			void StegerLine(const cv::Mat src, std::vector<cv::Point2f>& dst_pt) {
				//cv::Mat src = cv::imread("1650.bmp", 0);
				cv::Mat img = src.clone();

				//高斯滤波
				img.convertTo(img, CV_32FC1);
				cv::GaussianBlur(img, img, cv::Size(0, 0), 2.5, 2.5);

				cv::Mat dx, dy;
				cv::Mat dxx, dyy, dxy;

				//一阶偏导数
				cv::Mat mDx, mDy;
				//二阶偏导数
				cv::Mat mDxx, mDyy, mDxy;

				mDx = (cv::Mat_<float>(1, 2) << 1, -1);//x偏导
				mDy = (cv::Mat_<float>(2, 1) << 1, -1);//y偏导
				mDxx = (cv::Mat_<float>(1, 3) << 1, -2, 1);//二阶x偏导
				mDyy = (cv::Mat_<float>(3, 1) << 1, -2, 1);//二阶y偏导
				mDxy = (cv::Mat_<float>(2, 2) << 1, -1, -1, 1);//二阶xy偏导

				cv::filter2D(img, dx, CV_32FC1, mDx);
				cv::filter2D(img, dy, CV_32FC1, mDy);
				cv::filter2D(img, dxx, CV_32FC1, mDxx);
				cv::filter2D(img, dyy, CV_32FC1, mDyy);
				cv::filter2D(img, dxy, CV_32FC1, mDxy);

				//hessian矩阵
				int cols = src.cols;
				int rows = src.rows;
				std::vector<cv::Point2f> pts;

				for (int col = 0; col < cols; ++col)
				{
					for (int row = rows - 1; row != -1; --row)
					{
						if (src.at<uchar>(row, col) < 210) continue;

						cv::Mat hessian(2, 2, CV_32FC1);
						hessian.at<float>(0, 0) = dxx.at<float>(row, col);
						hessian.at<float>(0, 1) = dxy.at<float>(row, col);
						hessian.at<float>(1, 0) = dxy.at<float>(row, col);
						hessian.at<float>(1, 1) = dyy.at<float>(row, col);
						cv::Mat eValue;
						cv::Mat eVectors;
						cv::eigen(hessian, eValue, eVectors);
						double nx, ny;
						double fmaxD = 0;

						if (std::fabs(eValue.at<float>(0, 0)) >= std::fabs(eValue.at<float>(1, 0)))  //求特征值最大时对应的特征向量
						{
							nx = eVectors.at<float>(0, 0);
							ny = eVectors.at<float>(0, 1);
							fmaxD = eValue.at<float>(0, 0);
						}
						else
						{
							nx = eVectors.at<float>(1, 0);
							ny = eVectors.at<float>(1, 1);
							fmaxD = eValue.at<float>(1, 0);
						}

						float t = -(nx * dx.at<float>(row, col) + ny * dy.at<float>(row, col))
							/ (nx * nx * dxx.at<float>(row, col) + 2 * nx * ny * dxy.at<float>(row, col) + ny * ny * dyy.at<float>(row, col));
						float tnx = t * nx;
						float tny = t * ny;

						if (std::fabs(tnx) <= 0.25 && std::fabs(tny) <= 0.25)
						{
							float x = col + /*.5*/tnx;
							float y = row + /*.5*/tny;
							pts.push_back({ x, y });
							break;
						}
					}
				}

				cv::Mat display;
				cv::cvtColor(src, display, cv::COLOR_GRAY2BGR);

				for (int k = 0; k < pts.size(); k++)
				{
					cv::Point rpt;
					rpt.x = pts[k].x;
					rpt.y = pts[k].y;
					cv::circle(display, rpt, 1, cv::Scalar(0, 0, 255));
					dst_pt.emplace_back(rpt);

				}
				cv::imshow("result", display);
				cv::waitKey(0);
			}

		}//namespace hessen_light
	}//namespace algorithm
}//namespace nao


```
## 傅里叶变化

```c++
#include "opencv2/opencv.hpp"
#include "opencv2/highgui.hpp"

namespace nao {
    namespace algorithm {
        namespace fuliy {

			//傅里叶变换
			//https://blog.csdn.net/weixin_45875105/article/details/106917609
			//https://blog.csdn.net/cyf15238622067/article/details/87917766
			void FuLiY(const cv::Mat src, cv::Mat& dst) {
				int w = cv::getOptimalDFTSize(src.cols);
				int h = cv::getOptimalDFTSize(src.rows);
				cv::Mat padded;
				cv::copyMakeBorder(src, padded, 0, h - src.rows, 0, w - src.cols, cv::BORDER_CONSTANT, cv::Scalar::all(0));
				cv::Mat plane[] = { cv::Mat_<float>(padded),cv::Mat::zeros(padded.size(),CV_32F) };
				cv::Mat complexIm;
				cv::merge(plane, 2, complexIm);//为延扩后的图像增添一个初始化为0的通道
				cv::dft(complexIm, complexIm);
				cv::split(complexIm, plane);
				cv::magnitude(plane[0], plane[1], plane[0]);
				cv::Mat magnitudeImage = plane[0];

				magnitudeImage += cv::Scalar::all(1);
				cv::log(magnitudeImage, magnitudeImage);  //自然对数

				magnitudeImage = magnitudeImage(cv::Rect(0, 0, magnitudeImage.cols & -2, magnitudeImage.rows & -2));
				int cx = magnitudeImage.cols / 2;
				int cy = magnitudeImage.rows / 2;

				cv::Mat q0(magnitudeImage, cv::Rect(0, 0, cx, cy));
				cv::Mat q1(magnitudeImage, cv::Rect(cx, 0, cx, cy));
				cv::Mat q2(magnitudeImage, cv::Rect(0, cy, cx, cy));
				cv::Mat q3(magnitudeImage, cv::Rect(cx, cy, cx, cy));


				cv::Mat temp;
				q0.copyTo(temp);
				q3.copyTo(q0);
				temp.copyTo(q3);

				q1.copyTo(temp);
				q2.copyTo(q1);
				temp.copyTo(q2);

				cv::normalize(magnitudeImage, magnitudeImage, 0, 1, cv::NORM_MINMAX);
				dst = magnitudeImage.clone();
			}
        }//namespace fuliy
    }//namespace algorithm
}//namespace nao


```
## 霍夫变换

参考链接：

https://zhuanlan.zhihu.com/p/440016372

https://zhuanlan.zhihu.com/p/645074162

如果我们对图像中的每一个像素点（即x-y坐标系下的每一个点），都转换至参数坐标系下，那么在参数坐标系下，很多条直线的交点对应图像空间中的一条直线，也就是我们要找的边界线；

1、确定一个参数空间(m, b)

2、创建一个初始值全是0的矩阵 ，记为A(m,b); 其中行数为m的取值个数，列数为b的取值个数，从m0至mk表示m的取值，b0至bk表示b的取值， 目前来说，A(m0,b0) =0 ，表示当m = m0,b=b0时，对应的空格内的数字为0；

3、对于图像中的每一个像素点（xi,yi）, 它对应参数坐标系下的一条直线；遍历参数空间下m和b的所有取值，如果（m,b）的取值位于该直线上，则对应的空格内的数字加1；比如(m3,b4)位于该直线上，那么在m3,b4所对应的空格内的数字加1；此过程记为A(m,b) = A(m,b) +1/

4、在最终的矩阵A(m,c)中，找到局部空间内，空格数字最大的值所对应的(m,b)

伪代码

```python
 44 def get_line_coef_length(p1,p2):
 45     import numpy as np
 46     x1,y1=p1
 47     x2,y2=p2
 48     xe=x1-x2
 49     ye=y1-y2
 50     dist = np.sqrt(xe*xe+ye*ye)
 51     k=float(y2)-float(y1)
 52     if x2-x1==0:
 53         return dist,180,y1
 54     k=k/(float(x2)-float(x1))
 55     k_theta = int(np.arctan(k)/3.14*180.0+90.0)
 56     b = y1-k*x1
 57     #线段长度，角度
 58     return dist,k_theta,b
```

扩展思路：

霍夫变换的思路可以应用到其他的方面，譬如找许多数据中的共类。 图片中的许多点求图片旋转的角度。
```c++
#include <limits>
float calculateSlope(const cv::Point2f& p1, const cv::Point2f& p2)
{
    if (p1.x == p2.x) {
        return std::numeric_limits<float>::infinity();
    }
    return (p2.y - p1.y) / (p2.x - p1.x);
}

double reget_angle(std::vector<cv::Point2f> pts, int min_points_in_line)
{
    std::map<float, std::vector<std::pair<int, int>>> line_groups;
    for (size_t i = 0; i < pts.size(); ++i) {
        for (size_t j = i + 1; j < pts.size(); ++j) {
            float slope = calculateSlope(pts[i], pts[j]);
            float slope_key = roundf(slope * 100) / 100;
            line_groups[slope_key].push_back(std::make_pair(i, j));
        }
    }
    int max_value = 0;
    double angle = 0;
    for (const auto& pair : line_groups) {
        if (pair.second.size() >= min_points_in_line) {
            if (pair.second.size() >= max_value) {
                max_value = pair.second.size();
                angle = pair.first;
            }
        }
    }
    angle = atanl(angle) * 180.0 / CV_PI;
    return angle;
}

```

## 直方图匹配

```c++
	std::optional<cv::Mat> get_equal_img(const cv::Mat& hist_img, const cv::Rect& hist_rect, const cv::Mat& template_img, const cv::Rect& template_rect) {
		cv::Mat hist1, hist2;
		const int channels[1] = { 0 };
		float inRanges[2] = { 0,255 };
		const float* ranges[1] = { inRanges };
		const int bins[1] = { 256 };

		//保留ROI 区域的直方图
		cv::Mat img_1 = hist_img(hist_rect).clone();
		cv::Mat img_2 = template_img(template_rect).clone();
		cv::calcHist(&img_1, 1, channels, cv::Mat(), hist1, 1, bins, ranges, true, false);
		cv::calcHist(&img_2, 1, channels, cv::Mat(), hist2, 1, bins, ranges, true, false);

		float hist1_cdf[256] = { hist1.at<float>(0) };
		float hist2_cdf[256] = { hist2.at<float>(0) };
		for (int i = 1; i < 256; ++i) {
			hist1_cdf[i] = hist1_cdf[i - 1] + hist1.at<float>(i);
			hist2_cdf[i] = hist2_cdf[i - 1] + hist2.at<float>(i);
		}
		//归一化，两幅图像大小可能不一致
		for (int i = 0; i < 256; i++)
		{
			hist1_cdf[i] = hist1_cdf[i] / (img_1.rows * img_1.cols);
			hist2_cdf[i] = hist2_cdf[i] / (img_1.rows * img_1.cols);
		}

		float diff_cdf[256][256];
		for (int i = 0; i < 256; ++i) {
			for (int j = 0; j < 256; ++j) {
				diff_cdf[i][j] = fabs(hist1_cdf[i] - hist2_cdf[j]);
			}
		}
		cv::Mat lut(1, 256, CV_8U);
		for (int i = 0; i < 256; ++i) {
			float min = diff_cdf[i][0];
			int index = 0;
			for (int j = 1; j < 256; ++j) {
				if (min > diff_cdf[i][j]) {
					min = diff_cdf[i][j];
					index = j;
				}
			}
			lut.at<uchar>(i) = (uchar)index;
		}
		cv::Mat result, hist3;
		cv::LUT(hist_img, lut, result);
		return result;
	}

```
## lineMod 匹配算法

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