## xmake

### lua

第一个参考文件

```lua
set_project("AIRuntime")

set_version("0.0.1")
set_languages("c++17")
add_rules("mode.debug", "mode.release")

if is_mode "release" then
    --set_symbols "hidden"
    --set_optimize "fastest"
        set_runtimes("MT")
        --调试时打开下面两个
        set_optimize "none"
    set_symbols("debug")
end

-- cudnn库规则
rule("package_cudnn")
    on_config(function (target)
        target:add("includedirs","3rdparty/cudnn-windows-x86_64-8.4.1.50_cuda11.6-archive/include")
        target:add("linkdirs","3rdparty/cudnn-windows-x86_64-8.4.1.50_cuda11.6-archive/lib")
        target:add("links",
        "cudnn",
        "cudnn64_8",
        "cudnn_adv_infer",
        "cudnn_adv_infer64_8",
        "cudnn_adv_train",
        "cudnn_adv_train64_8",
        "cudnn_cnn_infer",
        "cudnn_cnn_infer64_8",
        "cudnn_cnn_train",
        "cudnn_cnn_train64_8",
        "cudnn_ops_infer",
        "cudnn_ops_infer64_8",
        "cudnn_ops_train",
        "cudnn_ops_train64_8"
        )
    end)
rule_end()



-- tensorrt库
rule("package_tensorrt")
    on_config(function (target)
        target:add("includedirs","3rdparty/TensorRT-8.4.1.5/include")
        target:add("linkdirs","3rdparty/TensorRT-8.4.1.5/lib")
        target:add("links",
        "nvinfer",
        "nvonnxparser",
        "nvinfer_plugin",
        "nvparsers"
        )
    end)
rule_end()



--json库
rule("package_json")
    on_config(function (target)
        target:add("includedirs","3rdparty/nlohmann-json_x64-windows/include")
    end)
rule_end()



--format库
rule("package_format")
    on_config(function (target)
        target:add("includedirs","3rdparty/fmt_x64-windows/include")
        if is_mode("release") then
            target:add("linkdirs","3rdparty/fmt_x64-windows/lib")
            target:add("links","fmt")
        else
            target:add("linkdirs","3rdparty/fmt_x64-windows/debug/lib")
            target:add("links","fmtd")
        end
    end)
rule_end()



--opencv库
rule("package_opencv")
    on_config(function (target)
        target:add("includedirs","3rdparty/opencv/341/x64/include")
        target:add("linkdirs","3rdparty/opencv/341/x64/lib")
        if is_mode("release") then
            target:add("links","opencv_world341")
        else
            target:add("links","opencv_world341d")
        end
    end)
rule_end()



--spdlog库(印象中好像只有头文件)
rule("package_spdlog")
    on_config(function (target)
        target:add("includedirs","3rdparty/spdlog_x64-windows/include")
        if is_mode("release") then
            target:add("linkdirs","3rdparty/spdlog_x64-windows/lib")
            target:add("links","spdlog")
        else
            target:add("linkdirs","3rdparty/spdlog_x64-windows/debug/lib")
            target:add("links","spdlogd")
        end
    end)
rule_end()



--队列库
rule("package_queue")
    on_config(function (target)
    target:add("includedirs","3rdparty/concurrent_queue")
 end)
rule_end()



--添加cuda
rule("package_cuda")
    on_config(function (target)
        target:add("frameworks","cuda")
    end)
rule_end()



rule("package_onnx")
    on_config(function (target)
        target:add("includedirs","3rdparty/onnxruntime-win-x64-gpu-1.15.1/include")
        target:add("linkdirs","3rdparty/onnxruntime-win-x64-gpu-1.15.1/lib")
        target:add("links",
        "onnxruntime",
        "onnxruntime_providers_cuda",
        "onnxruntime_providers_shared",
        "onnxruntime_providers_tensorrt"
        )
    end)
rule_end()



--显示构建目标路径
rule("rule_display")
     after_build(function (target)
     cprint("${green} my output path: %s", target:targetfile())
    end)
rule_end()



--构建完成后复制文件
rule("rule_copy")
    after_build(function (target)
        os.cp(target:targetfile(), "$(projectdir)/install")
        --os.rm(target:targetfile())
        os.cp("$(projectdir)/include/public/*.h","$(projectdir)/install")
    end)
rule_end()

--自动更新vs解决方案结构
add_rules("plugin.vsxmake.autoupdate")

includes(
    "src/xmake.lua",
    "sample/ort_test/xmake.lua",
    "sample/trt_test/xmake.lua"
)
```

