## 第一章 机器视觉概述

![wechat](./Screenshot2025-07-15at22-22-23.png)


## 第二章 数字图像基础

![wechat](./Screenshot2025-07-15at22-24-26.png)


## 第三章 了解和熟悉HALCON

![wechat](./Screenshot2025-07-15at22-25-45.png)


## 第四章 图像预处理

![wechat](./Screenshot2025-07-15at22-29-28.png)

![wechat](./Screenshot2025-07-15at22-30-48.png)

### ROI选择
```c++
    * 关闭窗口
    dev_close_window ()
    *读取图像
    read_image (Clip, 'clip')
    *把一个图像缩放到指定比例大小
    zoom_image_factor (Clip, ImageZoomed, 0.5, 0.5, 'constant')
    *获得图像尺寸
    get_image_size (ImageZoomed, Width, Height)
    *新建显示窗口，适应图像尺寸
    dev_open_window (0, 0, Width, Height, 'black', WindowID)
    dev_display (ImageZoomed)
    *输入矩形长轴针对水平方向的角度
    phi := 1.91
    *输入矩形中心点的y值坐标、x值坐标
    Row := 134
    Column := 118
    *选择ROI
    gen_rectangle2 (Rectangle, Row, Column,phi, 19, 55)
    *从原图中分割出ROI
    reduce_domain (ImageZoomed, Rectangle, ImageReduced)
    *显示分割后的ROI图像
    dev_display (ImageReduced)
```
### 仿射变换
```c++
    dev_close_window ()
    read_image (Image, 'C:/Users/Dear/Desktop/《机器视觉案例》/案例原图/第四章/4-2.png')
    get_image_size (Image, Width, Height)
    dev_open_window (0, 0, Width, Height, 'black', WindowHandle)
    dev_display (Image)
    rgb1_to_gray (Image, GrayImage)
    threshold (GrayImage, Regions, 200, 255)
    area_center (Regions, Area, Row, Column)
    hom_mat2d_identity (HomMat2DIdentity)
    hom_mat2d_translate (HomMat2DIdentity, Height/2-Row, Width/2-Column, HomMat2DTranslate)
    affine_trans_image (GrayImage, ImageAffinTrans, HomMat2DTranslate, 'constant', 'false')
    hom_mat2d_rotate (HomMat2DIdentity, 3.14/2, Height/2, Width/2, HomMat2DRotate)
    affine_trans_image (ImageAffinTrans, ImageAffinTrans1, HomMat2DRotate, 'constant', 'false')
    hom_mat2d_scale (HomMat2DIdentity, 1.5, 1.5, Height/2, Width/2, HomMat2DScale)
    affine_trans_image (ImageAffinTrans1, ImageAffinTrans2, HomMat2DScale, 'constant', 'false')
```


### 二维码校正
```c++
    dev_close_window ()
    read_image (Image, 'E:/《机器视觉案例》/案例原图/第四章/4-3.png')
    dev_open_window_fit_image (Image, 0, 0, -1, -1, WindowHandle)
    dev_set_color ('red')
    dev_set_line_width (2)
    X := [163,280,362,75]
    Y := [125,120,361,340]
    gen_cross_contour_xld (Crosses, X, Y, 6, 0.78)
    dev_display (Image)
    dev_display (Crosses)
    hom_vector_to_proj_hom_mat2d (X, Y, [1,1,1,1], [75,360,360,75], [110,110,360,360], [1,1,1,1], 'normalized_dlt', HomMat2D)
    projective_trans_image (Image, Image_rectified, HomMat2D, 'bilinear', 'false', 'false')
```

### 线性灰度变换
```c++
    *关闭窗口
    dev_close_window ()
    *获取图像
    read_image (Image, 'E:/《机器视觉案例》/案例原图/第四章/4-4 4-5.png')
    *获取图像尺寸
    get_image_size (Image, Width, Height)
    *打开大小适应的窗口
    dev_open_window (0, 0, Width, Height, 'black', WindowHandle)
    *显示图像
    dev_display (Image)
    *图像灰度化
    rgb1_to_gray (Image, GrayImage)
    *图像取反
    invert_image (GrayImage, ImageInvert)
    *增强对比度
    emphasize (GrayImage, ImageEmphasize, Width, Height, 2)
    *缩放图像灰度值
    scale_image (GrayImage, ImageScaled, 1, 100)
    *分别显示ImageInvert、ImageEmphasize、ImageScaled
    dev_display (ImageInvert)
    dev_display (ImageEmphasize)
    dev_display (ImageScaled)
```

### 直方图均衡化
```c++
    *关闭窗口
    dev_close_window ()
    *获取图像
    read_image (Image, 'E:/《机器视觉案例》/案例原图/第四章/4-4 4-5.png')
    *获取图像大小
    get_image_size (Image,Width, Height)
    *打开与图像大小适应的窗口
    dev_open_window (0, 0, Width, Height, 'black', WindowHandle1)
    *图像灰度化
    rgb1_to_gray (Image, GrayImage)
    *直方图均衡化
    equ_histo_image (GrayImage, ImageEquHisto)
```

