## 编码

跨win/linux项目的编码选择和编译选项设置，首选： UTF-8 With BOOM

以下是对编码造成问题的说明

https://github.com/lovepika/thinking_file_encoding_cpp

## 多线程

## 线程池

## opencv

```c++
//漫水填充
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
