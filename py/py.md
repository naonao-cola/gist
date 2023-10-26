# Python程序打包

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

***

# 安装包

```bash
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple numpy
```

```

```