### 均值滤波
```c++
    *读取图像
    read_image (Image, 'E:/《机器视觉案例》/案例原图/第四章/4-6 4-7.jpg')
    *关闭窗口
    dev_close_window ( )
    *重新打开窗口
    dev_open_window (0, 0, 512, 512, 'black', WindowHandle)
    *显示图像，将图像灰度化
    dev_display (Image)
    rgb1_to_gray (Image, GrayImage)
    *添加高斯噪声
    gauss_distribution (20, Distribution)
    add_noise_distribution (GrayImage, ImageNoise, Distribution)
    *均值滤波处理
    mean_image (ImageNoise, ImageMean, 5, 5)
    *显示图像
    dev_display (ImageMean)
```
### 中值滤波
```c++
    *读取图像
    read_image (Image, 'E:/《机器视觉案例》/案例原图/第四章/4-6 4-7.jpg')
    rgb1_to_gray (Image, GrayImage)
    *关闭窗口，重新打开窗口
    dev_close_window ( )
    dev_open_window (0, 0, 512, 512, 'black', WindowHandle)
    *显示图片
    dev_display (GrayImage)
    *图像灰度化
    *添加椒盐噪声
    sp_distribution (3, 3, Distribution)
    add_noise_distribution (GrayImage, ImageNoise, Distribution)
    *中值滤波
    median_image (ImageNoise, ImageMedian, 'circle', 3, 'mirrored')
    *显示图像
    dev_display (ImageMedian)
```

### sobel算子
```c++
    *读取图像
    read_image (Image, 'E:/《机器视觉案例》/案例原图/第四章/4-8.png')
    *边缘检测
    sobel_amp (Image, EdgeAmplitude, 'sum_abs', 3)
    *阈值分割
    threshold (EdgeAmplitude, Region, 10, 255)
    *提取边缘框架
    skeleton (Region, Skeleton)
    *显示图片
    dev_display (Image)
    *设置输出颜色为红色
    dev_set_color ('red')
    *显示边缘框架
    dev_display (Skeleton)
```

### 拉普拉斯算子
```c++
    *关闭窗口
    dev_close_window ()
    *获取图像
    read_image (Image, 'E:/《机器视觉案例》/案例原图/第四章/4-9.png')
    *获取图像尺寸
    get_image_size (Image, Width, Height)
    *打开适应图片大小的窗口
    dev_open_window (0, 0, Width, Height, 'black', WindowHandle)
    *显示图片
    dev_display (Image)
    *对图像进行拉普拉斯算子处理
    laplace (Image, ImageLaplace, 'signed', 3, 'n_8_isotropic')
    *显示处理后的图像
    dev_display (ImageLaplace)
```

### 低通滤波处理
```c++
    *读取带有椒盐噪声图像
    read_image (Image, 'E:/《机器视觉案例》/案例原图/第四章/4-10.png')
    *获得图像尺寸
    get_image_size (Image, Width, Height)
    *关闭窗口
    dev_close_window ()
    *打开适应图像大小的窗口
    dev_open_window (0, 0, 512, 512, 'black', WindowHandle)
    *显示图像
    dev_display (Image)
    *图像转灰度化
    rgb1_to_gray (Image, GrayImage)
    *获得一个低通滤波模型
    gen_lowpass (ImageLowpass, 0.1, 'none', 'dc_center', Width, Height)
    *对噪声图像进行傅里叶变换，得到频率图像
    fft_generic (Image, ImageFFT, 'to_freq', -1, 'sqrt', 'dc_center', 'complex')
    *对频率图像进行低通滤波
    convol_fft (ImageFFT, ImageLowpass, ImageConvol)
    *对频率图像进行傅里叶变换
    fft_generic (ImageConvol, ImageFFT1, 'from_freq',1, 'sqrt', 'dc_center', 'complex')
```

### 高通滤波处理
```c++
    *关闭窗口
    dev_close_window ()
    *读取图像
    read_image (Image, 'E:/《机器视觉案例》/案例原图/第四章/4-11.png')
    *图像灰度化
    rgb1_to_gray (Image, GrayImage)
    *获取图像大小
    get_image_size (GrayImage, Width, Height)
    *打开图像适应大小窗口
    dev_open_window (0, 0, Width, Height, 'black', WindowHandle)
    *得到高通滤波模型
    gen_highpass (ImageHighpass, 0.1, 'n', 'dc_center', Width, Height)
    *对图像进行傅里叶变换
    fft_generic(GrayImage,ImageFFT,'to_freq',-1,'none','dc_center','complex')
    *对频率图像进行高通滤波
    convol_fft(ImageFFT,ImageHighpass,ImageConvol)
    *对得到的频率图像进行傅里叶反变换
    fft_generic(ImageConvol,ImageResult,'from_freq',1,'none','dc_center','byte')
    *显示图像
    dev_display (ImageResult)
```


## 第五章 图像分割


![wechat](./Screenshot2025-07-15at22-35-39.png)
![wechat](./Screenshot2025-07-15at22-36-57.png)

### 直方图谷底确定阈值分割
```c++
    read_image (Image, 'E:/《机器视觉案例》/案例原图/第五章/5-1.png')
    get_image_size (Image, Width, Height)
    dev_close_window ()
    dev_open_window (0, 0, Width, Height, 'black', WindowHandle)
    dev_set_color ('red')
    *计算图像的灰度直方图
    gray_histo (Image, Image, AbsoluteHisto, RelativeHisto)
    histo_to_thresh (RelativeHisto, 8, MinThresh, MaxThresh)
    dev_set_colored (12)
    threshold (Image, Region, MinThresh[0], MaxThresh[0])
    dev_display (Region)
```
### 基于直方图的自动阈值分割
```c++
    *获取图像
    read_image (Image, 'E:/《机器视觉案例》/案例原图/第五章/5-2.png')
    *自动阈值分割
    auto_threshold (Image, Regions, 5)
    *显示分割区域
    dev_display (Regions)
```

