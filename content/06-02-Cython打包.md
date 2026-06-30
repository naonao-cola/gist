---
title: 06-02-Cython打包
tags: ["Python", "python", "编程"]
---

# 06-02-Cython打包

> 父节点: [[06-00-Python生态]]
> 源文件: `py/py.md`
> 相关: [[06-04-魔术方法]] | [[03-00-编译工具链]]

---


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