第二个参考文件

```lua
target("AIFramework")
    set_kind("shared")
    --添加三方库
    add_rules("package_cudnn")
    add_rules("package_tensorrt")
    add_rules("package_json")
    add_rules("package_format")
    add_rules("package_opencv")
    add_rules("package_spdlog")
    add_rules("package_queue")
    add_rules("package_cuda")
    add_rules("package_onnx")
    add_rules("rule_copy")
    add_rules("rule_display")
    -- 添加编译文件
    add_files("./**.cpp")
    add_files("./**.cu")
    --添加显示头文件
    add_headerfiles("../include/**.h")
    add_headerfiles("../include/**.hpp")
    add_headerfiles("../include/**.cuh")
target_end()
```

第三个参考文件

```lua
-- project
set_project("CGraph")

-- set project version
set_version("2.5.0")

-- set language: c++11
set_languages("c++11")

-- set features on different platform
if is_plat("macosx") then
    add_defines("_ENABLE_LIKELY_")
elseif is_plat("linux") then
    add_defines("_ENABLE_LIKELY_")
    add_syslinks("pthread")
end

tutorial_list = {
        "T00-HelloCGraph",
        "T01-Simple",
        "T02-Cluster",
        "T03-Region",
        "T04-Complex",
        "T05-Param",
        "T06-Condition",
        "T07-MultiPipeline",
        "T08-Template",
        "T09-Aspect",
        "T10-AspectParam",
        "T11-Singleton",
        "T12-Function",
        "T13-Daemon",
        "T14-Hold",
        "T15-ElementParam",
        "T16-MessageSendRecv",
        "T17-MessagePubSub",
        "T18-Event",
        "T19-Cancel",
        "T20-YieldResume",
        "T21-MultiCondition"
}

-- add tutorial target one by one
for _, v in pairs(tutorial_list) do
    target(v)
        set_kind("binary")
        add_includedirs("src")
        add_headerfiles("src/CGraph.h")
        add_files("src/**.cpp", string.format("tutorial/%s.cpp", v))
end
```

```lua
--给单独文件加参数
add_files("test/*.c", "test2/test2.c", {defines = "TEST2", languages = "c99", includedirs = ".", cflags = "-O0"})
-- 强制禁用 cxflags,cflags 等编译选项的自动检测
add_files("src/*.c", {force = {cxflags = "-DTEST", mflags = "-framework xxx"}})
--添加编译命令,编码格式
set_xmakever("2.7.9")
set_project("cpp_pg")
set_languages("cxx17")

set_encodings("source:utf-8", "target:utf-8")

add_cxflags("/utf-8")
add_cxflags("/Zc:__cplusplus")
target("app")

    set_kind("binary")
    add_includedirs("src")
    add_files("src/**.cpp")

--指定文件加参数
target("test")
    add_files("test/*.cpp", {foo = 1})

    on_config(function (target)
        -- configs = {foo = 1}
        local configs = target:fileconfig("src/main.cpp")
    end)
```

### 命令行

```bash
xmake create -l C++ -P ./hello

xmake f -c
xmake f -v
# 确认安装包
xmake f -y
xmake -rv
# 输出调用各种工具操作，编译的详细参数，如果出错还会打印 xmake 的栈回溯
xmake -vD
xmake show
#显示指定 target 配置信息，可以看到各种配置来源于哪个配置文件和具体的行数
xmake show -t <target>
# 检查工程配置和代码
xmake check
xmake project -k vsxmake2022 -m "release,debug" v2022

# 快速检测系统上指定的包信息,请切换到非工程目录下执行上面的命令
xmake l find_package x264
# 追加第三方包管理器前缀来测试
xmake l find_package conan::OpenSSL/1.0.2g
```

## cmake

### cmakelist

#### 调用三方库

现代cmake

https://modern-cmake-cn.github.io/Modern-CMake-zh_CN/README_GitBook.html

cmake模板

https://github.com/ganleiboy/CMakeTutorial/tree/master

cmake 示例

https://github.com/ttroy50/cmake-examples