### 局部阈值分割算子dyn_threshold
```c++
    *关闭窗口
    dev_close_window ()
    *获取图像
    read_image (Image, 'photometric_stereo/embossed_01')
    *获得图像尺寸
    get_image_size (Image, Width, Height)
    *打开适应图像大小的窗口
    dev_open_window (0, 0, Width, Height, 'black', WindowHandle1)
    *在图像上使用均值滤波器进行适当平滑
    mean_image (Image, ImageMean, 59, 59)
    *动态阈值分割，提取圆区域
    dyn_threshold (Image, ImageMean, RegionDynThresh, 15, 'not_equal')
    * 显示图像
    dev_display (Image)
    *显示提取区域
    dev_display (RegionDynThresh)
```
### Prewitt边缘提取实例
```c++
    *读取图像
    read_image (Image, 'fabrik')
    *用prewitt算子进行边缘提取
    prewitt_amp (Image, ImageEdgeAmp)
    *进行阈值操作
    threshold (ImageEdgeAmp, Region, 20, 255)
    *骨骼化操作
    skeleton (Region, Skeleton)
    *显示图像
    dev_display (Image)
    *设置输出颜色为红色
    dev_set_color ('red')
    *显示骨骼图像
    dev_display (Skeleton)
```
### Kirsch边缘提取实例
```c++
    *读取图像
    read_image (Image, 'fabrik')
    *用kirsch算子进行边缘检测
    kirsch_amp (Image, ImageEdgeAmp)
    *进行阈值操作
    threshold (ImageEdgeAmp, Region, 70, 255)
    *骨骼化操作
    skeleton (Region, Skeleton)
    *显示图像
    dev_display (Image)
    *设置输出颜色为红色
    dev_set_color ('red')
    *显示骨骼图像
    dev_display (Skeleton)
```

### Canny边缘提取分割实例
```c++
    *获取图像
    read_image (Image, 'fabrik')
    *使用canny算法进行边缘提取
    edges_image (Image, ImaAmp, ImaDir, 'lanser2', 0.5, 'nms', 12, 22)
    *阈值分割
    threshold (ImaAmp, Edges, 1, 255)
    *骨骼化
    skeleton (Edges, Skeleton)
    *将骨骼化的区域转化为XLD
    gen_contours_skeleton_xld (Skeleton, Contours, 1, 'filter')
    *显示图像
    dev_display (Image)
    *设置6种输出颜色
    dev_set_colored (6)
    *显示XLD
    dev_display (Contours)
```
### 亚像素级别的边缘提取实例
```c++
    * 关闭窗口
    dev_close_window ()
    * 读取图像
    read_image (Image, 'fabrik')
    * 打开适应图像大小的窗口
    dev_open_window_fit_image (Image, 0, 0, -1, -1, WindowHandle)
    * 对图像进行亚像素区域提取
    edges_sub_pix (Image, Edges, 'canny', 2, 12, 22)
    * 放大图像用于详细的边缘检查
    dev_set_part (160, 250, 210, 300)
    dev_display (Image)
    dev_display (Edges)
```

### 区域生长法实例
```c++
    *读取图像
    read_image (Image, 'fabrik')
    *对图像进行均值处理，选用circle类型的中值滤波器
    median_image (Image, ImageMedian, 'circle', 2, 'mirrored')
    *使用regiongrowing算子寻找颜色相近的邻域
    regiongrowing (ImageMedian, Regions, 1, 1, 2, 5000)
    *对图像进行区域分割，提取满足各个条件的各个独立区域
    shape_trans (Regions, Centers, 'inner_center')
    connection (Centers, SingleCenters)
    *计算出初步提取的区域的中心点坐标
    area_center (SingleCenters, Area, Row, Column)
    *以均值灰度图像为输入，进行区域增长计算，计算的起始坐标为上一步的各区域中心
    regiongrowing_mean (ImageMedian, RegionsMean, Row, Column, 25, 100)
```

### Hough变换图像分割实例
```c++
    *读取图像
    read_image (Image, 'fabrik')
    *获得目标区域图像
    rectangle1_domain (Image, ImageReduced, 170, 280, 310, 360)
    * 用Sobel边缘检测算子提取边缘
    sobel_dir (ImageReduced, EdgeAmplitude, EdgeDirection, 'sum_abs', 3)
    *设置输出颜色为红色
    dev_set_color ('red')
    *阈值分割得到图像
    threshold (EdgeAmplitude, Region, 55, 255)
    * 截取图像
    reduce_domain (EdgeDirection, Region, EdgeDirectionReduced)
    * 进行Hough变换
    hough_lines_dir (EdgeDirectionReduced, HoughImage, Lines, 4, 2, 'mean', 3, 25, 5, 5, 'true', Angle, Dist)
    *将霍夫变换提取直线以普通形式描述的输入行存储为区域
    gen_region_hline (LinesHNF, Angle, Dist)
    *显示图像
    dev_display (Image)
    *设置输出颜色数目
    dev_set_colored (12)
    *设置输出填充方式为“轮廓”
    dev_set_draw ('margin')
    *显示LinesHNF
    dev_display (LinesHNF)
    *设置输出填充方式为“填充”
    dev_set_draw ('fill')
    *显示Lines
    dev_display (Lines)
```
### 分水岭算法分割实例
```c++
    *获取图像
    read_image (Br2, 'particle')
    *对单通道图像进行高斯平滑处理，去除噪声
    gauss_filter (Br2, ImageGauss, 9)
    *将图像颜色进行反转
    invert_image (ImageGauss, ImageInvert)
    *对高斯平滑后的图像进行分数岭处理与阈值分割，提取出盆地区域
    watersheds (ImageInvert, Basins, Watersheds)
    watersheds_threshold (ImageInvert, Basins1,30)
```

