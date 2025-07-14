## Python程序打包

```python
__all__ = ['__version__']
__version__ = "1.0.0"

```


```python
from .algo import algo_base, algo_pro
from .version import __version__
__all__ = [
    '__version__', 'algo_base', 'algo_pro'
]

```


```python
import os
import os.path as osp
import glob
import setuptools
from setuptools.extension import Extension
from Cython.Build import cythonize
from Cython.Distutils import build_ext
import sys
import shutil

def get_extensions():
    this_dir = osp.dirname(osp.abspath(__file__))
    build_dir = osp.join(this_dir, 'build')
    os.makedirs(build_dir, exist_ok=True)
    # copy tvdl to build/tvdl_py
    out_dir = osp.join(build_dir, 'src/algo_test')
    shutil.rmtree(out_dir, ignore_errors=True)
    shutil.copytree(osp.join(this_dir, "algo_test"), out_dir)
    # get py list
    py_list = glob.glob(osp.join(out_dir, '**', '*.py'), recursive=True)
    # py_list = [py for py in py_list if 'license_hook' not in py and '__pycache__' not in py]
    code_py_list = [py for py in py_list if '__init__' not in py]
    init_py_list = [py for py in py_list if '__init__' in py]
    # register_hook
    return code_py_list, init_py_list


BSO = False
for arg in sys.argv[:]:
    if 'BSO' in arg:
        BSO = True
        sys.argv.remove(arg)


exec(open('algo_test/version.py').read())


def get_packages():
    impl_list = glob.glob('./algo_test/**/impl', recursive=True)
    pkgs = ['algo_test'] + [p[2:].replace(osp.sep, '.') for p in impl_list]
    print('pkgs:', pkgs)
    return pkgs


def get_package_data():
    impl_list = glob.glob('./algo_test/**/impl', recursive=True)
    init_list = glob.glob('./algo_test/**/', recursive=True)
    print(f'@@ init_py_list: {init_list}')
    for p in init_list:
        print(p)
    models_list = glob.glob('./algo_test/**/models', recursive=True)
    pkg_data = {"algo_test": [osp.join(p[14:], '*.so') for p in impl_list] +
                [osp.join(p[14:], '*.pyd') for p in impl_list] +
                [osp.join(p[14:], '__init__.py') for p in init_list if '__pycache__' not in p] +
                [osp.join(p[14:], '*.dll') for p in impl_list] +
                [osp.join(p[14:], '*.pth') for p in models_list]
                }
    print('## pkg_data:', pkg_data)
    return pkg_data


if BSO:
    code_py_list, init_py_list = get_extensions()
    pkg_data = get_package_data()
    cython_ext_modules = cythonize(code_py_list,
                                   build_dir="build",
                                   compiler_directives={'language_level': 3})
    setuptools.setup(
        name="algo_test",
        version=__version__,
        author="Allen",
        author_email="allen@turingvision.com",
        description="dl module",
        cmdclass={'build_ext': build_ext},
        packages=get_packages(),
        package_data=pkg_data,
        ext_modules=cython_ext_modules,
        long_description="DeepLearning models.",
        long_description_content_type="text/markdown",
        url="",
        classifiers=[
            "Programming Language :: Python :: 3",
            "License :: OSI Approved :: MIT License",
            "Operating System :: OS Independent",
        ],
        zip_safe=False,
    )
else:
    setuptools.setup(
        name="algo_test",
        version=__version__,
        author="Allen",
        author_email="allen@turingvision.com",
        description="dl module",
        long_description="DeepLearning models.",
        long_description_content_type="text/markdown",
        url="",
        packages=setuptools.find_packages(),
        package_data=get_package_data(),
        classifiers=[
            "Programming Language :: Python :: 3",
            "License :: OSI Approved :: MIT License",
            "Operating System :: OS Independent",
        ],
        zip_safe=False,
    )

```

```bash
python setup.py bdist_wheel BSO
```

***

## 安装包

```bash
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple numpy
```

```bash
#设置全局pip清华源
pip3 install pip -U
pip3 config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
# 更新全部包，三方工具
pip3 install pip-review
pip-review --local --interactive
```

## python 库推荐

```bash
import pickle as pkl  # 序列化库
from pathlib2 import Path # 路径库
import importlib # 导包库
import hydra     # 配置库
import inspect   # 获取属性库
```

## 路径处理库pathlib

```python
from pathlib2 import Path
# 获取当前目录
# D:\IDEA\ipoad_ywk\test\demo_pathlib
current_path = Path.cwd()
# 获取Home目录
home_path = Path.home()

# 获取上级父目录
# D:\IDEA\ipoad_ywk\test
print(current_path.parent)
# 获取上上级父目录
# D:\IDEA\ipoad_ywk
print(current_path.parent.parent)
# 获取上上上级父目录
# D:\IDEA
print(current_path.parent.parent.parent)

# 文件名操作
# 返回目录中最后一个部分的扩展名
example_path = Path("D:\IDEA\ipoad_ywk\test\demo_pathlib\demo.txt")
print(example_path.suffix)  # .txt
# 返回目录中多个扩展名列表
example_paths = Path("D:\IDEA\ipoad_ywk\test\demo_pathlib\abc.tar.gz")
print(example_paths.suffixes)  # ['.tar', '.gz']


# 返回目录中最后一部分文件名，但不包含后缀
example_path = Path("D:\IDEA\ipoad_ywk\test\demo_pathlib\demo.txt")
print(example_path.stem)  # demo
# 返回目录中最后一部分文件名
example_path = Path(r'D:\IDEA\ipoad_ywk\test\demo_pathlib\demo.txt')
print(example_path.name)  # demo.txt


# 替换目录最后一部分的文件名并返回一个新的路径
new_path1 = example_path.with_name('def.txt')
print(new_path1)  # D:\IDEA\ipoad_ywk\test\demo_pathlib\def.txt
# 替换目录最后一部分的文件名并返回一个新的路径
new_path2 = example_path.with_suffix('.gif')
print(new_path2)  # D:\IDEA\ipoad_ywk\test\demo_pathlib\demo.gif



# 路径拼接分解
# 直接传进去一个完整字符串
example_path0 = Path(r'D:\IDEA\ipoad_ywk\test\demo_pathlib\demo.txt')
# D:\IDEA\ipoad_ywk\test\demo_pathlib\demo.txt <class 'pathlib2.WindowsPath'>
print(example_path0, type(example_path0))
# 直接传进一个完整字符串
example_path1 = Path('/Users/Anders/Documents/powershell-2.jpg')
# \Users\Anders\Documents\powershell-2.jpg <class 'pathlib2.WindowsPath'>
print(example_path1, type(example_path1))
# 也可以传进多个字符串
example_path2 = Path('/', 'Users', 'dongh', 'Documents', 'python_learn', 'pathlib_', 'file1.txt')
print(example_path2)  # \Users\dongh\Documents\python_learn\pathlib_\file1.txt
# 也可以利用Path.joinpath()
example_path3 = Path('/Users/Anders/Documents/').joinpath('python_learn')
print(example_path3)  # \Users\Anders\Documents\python_learn


# #利用 / 可以创建子路径
example_path4 = Path('/Users/Anders/Documents')
print(example_path4)  # \Users\Anders\Documents
example_path5 = example_path4 / 'python_learn/pic-2.jpg'
print(example_path5)  # \Users\Anders\Documents\python_learn\pic-2.jpg


# 遍历文件夹
example_path = Path(r"D:\IDEA\ipoad_ywk\test\demo_pathlib")
var = [path for path in example_path.iterdir()]
print(var)
p = Path(r'd:\test')
# WindowsPath('d:/test')
p.iterdir()                     # 相当于os.listdir
p.glob('*')                     # 相当于os.listdir, 但是可以添加匹配条件
p.rglob('*')                    # 相当于os.walk, 也可以添加匹配条件



example_path = Path('/Users/Anders/Documents/test1/test2/test3')
# 创建文件目录，在这个例子中因为本身不存在test1,test2,test3，由于parents为True，所以都会被创建出来。
example_path.mkdir(parents = True, exist_ok = True)
# 删除路径对象目录，如果要删除的文件夹内包含文件就会报错
example_path.rmdir()



example_path = Path('/Users/Anders/Documents/pic-2.jpg')
# 判断对象是否存在
print(example_path.exists())
# 输出如下：
# True

# 判断对象是否是目录
print(example_path.is_dir())
# 输出如下：
# False

# 判断对象是否是文件
print(example_path.is_file())
# 输出如下：
# True

# 原始文件名
file_name = "example.txt"
# 将文件名转化为Path对象
p = Path(file_name)
# 更改文件扩展名为csv
new_file_name = p.with_suffix(".csv")
# 修改文件名
p.rename(new_file_name)


#文件读写
p = Path('C:/Users/Administrator/Desktop/text.txt')
with p.open(encoding='utf-8') as f:
    print(f.readline())

#read_bytes()：以'rb'模式读取文件，并返回bytes类型数据
#write_bytes(data)： 以'wb'方式将数据写入文件
p = Path('C:/Users/Administrator/Desktop/text.txt')
p.write_bytes(b'Binary file contents')
# 20
p.read_bytes()
# b'Binary file contents'

#read_text(encoding=None, errors=None)： 以'r'方式读取路径对应文件，返回文本
#write_text(data, encoding=None, errors=None)：以'w'方式写入字符串到路径对应文件
p = Path('C:/Users/Administrator/Desktop/text.txt')
p.write_text('Text file contents')
# 18
p.read_text()
# 'Text file contents'

```

