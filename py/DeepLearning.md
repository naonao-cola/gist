﻿## 目录

### pytorch


### pytorch常用代码

#### 一.读取数据read_data,Dataset类实战
``` python
from torch.utils.data import Dataset, DataLoader  # 导入 PyTorch 中的 Dataset 和 DataLoader，用于数据集处理
from PIL import Image  # 导入 PIL 库，用于图像处理
import os  # 导入 os 库，用于文件和目录操作


# ========== 1. 自定义数据集类 ==========
class mydata(Dataset):

    # 自定义数据集类，继承自 PyTorch 的 Dataset 类
    # 用于加载和处理指定路径下的图像数据集，并返回图像与标签


    def __init__(self, root_dir, label_dir):

        # 初始化数据集类，设置根目录和标签目录
        # 参数：
        # - root_dir (str): 数据集的根目录，包含所有子文件夹
        # - label_dir (str): 标签目录，存放对应类别的图像文件

        self.root_dir = root_dir  # 根目录（例如：`Dataset/train`）
        self.label_dir = label_dir  # 标签目录（例如：`ants` 或 `bees`）
        self.path = os.path.join(self.root_dir, self.label_dir)  # 拼接得到完整路径
        self.img_path = os.listdir(self.path)  # 获取该目录下的所有图像文件名列表

   def __getitem__(self, index):

        # 根据索引加载图像和标签
        #
        # 参数：
        # - index (int): 当前样本的索引值
        #
        # 返回：
        # - img (PIL Image): 加载的图像对象
        # - label (str): 对应的标签（即文件夹名）

        img_name = self.img_path[index]  # 获取对应索引的图像文件名
        img_item_path = os.path.join(self.root_dir, self.label_dir, img_name)  # 拼接得到图像的完整路径
        img = Image.open(img_item_path)  # 使用 PIL 打开图像文件
        label = self.label_dir  # 标签就是文件夹名（例如：`ants` 或 `bees`）
        return img, label  # 返回图像和标签

    def __len__(self):
        """
        返回数据集中的样本数量

        返回：
        - (int): 数据集中的样本数
        """
        return len(self.img_path)  # 返回图像文件的数量

# ========== 2. 实例化数据集并加载数据 ==========
root_dir = "Dataset/train"  # 数据集根目录
label_dir = "ants"  # 标签目录（例如：`ants` 文件夹）
ants_dataset = mydata(root_dir, label_dir)  # 创建 ants 数据集对象

# 示例：可以查看第一个样本的图像和标签
# img, label = ants_dataset[0]  # 获取第一个样本
# img.show()  # 显示该图像

# 处理另一个标签目录（例如：`bees`）
bees_label_dir = "bees"  # 标签目录（例如：`bees` 文件夹）
bees_dataset = mydata(root_dir, bees_label_dir)  # 创建 bees 数据集对象

# 示例：可以查看第一个 `bees` 数据集的图像和标签
# img, label = bees_dataset[0]
# img.show()

# ========== 3. 合并两个数据集（ants 和 bees） ==========
# 注意：直接加两个数据集会报错，因为 PyTorch 的 `Dataset` 不能直接用 `+` 运算符
# 正确的做法是：分别读取两个数据集后，可以使用 `DataLoader` 或 `torch.utils.data.ConcatDataset` 合并
# from torch.utils.data import ConcatDataset
# # 合并 ants_dataset 和 bees_dataset
# train_data = ConcatDataset([ants_dataset, bees_dataset])



# train_data = ants_dataset + bees_dataset  # 直接加两个数据集会报错
# ========== 4. 查看数据集的长度 ==========
# print(len(train_data))  # 打印合并数据集的大小，当前做法会报错，需要处理合并逻辑

```

#### 二.Tensorboard图像可视化
``` python
from torch.utils.tensorboard import SummaryWriter  # 导入 PyTorch 中的 TensorBoard 工具，用于可视化训练过程
import numpy as np  # 进行数组运算
from PIL import Image  # 导入 PIL 库，用于图像处理

# ========== 1. 初始化 SummaryWriter ==========
writer = SummaryWriter("logs")  # 创建 SummaryWriter 实例，用于将日志写入 'logs' 文件夹

# ========== 2. 加载图像并转换格式 ==========
img_path = "train/ants_image/0013035.jpg"  # 图像文件路径
img_PIL = Image.open(img_path)  # 使用 PIL 打开图像文件
img_array = np.array(img_PIL)  # 将图像从 PIL 格式转换为 NumPy 数组

# ========== 3. 将图像写入 TensorBoard ==========
writer.add_image("test", img_array, 10, dataformats="HWC")
# 'test'：在 TensorBoard 中的标签，用于标识该图像
# img_array：NumPy 数组格式的图像数据
# 10：当前图像记录的迭代次数（可以视为步骤）
# dataformats="HWC"：指定数据格式，H 表示高度（height），W 表示宽度（width），C 表示通道数（channels）

# ========== 4. 添加标量数据 ==========
for i in range(100):  # 生成并写入标量数据
    writer.add_scalar("y=2x", 3 * i, i)
    # 'y=2x'：图表名称（用于标识）
    # 3 * i：标量的值（y=2x）
    # i：当前步骤（x值）

# ========== 5. 关闭 writer ==========
writer.close()  # 训练结束后，关闭 SummaryWriter，确保所有数据写入

```

#### 三.Transforms图像类型转换以及常用的transforms

``` python
from torchvision import transforms  # 导入 torchvision 库中的 transforms 模块，用于数据转换
from PIL import Image  # 导入 PIL 库，用于图像处理
from torch.utils.tensorboard import SummaryWriter  # 导入 TensorBoard，用于可视化

# 从 'test_tb.py' 中导入已经初始化的 writer
from test_tb import writer

# ========== 1. 加载图像 ==========
img_path = "train/ants_image/0013035.jpg"  # 图像文件路径
img = Image.open(img_path)  # 使用 PIL 打开图像文件

# ========== 2. 转换图像为 Tensor ==========
writer = SummaryWriter("logs")  # 创建 SummaryWriter 实例，日志会存储在 'logs' 文件夹
tensor_train = transforms.ToTensor()  # 定义转换为 Tensor 的操作
img_tensor = tensor_train(img)  # 将图像从 PIL 格式转换为 Tensor 格式

# ========== 3. 将图像数据写入 TensorBoard ==========
writer.add_image("Tensor_img", img_tensor)
# 'Tensor_img'：在 TensorBoard 中的标签，用于标识该图像
# img_tensor：已经转换成 Tensor 格式的图像数据
# 默认情况下，`add_image` 将图像的通道数（Channels）作为第一维，像素值作为第二、三维（Height, Width）

# ========== 4. 关闭 writer ==========
writer.close()  # 训练结束后，关闭 SummaryWriter，确保所有数据写入

```
```python
from PIL import Image  # 导入 PIL 库，用于图像处理
from torchvision import transforms  # 导入 torchvision.transforms 模块，用于图像转换
from torch.utils.tensorboard import SummaryWriter  # 导入 TensorBoard，用于可视化

# ========== 1. 创建 SummaryWriter 实例 ==========
writer = SummaryWriter("logs")  # 创建 SummaryWriter 实例，用于将日志数据写入 'logs' 文件夹

# ========== 2. 加载图像 ==========
img = Image.open("images/pytorch.png")  # 使用 PIL 打开图像文件

# ========== 3. 图像转为 Tensor ==========
trans_totensor = transforms.ToTensor()  # 定义转换为 Tensor 的操作
img_tensor = trans_totensor(img)  # 将 PIL 图像转换为 Tensor 格式
writer.add_image("Tensor_img", img_tensor)  # 将转换后的图像添加到 TensorBoard

# ========== 4. 打印 Tensor 图像中的某个值 ==========
print(img_tensor[0][0][0])  # 打印图像 Tensor 在 [0,0] 位置的值（通道值）

# ========== 5. 图像归一化 ==========
trans_norm = transforms.Normalize([0.5, 0.5, 0.5, 0.5], [0.5, 0.5, 0.5, 0.5])
# 定义 Normalize 转换，归一化每个通道，均值和标准差都为 [0.5, 0.5, 0.5, 0.5]

img_norm = trans_norm(img_tensor)  # 对图像 Tensor 进行归一化处理
print(img_norm[0][0][0])  # 打印归一化后图像 Tensor 中某个值

writer.add_image("Normalize", img_norm)  # 将归一化后的图像添加到 TensorBoard

# ========== 6. 图像调整大小 ==========
print(img.size)  # 打印原图像的大小

trans_resize = transforms.Resize((512, 512))  # 定义 Resize 转换，调整图像为 512x512
img_resize = trans_resize(img)  # 对图像进行调整大小处理
img_resize = trans_totensor(img_resize)  # 将调整大小后的图像转换为 Tensor 格式

writer.add_image("Resize", img_resize, 0)  # 将调整大小后的图像添加到 TensorBoard
print(img_resize)  # 打印调整大小后的图像 Tensor

# ========== 7. 使用 Compose 组合多个转换 ==========
trans_resize_2 = transforms.Resize(512)  # 只调整图像的长边为 512
# PIL -> PIL -> Tensor
trans_compose = transforms.Compose([trans_resize_2, trans_totensor])  # 组合 Resize 和 ToTensor
img_resize_2 = trans_compose(img)  # 对图像应用组合转换

writer.add_image("Resize2", img_resize_2, 1)  # 将第二次调整大小后的图像添加到 TensorBoard

# ========== 8. 随机裁剪：RandomCrop ==========
trans_random = transforms.RandomCrop((500, 1000))  # 定义随机裁剪操作，裁剪为 500x1000 大小
trans_compose_2 = transforms.Compose([trans_random, trans_totensor])  # 组合随机裁剪和转换为 Tensor

for i in range(10):  # 执行 10 次随机裁剪
    img_crop = trans_compose_2(img)  # 对图像进行随机裁剪
    writer.add_image("RandomCrop", img_crop, i)  # 将裁剪后的图像添加到 TensorBoard

# ========== 9. 关闭 writer ==========
writer.close()  # 关闭 SummaryWriter，确保所有数据写入

```