## 第六章 特征提取

![wechat](./Screenshot2025-07-15at22-39-58.png)

### 获取区域的面积和中线点特征实例
```c++
    *获取图像
    read_image (Image, 'fabrik')
    *关闭窗口
    dev_close_window ()
    *打开窗口
    dev_open_window (0, 0, 512, 512, 'black', WindowID)
    *设置输出字体，14号字，Courier字体，粗体
    set_display_font (WindowID, 14, 'mono', 'true', 'false')
    *设置输出颜色
    dev_set_colored (6)
    *进行区域生长操作
    regiongrowing (Image, Regions, 1, 1, 3, 200)
    *显示区域
    dev_display (Regions)
    *计算所有不相连区域的面积和中心点坐标
    area_center (Regions, Area, Row, Column)
    center:=|Area|
    *获取一个字符串的空间大小
    get_string_extents (WindowID, 12345, Ascent, Descent, TxtWidth, TxtHeight)
    *将面积计算结果以字符串形式显示在窗口中
    for I := 0 to center-1 by 1
        disp_message (WindowID, Area[I], 'image', Row[I] - TxtHeight / 2, Column[I] - TxtWidth / 2, 'white', 'false')
    endfor
```
### 计算封闭区域面积实例
```c++
    *关闭窗口
    dev_close_window ()
    *读取图像
    read_image (Image, 'rings_and_nuts')
    *打开适应图像大小的窗口
    dev_open_window_fit_image (Image, 0, 0, -1, -1, WindowHandle)
    *设置输出颜色
    dev_set_color ('red')
    *设置输出字体，14号字，Courier字体，粗体
    set_display_font (WindowHandle, 14, 'mono', 'true', 'false')
    *显示图像
    dev_display (Image)
    *进行阈值操作
    threshold (Image, Region, 128, 255)
    * 计算区域中孔的面积
    area_holes (Region, Area)
    *将面积计算结果以字符串形式显示在窗口中
    disp_message (WindowHandle, 'Size of enclosed area (holes): ' + Area + ' pixel', 'window', 12, 12, 'black', 'true')

```

### 利用Select_shape选择区域实例
```c++
    *读取图像
    read_image (Image, 'monkey')
    *二值化
    threshold (Image, Region, 128, 255)
    *将非连通区域分割成一组区域的集合
    connection (Region, ConnectedRegions)
    *利用面积以及椭圆长轴与短轴的比值特征，将眼睛部分区域提取出来
    select_shape (ConnectedRegions, SelectedRegions, ['area','anisometry'], 'and', [500,1], [2000,1.7])
    *显示结果区域
    dev_display (SelectedRegions)
```
### 使用inner circle算子计算图像区域内接圆
```c++
    *读取图像
    read_image (Image, 'fabrik')
    *关闭窗口
    dev_close_window ()
    *打开窗口
    dev_open_window (0, 0, 512, 512, 'black', WindowID)
    *设置输出颜色为白色
    dev_set_color ('white')
    *设置图像模式为填充模式
    dev_set_draw ('fill')
    *使用regiongrowing算子寻找颜色相近的邻域
    regiongrowing (Image, Regions, 1, 1, 3, 500)
    *找出每个区域的最大内接圆以及内接圆的中心坐标和半径
    inner_circle (Regions, Row, Column, Radius)
    *设置输出颜色为红色
    dev_set_color ('red')
    *显示每个区域的内接圆
    disp_circle (WindowID, Row, Column, Radius)
```
### 求图像中的外接矩形实例
```c++
    *关闭窗口
    dev_close_window ()
    *读取图像
    read_image (Image, 'E:/《机器视觉案例》/案例原图/第六章/6-5.png')
    *获取图像尺寸
    get_image_size (Image, Width, Height)
    *打开适应图像大小的窗口
    dev_open_window (0, 0, Width, Height, 'black', WindowHandle)
    *灰度化
    rgb1_to_gray (Image, GrayImage)
    *使用阈值处理提取较暗的部分
    threshold (GrayImage, Regions, 0, 253)
    *求平行坐标的最小外接矩形
    smallest_rectangle1 (Regions, Row1, Column1, Row2, Column2)
    *填充模式为轮廓
    dev_set_draw ('margin')
    *根据矩形参数绘制矩形的轮廓
    gen_rectangle1 (Rectangle, Row1, Column1, Row2, Column2)
    *求区域的最小外接矩形
    smallest_rectangle2 (Regions, Row, Column, Phi, Length1, Length2)
    *根据矩形参数绘制矩形的轮廓
    gen_rectangle2 (Rectangle1, Row, Column, Phi, Length1, Length2)
```