## json

```python
import os
import json

def convert_annotation(image_id):
    path_json = '../dataset/lego/Annotations/%s.json' % (image_id)
    path_txt = '../dataset/lego/labels/%s.txt' % (image_id)
    with open(path_json, 'r', encoding='utf-8') as path_json:
        jsonx = json.load(path_json)
        with open(path_txt, 'w+') as ftxt:
            shapes = jsonx['shapes']
            # 获取图片长和宽
            width = jsonx['imageWidth']
            height = jsonx['imageHeight']
            for shape in shapes:
               # 获取矩形框两个角点坐标
                x1 = shape['points'][0][0]
                y1 = shape['points'][0][1]
                x2 = shape['points'][1][0]
                y2 = shape['points'][1][1]

                cat = shape['label']

                cls_id = classes.index(cat)
                # 对结果进行归一化
                dw = 1. / width
                dh = 1. / height
                x = dw * (x1+x2)/2
                y = dh * (y1+y2)/2
                w = dw * abs(x2-x1)
                h = dh * abs(y2 - y1)
                yolo = f"{cls_id} {x} {y} {w} {h} \n"
                ftxt.writelines(yolo)
```

```python
# yolov8 的预测流程，并转化为labelme格式的json
def predict_yolo8(img_path, save_path):
    search_path = img_path + '/**/*.*'
    file_list = glob.glob(search_path, recursive=True)
    model = YOLO(Path(
        "/data/proj/www/repo/yolo8_test/build/sbg_il/out/weights/best.pt"), task="detect")
    results = model(file_list)  # return a list of Results objects
    for img_path in file_list:
        ret = model.predict(img_path)
        for item in ret:
            boxes = item.boxes
            print(boxes.cls)
            print(boxes.xyxy)
            # masks = item.masks
            # keypoints = item.keypoints
            # probs = item.probs
            im_array = item.plot(conf=False, line_width=1, font_size=1.5)
            im = Image.fromarray(im_array[..., ::-1])  # RGB PIL image
            im.save(save_path + Path(img_path).name)  # save image
            item.save_txt(save_path + Path(img_path).stem + ".txt")


def txt2json(txt_path, label_vec):
    search_path = txt_path + '*.txt'
    file_list = glob.glob(search_path, recursive=True)
    img_width = 4032
    img_height = 3024
    # 读取每一个文本文件
    for txt_item in file_list:
        lines = []
        with open(txt_item, 'r') as file:
            for line in file:
                lines.append(line.strip().split())
        transformed_annotation = {
            'version': '5.3.1',
            'flags': {},
            'shapes': [],
            'imagePath': Path(txt_item).stem + ".jpg",
            'imageData': None,
            'imageHeight': img_height,
            'imageWidth': img_width
        }
        # 处理文件
        for line_item in lines:
            print("current line: ", line_item)
            line_label = label_vec[int(line_item[0])]
            # 坐标是中心点左边
            dx = float(line_item[1])
            dy = float(line_item[2])
            dw = float(line_item[3])
            dh = float(line_item[4])
            x = dx * img_width
            y = dy * img_height
            w = dw * img_width
            h = dh * img_height
            x1 = x - w/2
            y1 = y - h/2
            x2 = x + w/2
            y2 = y + h/2
            transformed_shape = {
                'label': line_label,
                'points': [[float(x1), float(y1)], [float(x2), float(y2)]],
                'group_id': None,
                'description': '',
                'shape_type': 'rectangle',
                'flags': {}
            }
            transformed_annotation['shapes'].append(transformed_shape)
        output_annotation_path = Path(txt_item).with_suffix('.json')
        with open(output_annotation_path, 'w') as f:
            json.dump(transformed_annotation, f)
```
## xml
```python
import os
import xml.etree.ElementTree as ET
def convert_annotation(image_id):
    # 对应的通过year 找到相应的文件夹，并且打开相应image_id的xml文件，其对应bund文件
    in_file = open('../dataset/smoke_data/Annotations/%s.xml' % (image_id), encoding='utf-8')
    # 准备在对应的image_id 中写入对应的label，分别为
    # <object-class> <x> <y> <width> <height>
    out_file = open('../dataset/smoke_data/labels/%s.txt' % (image_id), 'w', encoding='utf-8')
    # 解析xml文件
    tree = ET.parse(in_file)
    # 获得对应的键值对
    root = tree.getroot()
    # 获得图片的尺寸大小
    size = root.find('size')
    # 如果xml内的标记为空，增加判断条件
    if size != None:
        # 获得宽
        w = int(size.find('width').text)
        # 获得高
        h = int(size.find('height').text)
        # 遍历目标obj
        for obj in root.iter('object'):
            # 获得difficult ？？
            difficult = obj.find('difficult').text
            # 获得类别 =string 类型
            cls = obj.find('name').text
            # 如果类别不是对应在我们预定好的class文件中，或difficult==1则跳过
            if cls not in classes or int(difficult) == 1:
                continue
            # 通过类别名称找到id
            cls_id = classes.index(cls)
            # 找到bndbox 对象
            xmlbox = obj.find('bndbox')
            # 获取对应的bndbox的数组 = ['xmin','xmax','ymin','ymax']
            b = (float(xmlbox.find('xmin').text), float(xmlbox.find('xmax').text), float(xmlbox.find('ymin').text),
                 float(xmlbox.find('ymax').text))
            print(image_id, cls, b)
            # 带入进行归一化操作
            # w = 宽, h = 高， b= bndbox的数组 = ['xmin','xmax','ymin','ymax']
            bb = convert((w, h), b)
            # bb 对应的是归一化后的(x,y,w,h)
            # 生成 calss x y w h 在label文件中
            out_file.write(str(cls_id) + " " + " ".join([str(a) for a in bb]) + '\n')

```