```cmake
#1
find_package(SDL2 REQUIRED)
target_link_libraries(main.out PRIVATE SDL2:SDL2)

#2
find_package(PkgConfig REQUIRED)
pkg_check_modules(SDL2 sdl2 REQUIRED IMPORTED_TARGET)
target_link_libraries(main.out PRIVATE PkgConfig::SDL2)

#3 拉取三范库源码
add_subdirectory(3rdparty/SDL)
target_link_libraries(main.out PRIVATE SDL2:SDL2)

#4 第三方库的头文件 
# 另外写一个 findsdl2.cmake
#主文件添加
include(cmake/findsdl2.cmake)
target_link_libraries(main.out PRIVATE SDL2:SDL2)
#子文件
find_path(SDL_HEADER_PATH  SDL.h PATHS 3rdlib/SDL2/include/SDL2 REQUIRED)
find_path(SDL_LIB_PATH libsdl2.a PATHS 3rdlib/SDL2/lib REQUIRED)
message( STATUS "include dir ${SDL_HEADER_PATH}")
add_library(SDL2::SDL2 INTERFACE IMPORTED)
set_target_properties(
    SDL2::SDL2
    PROPERTIES
        INTERFACE_INCLUDE_DIRECTORIES "${SDL_HEADER_PATH}"
        INTERFACE_LINK_LIBRARIES "-L ${SDL_LIB_PATH} -lmingw32 -lSDL2main -lSDL2 -mwindows"
        IMPORTED_LINK_INTERACE_LANGUAGES "C"

)
```

#### 模板

```cmake
cmake_minimum_required( VERSION 3.8 FATAL_ERROR)
project(main VERSION 1.0.0 LANGUAGES CXX)

#set dirs
set(PROJECT_ROOT ${CMAKE_CURRENT_LIST_DIR})
message("project dir:${PROJECT_ROOT}")

SET(CMAKE_EXPORT_COMPILE_COMMANDS ON)   #导出clangd需要的文件，用于智能提示和基于语议的补全

SET(BIN_DESTINATION ${PROJECT_SOURCE_DIR}/bin)
SET(CMAKE_ARCHIVE_OUTPUT_DIRECTORY ${BIN_DESTINATION})
SET(CMAKE_LIBRARY_OUTPUT_DIRECTORY ${BIN_DESTINATION})
SET(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${BIN_DESTINATION})

#set compile flags
#add_definitions(-std=c++11 -g -rdynamic)
set(CMAKE_CXX_FLAGS "-g3 -rdynamic -std=c++11")
set(CMAKE_CXX_FLAGS_DEBUG "-g3 -O0 -fsanitize=address -fno-omit-frame-pointer -fsanitize=leak")
set(CMAKE_CXX_FLAGS_RELEASE "-O3 -DNDEBUG")

#include dirs
include_directories(./)

#link dirs
link_directories(${BIN_DESTINATION})

#libraries
SET(SRC_BASE_CALC base_calc.cpp)
add_library(base_calc SHARED ${SRC_BASE_CALC})

SET(SRC_ADD add_calc.cpp)
add_library(add SHARED ${SRC_ADD})
target_link_libraries(add base_calc)

SET(SRC_SUB sub_calc.cpp)
add_library(sub SHARED ${SRC_SUB})
target_link_libraries(sub base_calc)

SET(SRC_MULTI multi_calc.cpp)
add_library(multi SHARED ${SRC_MULTI})
target_link_libraries(multi base_calc)

SET(SRC_DIV div_calc.cpp)
add_library(div SHARED ${SRC_DIV})
target_link_libraries(div base_calc)


#execute 
SET(SRC_MAIN main.cpp calc_service.cpp)
set_target_properties(${PROJECT_NAME} PROPERTIES VERSION ${PROJECT_VERSION})    
add_executable( ${PROJECT_NAME} ${SRC_MAIN})
target_link_libraries(${PROJECT_NAME} add sub multi div pthread)
```