### gray_features算子实例
```c++
    * 读取图片
    read_image (Image, 'monkey')
    *对图像进行阈值处理，主要是将图像转化为区域
    threshold (Image, Region, 1, 255)
    *提取区域中最小灰度值
    gray_features (Region, Image, 'min',MinDisp)
    *提取区域中最大灰度值
    gray_features (Region, Image, 'max', MaxDisp)

```
### 运用intensity算子计算区域的灰度值平均值和偏差
```c++
    * 读取图像
    read_image (Image, 'mreut')
    *关闭窗口
    dev_close_window ()
    *获得图像尺寸
    get_image_size (Image, Width, Height)
    *打开适应图像大小的窗口
    dev_open_window (0, 0, Width, Height, 'black', WindowID)
    *显示图像
    dev_display (Image)
    *设置填充模式为轮廓
    dev_set_line_width (5)
    dev_set_draw ('margin')
    * 创建两个矩形区域
    gen_rectangle1 (Rectangle1, 350, 100, 450, 200)
    gen_rectangle1 (Rectangle2, 100, 200, 200, 300)
    *提取区域1中灰度值的平均值与偏差
    intensity (Rectangle1, Image, Mean1, Deviation1)
    *提取区域2中灰度值的平均值与偏差
    intensity (Rectangle2, Image, Mean2, Deviation2)

```
### 使用min_max_gray算子提取区域中最大灰度以及最小灰度值
```c++
    * 读取图像
    read_image (Image, 'mreut')
    *关闭窗口
    dev_close_window ()
    *获得图像尺寸
    get_image_size (Image, Width, Height)
    *打开适应图像大小的窗口
    dev_open_window (0, 0, Width, Height, 'black', WindowID)
    *显示图像
    dev_display (Image)
    *设置填充模式为轮廓
    dev_set_line_width (5)
    dev_set_draw ('margin')
    * 创建两个矩形区域
    gen_rectangle1 (Rectangle1, 350, 100, 450, 200)
    gen_rectangle1 (Rectangle2, 100, 200, 200, 300)
    *提取区域1中最大与最小灰度值
    min_max_gray (Rectangle1, Image, 5, Min1, Max1, Range1)
    *提取区域2中最大与最小灰度值
    min_max_gray (Rectangle2, Image, 5, Min2, Max2, Range2)
```
### 运用area_center_gray 计算一幅灰度值图像的面积和中心实例
```c++
    * 读取图像
    read_image (Image, 'mreut')
    * 创建矩形区域
    gen_rectangle1 (Rectangle1, 350, 100, 450, 200)
    * 计算区域内总灰度值以及中心的行、列坐标
    area_center_gray (Rectangle1, Image, Area, Row, Column)
```

### select_gray算子运算实例
```c++
    *读取图像
    read_image (Image, 'fabrik')
    *关闭窗口
    dev_close_window ()
    *打开窗口
    dev_open_window (0, 0, 512, 512, 'black', WindowID)
    *设置输出颜色为白色
    dev_set_color ('white')
    *设置填充模式为填充
    dev_set_draw ('fill')
    *使用regiongrowing算子进行区域增长
    regiongrowing (Image, Regions, 1, 1, 3, 10)
    *设置输出颜色为红色
    dev_set_color ('red')
    *使用select_gray算子快速选择出灰度值在199-255碱的区域
    select_gray (Regions, Image, SelectedRegions, 'mean', 'and',190, 250)
```

## 第七章 图像的形态学处理



![wechat](./Screenshot2025-07-15at22-42-41.png)


### 利用不同的腐蚀算子得到不同的腐蚀结果实例
```c++
    dev_close_window ()
    *获取图像
    read_image (Image, 'E:/《机器视觉案例》/案例原图/第七章/7-1.png')
    *获取图像的尺寸
    get_image_size (Image, Width, Height)
    *创建新的显示窗口（适应图像尺寸）
    dev_open_window (0, 0, Width, Height, 'black', WindowHandle)
    *显示图像
    dev_display (Image)
    *将图像转化为灰度图像
    rgb1_to_gray (Image, GrayImage)
    *将图像通过阈值处理转化为二值化图像
    threshold (GrayImage, Regions, 134, 239)
    *使用半径为11的圆形结构腐蚀得到区域
    erosion_circle (Regions, RegionErosion, 11)
    *使用长宽均为11的矩形结构元素腐蚀得到区域
    erosion_rectangle1 ( Regions, RegionErosion1, 11, 11)
    *生成短轴11，长轴13的椭圆形区域，作为结构元素
    gen_ellipse (Ellipse, 100, 100, 0, 13, 11)
    *使用生成的椭圆形结构元素腐蚀得到区域
    erosion1 (Regions, Ellipse, RegionErosion2, 1)
    *使用生成的椭圆形结构元素腐蚀得到区域（可设置参考点）
    erosion2 (Regions, Ellipse, RegionErosion3, 0, 0, 1)
```

### 利用不同的膨胀算子得到不同的膨胀结果实例
```c++
    dev_close_window ()
    *获取图像
    read_image (Image71, 'D:/《机器视觉》图片/第七章/7-1.png')
    get_image_size (Image71, Width, Height)
    *创建新的显示窗口（适应图像尺寸）
    dev_open_window (0, 0, Width, Height, 'black', WindowHandle)
    *显示图像
    dev_display (Image71)
    *将图像转化为灰度图像
    rgb1_to_gray (Image71, GrayImage)
    *将图像通过阈值处理转化为二值化图像
    threshold (GrayImage, Regions, 134, 239)
    *使用半径为11的圆形结构膨胀得到区域
    dilation_circle (Regions, RegionDilation, 11)
    *使用长为13，宽为11的矩形结构元素膨胀得到区域
    dilation_rectangle1 (Regions, RegionDilation1, 11, 13)
    *生成短轴11，长轴13的椭圆形区域，作为结构元素
    gen_ellipse (Ellipse, 100, 100, 0, 13, 11)
    *使用生成的椭圆形结构元素膨胀得到区域
    dilation1 (Regions, Ellipse, RegionDilation2, 1)
    *使用生成的椭圆形结构元素膨胀得到区域（可设置参考点）
    dilation2 (Regions, Ellipse, RegionDilation3, 0, 0, 1)
```