## split data
```python
from sklearn.model_selection import train_test_split
import os
import shutil
import cv2
from pathlib import Path

def split_train_val(train_path_set, val_path_set):
    total_files = []

    for filename in os.listdir(train_path_set):
        total_files.append(filename)
        # test_size为训练集和测试集的比例
    train_files, val_files = train_test_split(
        total_files, test_size=0.1, random_state=42)
    save_dir = Path(val_path_set)
    if save_dir.is_dir():
        for j in range(len(val_files)):
            val_path1 = train_path_set + '/' + val_files[j]
            shutil.move(val_path1, val_path_set)
    else:
        os.makedirs(save_dir)
        for j in range(len(val_files)):
            val_path1 = train_path_set + '/' + val_files[j]
            shutil.move(val_path1, val_path_set)


if __name__ == '__main__':
    train_path = r'/data/proj/www/repo/yolo8_test/dataset/pin/images'  # 图片路径
    val_path = r'/data/proj/www/repo/yolo8_test/dataset/pin/val'  # 划分测试集存放路径
    split_train_val(train_path, val_path)
    # for set in os.listdir(train_path):
    #     train_path_set=train_path+'\\'+set
    #     val_path_set=val_path+'\\'+set
    #     split_train_val(train_path_set, val_path_set)
    print("划分完成！")
```

## move data
```python
import os
import shutil
# move json
# 将训练的标注文件移动到训练目录，验证的标注文件手动复制
val_xml_path = r'/data/proj/www/repo/yolo8_test/dataset/pin/coco2yolo'
img_path = r'/data/proj/www/repo/yolo8_test/dataset/pin/images'
move_path = r'/data/proj/www/repo/yolo8_test/dataset/pin/images'
for filename in os.listdir(img_path):
    for filename2 in os.listdir(val_xml_path):
        img_list = filename.split('.')
        label_list = filename2.split('.')
        if len(img_list) == 2:
            img_name = ''
            label_name = ''
            for i in range(len(img_list)-1):
                img_name = img_name+img_list[i]
            for i in range(len(label_list)-1):
                label_name = label_name+label_list[i]
            if img_name == label_name:
                shutil.move(val_xml_path + '/' + filename2, move_path)
        else:
            if filename.split('.')[0] == filename2.split('.')[0]:
                shutil.move(val_xml_path + '/' + filename, move_path)

```

## 图像增强

```python
import imgaug.augmenters as iaa
from imgaug.augmentables.bbs import BoundingBox, BoundingBoxesOnImage
import json
import cv2
import os
import random

def augment_data(image_path, annotation_path, output_dir, index):
    image_base_name = os.path.basename(image_path).split('.')[0];
    # 读取图像和标注文件
    image = cv2.imread(image_path)
    with open(annotation_path, 'r') as f:
        annotation_data = json.load(f)

    # 将labelme标注数据转换为imgaug的BoundingBoxesOnImage格式
    bbs = []
    for shape in annotation_data['shapes']:
        label = shape['label']
        points = shape['points']
        x1 = points[0][0]
        y1 = points[0][1]
        x2 = points[1][0]
        y2 = points[1][1]
        bb = BoundingBox(x1=x1, y1=y1, x2=x2, y2=y2, label=label)
        bbs.append(bb)
    bbs_on_image = BoundingBoxesOnImage(bbs, shape=image.shape)

    # 定义图像增强器
    seq = iaa.Sequential([
        iaa.Multiply(mul=(0.8, 1.5)),
        iaa.Sometimes(0.2, iaa.AddToHueAndSaturation(value=(-10, 10), per_channel=True)),
        iaa.Sometimes(0.5, iaa.GaussianBlur(sigma=(1, 5.0))),
        iaa.Sometimes(0.5, iaa.AdditiveGaussianNoise(scale=(0, random.random() * 0.2 * 255))),
        iaa.Fliplr(0.3),  # 水平翻转
        iaa.Affine(scale=random.uniform(0.9, 1.1)),
        iaa.Affine(rotate=(-5,5)),
        iaa.PerspectiveTransform(scale=(0, 0.1)),
    ])

    # 进行图像增强
    augmented_image, augmented_bbs_on_image = seq(image=image, bounding_boxes=bbs_on_image)

    # 生成labelme标注
    transformed_annotation = {
        'version': '5.3.1',
        'flags': {},
        'shapes': [],
        'imagePath': f'{image_base_name}_aug_{index}.jpg',
        'imageData': None,
        'imageHeight':augmented_image.shape[0],
        'imageWidth':augmented_image.shape[1]
    }

    for bb in augmented_bbs_on_image.bounding_boxes:
        transformed_shape = {
            'label': bb.label,
            'points': [[float(bb.x1), float(bb.y1)], [float(bb.x2), float(bb.y2)]],
            'group_id': None,
            'description': '',
            'shape_type': 'rectangle',
            'flags': shape['flags']
        }
        transformed_annotation['shapes'].append(transformed_shape)


    # 导出增强后的图像和标注
    output_image_path = os.path.join(output_dir, f'{image_base_name}_aug_{index}.jpg')
    output_annotation_path = os.path.join(output_dir, f'{image_base_name}_aug_{index}.json')

    cv2.imwrite(output_image_path, augmented_image)
    with open(output_annotation_path, 'w') as f:
        json.dump(transformed_annotation, f)


for i in range(30):
    augment_data('./data/Right_20240430151354405.jpg', './data/Right_20240430151354405.json', './aug2', i)

```

## Python三剑客

[filename](./numpy.html ':include width=100% height=1000px' )






## 协程 & 异步编程(asyncio)

协程（Coroutine），也可以被称为微线程，是一种用户态内的上下文切换技术。简而言之，其实就是通过一个线程实现代码块相互切换执行。例如：

```python
def func1():
	print(1)
    ...
	print(2)

def func2():
	print(3)
    ...
	print(4)

func1()
func2()
```