```cmake
/*
cmake版本
必选项。放在第一行，指定cmake最低版本。
*/
cmake_minimum_required(VERSION 3.10)  # 必须
/*
指定语言版本
这里其实是用set给默认变量CMAKE_CXX_STANDARD & CMAKE_C_STANDARD 赋值。
*/
set(CMAKE_CXX_STANDARD 14)  # C++14

/*
设置工程名字
这个应该可以必选项。工程名后面可选 加 语言类型。
指定的工程名，在后面可以通过变量${PROJECT_NAME}获取此值。
project(HelloWorld CXX)   # 可选指明是C++
project(HelloWorld C CXX) # C & C++
*/
project(HelloWorld)  #工程名

/*
指定头文件目录
include_directories后可以可以加SYSTEM标志，这个标志是告诉编译器将此目录视为系统目录，跳过某些编译检查。
一般不用加SYSTEM。
include_directories("../third-party/include/")
include_directories(SYSTEM "/usr/local/include/") # 可选SYSTEM

*/
include_directories("/usr/local/include/") # 头文件目录

/*
指定链接库目录
动态库或者静态目录

我查到了有两个函数link_libraries和target_link_libraries，这两者区别是 前者需放生成目标之前，后者放在生成目标之后。
link_libraries(pthread)   # 在add_executable前面
add_executable(${PROJECT_NAME} main.cpp)
或者
add_executable(${PROJECT_NAME} main.cpp)
target_link_libraries(${PROJECT_NAME} pthread) # 在add_executable后面，且第一参数为目标名。
Clion工程采用的是第一种方式。要是按照 编译-链接 的顺序，还是后者比较好理解。
*/
link_directories("/usr/local/lib/") # 链接库目录

/*
指明源码文件
可以用aux_source_directory(目录名 变量)来检索此目录下所有源文件。
或者使用FILE()函数检索。
aux_source_directory(. SRCS)          # 当前目录
aux_source_directory(../common/ SRCS)  # 上级目录

FILE(GLOB SRCS ${PROJECT_SOURCE_DIR}/*.cpp)  # 匹配源码目录所有.cpp文件
FILE(GLOB_RECURSE SRCS ${PROJECT_SOURCE_DIR}/*.cpp )  # 递归搜索匹配源码目录和其子目录下的.cpp文件
*/
aux_source_directory(. SRCS) # 源文件
aux_source_directory(./abc SRCS)

/*
生成可执行文件
add_executable(可执行文件名 源文件)，源文件可以是变量形式，或者后面加了一串源文件名。
*/
add_executable(${PROJECT_NAME} ${SRCS}) # 生成可执行文件，这里程序名即为功能名

/*
见上
*/
target_link_libraries(${PROJECT_NAME} pthread) # 链接库

/*
一般开源项目需要安装的，都有make install命令，这个命令是通过install函数实现的。

安装的时候一般都需要指定安装路径，cmake里面通过设置CMAKE_INSTALL_PREFIX来实现的，可以在执行cmake的时候直接指定，
比如cmake .. -DCMAKE_INSTALL_PREFIX=./local，Linux环境默认是/usr/local目录。

# 安装动态库到lib目录
install(TARGETS ${PROJECT_NAME} LIBRARY DESTINATION lib)  # 安装在 /usr/local/lib目录
install(TARGETS ${PROJECT_NAME} ARCHIVE DESTINATION lib)  # 多用于静态库

# 安装对外头文件
install(TARGETS ${XXXX} PUBLIC_HEADER DESTINATION include)

*/
# 下面使用install作为项目打包使用
set(CMAKE_INSTALL_PREFIX ./dist)  # 自定义安装目录，打包使用
install(TARGETS ${PROJECT_NAME} RUNTIME DESTINATION bin) # 打包二进制文件,安装在 /usr/local/bin目录

set(CONFIGS ${PROJECT_SOURCE_DIR}/hello.cf) 
install(FILES ${CONFIGS} DESTINATION config) # # 安装其他文件，比如配置文件


===============其他==============
/*
多级目录多个工程
可以使用add_subdirectory编译子目录中的cmake工程。
*/
add_subdirectory(subdir)

/*
输出方式
message函数输出，可以指定输出消息类型STATUS WARNING DEBUG等。
*/
message("hello")
message(STATUS ${PROJECT_NAME})

/*
常见宏（默认变量）
*/
  宏         说明
PROJECT_NAME      project()设置的工程名
PROJECT_SOURCE_DIR    工程源码目录，例如 ~/Hello/
PROJECT_BINARY_DIR    生成文件目录，例如 ~/Hello/build
```