### HALCON闭运算实例
```c++
    read_image (Image, 'E:/《机器视觉案例》/案例原图/第七章/7-3 闭运算.png')
    dev_close_window ()
    rgb1_to_gray (Image, GrayImage)
    get_image_size (GrayImage, Width, Height)
    dev_open_window (0, 0, Width / 2, Height / 2, 'black', WindowID)
    dev_display (GrayImage)
    threshold (GrayImage, Regions1, 25, 189)
    closing_circle (Regions1, RegionClosing, 7)
    closing_rectangle1 (Regions1, RegionClosing1, 9, 9)
    gen_ellipse (Ellipse, 200, 200, 0, 5, 7)
    closing (Regions1, Ellipse, RegionClosing2)
    dev_display (RegionClosing)
    dev_display (RegionClosing1)
    dev_display (RegionClosing2)


    dev_close_window ()
    read_image (Image, 'E:/《机器视觉案例》/案例原图/第七章/7-3开运算.png')
    rgb1_to_gray (Image, GrayImage)
    get_image_size (GrayImage, Width, Height)
    dev_open_window (0, 0, Width / 2, Height / 2, 'black', WindowID)
    dev_display (GrayImage)
    threshold (GrayImage, Regions1, 25, 189)
    opening_circle (Regions1, RegionOpening,11)
    opening_rectangle1 (Regions1, RegionOpening1,11, 11)
    gen_ellipse (Ellipse, 200, 200, 0, 11, 13)
    opening (Regions1, Ellipse, RegionOpening2)
    dev_display (RegionOpening)
    dev_display (RegionOpening1)
    dev_display (RegionOpening2)
```

### 灰度图像的腐蚀与膨胀、开运算与闭运算操作实例
```c++
    *关闭窗口
    dev_close_window ()
    *获取图像
    read_image (Image, 'E:/《机器视觉案例》/案例原图/第七章/7-4.png')
    *获取图像尺寸大小
    get_image_size (Image, Width, Height)
    *打开与图像适应大小的窗口
    dev_open_window (0, 0, Width, Height, 'black', WindowHandle)
    *显示图像
    dev_display (Image)
    *对灰度图像进行腐蚀操作
    gray_erosion_shape (Image, ImageMin, 5, 5, 'octagon')
    *对灰度图像进行膨胀操作
    gray_dilation_shape (Image, ImageMax, 5, 5, 'octagon')
    *对灰度图像进行开运算操作
    gray_opening_shape (Image, ImageOpening, 5, 5, 'octagon')
    *对灰度图像进行闭运算操作
    gray_closing_shape (Image, ImageClosing, 5, 5, 'octagon')

```
### 灰度图像的顶帽、底帽运算
```c++
    *关闭窗口
    dev_close_window ()
    *获取图像
    read_image (Image, 'E:/《机器视觉案例》/案例原图/第七章/7-5.png')
    *获取图片图像
    get_image_size (Image, Width, Height)
    *打开适应图像大小的窗口
    dev_open_window (0, 0, Width, Height, 'black', WindowHandle)
    *显示图像
    dev_display (Image)
    *图像灰度化
    rgb1_to_gray (Image, GrayImage)
    *生成结构半径为5的圆形结构
    gen_disc_se (SE, 'byte', 21, 21, 0)
    *对图像进行顶帽运算处理
    gray_tophat (GrayImage, SE, ImageTopHat)
    *对图像进行底帽运算处理
    gray_bothat (GrayImage, SE, ImageBotHat)
```

### 边界提取实例
```c++
    *关闭窗口
    dev_close_window ()
    *获取图像
    read_image (Image76, 'E:/《机器视觉案例》/案例原图/第七章/7-6.png')
    *获取图像大小
    get_image_size (Image76, Width, Height)
    *打开适应图像大小的窗口
    dev_open_window (0, 0, Width, Height, 'black', WindowHandle)
    *显示图像
    dev_display (Image76)
    *将图像二值化
    threshold (Image76, Regions, 76, 255)
    *边界提取
    boundary (Regions, RegionBorder, 'inner')
```
### 孔洞填充实例
```c++
    *获取图像
    read_image (Aegyt1, 'egypt1')
    *将图像二值化
    threshold (Aegyt1, Region, 0, 140)
    *填充孔洞
    fill_up (Region, RegionFillUp)
```

### 骨架提取实例
```c++
    read_image (Image, 'fabrik')
    dev_close_window ()
    get_image_size (Image, Width, Height)
    dev_open_window (0, 0, Width, Height, 'black', WindowID)
    dev_display (Image)
    *边缘检测
    edges_image (Image, ImaAmp, ImaDir, 'lanser2', 0.5, 'nms', 8, 16)
    *阈值分割
    threshold (ImaAmp, Region, 8, 255)
    *提取骨架
    skeleton (Region, Skeleton)
```

## 第八章 图像模板匹配

![wechat](./Screenshot2025-07-15at22-46-20.png)

### 基于像素灰度值的模板匹配
```c++
    read_image (Image, 'smd/smd_on_chip_05')
    get_image_size (Image, Width, Height)
    dev_close_window ()
    dev_open_window (0, 0, Width, Height, 'black', WindowHandle)
    set_display_font (WindowHandle, 16, 'mono', 'true', 'false')
    dev_set_color ('green')
    dev_set_draw ('margin')
    gen_rectangle1 (Rectangle, 175, 156, 440, 460)
    area_center (Rectangle, Area, RowRef, ColumnRef)
    reduce_domain (Image, Rectangle, ImageReduced)
    create_ncc_model (ImageReduced, 'auto', 0, 0, 'auto', 'use_polarity', ModelID)
    dev_display (Image)
    dev_display (Rectangle)
    disp_continue_message (WindowHandle, 'black', 'true')
    for J := 1 to 11 by 1
        read_image (Image, 'smd/smd_on_chip_' + J$'02')
        find_ncc_model (Image, ModelID, 0, 0, 0.5, 1, 0.5, 'true', 0, Row, Column, Angle, Score)
        vector_angle_to_rigid (RowRef, ColumnRef, 0, Row, Column, 0, HomMat2D)
        affine_trans_region (Rectangle, RegionAffineTrans, HomMat2D, 'nearest_neighbor')
        dev_display (Image)
        dev_display (RegionAffineTrans)
        if (J < 11)
            disp_continue_message (WindowHandle, 'black', 'true')
        endif
        stop ()
    endfor
    clear_ncc_model (ModelID)
```