上述代码是普通的函数定义和执行，按流程分别执行两个函数中的代码，并先后会输出：`1、2、3、4`。但如果介入协程技术那么就可以实现函数见代码切换执行，最终输入：`1、3、2、4` 。



### 1. 协程的实现

在Python中有多种方式可以实现协程，例如：

- greenlet，是一个第三方模块，用于实现协程代码（Gevent协程就是基于greenlet实现）
- yield，生成器，借助生成器的特点也可以实现协程代码。
- asyncio，在Python3.4中引入的模块用于编写协程代码。
- async & awiat，在Python3.5中引入的两个关键字，结合asyncio模块可以更方便的编写协程代码。



#### 1.1 greenlet

greentlet是一个第三方模块，需要提前安装 `pip3 install greenlet`才能使用。

```python
from greenlet import greenlet


def func1():
    print(1)        # 第1步：输出 1
    gr2.switch()    # 第3步：切换到 func2 函数
    print(2)        # 第6步：输出 2
    gr2.switch()    # 第7步：切换到 func2 函数，从上一次执行的位置继续向后执行


def func2():
    print(3)        # 第4步：输出 3
    gr1.switch()    # 第5步：切换到 func1 函数，从上一次执行的位置继续向后执行
    print(4)        # 第8步：输出 4


gr1 = greenlet(func1)
gr2 = greenlet(func2)
gr1.switch() # 第1步：去执行 func1 函数
```

注意：switch中也可以传递参数用于在切换执行时相互传递值。



#### 1.2 yield

基于Python的生成器的yield和yield form关键字实现协程代码。

```python
def func1():
    yield 1
    yield from func2()
    yield 2


def func2():
    yield 3
    yield 4


f1 = func1()
for item in f1:
    print(item)
```

注意：yield form关键字是在Python3.3中引入的。



#### 1.3 asyncio

在Python3.4之前官方未提供协程的类库，一般大家都是使用greenlet等其他来实现。在Python3.4发布后官方正式支持协程，即：asyncio模块。

```python
import asyncio

@asyncio.coroutine
def func1():
    print(1)
    yield from asyncio.sleep(2)  # 遇到IO耗时操作，自动化切换到tasks中的其他任务
    print(2)


@asyncio.coroutine
def func2():
    print(3)
    yield from asyncio.sleep(2) # 遇到IO耗时操作，自动化切换到tasks中的其他任务
    print(4)


tasks = [
    asyncio.ensure_future( func1() ),
    asyncio.ensure_future( func2() )
]

loop = asyncio.get_event_loop()
loop.run_until_complete(asyncio.wait(tasks))
```

注意：基于asyncio模块实现的协程比之前的要更厉害，因为他的内部还集成了遇到IO耗时操作自动切花的功能。



#### 1.4 async & awit

async & awit 关键字在Python3.5版本中正式引入，基于他编写的协程代码其实就是 上一示例 的加强版，让代码可以更加简便。

Python3.8之后 `@asyncio.coroutine` 装饰器就会被移除，推荐使用async & awit 关键字实现协程代码。

```python
import asyncio


async def func1():
    print(1)
    await asyncio.sleep(2)
    print(2)


async def func2():
    print(3)
    await asyncio.sleep(2)
    print(4)


tasks = [
    asyncio.ensure_future(func1()),
    asyncio.ensure_future(func2())
]

loop = asyncio.get_event_loop()
loop.run_until_complete(asyncio.wait(tasks))
```

#### 1.5 小结

关于协程有多种实现方式，目前主流使用是Python官方推荐的asyncio模块和async&await关键字的方式，例如：在tonado、sanic、fastapi、django3 中均已支持。

接下来，我们也会针对 `asyncio模块` + `async & await` 关键字进行更加详细的讲解。



### 2.协程的意义

通过学习，我们已经了解到协程可以通过一个线程在多个上下文中进行来回切换执行。

<span>**但是**</span>，协程来回切换执行的意义何在呢？（网上看到很多文章舔协程，协程牛逼之处是哪里呢？）

```
计算型的操作，利用协程来回切换执行，没有任何意义，来回切换并保存状态 反倒会降低性能。
IO型的操作，利用协程在IO等待时间就去切换执行其他任务，当IO操作结束后再自动回调，那么就会大大节省资源并提供性能，从而实现异步编程（不等待任务结束就可以去执行其他代码）。
```

#### 2.1 爬虫案例

例如：用代码实现下载 `url_list` 中的图片。

- 方式一：同步编程实现

  ```python
  """
  下载图片使用第三方模块requests，请提前安装：pip3 install requests
  """
  import requests


  def download_image(url):
  	print("开始下载:",url)
      # 发送网络请求，下载图片
      response = requests.get(url)
  	print("下载完成")
      # 图片保存到本地文件
      file_name = url.rsplit('_')[-1]
      with open(file_name, mode='wb') as file_object:
          file_object.write(response.content)


  if __name__ == '__main__':
      url_list = [
          'https://www3.autoimg.cn/newsdfs/g26/M02/35/A9/120x90_0_autohomecar__ChsEe12AXQ6AOOH_AAFocMs8nzU621.jpg',
          'https://www2.autoimg.cn/newsdfs/g30/M01/3C/E2/120x90_0_autohomecar__ChcCSV2BBICAUntfAADjJFd6800429.jpg',
          'https://www3.autoimg.cn/newsdfs/g26/M0B/3C/65/120x90_0_autohomecar__ChcCP12BFCmAIO83AAGq7vK0sGY193.jpg'
      ]
      for item in url_list:
          download_image(item)
  ```

- 方式二：基于协程的异步编程实现

  ```python
  """
  下载图片使用第三方模块aiohttp，请提前安装：pip3 install aiohttp
  """
  #!/usr/bin/env python
  # -*- coding:utf-8 -*-
  import aiohttp
  import asyncio


  async def fetch(session, url):
      print("发送请求：", url)
      async with session.get(url, verify_ssl=False) as response:
          content = await response.content.read()
          file_name = url.rsplit('_')[-1]
          with open(file_name, mode='wb') as file_object:
              file_object.write(content)


  async def main():
      async with aiohttp.ClientSession() as session:
          url_list = [
              'https://www3.autoimg.cn/newsdfs/g26/M02/35/A9/120x90_0_autohomecar__ChsEe12AXQ6AOOH_AAFocMs8nzU621.jpg',
              'https://www2.autoimg.cn/newsdfs/g30/M01/3C/E2/120x90_0_autohomecar__ChcCSV2BBICAUntfAADjJFd6800429.jpg',
              'https://www3.autoimg.cn/newsdfs/g26/M0B/3C/65/120x90_0_autohomecar__ChcCP12BFCmAIO83AAGq7vK0sGY193.jpg'
          ]
          tasks = [asyncio.create_task(fetch(session, url)) for url in url_list]

          await asyncio.wait(tasks)


  if __name__ == '__main__':
      asyncio.run(main())

  ```

上述两种的执行对比之后会发现，`基于协程的异步编程` 要比 `同步编程`的效率高了很多。因为：

