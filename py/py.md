## Python程序打包

```python
# import setuptools

# exec(open('/data/proj/echint/echint_algo/echint_algo/version.py', encoding='utf-8').read())
# #__version__ = "1.0"
# setuptools.setup(
#     name="echint_algo",
#     version=__version__,
#     author="xiaobo",
#     author_email="",
#     description="echint_algo",
#     long_description="Echint DeepLearning model interface for training, inference and package.",
#     long_description_content_type="text/markdown",
#     url="",
#     packages=setuptools.find_packages(),
#     package_data={
#         "":["configs/*.yaml"],
#     },
#     classifiers=[
#         "Programming Language :: Python :: 3",
#         "License :: OSI Approved :: MIT License",
#         "Operating System :: OS Independent",
#     ],
# )



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
    out_dir = osp.join(build_dir, 'src/echint_algo')
    shutil.rmtree(out_dir, ignore_errors=True)
    shutil.copytree(osp.join(this_dir, "echint_algo"), out_dir)
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

exec(open('echint_algo/version.py').read())


def get_packages():
    return []

def get_package_data():
    return {}

if BSO:
    code_py_list, init_py_list = get_extensions()
    pkg_data = get_package_data()
    cython_ext_modules = cythonize(code_py_list,
                              build_dir="build",
                              compiler_directives={'language_level': 3})
    setuptools.setup(
        name="echint_algo",
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
        name="echint_algo",
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
## Python三剑客

[filename](./numpy.html ':include width=100% height=1000px' )



##  PPQ量化
参考链接： https://www.cnblogs.com/ruidongwu/p/16180991.html
视频地址： https://space.bilibili.com/289239037