#### 四.torchvision数据集的使用(dataset_transforms)
```python
from torch.utils.tensorboard import SummaryWriter  # 导入 TensorBoard 工具，用于训练过程的可视化
import torchvision.transforms

# ========== 1. 数据预处理（Transforms） ==========
dataset_transforms = torchvision.transforms.Compose([
    torchvision.transforms.ToTensor()  # 将图像转换为 Tensor 格式
])

# ========== 2. 加载 CIFAR10 数据集 ==========
# train_set: 训练集，test_set: 测试集
train_set = torchvision.datasets.CIFAR10(root="./dataset", transform=dataset_transforms, train=True, download=True)
test_set = torchvision.datasets.CIFAR10(root="./dataset", transform=dataset_transforms, train=False, download=True)

# ========== 3. 显示测试集的部分信息（注释掉的） ==========
# print(test_set[0])  # 打印数据集的第一个样本（图片及标签）
# print(test_set.classes)  # 打印所有的类别名称（0-9）

# ========== 4. 查看某个图像和目标（标签） ==========
# img, targets = test_set[0]  # 获取测试集的第一个样本
# print(img, targets)  # 打印图像和标签
# print(test_set.classes[targets])  # 打印标签对应的类别名称
# img.show()  # 显示图像

# ========== 5. 创建 SummaryWriter 实例 ==========
writer = SummaryWriter("p10")  # 用于将图像和标量数据写入 TensorBoard

# ========== 6. 将训练集图像添加到 TensorBoard ==========
for i in range(10):  # 获取训练集的前 10 张图像
    img, target = train_set[i]  # 获取第 i 个样本（图像和标签）
    writer.add_image("test_set", img, i)  # 将图像添加到 TensorBoard，标签为 "test_set"

# ========== 7. 关闭 SummaryWriter ==========
writer.close()  # 关闭 SummaryWriter，确保所有数据写入

```

#### 五.DataLoader的使用(dataloader)
```python
import torchvision  # 导入 torchvision，用于加载数据集
from torch.utils.data import DataLoader  # 导入 DataLoader，用于批量加载数据
from torch.utils.tensorboard import SummaryWriter  # 导入 TensorBoard 进行数据可视化

# 从 dataset_transforms.py 导入数据转换方法和 writer
from dataset_transforms import dataset_transforms, writer

# ========== 1. 加载测试数据集 ==========
test_data = torchvision.datasets.CIFAR10(root="./dataset", train=False, transform=torchvision.transforms.ToTensor())
# CIFAR-10 是一个 10 类图像分类数据集
# `root="./dataset"`：数据存储位置
# `train=False`：加载测试集（如果为 True，则加载训练集）
# `transform=torchvision.transforms.ToTensor()`：将 PIL 图像转换为 Tensor 格式（自动归一化到 [0,1]）

# ========== 2. 使用 DataLoader 进行批量加载 ==========
test_loader = DataLoader(test_data, batch_size=64, shuffle=True, num_workers=0, drop_last=False)
# `batch_size=64`：每个批次 64 张图片
# `shuffle=True`：每次迭代时打乱数据，避免模型学到数据顺序
# `num_workers=0`：数据加载的线程数，0 表示使用主线程
# `drop_last=False`：如果数据集大小不是 batch_size 的整数倍，是否丢弃最后一个批次（这里保留）

# ========== 3. 查看单张图片信息 ==========
img, target = test_data[0]  # 获取测试集的第一张图片及其标签
print(img.shape)  # 打印图像的 Tensor 形状，例如 (3, 32, 32) 表示 3 通道（RGB），32x32 像素
print(target)  # 打印该图像的类别索引（0~9）

# ========== 4. 创建 TensorBoard 记录器 ==========
writer = SummaryWriter("dataloader")  # 创建 SummaryWriter 实例，日志数据存储在 'dataloader' 文件夹

# ========== 5. 遍历 DataLoader 并写入 TensorBoard ==========
step = 0  # 记录步数
for data in test_loader:  # 遍历 DataLoader
    imgs, targets = data  # 获取当前批次的图片和标签

    # 将批量图像写入 TensorBoard
    writer.add_images("test_data", imgs, step)

    step += 1  # 记录当前步数

# ========== 6. 关闭 writer ==========
writer.close()  # 确保数据写入并关闭 writer

```

#### 六.神经网络的基本骨架(nn_module)
```python
import torchvision  # 导入 torchvision，用于加载数据集
from torch.utils.data import DataLoader  # 导入 DataLoader，用于批量加载数据
from torch.utils.tensorboard import SummaryWriter  # 导入 TensorBoard 进行数据可视化

# 从 dataset_transforms.py 导入数据转换方法和 writer
from dataset_transforms import dataset_transforms, writer

# ========== 1. 加载测试数据集 ==========
test_data = torchvision.datasets.CIFAR10(root="./dataset", train=False, transform=torchvision.transforms.ToTensor())
# CIFAR-10 是一个 10 类图像分类数据集
# `root="./dataset"`：数据存储位置
# `train=False`：加载测试集（如果为 True，则加载训练集）
# `transform=torchvision.transforms.ToTensor()`：将 PIL 图像转换为 Tensor 格式（自动归一化到 [0,1]）

# ========== 2. 使用 DataLoader 进行批量加载 ==========
test_loader = DataLoader(test_data, batch_size=64, shuffle=True, num_workers=0, drop_last=False)
# `batch_size=64`：每个批次 64 张图片
# `shuffle=True`：每次迭代时打乱数据，避免模型学到数据顺序
# `num_workers=0`：数据加载的线程数，0 表示使用主线程
# `drop_last=False`：如果数据集大小不是 batch_size 的整数倍，是否丢弃最后一个批次（这里保留）

# ========== 3. 查看单张图片信息 ==========
img, target = test_data[0]  # 获取测试集的第一张图片及其标签
print(img.shape)  # 打印图像的 Tensor 形状，例如 (3, 32, 32) 表示 3 通道（RGB），32x32 像素
print(target)  # 打印该图像的类别索引（0~9）

# ========== 4. 创建 TensorBoard 记录器 ==========
writer = SummaryWriter("dataloader")  # 创建 SummaryWriter 实例，日志数据存储在 'dataloader' 文件夹

# ========== 5. 遍历 DataLoader 并写入 TensorBoard ==========
step = 0  # 记录步数
for data in test_loader:  # 遍历 DataLoader
    imgs, targets = data  # 获取当前批次的图片和标签

    # 将批量图像写入 TensorBoard
    writer.add_images("test_data", imgs, step)

    step += 1  # 记录当前步数

# ========== 6. 关闭 writer ==========
writer.close()  # 确保数据写入并关闭 writer

```