- 同步编程，按照顺序逐一排队执行，如果图片下载时间为2分钟，那么全部执行完则需要6分钟。
- 异步编程，几乎同时发出了3个下载任务的请求（遇到IO请求自动切换去发送其他任务请求），如果图片下载时间为2分钟，那么全部执行完毕也大概需要2分钟左右就可以了。



#### 2.2 小结

协程一般应用在有IO操作的程序中，因为协程可以利用IO等待的时间去执行一些其他的代码，从而提升代码执行效率。

生活中不也是这样的么，假设 你是一家制造汽车的老板，员工点击设备的【开始】按钮之后，在设备前需等待30分钟，然后点击【结束】按钮，此时作为老板的你一定希望这个员工在等待的那30分钟的时间去做点其他的工作。



### 3.异步编程

基于`async` & `await`关键字的协程可以实现异步编程，这也是目前python异步相关的主流技术。

想要真正的了解Python中内置的异步编程，根据下文的顺序一点点来看。

#### 3.1 事件循环

事件循环，可以把他当做是一个while循环，这个while循环在周期性的运行并执行一些`任务`，在特定条件下终止循环。

```python
# 伪代码

任务列表 = [ 任务1, 任务2, 任务3,... ]

while True:
    可执行的任务列表，已完成的任务列表 = 去任务列表中检查所有的任务，将'可执行'和'已完成'的任务返回

    for 就绪任务 in 已准备就绪的任务列表:
        执行已就绪的任务

    for 已完成的任务 in 已完成的任务列表:
        在任务列表中移除 已完成的任务

	如果 任务列表 中的任务都已完成，则终止循环
```

在编写程序时候可以通过如下代码来获取和创建事件循环。

```python
import asyncio

loop = asyncio.get_event_loop()
```



#### 3.2 协程和异步编程