### 基于形状的模板匹配
```c++
    *读取图像
    read_image (Image, 'green-dot')
    get_image_size (Image, Width, Height)
    dev_close_window ()
    dev_open_window (0, 0, Width, Height, 'black', WindowHandle)
    dev_set_color ('red')
    dev_set_line_width (5)
    dev_display (Image)
    *提取模板
    threshold (Image, Region, 0, 128)
    connection (Region, ConnectedRegions)
    select_shape (ConnectedRegions, SelectedRegions, 'area', 'and', 10000, 20000)
    fill_up (SelectedRegions, RegionFillUp)
    dilation_circle (RegionFillUp, RegionDilation, 5.5)
    reduce_domain (Image, RegionDilation, ImageReduced)
    *创建模版
    create_scaled_shape_model (ImageReduced, 5, rad(-45), rad(90), 'auto', 0.8, 1.0, 'auto', 'none', 'ignore_global_polarity', 40, 10, ModelID)
    *提取模版轮廓
    get_shape_model_contours (Model, ModelID, 1)
    *显示模板轮廓到模版位置
    area_center (RegionFillUp, Area, RowRef, ColumnRef)
    vector_angle_to_rigid (0, 0, 0, RowRef, ColumnRef, 0, HomMat2D)
    affine_trans_contour_xld (Model, ModelTrans, HomMat2D)
    dev_display (Image)
    dev_display (ModelTrans)
    *读取目标图片
    read_image (ImageSearch, 'green-dots')
    dev_display (ImageSearch)
    *匹配模版
    find_scaled_shape_model (ImageSearch, ModelID, rad(-45), rad(90), 0.8, 1.0, 0.5, 0, 0.5, 'least_squares', 5, 0.8, Row, Column, Angle, Scale, Score)
    *循环显示匹配出来的模版区域轮廓
    for I := 0 to |Score| - 1 by 1
        hom_mat2d_identity (HomMat2DIdentity)
        hom_mat2d_translate (HomMat2DIdentity, Row[I], Column[I], HomMat2DTranslate)
        hom_mat2d_rotate (HomMat2DTranslate, Angle[I], Row[I], Column[I], HomMat2DRotate)
        hom_mat2d_scale (HomMat2DRotate, Scale[I], Scale[I], Row[I], Column[I], HomMat2DScale)
        affine_trans_contour_xld (Model, ModelTrans, HomMat2DScale)
        dev_display (ModelTrans)
    endfor
    *清除模版
    clear_shape_model (ModelID)
```
### 图像金字塔应用
```c++
    *使用采集助手读取图像
    open_framegrabber ('File', 1, 1, 0, 0, 0, 0, 'default', -1, 'default', -1, 'default', 'rings/rings.seq', 'default', -1, 1, FGHandle)
    grab_image (ModelImage, FGHandle)
    get_image_pointer1 (ModelImage, Pointer, Type, Width, Height)
    dev_close_window ()
    dev_open_window (0, 0, Width, Height, 'white', WindowHandle)
    dev_display (ModelImage)
    * 设置显示条件
    dev_set_color ('red')
    dev_set_draw ('margin')
    dev_set_line_width (5)
    *生成模版的圆形区域并截取模版
    gen_circle (ModelROI, 251, 196, 103)
    reduce_domain (ModelImage, ModelROI, ImageROI)
    *创建基于金字塔层数的模型表示
    inspect_shape_model (ImageROI, ShapeModelImage, ShapeModelRegion, 5, 30)
    dev_display (ShapeModelRegion)
    *创建基于形状的模版
    create_shape_model (ImageROI, 'auto', 0, rad(360), 'auto', 'none', 'use_polarity', 30, 10, ModelID)
    get_shape_model_contours (ShapeModel, ModelID, 1)
    *循环识别目标图像
    for i := 1 to 7 by 1
        *读取图像
        grab_image (SearchImage, FGHandle)
        dev_display (SearchImage)
        *匹配模版
        find_shape_model (SearchImage, ModelID, 0, rad(360), 0.6, 0, 0.55, 'least_squares', 0, 0.8, RowCheck, ColumnCheck, AngleCheck, Score)
        *显示匹配结果
        for j := 0 to |Score| - 1 by 1
            vector_angle_to_rigid (0, 0, 0, RowCheck[j], ColumnCheck[j], AngleCheck[j], MovementOfObject)
            affine_trans_contour_xld (ShapeModel, ModelAtNewPosition, MovementOfObject)
            dev_set_color ('blue')
            dev_display (ModelAtNewPosition)
            dev_set_color ('red')
            affine_trans_pixel (MovementOfObject, -120, 0, RowArrowHead, ColumnArrowHead)
            disp_arrow (WindowHandle, RowCheck[j], ColumnCheck[j], RowArrowHead, ColumnArrowHead, 2)
        endfor
    endfor
    *清除模版和关闭采集助手
    clear_shape_model (ModelID)
    close_framegrabber (FGHandle)
```

## 第九章 3D立体视觉