#### 七.卷积神经网络(nn_conv）
```python
import torch  # 导入 PyTorch
import torch.nn.functional as F  # 从 PyTorch 导入函数式 API，用于神经网络操作

# ========== 1. 定义输入张量和卷积核 ==========
input = torch.tensor([[1, 2, 0, 3, 1],
                      [0, 1, 2, 3, 1],
                      [1, 2, 1, 0, 0],
                      [5, 2, 3, 1, 1],
                      [2, 1, 0, 1, 1]])  # 输入图像，5x5 矩阵

kernel = torch.tensor([[1, 2, 1],
                       [0, 1, 0],
                       [2, 1, 0]])  # 卷积核，3x3 矩阵

# ========== 2. 变换输入张量和卷积核的形状 ==========
input = torch.reshape(input, (1, 1, 5, 5))  # 转换为 4D 张量：batch_size x channels x height x width
kernel = torch.reshape(kernel, (1, 1, 3, 3))  # 转换为 4D 张量：out_channels x in_channels x kernel_height x kernel_width

# 输出形状查看
print(input.shape)  # 查看输入的形状：torch.Size([1, 1, 5, 5])
print(kernel.shape)  # 查看卷积核的形状：torch.Size([1, 1, 3, 3])

# ========== 3. 执行卷积操作（stride=1） ==========
output = F.conv2d(input, kernel, stride=1)  # 进行 2D 卷积操作，步长为 1
print(output)  # 输出卷积结果

# ========== 4. 执行卷积操作（stride=2） ==========
output = F.conv2d(input, kernel, stride=2)  # 进行 2D 卷积操作，步长为 2
print(output)  # 输出卷积结果

# ========== 5. 执行卷积操作（stride=1，padding=1） ==========
output = F.conv2d(input, kernel, stride=1, padding=1)  # 进行 2D 卷积操作，步长为 1，填充为 1
print(output)  # 输出卷积结果


```

#### 八.常规卷积层的写法(nn_conv2d)
```python
import torch  # 导入 PyTorch
import torchvision  # 导入 torchvision，用于图像数据集和转换
from torch import nn  # 导入 nn 模块，用于定义神经网络层
from torch.utils.tensorboard import SummaryWriter  # 导入 TensorBoard，用于可视化
from torchvision import datasets, transforms  # 导入数据集和转换工具
from torch.utils.data import DataLoader  # 导入 DataLoader，用于加载数据集

# ========== 1. 加载 CIFAR10 数据集 ==========
dataset = torchvision.datasets.CIFAR10(root='./data', train=False, download=True,
                                       transform=torchvision.transforms.ToTensor())
# CIFAR10 数据集：`train=False` 表示加载测试集，`transform=ToTensor()` 将图片转为 Tensor 格式。

# ========== 2. 创建 DataLoader ==========
dataloader = DataLoader(dataset, batch_size=64, shuffle=True)


# `batch_size=64`：每次加载 64 张图片，`shuffle=True`：每个 epoch 随机打乱数据

# ========== 3. 定义简单的卷积神经网络 ==========
class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()  # 调用父类构造函数
        self.conv1 = nn.Conv2d(in_channels=3, out_channels=6, kernel_size=3, stride=1, padding=0)
        # 卷积层：输入 3 个通道（RGB），输出 6 个通道，卷积核大小 3x3，步长 1，填充 0

    def forward(self, x):
        x = self.conv1(x)  # 通过卷积层进行前向传播
        return x  # 返回卷积后的输出

# ========== 4. 实例化模型 ==========
net = Net()  # 创建一个 Net 类的实例

# ========== 5. 创建 TensorBoard writer ==========
writer = SummaryWriter("./logs")  # 创建 TensorBoard 记录器，将日志数据存储在 "./logs" 文件夹中

step = 0  # 初始化步数
# ========== 6. 遍历 DataLoader 进行前向传播 ==========
for data in dataloader:
    imgs, targets = data  # 获取当前批次的图像和标签
    output = net(imgs)  # 将图像传入网络进行前向传播
    print(imgs.shape)  # 打印输入图像的形状，形状应为 torch.Size([64, 3, 32, 32])
    print(output.shape)  # 打印输出的形状，形状应为 torch.Size([64, 6, 30, 30])

    # ========== 7. 将输入图像和输出图像写入 TensorBoard ==========
    writer.add_images("input", imgs, step)  # 将输入图像写入 TensorBoard
    output = torch.reshape(output, (-1, 3, 30, 30))  # 将输出张量重新形状为 3 通道（模拟 RGB 图像）
    writer.add_images("output", output, step)  # 将输出图像写入 TensorBoard

    step += 1  # 增加步数

# ========== 8. 关闭 TensorBoard writer ==========
writer.close()  # 关闭 TensorBoard writer，确保数据被写入

```

#### 九.神经网络的池化层(maxpool)
```python
import torch  # 导入 PyTorch
import torchvision  # 导入 torchvision，用于加载数据集
from torch import nn  # 导入 nn（神经网络模块）
from torch.utils.data import DataLoader  # 导入 DataLoader，用于加载数据
from torch.utils.tensorboard import SummaryWriter  # 导入 TensorBoard，用于可视化

# ========== 1. 原始输入数据（已注释） ==========
# input = torch.tensor([[1, 2, 0, 3, 1],
#                       [0, 1, 2, 3, 1],
#                       [1, 2, 1, 0, 0],
#                       [5, 2, 3, 1, 1],
#                       [2, 1, 0, 1, 1]])

# ========== 2. 加载 CIFAR10 数据集 ==========
dataset = torchvision.datasets.CIFAR10(root='./data', train=False, download=True,
                                       transform=torchvision.transforms.ToTensor())
# CIFAR10 数据集：
# `train=False` 表示加载测试集，`transform=ToTensor()` 将图片转换为 Tensor 格式（归一化到 [0,1]）

# ========== 3. 创建 DataLoader ==========
dataloader = DataLoader(dataset, batch_size=64, shuffle=True)
# `batch_size=64`：每次加载 64 张图片
# `shuffle=True`：每个 epoch 结束后打乱数据，提高泛化能力

# ========== 4. 变换输入数据格式（已注释） ==========
# input = torch.reshape(input, (-1, 1, 5, 5))
# 这里 `-1` 表示 PyTorch 自动计算 batch_size，转换为 4D 张量：batch_size x channels x height x width

# ========== 5. 定义最大池化（MaxPooling）神经网络 ==========
class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()  # 调用父类构造函数
        self.maxpool1 = nn.MaxPool2d(kernel_size=3, ceil_mode=True)
        # `kernel_size=3`：最大池化窗口大小为 3x3
        # `ceil_mode=True`：使用 `ceil` 方式计算输出尺寸，防止丢失部分边界数据

    def forward(self, input):
        output = self.maxpool1(input)  # 通过最大池化层进行前向传播
        return output  # 返回池化后的输出

# ========== 6. 实例化网络 ==========
net = Net()

# ========== 7. 原始的池化测试（已注释） ==========
# output = net(input)
# print(output)

# ========== 8. 创建 TensorBoard writer ==========
writer = SummaryWriter("logs_maxpool")  # 记录 TensorBoard 数据，保存在 `logs_maxpool` 文件夹中

step = 0  # 初始化步数

# ========== 9. 遍历 DataLoader 进行池化处理 ==========
for data in dataloader:
    imgs, targets = data  # 获取当前批次的图像和标签
    writer.add_images("input", imgs, step)  # 记录原始输入图像
    output = net(imgs)  # 通过最大池化层进行前向传播
    writer.add_images("output", output, step)  # 记录池化后的图像
    step += 1  # 递增步数

# ========== 10. 关闭 TensorBoard writer ==========
writer.close()  # 确保数据被写入并关闭 writer
```