协程函数，定义形式为 [`async def`](https://docs.python.org/zh-cn/3.8/reference/compound_stmts.html#async-def) 的函数。

协程对象，调用 *协程函数* 所返回的对象。

```python
# 定义一个协程函数
async def func():
    pass

# 调用协程函数，返回一个协程对象
result = func()
```

**注意**：调用协程函数时，函数内部代码不会执行，只是会返回一个协程对象。

##### 3.2.1 基本应用

程序中，如果想要执行协程函数的内部代码，需要 `事件循环` 和 `协程对象` 配合才能实现，如：

```python
import asyncio


async def func():
    print("协程内部代码")

# 调用协程函数，返回一个协程对象。
result = func()

# 方式一
# loop = asyncio.get_event_loop() # 创建一个事件循环
# loop.run_until_complete(result) # 将协程当做任务提交到事件循环的任务列表中，协程执行完成之后终止。

# 方式二
# 本质上方式一是一样的，内部先 创建事件循环 然后执行 run_until_complete，一个简便的写法。
# asyncio.run 函数在 Python 3.7 中加入 asyncio 模块，
asyncio.run(result)
```

这个过程可以简单理解为：将`协程`当做任务添加到 `事件循环` 的任务列表，然后事件循环检测列表中的`协程`是否 已准备就绪（默认可理解为就绪状态），如果准备就绪则执行其内部代码。

##### 3.2.2 await

await是一个只能在协程函数中使用的关键字，用于遇到IO操作时挂起 当前协程（任务），当前协程（任务）挂起过程中 事件循环可以去执行其他的协程（任务），当前协程IO处理完成时，可以再次切换回来执行await之后的代码。代码如下：

**示例1：**

```python
import asyncio


async def func():
    print("执行协程函数内部代码")

    # 遇到IO操作挂起当前协程（任务），等IO操作完成之后再继续往下执行。
    # 当前协程挂起时，事件循环可以去执行其他协程（任务）。
    response = await asyncio.sleep(2)

    print("IO请求结束，结果为：", response)

result = func()

asyncio.run(result)
```



**示例2：**

```python
import asyncio


async def others():
    print("start")
    await asyncio.sleep(2)
    print('end')
    return '返回值'


async def func():
    print("执行协程函数内部代码")

    # 遇到IO操作挂起当前协程（任务），等IO操作完成之后再继续往下执行。当前协程挂起时，事件循环可以去执行其他协程（任务）。
    response = await others()

    print("IO请求结束，结果为：", response)

asyncio.run( func() )
```

**示例3：**

```python
import asyncio


async def others():
    print("start")
    await asyncio.sleep(2)
    print('end')
    return '返回值'


async def func():
    print("执行协程函数内部代码")

    # 遇到IO操作挂起当前协程（任务），等IO操作完成之后再继续往下执行。当前协程挂起时，事件循环可以去执行其他协程（任务）。
    response1 = await others()
    print("IO请求结束，结果为：", response1)

    response2 = await others()
    print("IO请求结束，结果为：", response2)

asyncio.run( func() )
```

上述的所有示例都只是创建了一个任务，即：事件循环的任务列表中只有一个任务，所以在IO等待时无法演示切换到其他任务效果。

在程序想要创建多个任务对象，需要使用Task对象来实现。



##### 3.2.3 Task对象

> *Tasks* are used to schedule coroutines *concurrently*.
>
> When a coroutine is wrapped into a *Task* with functions like [`asyncio.create_task()`](https://docs.python.org/3.8/library/asyncio-task.html#asyncio.create_task) the coroutine is automatically scheduled to run soon。

Tasks用于并发调度协程，通过`asyncio.create_task(协程对象)`的方式创建Task对象，这样可以让协程加入事件循环中等待被调度执行。除了使用 `asyncio.create_task()` 函数以外，还可以用低层级的 `loop.create_task()` 或 `ensure_future()` 函数。不建议手动实例化 Task 对象。

本质上是将协程对象封装成task对象，并将协程立即加入事件循环，同时追踪协程的状态。

注意：`asyncio.create_task()` 函数在 Python 3.7 中被加入。在 Python 3.7 之前，可以改用低层级的 `asyncio.ensure_future()` 函数。

**示例1：**

```python
import asyncio


async def func():
    print(1)
    await asyncio.sleep(2)
    print(2)
    return "返回值"


async def main():
    print("main开始")

    # 创建协程，将协程封装到一个Task对象中并立即添加到事件循环的任务列表中，等待事件循环去执行（默认是就绪状态）。
    task1 = asyncio.create_task(func())

    # 创建协程，将协程封装到一个Task对象中并立即添加到事件循环的任务列表中，等待事件循环去执行（默认是就绪状态）。
    task2 = asyncio.create_task(func())

    print("main结束")

    # 当执行某协程遇到IO操作时，会自动化切换执行其他任务。
    # 此处的await是等待相对应的协程全都执行完毕并获取结果
    ret1 = await task1
    ret2 = await task2
    print(ret1, ret2)


asyncio.run(main())
```



**示例2：**

```python
import asyncio


async def func():
    print(1)
    await asyncio.sleep(2)
    print(2)
    return "返回值"


async def main():
    print("main开始")

    # 创建协程，将协程封装到Task对象中并添加到事件循环的任务列表中，等待事件循环去执行（默认是就绪状态）。
    # 在调用
    task_list = [
        asyncio.create_task(func(), name="n1"),
        asyncio.create_task(func(), name="n2")
    ]

    print("main结束")

    # 当执行某协程遇到IO操作时，会自动化切换执行其他任务。
    # 此处的await是等待所有协程执行完毕，并将所有协程的返回值保存到done
    # 如果设置了timeout值，则意味着此处最多等待的秒，完成的协程返回值写入到done中，未完成则写到pending中。
    done, pending = await asyncio.wait(task_list, timeout=None)
    print(done, pending)


asyncio.run(main())
```

注意：`asyncio.wait` 源码内部会对列表中的每个协程执行ensure_future从而封装为Task对象，所以在和wait配合使用时task_list的值为`[func(),func()]` 也是可以的。



**示例3：**

```python
import asyncio


async def func():
    print("执行协程函数内部代码")

    # 遇到IO操作挂起当前协程（任务），等IO操作完成之后再继续往下执行。当前协程挂起时，事件循环可以去执行其他协程（任务）。
    response = await asyncio.sleep(2)

    print("IO请求结束，结果为：", response)


coroutine_list = [func(), func()]

# 错误：coroutine_list = [ asyncio.create_task(func()), asyncio.create_task(func()) ]
# 此处不能直接 asyncio.create_task，因为将Task立即加入到事件循环的任务列表，
# 但此时事件循环还未创建，所以会报错。


# 使用asyncio.wait将列表封装为一个协程，并调用asyncio.run实现执行两个协程
# asyncio.wait内部会对列表中的每个协程执行ensure_future，封装为Task对象。
done,pending = asyncio.run( asyncio.wait(coroutine_list) )
```



##### 3.2.4 asyncio.Future对象

> A `Future`is a special **low-level** awaitable object that represents an **eventual result** of an asynchronous operation.

asyncio中的Future对象是一个相对更偏向底层的可对象，通常我们不会直接用到这个对象，而是直接使用Task对象来完成任务的并和状态的追踪。（ Task 是 Futrue的子类 ）

Future为我们提供了异步编程中的 最终结果 的处理（Task类也具备状态处理的功能）。

示例1：

```python
async def main():
    # 获取当前事件循环
    loop = asyncio.get_running_loop()

    # # 创建一个任务（Future对象），这个任务什么都不干。
    fut = loop.create_future()

    # 等待任务最终结果（Future对象），没有结果则会一直等下去。
    await fut

asyncio.run(main())
```

示例2：

```python
import asyncio


async def set_after(fut):
    await asyncio.sleep(2)
    fut.set_result("666")


async def main():
    # 获取当前事件循环
    loop = asyncio.get_running_loop()

    # 创建一个任务（Future对象），没绑定任何行为，则这个任务永远不知道什么时候结束。
    fut = loop.create_future()

    # 创建一个任务（Task对象），绑定了set_after函数，函数内部在2s之后，会给fut赋值。
    # 即手动设置future任务的最终结果，那么fut就可以结束了。
    await loop.create_task(set_after(fut))

    # 等待 Future对象获取 最终结果，否则一直等下去
    data = await fut
    print(data)

asyncio.run(main())
```

Future对象本身函数进行绑定，所以想要让事件循环获取Future的结果，则需要手动设置。而Task对象继承了Future对象，其实就对Future进行扩展，他可以实现在对应绑定的函数执行完成之后，自动执行`set_result`，从而实现自动结束。

虽然，平时使用的是Task对象，但对于结果的处理本质是基于Future对象来实现的。



扩展：支持 `await 对象`语 法的对象课成为可等待对象，所以 `协程对象`、`Task对象`、`Future对象` 都可以被成为可等待对象。

##### 3.2.5 futures.Future对象

在Python的`concurrent.futures`模块中也有一个Future对象，这个对象是基于线程池和进程池实现异步操作时使用的对象。

```python
import time
from concurrent.futures import Future
from concurrent.futures.thread import ThreadPoolExecutor
from concurrent.futures.process import ProcessPoolExecutor


def func(value):
    time.sleep(1)
    print(value)


pool = ThreadPoolExecutor(max_workers=5)
# 或 pool = ProcessPoolExecutor(max_workers=5)


for i in range(10):
    fut = pool.submit(func, i)
    print(fut)
```

两个Future对象是不同的，他们是为不同的应用场景而设计，例如：`concurrent.futures.Future`不支持await语法 等。

官方提示两对象之间不同：

- unlike asyncio Futures, [`concurrent.futures.Future`](https://docs.python.org/3.8/library/concurrent.futures.html#concurrent.futures.Future) instances cannot be awaited.

- [`asyncio.Future.result()`](https://docs.python.org/3.8/library/asyncio-future.html#asyncio.Future.result) and [`asyncio.Future.exception()`](https://docs.python.org/3.8/library/asyncio-future.html#asyncio.Future.exception) do not accept the *timeout* argument.
- [`asyncio.Future.result()`](https://docs.python.org/3.8/library/asyncio-future.html#asyncio.Future.result) and [`asyncio.Future.exception()`](https://docs.python.org/3.8/library/asyncio-future.html#asyncio.Future.exception) raise an [`InvalidStateError`](https://docs.python.org/3.8/library/asyncio-exceptions.html#asyncio.InvalidStateError) exception when the Future is not *done*.
- Callbacks registered with [`asyncio.Future.add_done_callback()`](https://docs.python.org/3.8/library/asyncio-future.html#asyncio.Future.add_done_callback) are not called immediately. They are scheduled with [`loop.call_soon()`](https://docs.python.org/3.8/library/asyncio-eventloop.html#asyncio.loop.call_soon) instead.
- asyncio Future is not compatible with the [`concurrent.futures.wait()`](https://docs.python.org/3.8/library/concurrent.futures.html#concurrent.futures.wait) and [`concurrent.futures.as_completed()`](https://docs.python.org/3.8/library/concurrent.futures.html#concurrent.futures.as_completed) functions.



在Python提供了一个将`futures.Future` 对象包装成`asyncio.Future`对象的函数 `asynic.wrap_future`。

接下里你肯定问：为什么python会提供这种功能？

其实，一般在程序开发中我们要么统一使用 asycio 的协程实现异步操作、要么都使用进程池和线程池实现异步操作。但如果 `协程的异步`和 `进程池/线程池的异步` 混搭时，那么就会用到此功能了。

```python
import time
import asyncio
import concurrent.futures

def func1():
    # 某个耗时操作
    time.sleep(2)
    return "SB"

async def main():
    loop = asyncio.get_running_loop()

    # 1. Run in the default loop's executor ( 默认ThreadPoolExecutor )
    # 第一步：内部会先调用 ThreadPoolExecutor 的 submit 方法去线程池中申请一个线程去执行func1函数，并返回一个concurrent.futures.Future对象
    # 第二步：调用asyncio.wrap_future将concurrent.futures.Future对象包装为asycio.Future对象。
    # 因为concurrent.futures.Future对象不支持await语法，所以需要包装为 asycio.Future对象 才能使用。
    fut = loop.run_in_executor(None, func1)
    result = await fut
    print('default thread pool', result)

    # 2. Run in a custom thread pool:
    # with concurrent.futures.ThreadPoolExecutor() as pool:
    #     result = await loop.run_in_executor(
    #         pool, func1)
    #     print('custom thread pool', result)

    # 3. Run in a custom process pool:
    # with concurrent.futures.ProcessPoolExecutor() as pool:
    #     result = await loop.run_in_executor(
    #         pool, func1)
    #     print('custom process pool', result)

asyncio.run(main())
```



应用场景：当项目以协程式的异步编程开发时，如果要使用一个第三方模块，而第三方模块不支持协程方式异步编程时，就需要用到这个功能，例如：

```python
import asyncio
import requests


async def download_image(url):
    # 发送网络请求，下载图片（遇到网络下载图片的IO请求，自动化切换到其他任务）
    print("开始下载:", url)

    loop = asyncio.get_event_loop()
    # requests模块默认不支持异步操作，所以就使用线程池来配合实现了。
    future = loop.run_in_executor(None, requests.get, url)

    response = await future
    print('下载完成')
    # 图片保存到本地文件
    file_name = url.rsplit('_')[-1]
    with open(file_name, mode='wb') as file_object:
        file_object.write(response.content)


if __name__ == '__main__':
    url_list = [
        'https://www3.autoimg.cn/newsdfs/g26/M02/35/A9/120x90_0_autohomecar__ChsEe12AXQ6AOOH_AAFocMs8nzU621.jpg',
        'https://www2.autoimg.cn/newsdfs/g30/M01/3C/E2/120x90_0_autohomecar__ChcCSV2BBICAUntfAADjJFd6800429.jpg',
        'https://www3.autoimg.cn/newsdfs/g26/M0B/3C/65/120x90_0_autohomecar__ChcCP12BFCmAIO83AAGq7vK0sGY193.jpg'
    ]

    tasks = [download_image(url) for url in url_list]

    loop = asyncio.get_event_loop()
    loop.run_until_complete( asyncio.wait(tasks) )
```



##### 3.2.6 异步迭代器

**什么是异步迭代器**

实现了 [`__aiter__()`](https://docs.python.org/zh-cn/3.8/reference/datamodel.html#object.__aiter__) 和 [`__anext__()`](https://docs.python.org/zh-cn/3.8/reference/datamodel.html#object.__anext__) 方法的对象。`__anext__` 必须返回一个 [awaitable](https://docs.python.org/zh-cn/3.8/glossary.html#term-awaitable) 对象。[`async for`](https://docs.python.org/zh-cn/3.8/reference/compound_stmts.html#async-for) 会处理异步迭代器的 [`__anext__()`](https://docs.python.org/zh-cn/3.8/reference/datamodel.html#object.__anext__) 方法所返回的可等待对象，直到其引发一个 [`StopAsyncIteration`](https://docs.python.org/zh-cn/3.8/library/exceptions.html#StopAsyncIteration) 异常。由 [**PEP 492**](https://www.python.org/dev/peps/pep-0492) 引入。

**什么是异步可迭代对象？**

可在 [`async for`](https://docs.python.org/zh-cn/3.8/reference/compound_stmts.html#async-for) 语句中被使用的对象。必须通过它的 [`__aiter__()`](https://docs.python.org/zh-cn/3.8/reference/datamodel.html#object.__aiter__) 方法返回一个 [asynchronous iterator](https://docs.python.org/zh-cn/3.8/glossary.html#term-asynchronous-iterator)。由 [**PEP 492**](https://www.python.org/dev/peps/pep-0492) 引入。

```python
import asyncio


class Reader(object):
    """ 自定义异步迭代器（同时也是异步可迭代对象） """

    def __init__(self):
        self.count = 0

    async def readline(self):
        # await asyncio.sleep(1)
        self.count += 1
        if self.count == 100:
            return None
        return self.count

    def __aiter__(self):
        return self

    async def __anext__(self):
        val = await self.readline()
        if val == None:
            raise StopAsyncIteration
        return val


async def func():
    # 创建异步可迭代对象
    async_iter = Reader()
    # async for 必须要放在async def函数内，否则语法错误。
    async for item in async_iter:
        print(item)

asyncio.run(func())
```

异步迭代器其实没什么太大的作用，只是支持了async for语法而已。

##### 3.2.6 异步上下文管理器

此种对象通过定义 [`__aenter__()`](https://docs.python.org/zh-cn/3.8/reference/datamodel.html#object.__aenter__) 和 [`__aexit__()`](https://docs.python.org/zh-cn/3.8/reference/datamodel.html#object.__aexit__) 方法来对 [`async with`](https://docs.python.org/zh-cn/3.8/reference/compound_stmts.html#async-with) 语句中的环境进行控制。由 [**PEP 492**](https://www.python.org/dev/peps/pep-0492) 引入。

```python
import asyncio


class AsyncContextManager:
	def __init__(self):
        self.conn = conn

    async def do_something(self):
        # 异步操作数据库
        return 666

    async def __aenter__(self):
        # 异步链接数据库
        self.conn = await asyncio.sleep(1)
        return self

    async def __aexit__(self, exc_type, exc, tb):
        # 异步关闭数据库链接
		await asyncio.sleep(1)


async def func():
    async with AsyncContextManager() as f:
        result = await f.do_something()
        print(result)


asyncio.run(func())
```

这个异步的上下文管理器还是比较有用的，平时在开发过程中 打开、处理、关闭 操作时，就可以用这种方式来处理。



#### 3.3 小结

在程序中只要看到`async`和`await`关键字，其内部就是基于协程实现的异步编程，这种异步编程是通过一个线程在IO等待时间去执行其他任务，从而实现并发。

以上就是异步编程的常见操作，内容参考官方文档。

- 中文版：https://docs.python.org/zh-cn/3.8/library/asyncio.html
- 英文本：https://docs.python.org/3.8/library/asyncio.html



### 4. uvloop

Python标准库中提供了`asyncio`模块，用于支持基于协程的异步编程。

uvloop是 asyncio 中的事件循环的替代方案，替换后可以使得asyncio性能提高。事实上，uvloop要比nodejs、gevent等其他python异步框架至少要快2倍，性能可以比肩Go语言。

安装uvloop

```
pip3 install uvloop
```

在项目中想要使用uvloop替换asyncio的事件循环也非常简单，只要在代码中这么做就行。

```python
import asyncio
import uvloop
asyncio.set_event_loop_policy(uvloop.EventLoopPolicy())

# 编写asyncio的代码，与之前写的代码一致。

# 内部的事件循环自动化会变为uvloop
asyncio.run(...)
```

注意：知名的asgi uvicorn内部就是使用的uvloop的事件循环。



### 5.实战案例

为了更好理解，上述所有示例的IO情况都是以 `asyncio.sleep` 为例，而真实的项目开发中会用到很多IO的情况。

#### 5.1 异步Redis

当通过python去操作redis时，链接、设置值、获取值 这些都涉及网络IO请求，使用asycio异步的方式可以在IO等待时去做一些其他任务，从而提升性能。

安装Python异步操作redis模块

```
pip3 install aioredis
```

示例1：异步操作redis。

```python
#!/usr/bin/env python
# -*- coding:utf-8 -*-
import asyncio
import aioredis


async def execute(address, password):
    print("开始执行", address)
    # 网络IO操作：创建redis连接
    redis = await aioredis.create_redis(address, password=password)

    # 网络IO操作：在redis中设置哈希值car，内部在设三个键值对，即： redis = { car:{key1:1,key2:2,key3:3}}
    await redis.hmset_dict('car', key1=1, key2=2, key3=3)

    # 网络IO操作：去redis中获取值
    result = await redis.hgetall('car', encoding='utf-8')
    print(result)

    redis.close()
    # 网络IO操作：关闭redis连接
    await redis.wait_closed()

    print("结束", address)


asyncio.run(execute('redis://47.93.4.198:6379', "root!2345"))
```



示例2：连接多个redis做操作（遇到IO会切换其他任务，提供了性能）。

```python
import asyncio
import aioredis


async def execute(address, password):
    print("开始执行", address)

    # 网络IO操作：先去连接 47.93.4.197:6379，遇到IO则自动切换任务，去连接47.93.4.198:6379
    redis = await aioredis.create_redis_pool(address, password=password)

    # 网络IO操作：遇到IO会自动切换任务
    await redis.hmset_dict('car', key1=1, key2=2, key3=3)

    # 网络IO操作：遇到IO会自动切换任务
    result = await redis.hgetall('car', encoding='utf-8')
    print(result)

    redis.close()
    # 网络IO操作：遇到IO会自动切换任务
    await redis.wait_closed()

    print("结束", address)


task_list = [
    execute('redis://47.93.4.197:6379', "root!2345"),
    execute('redis://47.93.4.198:6379', "root!2345")
]

asyncio.run(asyncio.wait(task_list))
```

更多redis操作参考aioredis官网：https://aioredis.readthedocs.io/en/v1.3.0/start.html



#### 5.2 异步MySQL

当通过python去操作MySQL时，连接、执行SQL、关闭都涉及网络IO请求，使用asycio异步的方式可以在IO等待时去做一些其他任务，从而提升性能。

安装Python异步操作redis模块

```
pip3 install aiomysql
```

示例1：

```python
import asyncio
import aiomysql


async def execute():
    # 网络IO操作：连接MySQL
    conn = await aiomysql.connect(host='127.0.0.1', port=3306, user='root', password='123', db='mysql', )

    # 网络IO操作：创建CURSOR
    cur = await conn.cursor()

    # 网络IO操作：执行SQL
    await cur.execute("SELECT Host,User FROM user")

    # 网络IO操作：获取SQL结果
    result = await cur.fetchall()
    print(result)

    # 网络IO操作：关闭链接
    await cur.close()
    conn.close()


asyncio.run(execute())
```

示例2：

```python
#!/usr/bin/env python
# -*- coding:utf-8 -*-
import asyncio
import aiomysql


async def execute(host, password):
    print("开始", host)
    # 网络IO操作：先去连接 47.93.40.197，遇到IO则自动切换任务，去连接47.93.40.198:6379
    conn = await aiomysql.connect(host=host, port=3306, user='root', password=password, db='mysql')

    # 网络IO操作：遇到IO会自动切换任务
    cur = await conn.cursor()

    # 网络IO操作：遇到IO会自动切换任务
    await cur.execute("SELECT Host,User FROM user")

    # 网络IO操作：遇到IO会自动切换任务
    result = await cur.fetchall()
    print(result)

    # 网络IO操作：遇到IO会自动切换任务
    await cur.close()
    conn.close()
    print("结束", host)


task_list = [
    execute('47.93.40.197', "root!2345"),
    execute('47.93.40.197', "root!2345")
]

asyncio.run(asyncio.wait(task_list))
```



#### 5.3 FastAPI框架

FastAPI是一款用于构建API的高性能web框架，框架基于Python3.6+的 `type hints`搭建。

接下里的异步示例以`FastAPI`和`uvicorn`来讲解（uvicorn是一个支持异步的asgi）。

安装FastAPI web 框架，

```
pip3 install fastapi
```

安装uvicorn，本质上为web提供socket server的支持的asgi（一般支持异步称asgi、不支持异步称wsgi）

```
pip3 install uvicorn
```

示例：

```python
#!/usr/bin/env python
# -*- coding:utf-8 -*-
import asyncio

import uvicorn
import aioredis
from aioredis import Redis
from fastapi import FastAPI

app = FastAPI()

REDIS_POOL = aioredis.ConnectionsPool('redis://47.193.14.198:6379', password="root123", minsize=1, maxsize=10)


@app.get("/")
def index():
    """ 普通操作接口 """
    return {"message": "Hello World"}


@app.get("/red")
async def red():
    """ 异步操作接口 """

    print("请求来了")

    await asyncio.sleep(3)
    # 连接池获取一个连接
    conn = await REDIS_POOL.acquire()
    redis = Redis(conn)

    # 设置值
    await redis.hmset_dict('car', key1=1, key2=2, key3=3)

    # 读取值
    result = await redis.hgetall('car', encoding='utf-8')
    print(result)

    # 连接归还连接池
    REDIS_POOL.release(conn)

    return result


if __name__ == '__main__':
    uvicorn.run("luffy:app", host="127.0.0.1", port=5000, log_level="info")
```

在有多个用户并发请求的情况下，异步方式来编写的接口可以在IO等待过程中去处理其他的请求，提供性能。

例如：同时有两个用户并发来向接口 `http://127.0.0.1:5000/red` 发送请求，服务端只有一个线程，同一时刻只有一个请求被处理。  异步处理可以提供并发是因为：当视图函数在处理第一个请求时，第二个请求此时是等待被处理的状态，当第一个请求遇到IO等待时，会自动切换去接收并处理第二个请求，当遇到IO时自动化切换至其他请求，一旦有请求IO执行完毕，则会再次回到指定请求向下继续执行其功能代码。

#### 5.4 爬虫

在编写爬虫应用时，需要通过网络IO去请求目标数据，这种情况适合使用异步编程来提升性能，接下来我们使用支持异步编程的aiohttp模块来实现。

安装aiohttp模块

```
pip3 install aiohttp
```

示例：

```python
import aiohttp
import asyncio


async def fetch(session, url):
    print("发送请求：", url)
    async with session.get(url, verify_ssl=False) as response:
        text = await response.text()
        print("得到结果：", url, len(text))


async def main():
    async with aiohttp.ClientSession() as session:
        url_list = [
            'https://python.org',
            'https://www.baidu.com',
            'https://www.pythonav.com'
        ]
        tasks = [asyncio.create_task(fetch(session, url)) for url in url_list]

        await asyncio.wait(tasks)


if __name__ == '__main__':
    asyncio.run(main())
```

### 总结

为了提升性能越来越多的框架都在向异步编程靠拢，例如：sanic、tornado、django3.0、django channels组件 等，用更少资源可以做处理更多的事，何乐而不为呢。


##  PPQ量化
参考链接： https://www.cnblogs.com/ruidongwu/p/16180991.html
视频地址： https://space.bilibili.com/289239037