```cmake
作者：pingo
链接：https://zhuanlan.zhihu.com/p/582352549
来源：知乎
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

CMAKE_MINIMUM_REQUIRED(VERSION 3.0.0)
PROJECT(test VERSION 0.1.0 LANGUAGE CXX)

### 3rd
INCLUDE_DIRECTORIES(../3rd/include)
INCLUDE_DIRECTORIES(../common)
LINK_DIRECTORIES(../3rd/lib)

### OpenCV
#SET(OpenCV_DIR "D:/ENV/opencv-4.5.2/build")
SET(OpenCV_DIR "D:/ENV/opencv-4.6.0/build")
FIND_PACKAGE(OpenCV REQUIRED)
INCLUDE_DIRECTORIES(${OpenCV_INCLUDE_DIRS})

### Eigen3
SET(Eigen3_DIR "D:/ENV/eigen-3.3.7/")
INCLUDE_DIRECTORIES(${Eigen3_DIR}/include/eigen3)
MESSAGE(STATUS "EIGEN3_INCLUDE_DIRS:${Eigen3_DIR}/include/eigen3")

### script: common
FILE(GLOB HEADERS_COMMON ../common/*.h ../common/*.hpp )
FILE(GLOB SOURCES_COMMON ../common/*.cpp ../common/*.cxx ../common/*.c )
SOURCE_GROUP("Common"  FILES ${HEADERS_COMMON})
SOURCE_GROUP("Common" FILES ${SOURCES_COMMON})
SET(SRC_COMMON ${HEADERS_COMMON} ${SOURCES_COMMON})
MESSAGE(STATUS "SRC_COMMON:${SRC_COMMON}")

### script: main
FILE(GLOB HEADERS_MAIN ./*.h ./*.hpp )
FILE(GLOB SOURCES_MAIN ./*.cpp ./*.cxx ./*.c )
#SOURCE_GROUP("common"  FILES ${HEADERS_MAIN})
#SOURCE_GROUP("common" FILES ${SOURCES_MAIN})
SET(SRC_MAIN ${HEADERS_MAIN} ${SOURCES_MAIN})
MESSAGE(STATUS "SRC_MAIN:${SRC_MAIN}")

### target: main
ADD_EXECUTABLE(test ${SRC_MAIN} ${SRC_COMMON})
SET_TARGET_PROPERTIES(test PROPERTIES
    DEBUG_POSTFIX d
    )
IF("${CMAKE_BUILD_TYPE}" MATCHES "Debug")
    TARGET_LINK_LIBRARIES(test ${OpenCV_LIBS})
ELSE()
    TARGET_LINK_LIBRARIES(test ${OpenCV_LIBS})
ENDIF ()

### target: library
ADD_EXECUTABLE(libTest ${SRC_MAIN} ${SRC_COMMON})
SET_TARGET_PROPERTIES(libTest PROPERTIES
    DEBUG_POSTFIX d
    )
IF("${CMAKE_BUILD_TYPE}" MATCHES "Debug")
    TARGET_LINK_LIBRARIES(libTest ${OpenCV_LIBS})
ELSE()
    TARGET_LINK_LIBRARIES(libTest ${OpenCV_LIBS})
ENDIF ()
## author: Mylaf
```

适用于编译同一目录中的多个源文件，且没有调用第三方库，最终编译成一个可执行文件的情况。

```cmake
# 1,设置工程名称，叫“Demo1”（在Linux下可以随便设置）
project( Demo1 )

# 2,设置 CMake 最低版本号，我电脑装的是3.5
cmake_minimum_required( VERSION 3.5 )

# 3,设定编译参数
set(CMAKE_CXX_STANDARD    11)  # 指定 C++ 版本
set(CMAKE_BUILD_TYPE "Release")  # 调试使用Debug，可以查看中间变量；发布使用Release，运行速度快

# 4，把当前文件夹下的源码列表（文件后缀匹配的那些文件）存到变量 SRCS 中
file( GLOB SRCS *.c *.cpp *.cc *.h *.hpp )

# 5，把源码编译成一个可执行文件，文件名为test01（可以随便取名），会保存在当前目录下
add_executable( test01 ${SRCS} )
```

适用于编译某一目录中的指定源文件，且没有调用第三方库，最终编译成一个可执行文件的情况。

```cmake
# 1,设置工程名称，叫“Demo2”，在Linux下可以随便设置
project( Demo2 )

# 2,设置 CMake 最低版本号，我电脑装的是3.5
cmake_minimum_required( VERSION 3.5 )

# 3,设定编译参数
set(CMAKE_CXX_STANDARD    11)  # 指定 C++ 版本
set(CMAKE_BUILD_TYPE "Release")  # 调试使用Debug，可以查看中间变量；发布使用Release，运行速度快

# 4，把源码编译成一个可执行文件，文件名为test02（可以随便取名），会保存在当前目录下
add_executable( test02 test02.cpp )
```