#### 十.神经网络的激活函数应用（非线性激活）
```python
import torch  # 导入 PyTorch
import torchvision  # 导入 torchvision 处理数据集
from torch import nn  # 导入 nn 模块（用于定义神经网络）
from torch.utils.data import Dataset, DataLoader  # 用于数据加载
from torch.utils.tensorboard import SummaryWriter  # 导入 TensorBoard 进行可视化

from test_tb import writer  # 从 test_tb.py 导入 writer（假设 test_tb.py 里已经初始化 writer）

# ========== 1. 定义原始输入数据（已注释） ==========
# input = torch.tensor([[1,-0.5],
#                       [-1,3]])
#
# input = torch.reshape(input, (-1, 1, 2, 2))  # 调整形状，使其符合 CNN 输入格式

# ========== 2. 加载 CIFAR10 数据集 ==========
dataset = torchvision.datasets.CIFAR10(root='./data', download=True,
                                       transform=torchvision.transforms.ToTensor(),
                                       train=False)
# CIFAR10 数据集：
# `train=False` 表示加载测试集
# `transform=ToTensor()` 将图像转换为 PyTorch Tensor 格式，并归一化到 [0,1]

# ========== 3. 创建 DataLoader ==========
dataload = DataLoader(dataset, batch_size=64, shuffle=True)
# `batch_size=64`：每次加载 64 张图片
# `shuffle=True`：每个 epoch 结束后打乱数据，提高泛化能力

# ========== 4. 定义神经网络 ==========
class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()  # 调用父类构造函数
        self.relu = nn.ReLU()  # ReLU 激活函数
        self.sigmoid = nn.Sigmoid()  # Sigmoid 激活函数
        self.softmax = nn.Softmax(dim=1)  # Softmax 激活函数（按 `dim=1` 进行计算）

    def forward(self, input):
        # output = self.relu(input)  # ReLU 激活函数（已注释）
        output = self.sigmoid(input)  # 这里使用 Sigmoid 激活函数
        return output  # 返回激活后的输出

# ========== 5. 实例化网络 ==========
net = Net()

# ========== 6. 原始前向传播测试（已注释） ==========
# output = net(input)
# print(output)

# ========== 7. 创建 TensorBoard writer ==========
writer = SummaryWriter("logs_relu")  # 创建日志记录器，数据存储在 `logs_relu` 文件夹

step = 0  # 初始化步数

# ========== 8. 遍历 DataLoader 进行激活函数测试 ==========
for data in dataload:
    imgs, targets = data  # 获取当前批次的图像和标签
    writer.add_images("inputs", imgs, step)  # 记录原始输入图像

    output = net(imgs)  # 通过神经网络前向传播，应用 Sigmoid 激活函数
    writer.add_images("output", output, step)  # 记录激活后的输出图像

    step += 1  # 递增步数

# ========== 9. 关闭 TensorBoard writer ==========
writer.close()  # 确保数据被写入并关闭 writer

```

#### 十一.线性层和其他层
```python
import torch  # 导入 PyTorch
import torchvision  # 导入 torchvision 处理数据集
from torch import nn  # 导入 nn 模块（用于定义神经网络）
from torch.utils.data import DataLoader  # 用于数据加载

# ========== 1. 加载 CIFAR10 数据集 ==========
dataset = torchvision.datasets.CIFAR10(root='./data', train=False,
                                       transform=torchvision.transforms.ToTensor(),
                                       download=True)
# CIFAR10 数据集：
# `train=False` 表示加载测试集
# `transform=ToTensor()` 将图像转换为 PyTorch Tensor 格式，并归一化到 [0,1]

# ========== 2. 创建 DataLoader ==========
dataloader = DataLoader(dataset, batch_size=64)


# `batch_size=64`：每次加载 64 张图片
# 这里 **未使用 shuffle=True**，数据按原顺序读取

# ========== 3. 定义神经网络 ==========
class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()  # 调用父类构造函数
        self.linear1 = nn.Linear(3 * 32 * 32, 10)
        # `Linear(in_features=3*32*32, out_features=10)`：
        #  - 输入：`3*32*32`（CIFAR-10 图片是 3 通道（RGB）32x32）
        #  - 输出：10（CIFAR-10 共有 10 个类别）

    def forward(self, input):
        input = torch.flatten(input, start_dim=1)  # 维度变换
        output = self.linear1(input)  # 通过全连接层
        return output  # 返回输出


# ========== 4. 实例化网络 ==========
net = Net()  # 创建模型实例

# ========== 5. 遍历 DataLoader 进行前向传播 ==========
for data in dataloader:
    imgs, targets = data  # 获取当前批次的图像和标签

    # output = torch.reshape(imgs,(1,1,1,-1))
    output = torch.flatten(imgs,start_dim=1)
    # `torch.flatten()`：展平输入，使其适应全连接层输入格式
    # `start_dim=1` 让批次的维度保持不变

    output = net(imgs)

    print(output.shape)  # 预期输出: `torch.Size([64, 10])`

```

