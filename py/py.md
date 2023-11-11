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



```