![wechat](./Screenshot2025-07-15at22-49-57.png)


## 第十章 HALCON相关实例和算法

![wechat](./Screenshot2025-07-15at22-51-49.png)

### 卡号识别系统案例
```c++
    dev_clear_window ()

    read_image (Image1, '9-3_0.bmp')
    read_image (Image2, '9-1_1.bmp')

    get_image_size (Image1, Width, Height)
    dev_close_window ()
    dev_open_window (0, 0, Width, Height, 'black', WindowHandle)

    dev_display (Image1)
    gen_rectangle1 (ROI_1, 13.5, 106.232, 61.5, 355.273)
    reduce_domain (Image1, ROI_1, ImageReduced1)
    area_center (ROI_1, Area1, Row1, Column1)

    dev_display (Image2)
    gen_rectangle1 (ROI_2, 403.5, 133.5, 547.5, 188.5)
    reduce_domain (Image2, ROI_2, ImageReduced2)
    area_center (ROI_2, Area2, Row2, Column2)

    create_shape_model (ImageReduced1, 'auto', 0, rad(360), 'auto', 'auto', 'use_polarity', 'auto', 'auto', ModelID1)
    create_shape_model (ImageReduced2, 'auto', 0, rad(360), 'auto', 'auto', 'use_polarity', 'auto', 'auto', ModelID2)

    ImageFiles := []
    ImageFiles[0] := '9-1_1.bmp'
    ImageFiles[1] := '9-3_0.bmp'
    for Index := 0 to |ImageFiles| - 1 by 1
        read_image (Image, ImageFiles[Index])
        find_shape_model (Image, ModelID1, 0, rad(360), 0.5, 1, 0.5, 'least_squares', 0, 0.9, Row11, Column11, Angle11, Score1)
        find_shape_model (Image, ModelID2, 0, rad(360), 0.5, 1, 0.5, 'least_squares', 0, 0.9, Row21, Column21, Angle21, Score2)
        if(|Score1|==1)
            vector_angle_to_rigid (Row11, Column11, Angle11, Row1, Column1, rad(0), HomMat2D)
            affine_trans_image (Image, ImageAffinTrans1, HomMat2D, 'constant', 'false')
            dev_display (ImageAffinTrans1)
            rgb1_to_gray (ImageAffinTrans1, GrayImage1)
            threshold (GrayImage1, Regions1, 9, 70)
            connection (Regions1, ConnectedRegions1)
            select_shape (ConnectedRegions1, SelectedRegions1, ['area','row','column'], 'and', [81.66,234.92,66.58], [207.29,255.03,483.67])
            union1 (SelectedRegions1, RegionUnion1)
            shape_trans (RegionUnion1, RegionTrans1, 'rectangle1')
            orientation_region (RegionTrans1, Phi1)
            area_center (RegionTrans1, Area12, Row12, Column12)
            vector_angle_to_rigid (Row12, Column12, Phi1, Row12, Column12, rad(0), HomMat2D2)
            reduce_domain (GrayImage1, RegionTrans1, ImageReduced1)
            rgb1_to_gray (ImageReduced1, GrayImage2)
            threshold (GrayImage2, Regions2, 11, 104)
            connection (Regions2, ConnectedRegions1)
            sort_region (ConnectedRegions1, SortedRegions1, 'character', 'true', 'column')
            read_ocr_class_mlp ('Industrial_0-9_NoRej.omc', OCRHandle1)
            do_ocr_multi_class_mlp (SortedRegions1, GrayImage2, OCRHandle1, Class1, Confidence1)
            disp_message (WindowHandle, Class1, 'window', 0, 0, 'black', 'true')
        endif
        if(|Score2|==1)
            vector_angle_to_rigid (Row21, Column21, Angle21, Row2, Column2,rad(0), HomMat2D3)
            affine_trans_image (Image, ImageAffinTrans2, HomMat2D3, 'constant', 'false')
            dev_display (ImageAffinTrans2)
            gen_rectangle1 (ROI_0, 449.5, 186.5, 467.5, 354.5)
            reduce_domain (ImageAffinTrans2, ROI_0, ImageReduced3)
            rgb1_to_gray (ImageReduced3, GrayImage3)
            threshold (GrayImage3, Regions3, 10, 57)
            connection (Regions3, ConnectedRegions2)
            partition_dynamic (ConnectedRegions2, Partitioned, 7, 0)
            select_shape (ConnectedRegions2, SelectedRegions2, 'column', 'and', 184.76, 201.69)
            select_shape (Partitioned, SelectedRegions3, 'column', 'and', 201.69, 343.13)
            select_shape (Partitioned, SelectedRegions4, 'column', 'and', 344.12, 356.08)
            sort_region (SelectedRegions3, SortedRegions2, 'character', 'true', 'column')
            read_ocr_class_mlp ('Industrial_A-Z+_NoRej.omc', OCRHandle2)
            read_ocr_class_mlp ('Industrial_0-9_NoRej.omc', OCRHandle3)
            read_ocr_class_mlp ('Industrial_0-9A-Z_NoRej.omc', OCRHandle4)
            do_ocr_multi_class_mlp (SelectedRegions2, GrayImage3, OCRHandle2, Class2, Confidence5)
            do_ocr_multi_class_mlp (SortedRegions2, GrayImage3, OCRHandle3, Class3, Confidence6)
            do_ocr_multi_class_mlp (SelectedRegions4, GrayImage3, OCRHandle4, Class4, Confidence7)
            disp_message (WindowHandle, [Class2,Class3,Class4], 'window', 0, 0, 'black', 'true')
        endif
    endfor

```