#### 十二.完整CNN的搭建和Sequential函数的应用
```python
import torch  # 导入 PyTorch
from torch.nn import Flatten, MaxPool2d, Linear, Conv2d  # 直接导入所需模块
from torch import nn  # 导入 nn 模块（用于构建神经网络）
from torch.utils.tensorboard import SummaryWriter  # 用于可视化网络结构

# ========== 1. 定义 CNN 网络 ==========
class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()  # 调用父类构造函数

        # ========== 1.1. 逐层定义 CNN 结构（已注释） ==========
        # self.conv1 = nn.Conv2d(3, 32, 5, padding=2)  # 第一层卷积，输入 3 通道，输出 32 通道，5x5 卷积核，padding=2
        # self.maxpool1 = nn.MaxPool2d(2)  # 2x2 最大池化
        # self.conv2 = nn.Conv2d(32, 32, 5, padding=2)  # 第二层卷积
        # self.maxpool2 = nn.MaxPool2d(2)
        # self.conv3 = nn.Conv2d(32, 64, 5, padding=2)  # 第三层卷积
        # self.maxpool3 = nn.MaxPool2d(2)
        # self.flatten = Flatten()  # 展平层，将多维数据变成 1D
        # self.linear1 = nn.Linear(1024, 64)  # 全连接层，输入 1024，输出 64
        # self.linear2 = nn.Linear(64, 10)  # 最终输出 10 维，代表 10 个分类

        # ========== 1.2. 使用 nn.Sequential() 替代手动定义 ==========
        self.model1 = nn.Sequential(
            Conv2d(3, 32, 5, padding=2),  # 第 1 层卷积
            MaxPool2d(2),  # 第 1 层池化
            Conv2d(32, 32, 5, padding=2),  # 第 2 层卷积
            MaxPool2d(2),  # 第 2 层池化
            Conv2d(32, 64, 5, padding=2),  # 第 3 层卷积
            MaxPool2d(2),  # 第 3 层池化
            Flatten(),  # 展平层，将 3D 数据转换为 1D
            Linear(1024, 64),  # 全连接层 1
            Linear(64, 10)  # 全连接层 2（最终分类）
        )

    def forward(self, input):
        # ========== 2.1. 逐层执行 CNN 计算（已注释） ==========
        # input = self.conv1(input)
        # input = self.maxpool1(input)
        # input = self.conv2(input)
        # input = self.maxpool2(input)
        # input = self.conv3(input)
        # input = self.maxpool3(input)
        # input = self.flatten(input)
        # input = self.linear1(input)
        # input = self.linear2(input)

        # ========== 2.2. 直接使用 nn.Sequential() 计算 ==========
        input = self.model1(input)  # 直接调用 `self.model1`
        return input  # 返回最终输出

# ========== 3. 实例化模型 ==========
net = Net()
print(net)

# ========== 4. 创建一个模拟输入，并进行前向传播 ==========
input = torch.ones((64, 3, 32, 32))  # 64 张 RGB 彩色图片（3 通道，32x32 大小）
output = net(input)
print(output.shape)  # 预期输出：torch.Size([64, 10])，表示 64 张图片的 10 分类结果

# ========== 5. 可视化神经网络结构 ==========
writer = SummaryWriter("logs_seq")  # 记录 TensorBoard 数据，存储在 `logs_seq` 目录
writer.add_graph(net, input)  # 记录模型结构,将 net 结构可视化，可以在 TensorBoard 里查看 CNN 计算流程
writer.close()  # 关闭 writer



#####################################################
# nn.Sequential() VS 逐层定义
# 在 CNN 里，我们通常手动定义每一层，例如：
# self.conv1 = nn.Conv2d(3, 32, 5, padding=2)
# self.maxpool1 = nn.MaxPool2d(2)
# ...
# 然后在 forward() 里手动调用：
# input = self.conv1(input)
# input = self.maxpool1(input)
#
# 但这样写太冗长，可以用 nn.Sequential() 自动执行前向传播：
# self.model1 = nn.Sequential(
#     nn.Conv2d(3, 32, 5, padding=2),
#     nn.MaxPool2d(2),
#     nn.Conv2d(32, 32, 5, padding=2),
#     nn.MaxPool2d(2),
#     nn.Conv2d(32, 64, 5, padding=2),
#     nn.MaxPool2d(2),
#     nn.Flatten(),
#     nn.Linear(1024, 64),
#     nn.Linear(64, 10)
# )
# 然后在 forward() 里直接调用：
# input = self.model1(input)
# 这样代码更简洁，不需要手动写 forward() 里每一层的调用！


```
#### 十三.损失函数和反向传播
```python
import torch  # 导入 PyTorch
import torchvision  # 导入 torchvision，用于加载数据集
from torch.nn import Flatten, MaxPool2d, Linear, Conv2d  # 导入必要的神经网络层
from torch import nn  # 导入 PyTorch 的 `nn` 模块（神经网络构建）

# ========== 1. 加载 CIFAR-10 数据集 ==========
dataset = torchvision.datasets.CIFAR10(
    root='./data', train=False, transform=torchvision.transforms.ToTensor(), download=True
)
# `root='./data'`：数据存放目录
# `train=False`：加载测试集
# `transform=torchvision.transforms.ToTensor()`：转换为张量格式
# `download=True`：若数据集不存在，则自动下载

# ========== 2. 创建数据加载器 ==========
dataloader = torch.utils.data.DataLoader(dataset, batch_size=1, shuffle=True)
# `batch_size=1`：一次取 1 张图片
# `shuffle=True`：打乱数据，提高泛化能力

# ========== 3. 定义 CNN 模型 ==========
class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()
        self.model1 = nn.Sequential(
            Conv2d(3, 32, 5, padding=2),  # 卷积层 1（输入通道 3，输出通道 32，卷积核大小 5x5，padding=2）
            MaxPool2d(2),  # 池化层 1（池化核大小 2x2）
            Conv2d(32, 32, 5, padding=2),  # 卷积层 2（输入通道 32，输出 32，卷积核 5x5）
            MaxPool2d(2),  # 池化层 2
            Conv2d(32, 64, 5, padding=2),  # 卷积层 3（输入通道 32，输出 64，卷积核 5x5）
            MaxPool2d(2),  # 池化层 3
            Flatten(),  # 展平层，将 3D 数据转换为 1D
            Linear(1024, 64),  # 全连接层 1（输入 1024，输出 64）
            Linear(64, 10)  # 全连接层 2（输入 64，输出 10，最终分类）
        )

    def forward(self, input):
        """
        前向传播，执行 CNN 计算流程
        """
        input = self.model1(input)
        return input

# ========== 4. 定义损失函数 ==========
loss = nn.CrossEntropyLoss()
# `CrossEntropyLoss` 交叉熵损失，适用于分类任务（内部包含 softmax 计算）

# ========== 5. 实例化网络 ==========
net = Net()

# ========== 6. 训练流程（只执行 1 个 batch 进行测试） ==========
for data in dataloader:
    imgs, targets = data  # `imgs` 是输入图片，`targets` 是真实标签
    outputs = net(imgs)  # 前向传播，计算网络输出

    ans_loss = loss(outputs, targets)  # 计算损失
    print(ans_loss)  # 打印损失值

    ans_loss.backward()  # 反向传播，计算梯度
    print("OK")  # 训练完成

```
#### 十四.神经网络的优化（常见优化器）

```python
import torch  # 导入 PyTorch
import torchvision  # 导入 torchvision，用于加载数据集
from torch.nn import Flatten, MaxPool2d, Linear, Conv2d  # 导入必要的神经网络层
from torch import nn  # 导入 PyTorch 的 `nn` 模块（神经网络构建）

# ========== 1. 加载 CIFAR-10 数据集 ==========
dataset = torchvision.datasets.CIFAR10(
    root='./data', train=False, transform=torchvision.transforms.ToTensor(), download=True
)
# `root='./data'`：数据存放目录
# `train=False`：加载测试集
# `transform=torchvision.transforms.ToTensor()`：转换为张量格式
# `download=True`：若数据集不存在，则自动下载

# ========== 2. 创建数据加载器 ==========
dataloader = torch.utils.data.DataLoader(dataset, batch_size=1, shuffle=True)
# `batch_size=1`：一次取 1 张图片
# `shuffle=True`：打乱数据，提高泛化能力

# ========== 3. 定义 CNN 模型 ==========
class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()
        self.model1 = nn.Sequential(
            Conv2d(3, 32, 5, padding=2),  # 卷积层 1（输入通道 3，输出通道 32，卷积核大小 5x5，padding=2）
            MaxPool2d(2),  # 池化层 1（池化核大小 2x2）
            Conv2d(32, 32, 5, padding=2),  # 卷积层 2（输入通道 32，输出 32，卷积核 5x5）
            MaxPool2d(2),  # 池化层 2
            Conv2d(32, 64, 5, padding=2),  # 卷积层 3（输入通道 32，输出 64，卷积核 5x5）
            MaxPool2d(2),  # 池化层 3
            Flatten(),  # 展平层，将 3D 数据转换为 1D
            Linear(1024, 64),  # 全连接层 1（输入 1024，输出 64）
            Linear(64, 10)  # 全连接层 2（输入 64，输出 10，最终分类）
        )

    def forward(self, input):
        """
        前向传播，执行 CNN 计算流程
        """
        input = self.model1(input)
        return input

# ========== 4. 定义损失函数 ==========
loss = nn.CrossEntropyLoss()
# `CrossEntropyLoss` 交叉熵损失，适用于分类任务（内部包含 softmax 计算）
# ========== 5. 实例化网络 ==========
net = Net()

# ========== 6. 定义优化器 ==========
optim = torch.optim.SGD(net.parameters(), lr=0.01)
# `SGD`：随机梯度下降法
# `lr=0.01`：学习率 0.01

# ========== 7. 训练流程 ==========
for epoch in range(20):  # 训练 20 轮
    running_loss = 0.0  # 记录损失
    for data in dataloader:  # 遍历数据集
        imgs, targets = data  # `imgs` 是输入图片，`targets` 是真实标签
        outputs = net(imgs)  # 前向传播，计算网络输出

        ans_loss = loss(outputs, targets)  # 计算损失
        optim.zero_grad()  # 清空梯度
        ans_loss.backward()  # 反向传播，计算梯度
        optim.step()  # 更新权重

        running_loss += ans_loss.item()  # 累加损失值
    print(f"Epoch [{epoch+1}/20], Loss: {running_loss:.4f}")  # 打印损失值

```

#### 十五.常见神经网络模型的使用和修改
```python
import torchvision.datasets  # 导入 torchvision 的数据集模块
import torchvision.models  # 导入 torchvision 的模型库
from torch import nn  # 导入 PyTorch 的神经网络模块

# ========== 1. 加载 VGG16 预训练模型 ==========
VGG16_false = torchvision.models.vgg16(pretrained=False)  # 不加载预训练权重（随机初始化参数）
VGG16_true = torchvision.models.vgg16(pretrained=True)  # 加载预训练权重（使用 ImageNet 训练的参数）

# ========== 2. 加载 CIFAR-10 数据集 ==========
train_data = torchvision.datasets.CIFAR10(
    root='./data', train=True, download=True, transform=torchvision.transforms.ToTensor()
)
# `root='./data'`：数据存放路径
# `train=True`：加载训练集
# `download=True`：若数据不存在，则自动下载
# `transform=torchvision.transforms.ToTensor()`：转换为张量格式，方便输入 PyTorch 模型

# ========== 3. 修改 VGG16 预训练模型（VGG16_true） ==========
# 方式 1：使用 `add_module()` 添加新层（错误做法，仅能用于 `Sequential`）
# VGG16_true.add_module('add_linear',nn.Linear(1000,10))  # ❌ 这里会导致错误

# 方式 2：正确修改 `classifier`，添加一个新的全连接层
VGG16_true.classifier.add_module('add_linear', nn.Linear(1000, 10))  # ✅ 正确
print(VGG16_true)  # 查看 VGG16 的结构，确保层已被修改

# ========== 4. 修改未预训练的 VGG16（VGG16_false） ==========
# 方式 1（错误）：使用 `add_module()` 在 `Sequential` 里的指定层（❌）
# VGG16_false.classifier[6].add_module('add_linear', nn.Linear(4096,10))  # ❌ 这行会报错

# 方式 2（正确）：**直接替换最后一层**
VGG16_false.classifier[6] = nn.Linear(4096, 10)  # ✅ 正确，直接替换第 7 层（索引 6）
print(VGG16_false)  # 查看 VGG16 的结构，确保层已被修改

```