适用于cpp文件在一个文件夹(src/中)，头文件在另一个文件夹内（include/中），且没有调用第三方库，最终编译成一个可执行文件的情况。

```cmake
# 1,设置工程名称，叫“Demo3”，在Linux下可以随便设置
project( Demo3 )

# 2,设置 CMake 最低版本号，我电脑装的是3.5
cmake_minimum_required( VERSION 3.5 )

# 3,设定编译参数
set(CMAKE_CXX_STANDARD    11)  # 指定 C++ 版本
set(CMAKE_BUILD_TYPE "Release")  # 调试使用Debug，可以查看中间变量；发布使用Release，运行速度快

# 4,设定源码列表,查找指定目录下的所有源文件,并将名称保存到 DIR_SRCS 变量中
aux_source_directory(./src/ DIR_SRC)

# 5,设定头文件路径
include_directories(./include/)

# 6，把源码编译成一个可执行文件，文件名为test03（可以随便取名），会保存在当前目录下
add_executable( test03 ${DIR_SRC} )
```

适用于cpp文件在一个文件夹(src/中)，头文件在另一个文件夹内（include/中），且调用了第三方库（比如已经安装在系统中的opencv），最终编译成一个可执行文件的情况。

```cmake
# 1,设置工程名称，叫“Demo3”，在Linux下可以随便设置
project( Demo3 )

# 2,设置 CMake 最低版本号，我电脑装的是3.5
cmake_minimum_required( VERSION 3.5 )

# 3,设定编译参数
set(CMAKE_CXX_STANDARD    11)  # 指定 C++ 版本
set(CMAKE_BUILD_TYPE "Release")  # 调试使用Debug，可以查看中间变量；发布使用Release，运行速度快

# 4,设定源码列表,查找指定目录(都放在./src/中)中的所有源文件,并将名称保存到 DIR_SRCS 变量中
aux_source_directory(./src/ DIR_SRC)

# 5,设定头文件路径（还可以增加其他第三方库的头文件路径）
include_directories(./include/)

# 6,查找并添加OpenCV的头文件目录
find_package(OpenCV REQUIRED)  
# message( STATUS "    version: ${OpenCV_VERSION}" )  # 我电脑上装的是opencv3.3.1
# message( STATUS "    include path: ${OpenCV_INCLUDE_DIRS}" )
include_directories(${OpenCV_INCLUDE_DIRS})

# 7，把源码编译成一个可执行文件，文件名为test03（可以随便取名），会保存在当前目录下
add_executable( test04 ${DIR_SRC} )
target_link_libraries( test04 ${OpenCV_LIBS} )  # 可执行文件名 链接 OpenCV库
```

使用cmake构建一个工程，该工程创建了两个静态库，另外生成一个引用这两个静态库的可执行文件。

```cmake
cmake_minimum_required (VERSION 3.5)                                # cmake版本最低要求
project (test5)  # 设置工程名称

SET(EXECUTABLE_OUTPUT_PATH ${PROJECT_SOURCE_DIR}/bin)        # 设置可执行文件的输出目录
SET(LIBRARY_OUTPUT_PATH ${PROJECT_SOURCE_DIR}/lib)        # 设置库文件的输出目录

include_directories (${PROJECT_SOURCE_DIR}/inc)                # 添加头文件目录，可以添加多个，或多次添加

# refer：https://www.jianshu.com/p/07acea4e86a3
ADD_SUBDIRECTORY(${PROJECT_SOURCE_DIR}/libsrc)                # 先执行这个目录下的cmake生成静态库
ADD_SUBDIRECTORY(${PROJECT_SOURCE_DIR}/src)                        # 在生成库后，此时再链接库生成可执行文件
```

```cmake
# 发现一个目录下所有的源代码文件并将列表存储在一个变量中
aux_source_directory(${PROJECT_SOURCE_DIR}/src SRC_LIST)  # 设置./src为源文件路径

add_executable (test5 ${SRC_LIST})                        # 寻找源文件来编译可执行文件
target_link_libraries(test5 
        ${PROJECT_SOURCE_DIR}/lib/libadd.a 
        ${PROJECT_SOURCE_DIR}/lib/libmul.a)                # 编译时需要链接的静态库
```

