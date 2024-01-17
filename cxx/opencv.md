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