#### 十六.神经网络模型的保存和读取
```python

import torch  # 导入 PyTorch
import torchvision  # 导入 torchvision
from torch import nn  # 导入 `nn` 模块（构建神经网络）

# ========== 1. 加载 VGG16 预训练模型 ==========
VGG16 = torchvision.models.vgg16(pretrained=False)  # `pretrained=False` 只加载 VGG16 结构，不加载权重

# ========== 2. 保存方式 1：完整保存（模型结构 + 参数） ==========
torch.save(VGG16, "VGG16_method1.pth")
# ✅ `torch.save(model, path)` **保存完整模型**，包含：
# - 模型结构
# - 模型参数
# - 训练状态（如果有）
#   **缺点**：只能在 **相同环境（Python 版本 + PyTorch 版本）**下加载！

# ========== 3. 保存方式 2：仅保存模型参数（推荐！） ==========
torch.save(VGG16.state_dict(), "VGG16_method2.pth")
# ✅ `torch.save(model.state_dict(), path)` **官方推荐**：
# - 只保存模型参数（不保存结构）
# - **跨环境兼容性更好**
# - 适用于 **迁移学习、模型共享**
#   **缺点**：加载时需要**手动定义模型结构**。

# ========== 4. “陷阱” 示例：自定义模型 Net ==========
class Net(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = nn.Conv2d(in_channels=3, out_channels=64, kernel_size=3)

    def forward(self, x):
        x = self.conv1(x)
        return x

# ========== 5. 初始化自定义模型 & 保存 ==========
net = Net()
torch.save(net, "net_method1.pth")  #   这里可能会导致 “陷阱”！
```

#### 十七.完整神经网络的训练流程
```python
import torchvision  # 导入 torchvision，用于加载数据集
from torch.utils.tensorboard import SummaryWriter  # 导入 TensorBoard，用于可视化训练过程

from model import *  # 从 model.py 文件中导入模型（这里是自定义模型 Net）

# ========== 1. 准备训练集 ==========
train_data = torchvision.datasets.CIFAR10(
    root='./data',  # 数据保存目录
    train=True,  # 选择训练集
    download=True,  # 如果数据集不存在，自动下载
    transform=torchvision.transforms.ToTensor()  # 转换数据为 Tensor 格式，方便训练
)

# ========== 2. 准备测试集 ==========
test_data = torchvision.datasets.CIFAR10(
    root='./data',  # 数据保存目录
    train=False,  # 选择测试集
    download=True,  # 如果数据集不存在，自动下载
    transform=torchvision.transforms.ToTensor()  # 转换数据为 Tensor 格式，方便评估
)

# ========== 3. 训练集和测试集长度 ==========
train_data_size = len(train_data)  # 获取训练集长度
test_data_size = len(test_data)  # 获取测试集长度

# 输出训练集和测试集的长度
print(f"训练集的长度{train_data_size}\n" + f"测试集的长度{test_data_size}\n")

# ========== 4. 使用 DataLoader 加载数据 ==========
train_dataloader = torch.utils.data.DataLoader(train_data, batch_size=64, shuffle=True)
# 使用 DataLoader 加载训练数据，`batch_size=64` 表示每批次训练 64 张图，`shuffle=True` 表示打乱数据

test_dataloader = torch.utils.data.DataLoader(test_data, batch_size=64, shuffle=True)
# 使用 DataLoader 加载测试数据，`batch_size=64` 表示每批次测试 64 张图，`shuffle=True` 表示打乱数据

# ========== 5. 创建网络模型 ==========
net = Net()  # 实例化自定义模型 `Net`

# ========== 6. 设置损失函数 ==========
loss_fn = nn.CrossEntropyLoss()  # 使用交叉熵损失函数，适用于多分类任务

# ========== 7. 设置优化器 ==========
learning_rate = 0.01  # 设置学习率
optimizer = torch.optim.SGD(net.parameters(), lr=learning_rate)  # 使用随机梯度下降优化器（SGD）

# ========== 8. 设置训练过程的参数 ==========
total_train_step = 0  # 记录训练的步数（批次）
total_test_step = 0  # 记录测试的步数
epoch = 10  # 设置训练的轮数为 10

# ========== 9. TensorBoard 记录训练过程 ==========
writer = SummaryWriter("logs_train")  # 使用 TensorBoard 记录训练过程，日志保存路径为 "logs_train"

# ========== 10. 开始训练和测试 ==========
for i in range(epoch):  # 迭代训练 10 轮
    print(f"----------第{i + 1}轮训练开始")

    # 训练步骤开始
    net.train()  # 将模型设置为训练模式（启用 Dropout 和 BatchNorm）
    for data in train_dataloader:  # 迭代训练数据
        imgs, targets = data  # 获取输入图像和目标标签
        outputs = net(imgs)  # 前向传播，得到模型输出
        loss = loss_fn(outputs, targets)  # 计算损失

        optimizer.zero_grad()  # 清空梯度缓存
        loss.backward()  # 反向传播，计算梯度
        optimizer.step()  # 更新模型参数
        total_train_step += 1  # 记录训练步数

        if total_train_step % 100 == 0:  # 每 100 次训练打印一次损失
            print(f"训练次数{total_train_step}, loss:{loss.item()}")  # `loss.item()` 提取标量值
            writer.add_scalar("train_loss", loss.item(), total_train_step)  # 将训练损失添加到 TensorBoard

    # ========== 11. 测试步骤（验证） ==========
    net.eval()  # 将模型设置为评估模式（禁用 Dropout 和 BatchNorm）
    total_test_loss = 0  # 初始化测试损失
    tot_accuracy = 0  # 初始化正确预测的总数

    with torch.no_grad():  # 禁用梯度计算，节省内存
        for data in test_dataloader:  # 遍历测试数据
            imgs, targets = data  # 获取测试图像和标签
            outputs = net(imgs)  # 前向传播，得到模型输出
            loss = loss_fn(outputs, targets)  # 计算损失
            total_test_loss += loss.item()  # 累加测试损失
            accuracy = (outputs.argmax(1) == targets).sum()  # 计算当前批次的准确度
            tot_accuracy += accuracy.item()  # 累加总的准确数

    # 输出测试结果
    print(f"整体测试集的Loss:{total_test_loss}")
    print(f"整体测试集的正确率Accuracy:{tot_accuracy / test_data_size}")

    # 将测试损失和测试准确度记录到 TensorBoard
    writer.add_scalar("test_accuracy", tot_accuracy / test_data_size, total_test_step)
    writer.add_scalar("test_loss", total_test_loss, total_test_step)
    total_test_step += 1  # 记录测试步数

    # ========== 12. 保存模型 ==========
    torch.save(net, f"net_{i}.pth")  # 保存整个模型
    # torch.save(net.state_dict(), f"net_{i}.pth")  # 可选：仅保存模型参数（更推荐）
    print("模型已保存")

# 关闭 TensorBoard 记录器
writer.close()
```