```cmake
# refer：cmake : add_library详解：https://blog.csdn.net/LaineGates/article/details/108242803
# 生成静态库，name属性必须全局唯一
add_library(add STATIC ${PROJECT_SOURCE_DIR}/libsrc/add.cpp)
add_library(mul STATIC ${PROJECT_SOURCE_DIR}/libsrc/mul.cpp)
```

只有一个动态库subadd，另外生成一个引用该库的可执行文件main。

```cmake
# 父目录下的CMakeLists.txt
cmake_minimum_required(VERSION 3.5)  # cmake版本最低要求
project(main)  # 设置工程名称

# sub子模块
include_directories(sub)  # 添加头文件查找路径
add_subdirectory(sub)  # 会编译子模块生成静态库，默认保存位置：build/sub/libsubadd.a

add_executable(main main.cpp)
target_link_libraries(main subadd)  # 会链接静态库subadd
```

```cmake
add_library(subadd add.cpp)  # 生成动态库libsubadd.a，subadd这个名字可以自定义
```

使用cmake构建一个工程，每个子模块都有自己的cmakelists，该工程创建了两个静态库和一个动态库，另外生成一个调用这些库的可执行文件。

```cmake
cmake_minimum_required(VERSION 3.5)  # cmake版本最低要求
project(test7)  # 设置工程名称

set(CMAKE_CXX_STANDARD 11)  # 指定 C++ 版本
set(CMAKE_BUILD_TYPE Release)  # 调试使用Debug，可以查看中间变量；发布使用Release，运行速度快

message("${PROJECT_SOURCE_DIR}=" ${PROJECT_SOURCE_DIR})

# 这里设置好路径后，进入子模块的cmake时不用再次设置
SET(EXECUTABLE_OUTPUT_PATH ${PROJECT_SOURCE_DIR}/bin)  # 设置可执行文件的输出目录
SET(LIBRARY_OUTPUT_PATH ${PROJECT_SOURCE_DIR}/lib)           # 设置库文件的输出目录

ADD_SUBDIRECTORY(${PROJECT_SOURCE_DIR}/source/add)     # 会调用该目录中的CMakeLists.txt进行编译生成静态库
ADD_SUBDIRECTORY(${PROJECT_SOURCE_DIR}/source/sub)     # 会调用该目录中的CMakeLists.txt进行编译生成静态库
ADD_SUBDIRECTORY(${PROJECT_SOURCE_DIR}/source/mul)     # 会调用该目录中的CMakeLists.txt进行编译生成动态库
ADD_SUBDIRECTORY(${PROJECT_SOURCE_DIR}/source/main)    # 会调用该目录中的CMakeLists.txt进行编译生成可执行文件
```

```cmake
# 编译成静态库, libadd.a
# 方法一：逐个添加cpp源文件，适用于文件数量少的情况
# add_library(add ${CMAKE_CURRENT_SOURCE_DIR}/add.cpp ${CMAKE_CURRENT_SOURCE_DIR}/add3.cpp)

# 方法二：搜索有的cpp源文件，并将列表存储在一个变量中，适用于文件多的情况
aux_source_directory(${CMAKE_CURRENT_SOURCE_DIR} SRC_LIST)
add_library(add ${SRC_LIST})

# 方法三：递归遍历目录，获取所有的CPP文件，适用于多级目录的情况
# file(GLOB_RECURSE cpp_files  ${CMAKE_CURRENT_SOURCE_DIR}/*.cpp)  # GLOB是不递归
# add_library(add ${cpp_files})
```

```cmake
# 编译成动态库libmul.so
add_library(mul SHARED ${CMAKE_CURRENT_SOURCE_DIR}/mul.cpp)
```

```cmake
# 编译成静态库, libsub.a
add_library(sub ${CMAKE_CURRENT_SOURCE_DIR}/sub.cpp)
```

```cmake
# 添加头文件路径，会检索目录中的所有头文件
include_directories(${CMAKE_CURRENT_SOURCE_DIR}/../add
                    ${CMAKE_CURRENT_SOURCE_DIR}/../sub
                    ${CMAKE_CURRENT_SOURCE_DIR}/../mul
                    ${CMAKE_CURRENT_SOURCE_DIR}/../main)

# 把源码编译成一个可执行文件
add_executable(main ./main.cpp)
# 添加链接库，动态和静态都行
target_link_libraries(main add sub mul)
```
