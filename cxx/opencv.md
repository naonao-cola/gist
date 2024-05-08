
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