#### 十八.利用GPU训练神经网络
```python
import time
import torchvision  # 导入 torchvision，用于加载数据集
from torch.utils.tensorboard import SummaryWriter  # 导入 TensorBoard，用于可视化训练过程
import torch
from torch import nn

# ========== 1. 准备训练集 ===========
train_data = torchvision.datasets.CIFAR10(
    root='./data',  # 数据保存目录
    train=True,  # 选择训练集
    download=True,  # 如果数据集不存在，自动下载
    transform=torchvision.transforms.ToTensor()  # 转换数据为 Tensor 格式，方便训练
)

# ========== 2. 准备测试集 ===========
test_data = torchvision.datasets.CIFAR10(
    root='./data',  # 数据保存目录
    train=False,  # 选择测试集
    download=True,  # 如果数据集不存在，自动下载
    transform=torchvision.transforms.ToTensor()  # 转换数据为 Tensor 格式，方便评估
)

# ========== 3. 训练集和测试集长度 ===========
train_data_size = len(train_data)  # 获取训练集长度
test_data_size = len(test_data)  # 获取测试集长度

# 输出训练集和测试集的长度
print(f"训练集的长度{train_data_size}\n" + f"测试集的长度{test_data_size}\n")

# ========== 4. 使用 DataLoader 加载数据 ===========
train_dataloader = torch.utils.data.DataLoader(train_data, batch_size=16, shuffle=True)
test_dataloader = torch.utils.data.DataLoader(test_data, batch_size=16, shuffle=True)

# ========== 5. 创建网络模型 ===========
class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()
        self.model = nn.Sequential(
            nn.Conv2d(in_channels=3, out_channels=32, kernel_size=5, stride=1, padding=2),
            nn.MaxPool2d(2),
            nn.Conv2d(in_channels=32, out_channels=32, kernel_size=5, stride=1, padding=2),
            nn.MaxPool2d(2),
            nn.Conv2d(in_channels=32, out_channels=64, kernel_size=5, stride=1, padding=2),
            nn.MaxPool2d(2),
            nn.Flatten(),
            nn.Linear(in_features=4 * 4 * 64, out_features=64),
            nn.Linear(in_features=64, out_features=10)
        )

    def forward(self, x):
        return self.model(x)

# 实例化自定义模型 Net
net = Net()
if torch.cuda.is_available():
    net.cuda()

# ========== 6. 设置损失函数 ===========
loss_fn = nn.CrossEntropyLoss()  # 使用交叉熵损失函数，适用于多分类任务
if torch.cuda.is_available():
    loss_fn = loss_fn.cuda()

# ========== 7. 设置优化器 ===========
learning_rate = 0.01  # 设置学习率
optimizer = torch.optim.SGD(net.parameters(), lr=learning_rate)  # 使用随机梯度下降优化器（SGD）

# ========== 8. 设置训练过程的参数 ===========
total_train_step = 0  # 记录训练的步数（批次）
total_test_step = 0  # 记录测试的步数
epoch = 10  # 设置训练的轮数为 10

# ========== 9. TensorBoard 记录训练过程 ===========
writer = SummaryWriter("logs_train")  # 使用 TensorBoard 记录训练过程，日志保存路径为 "logs_train"
start_time = time.time()

# ========== 10. 开始训练和测试 ===========
for i in range(epoch):  # 迭代训练 10 轮
    print(f"----------第{i + 1}轮训练开始")

    # 训练步骤开始
    net.train()  # 将模型设置为训练模式（启用 Dropout 和 BatchNorm）
    for data in train_dataloader:  # 迭代训练数据
        imgs, targets = data  # 获取输入图像和目标标签
        if torch.cuda.is_available():
            imgs = imgs.cuda()  # 将输入数据移到 GPU
            targets = targets.cuda()  # 将目标标签移到 GPU
        outputs = net(imgs)  # 前向传播，得到模型输出
        loss = loss_fn(outputs, targets)  # 计算损失

        optimizer.zero_grad()  # 清空梯度缓存
        loss.backward()  # 反向传播，计算梯度
        optimizer.step()  # 更新模型参数
        total_train_step += 1  # 记录训练步数

        if total_train_step % 100 == 0:  # 每 100 次训练打印一次损失
            end_time = time.time()
            print(end_time - start_time)
            print(f"训练次数{total_train_step}, loss:{loss.item()}")  # loss.item() 提取标量值
            writer.add_scalar("train_loss", loss.item(), total_train_step)  # 将训练损失添加到 TensorBoard
            torch.cuda.empty_cache()

    # ========== 11. 测试步骤（验证） ==========
    net.eval()  # 将模型设置为评估模式（禁用 Dropout 和 BatchNorm）
    total_test_loss = 0  # 初始化测试损失
    tot_accuracy = 0  # 初始化正确预测的总数

    with torch.no_grad():  # 禁用梯度计算，节省内存
        for data in test_dataloader:  # 遍历测试数据
            imgs, targets = data  # 获取测试图像和标签
            if torch.cuda.is_available():
                imgs = imgs.cuda()  # 将输入数据移到 GPU
                targets = targets.cuda()  # 将目标标签移到 GPU
            outputs = net(imgs)  # 前向传播，得到模型输出
            loss = loss_fn(outputs, targets)  # 计算损失
            total_test_loss += loss.item()  # 累加测试损失
            accuracy = (outputs.argmax(1) == targets).sum()  # 计算当前批次的准确度
            tot_accuracy += accuracy.item()  # 累加总的准确数

    # 输出测试结果
    print(f"整体测试集的Loss:{total_test_loss}")
    print(f"整体测试集的正确率Accuracy:{tot_accuracy / test_data_size}")

    # 将测试损失和测试准确度记录到 TensorBoard
    writer.add_scalar("test_accuracy", tot_accuracy / test_data_size, total_test_step)
    writer.add_scalar("test_loss", total_test_loss, total_test_step)
    total_test_step += 1  # 记录测试步数

    # ========== 12. 保存模型 ==========
    torch.save(net, f"net_{i}.pth")  # 保存整个模型
    print("模型已保存")

# 关闭 TensorBoard 记录器
writer.close()
```
```python
import time
import torchvision  # 导入 torchvision，用于加载数据集
from torch.utils.tensorboard import SummaryWriter  # 导入 TensorBoard，用于可视化训练过程
import torch
from torch import nn

#定义训练设备
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
# ========== 1. 准备训练集 ===========
train_data = torchvision.datasets.CIFAR10(
    root='./data',  # 数据保存目录
    train=True,  # 选择训练集
    download=True,  # 如果数据集不存在，自动下载
    transform=torchvision.transforms.ToTensor()  # 转换数据为 Tensor 格式，方便训练
)

# ========== 2. 准备测试集 ===========
test_data = torchvision.datasets.CIFAR10(
    root='./data',  # 数据保存目录
    train=False,  # 选择测试集
    download=True,  # 如果数据集不存在，自动下载
    transform=torchvision.transforms.ToTensor()  # 转换数据为 Tensor 格式，方便评估
)

# ========== 3. 训练集和测试集长度 ===========
train_data_size = len(train_data)  # 获取训练集长度
test_data_size = len(test_data)  # 获取测试集长度
# 输出训练集和测试集的长度
print(f"训练集的长度{train_data_size}\n" + f"测试集的长度{test_data_size}\n")

# ========== 4. 使用 DataLoader 加载数据 ===========
train_dataloader = torch.utils.data.DataLoader(train_data, batch_size=16, shuffle=True)
test_dataloader = torch.utils.data.DataLoader(test_data, batch_size=16, shuffle=True)

# ========== 5. 创建网络模型 ===========
class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()
        self.model = nn.Sequential(
            nn.Conv2d(in_channels=3, out_channels=32, kernel_size=5, stride=1, padding=2),
            nn.MaxPool2d(2),
            nn.Conv2d(in_channels=32, out_channels=32, kernel_size=5, stride=1, padding=2),
            nn.MaxPool2d(2),
            nn.Conv2d(in_channels=32, out_channels=64, kernel_size=5, stride=1, padding=2),
            nn.MaxPool2d(2),
            nn.Flatten(),
            nn.Linear(in_features=4 * 4 * 64, out_features=64),
            nn.Linear(in_features=64, out_features=10)
        )

    def forward(self, x):
        return self.model(x)

# 实例化自定义模型 Net
net = Net()
net = net.to(device)

# ========== 6. 设置损失函数 ===========
loss_fn = nn.CrossEntropyLoss()  # 使用交叉熵损失函数，适用于多分类任务
loss_fn = loss_fn.to(device)

# ========== 7. 设置优化器 ===========
learning_rate = 0.01  # 设置学习率
optimizer = torch.optim.SGD(net.parameters(), lr=learning_rate)  # 使用随机梯度下降优化器（SGD）

# ========== 8. 设置训练过程的参数 ===========
total_train_step = 0  # 记录训练的步数（批次）
total_test_step = 0  # 记录测试的步数
epoch = 10  # 设置训练的轮数为 10

# ========== 9. TensorBoard 记录训练过程 ===========
writer = SummaryWriter("logs_train")  # 使用 TensorBoard 记录训练过程，日志保存路径为 "logs_train"
start_time = time.time()

# ========== 10. 开始训练和测试 ===========
for i in range(epoch):  # 迭代训练 10 轮
    print(f"----------第{i + 1}轮训练开始")

    # 训练步骤开始
    net.train()  # 将模型设置为训练模式（启用 Dropout 和 BatchNorm）
    for data in train_dataloader:  # 迭代训练数据
        imgs, targets = data  # 获取输入图像和目标标签
        imgs = imgs.to(device)
        targets = targets.to(device)
        outputs = net(imgs)  # 前向传播，得到模型输出
        loss = loss_fn(outputs, targets)  # 计算损失

        optimizer.zero_grad()  # 清空梯度缓存
        loss.backward()  # 反向传播，计算梯度
        optimizer.step()  # 更新模型参数
        total_train_step += 1  # 记录训练步数

        if total_train_step % 100 == 0:  # 每 100 次训练打印一次损失
            end_time = time.time()
            print(end_time - start_time)
            print(f"训练次数{total_train_step}, loss:{loss.item()}")  # loss.item() 提取标量值
            writer.add_scalar("train_loss", loss.item(), total_train_step)  # 将训练损失添加到 TensorBoard
            torch.cuda.empty_cache()

    # ========== 11. 测试步骤（验证） ==========
    net.eval()  # 将模型设置为评估模式（禁用 Dropout 和 BatchNorm）
    total_test_loss = 0  # 初始化测试损失
    tot_accuracy = 0  # 初始化正确预测的总数

    with torch.no_grad():  # 禁用梯度计算，节省内存
        for data in test_dataloader:  # 遍历测试数据
            imgs, targets = data  # 获取测试图像和标签
            imgs = imgs.to(device)
            targets = targets.to(device)
            outputs = net(imgs)  # 前向传播，得到模型输出
            loss = loss_fn(outputs, targets)  # 计算损失
            total_test_loss += loss.item()  # 累加测试损失
            accuracy = (outputs.argmax(1) == targets).sum()  # 计算当前批次的准确度
            tot_accuracy += accuracy.item()  # 累加总的准确数

    # 输出测试结果
    print(f"整体测试集的Loss:{total_test_loss}")
    print(f"整体测试集的正确率Accuracy:{tot_accuracy / test_data_size}")

    # 将测试损失和测试准确度记录到 TensorBoard
    writer.add_scalar("test_accuracy", tot_accuracy / test_data_size, total_test_step)
    writer.add_scalar("test_loss", total_test_loss, total_test_step)
    total_test_step += 1  # 记录测试步数

    # ========== 12. 保存模型 ==========
    torch.save(net, f"net_{i}.pth")  # 保存整个模型
    print("模型已保存")

# 关闭 TensorBoard 记录器
writer.close()


```
#### 十九.神经网络的模型验证套路
```python
import torch
import torchvision
from PIL import Image
from torch import nn

# ========== 1. 打开并处理图片 ==========
img_path = "images/dogs.jpg"  # 图片路径
image = Image.open(img_path)  # 使用 PIL 打开图片
print(image)  # 打印图片信息

# 将图片转换为 RGB 格式
image = image.convert('RGB')

# ========== 2. 图像预处理 ==========
transform =  torchvision.transforms.Compose([
    torchvision.transforms.Resize((32, 32)),  # 调整图片尺寸为 32x32
    torchvision.transforms.ToTensor()  # 转换为 Tensor 格式，且自动归一化到 [0, 1]
])

image = transform(image)  # 应用预处理操作
print(image.shape)  # 打印 tensor 的形状，应该是 (3, 32, 32)

# ========== 3. 定义网络模型 ==========
class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()
        # 使用 nn.Sequential 定义模型的各层结构
        self.model = nn.Sequential(
            nn.Conv2d(in_channels=3, out_channels=32, kernel_size=5, stride=1, padding=2),  # 卷积层1
            nn.MaxPool2d(2),  # 最大池化层
            nn.Conv2d(in_channels=32, out_channels=32, kernel_size=5, stride=1, padding=2),  # 卷积层2
            nn.MaxPool2d(2),  # 最大池化层
            nn.Conv2d(in_channels=32, out_channels=64, kernel_size=5, stride=1, padding=2),  # 卷积层3
            nn.MaxPool2d(2),  # 最大池化层
            nn.Flatten(),  # 展平操作
            nn.Linear(in_features=4 * 4 * 64, out_features=64),  # 全连接层1
            nn.Linear(in_features=64, out_features=10)  # 全连接层2（输出层）
        )

    def forward(self, x):
        return self.model(x)  # 前向传播，返回模型的输出


# ========== 4. 加载模型 ==========
# 如果你已经保存了模型结构和权重
# 正确的做法是：加载模型时先定义模型结构再加载参数
# model = torch.load("net_0.pth")  # 错误！会因为找不到 `Net` 类而报错

# 现在我们手动加载模型的参数
model = Net()  # 重新定义模型
model = torch.load("net_0.pth",weights_only=False)  # 只加载模型参数
print(model)  # 打印模型结构

# ========== 5. 图片准备 ==========
# 调整图像的维度为 (1, 3, 32, 32)，这里 1 是批量大小（batch_size），3 是通道数（RGB），32 是图像大小
image = torch.reshape(image, (1, 3, 32, 32))

# ========== 6. 进行推理 ==========
model.eval()  # 将模型设置为评估模式，禁用 Dropout 和 BatchNorm（如果有的话）
with torch.no_grad():  # 禁用梯度计算，节省内存
    output = model(image)  # 获取模型输出

print(output)  # 打印模型输出的结果

# ========== 7. 输出类别 ==========
# `output.argmax(1)` 获取模型预测结果中概率最大的类别
print(output.argmax(1))  # 输出预测类别的索引
```

### ONNX
### onnxsubgraph

官方仓库

https://github.com/NVIDIA/TensorRT/tree/release/10.9/tools/onnx-graphsurgeon

用法笔记
https://github.com/naonao-cola/onnx_graphsurgeon_note

### 量化 剪枝 蒸馏

tensorrt 的量化工具箱

https://github.com/NVIDIA/TensorRT/tree/release/10.9/tools/pytorch-quantization

使用

https://blog.csdn.net/qq_40672115/article/details/134100268


tensort 模型调试和优化工具

https://github.com/NVIDIA/TensorRT/tree/release/10.9/tools/Polygraphy

使用

https://blog.csdn.net/yitiaoxiaolu/article/details/136413877


### 剪枝 蒸馏 在线文档

Awesome Compression

https://datawhalechina.github.io/awesome-compression/#/README

量化(Quantification)章节说明

https://datawhalechina.github.io/llm-deploy/#/


蒸馏工具

https://github.com/VainF/Torch-Pruning


### ppq

张志的示例使用

https://github.com/zhangkaifang/model_deployment


### ollama
ubuntu 加速下载
#https://cloud.tencent.com/developer/article/2503867
```bash
export OLLAMA_MIRROR="https://ghproxy.cn/https://github.com/ollama/ollama/releases/latest/download"
curl -fsSL https://ollama.com/install.sh | sed "s|https://ollama.com/download|$OLLAMA_MIRROR|g" | sh

## 后台运行
nohup ollama run <model_name> > ollama.log 2>&1 &


## Linux/macOS  修改端口
export OLLAMA_HOST="0.0.0.0:新端口（如 8080）"
ollama serve
```

## 大模型相关

大模型训练技术介绍

https://techdiylife.github.io/blog/blog.html?category1=c02&blogid=0005

Softmax与交叉熵损失的实现及求导

https://zhuanlan.zhihu.com/p/67759205


