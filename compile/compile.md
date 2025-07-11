﻿## xmake
### xmake常见问题

常见问题解答，参考链接：

https://zhuanlan.zhihu.com/p/611388172


非官方的xmake教程,参考链接:

https://www.zhihu.com/column/c_1537535487199281152?utm_source=wechat_session&utm_medium=social&utm_oi=953224858981593088

xmake 远程包管理入门,参考链接:

https://zhuanlan.zhihu.com/p/412503965

### 命令行

```bash
xmake create -l C++ -P ./hello

#清除配置
xmake f -c
#清除所有东西，包括缓存，生成的
xmake clean -a
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
# 调用clang-tidy 检查代码
xmake check clang-tidy

xmake project -k vsxmake2022 -m "release,debug" v2022

# 快速检测系统上指定的包信息,请切换到非工程目录下执行上面的命令
xmake l find_package x264
# 追加第三方包管理器前缀来测试
xmake l find_package conan::OpenSSL/1.0.2g
# 图形化菜单
xmake f --menu
#下载安装好Cuda SDK后，在macosx上会默认安装到/Developer/NVIDIA/CUDA-x.x目录下，Windows上可以通过CUDA_PATH的环境
#变量找到对应的SDK目录，而 Linux下默认会安装到/usr/local/cuda目录下
#手动指定Cuda SDK环境目录：
xmake f --cuda=/usr/local/cuda-9.1/
#或者通过xmake g/global命令切到全局设置，避免每次切换编译模式都要重新配置一遍。
xmake g --cuda=/usr/local/cuda-9.1/
#如果想要测试xmake对当前cuda环境的探测支持，可以直接运行
xmake l detect.sdks.find_cuda

#生成cmakelists.txt
xmake project -k cmakelists
#生成compiler_commands
xmake project -k compile_commands


add_requires("opencv",{system = true})
add_packages("opencv")
# 使用pkg-config
add_ldflags("$(shell pkg-config --libs --cflags opencv)")

cuda 源文件中的 device 函数需要被 device-link 且只 device-link 一次。在 shared 或 binary 的 target 上 xmake 会自动进行 device-link ，这时它们依赖的 static target 也会同时被 device-link ，因此默认情况下 static target 不会被 device-link。然而，如果最终的 shared 或 binary 的 target 不包含任何 cuda 源文件，则不会发生 device-link 阶段，导致出现 undefined reference 错误。这种情况下，需要手动为 static target 指定

add_values("cuda.build.devlink", true).

# 查看内置规则
xmake show -l rules

#添加cuda
add_rules("cuda")
add_cugencodes("native")
add_cuflags("-allow-unsupported-compiler")
# 如果目标类型是静态库
if is_kind("static") then
    #-- 设置 CUDA 开发链接为 true
    set_policy("build.cuda.devlink", true)
else
    add_defines("ENABLE_DEPLOY_BUILDING_DLL")
end

#查看库的可选配置
xmake require --info boost
# 删除库, 加引号
xrepo remove "opencv 4.8.0"

#离线包搜索目录
xmake g --pkg_searchdirs="/download/packages"

# 设置代理
xmake g --proxy_pac=E:/demo/xmake/pac.lua
#pac.lua文件
``` lua
function mirror(url)
     --return string.format("https://github.moeyy.xyz/%s", url)
	 return url:gsub("https://github.com", "https://github.moeyy.xyz/https://github.com")
end
```

```
其他命令
```bash
# 命令行执行脚本
xmake lua .\env.lua
# 查看内置脚本
xmake lua -l

#进入交互式命令行
xmake lua
# 显示内置编译规则列表
xmake show -l rules
# 显示内置编译模式列表
xmake show -l buildmodes

# 显示指定 target 配置信息
xmake show -t tbox

# 显示工具链列表
xmake show -l toolchains
# 显示xmake自身和当前项目的基础信息
xmake show
```
### 调试

参考链接：

https://xmake.io/mirror/zh-cn/guide/faq.html

首先，我们需要在 VSCode 的插件市场安装 VSCode-EmmyLua 插件，然后执行下面的命令更新下 xmake-repo 仓库保持最新。`xrepo update-repo`, Xmake 也需要保持最新版本。

然后，在自己的工程目录下执行以下命令

`xrepo env -b emmylua_debugger -- xmake build`

其中 xrepo env -b emmylua_debugger 用于绑定 EmmyLua 调试器插件环境，而 -- 后面的参数，就是我们实际需要被调试的 xmake 命令。

通常我们仅仅调试 xmake build 构建，如果想要调试其他命令，可以自己调整，比如想要调试 xmake install -o /tmp 安装命令，那么可以改成：

`xrepo env -b emmylua_debugger -- xmake install -o /tmp`

执行完上面的命令后，它不会立即退出，会一直处于等待调试状态，有可能没有任何输出。这个时候，我们不要急着退出它，继续打开 VSCode，并在 VSCode 中打开 Xmake 的 Lua 脚本源码目录。也就是这个目录：Xmake Lua Scripts，我们可以下载的本地，也可以直接打开 Xmake 安装目录中的 lua 脚本目录。然后切换到 VSCode 的调试 Tab 页，点击 RunDebug -> Emmylua New Debug 就能连接到我们的 xmake build 命令调试端，开启调试。

如下图所示，默认的起始断点会自动中断到 debugger:_start_emmylua_debugger 内部，我们可以点击单步跳出当前函数，就能进入 main 入口。

![](../cxx/images/xmake_1.png)

然后设置自己的断点，点击继续运行，就能中断到自己想要调试的代码位置。我们也可以在项目工程的配置脚本中设置断点，也可以实现快速调试自己的配置脚本，而不仅仅是 Xmake 自身源码。

![](../cxx/images/xmake_2.png)

### lua脚本
```bash
# 编译模式选择
add_rules("mode.debug", "mode.release","mode.releasedbg")

# 增加自动生成compile_commands.json文件
add_rules("plugin.compile_commands.autoupdate", {outputdir = ".vscode"})

#自定义选项
## 定义选项
option("tensorrt")
    set_showmenu(true)
    set_description("TensorRT Path. Example: /usr/local/tensorrt")
    on_check(function (option)
        if not option:enabled() then
            raise("TensorRT path is not set. Please specify the TensorRT path.")
        end
    end)

target("deploy")
    set_languages("cxx17")
    -- add_packages("opencv")
    set_targetdir("$(projectdir)/lib")

    -- 添加库目录
    add_includedirs("$(projectdir)/include", {public = true})

    -- 添加文件
    add_files("$(projectdir)/source/**.cpp", "$(projectdir)/source/**.cu")

    -- 设置目标类型
    set_kind("$(kind)")

    -- 如果目标类型是静态库
    if is_kind("static") then
        -- 设置 CUDA 开发链接为 true
        set_policy("build.cuda.devlink", true)
    else
        add_defines("ENABLE_DEPLOY_BUILDING_DLL")
    end

    -- 添加 cuda
    add_rules("cuda")
    add_cugencodes("native")

    -- 添加TensorRT链接目录和链接库
    if has_config("tensorrt") then
        add_includedirs(path.join("$(tensorrt)", "include"))
        add_linkdirs(path.join("$(tensorrt)", "lib"))
        add_links("nvinfer", "nvinfer_plugin", "nvparsers", "nvonnxparser")
    end


## 导出函数包含cuda的device函数是静态库时
## 如果目标类型是静态库
    if is_kind("static") then
        ## 设置 CUDA 开发链接为 true
        set_policy("build.cuda.devlink", true)
    else
        add_defines("ENABLE_DEPLOY_BUILDING_DLL")
    end
```

### vscode配置

代码调试配置
```bash
## 调试器建议为codelldb， lsp为clangd,可视化文件在自定义符号配置里
{
    "clangd.arguments": [
        "--compile-commands-dir=.vscode", // 编译数据库(compile_commands.json 文件)的目录位
    ],
    "xmake.customDebugConfig": {
        "visualizerFile": "/home/naonao/Downloads/nlohmann_test/hello/nlohmann_json.natvis",
        "showDisplayString": true,
    },
}
```

### xrepo


### 模板

第一个项目

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

第二个项目

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

第三个项目
```lua
set_project("tvt")

set_version("1.0.1")

add_rules("mode.debug", "mode.release")
--add_requires("openmp")
set_languages("c++17")

if is_plat("windows") then
	add_syslinks("opengl32")
	add_syslinks("gdi32")
	add_syslinks("advapi32")
	add_syslinks("glu32")
	add_syslinks("ws2_32")
	add_syslinks("user32")
	add_syslinks("comdlg32")


end

if is_os("windows") then
	set_toolchains("msvc",{vs="2019"})
end

if is_mode "debug" then
    add_defines("DEBUG")
    set_symbols "debug"
    set_optimize "none"
    set_runtimes("MT")
end

if is_mode "release" then
    --set_symbols "hidden"
    --set_optimize "fastest"
	set_runtimes("MT")
	--调试时打开下面两个
	set_optimize "none"
    set_symbols("debug")
	add_cxxflags("/openmp")
    add_ldflags("-lopenmp")
end


add_includedirs("./3rdparty/binn")

add_includedirs("./3rdparty/fmt/include")
add_linkdirs("./3rdparty/fmt/lib")
add_links("fmt","fmtd")

add_includedirs("./3rdparty/nlohmann_json/include")


add_includedirs("./3rdparty/opencv4.5.3/include")
add_linkdirs("./3rdparty/opencv4.5.3/x64/vc16/staticlib")
add_links("ade",
"libjpeg-turbo",
"libpng",
"libprotobuf",
"libtiff",
"libwebp",
"opencv_aruco453",
"opencv_barcode453",
"opencv_bgsegm453",
"opencv_bioinspired453",
"opencv_calib3d453",
"opencv_ccalib453",
"opencv_core453",
"opencv_datasets453",
"opencv_dnn453",
"opencv_dnn_objdetect453",
"opencv_dnn_superres453",
"opencv_dpm453",
"opencv_face453",
"opencv_features2d453",
"opencv_flann453",
"opencv_fuzzy453",
"opencv_gapi453",
"opencv_hfs453",
"opencv_highgui453",
"opencv_imgcodecs453",
"opencv_imgproc453",
"opencv_img_hash453",
"opencv_intensity_transform453",
"opencv_line_descriptor453",
"opencv_mcc453",
"opencv_ml453",
"opencv_objdetect453",
"opencv_optflow453",
"opencv_phase_unwrapping453",
"opencv_photo453",
"opencv_plot453",
"opencv_quality453",
"opencv_rapid453",
"opencv_reg453",
"opencv_rgbd453",
"opencv_saliency453",
"opencv_shape453",
"opencv_stereo453",
"opencv_stitching453",
"opencv_structured_light453",
"opencv_superres453",
"opencv_surface_matching453",
"opencv_text453",
"opencv_tracking453",
"opencv_video453",
"opencv_videoio453",
"opencv_videostab453",
"opencv_wechat_qrcode453",
"opencv_xfeatures2d453",
"opencv_ximgproc453",
"opencv_xobjdetect453",
"opencv_xphoto453",
"quirc",
"zlib")

add_includedirs("./3rdparty/tvcore/include")
add_linkdirs("./3rdparty/tvcore/lib")
add_links("libzbar","license","tvcore")

--自动更新vs解决方案结构
add_rules("plugin.vsxmake.autoupdate")
set_encodings("source:utf-8")

add_linkdirs("src/custom/sub_3rdparty/tival/lib")
add_links("tival_advanced")


target("tv_algorithm")
	set_kind("shared")
	--add_packages("openmp")
    add_headerfiles("src/framework/*h")
	add_files("src/framework/*cpp")
    add_headerfiles("src/custom/*h")
	add_headerfiles("src/custom/*hpp")
	add_files("src/custom/*cpp")
	add_headerfiles("src/example/*h")
	add_files("src/example/*cpp")
    add_headerfiles("src/utils/*h")
	add_files("src/utils/*cpp")
    add_headerfiles("src/*.h")
	add_files("src/*.cpp")
	--add_defines("DEBUG_ON")
    add_defines("EXPORT_API")
	add_headerfiles("src/custom/sub_3rdparty/tival/include/**h")

target("test_dll")
    set_kind("binary")
	add_deps("tv_algorithm")
    add_defines("EXPORT_API")
    add_headerfiles("test/fs.h")
	add_files("test/main.cpp")
	add_files("test/fs.cpp")
	--add_files("src/utils/easylogging++.cpp")


target("test_exe")
	set_kind("binary")
    add_headerfiles("src/framework/*h")
	add_files("src/framework/*cpp")
    add_headerfiles("src/example/*h")
	add_files("src/example/*cpp")
    add_headerfiles("src/utils/*h")
	add_files("src/utils/*cpp")
    add_headerfiles("src/*.h")
	add_files("src/*.cpp")

	add_includedirs("./3rdparty/co/include")
	add_linkdirs("./3rdparty/co/lib")
	add_links("co")

    add_headerfiles("test/**.h")
    add_files("test/*.cpp|main.cpp")


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

第四个项目,参考链接：

https://github.com/star-hengxing/clipboard-url-clear/tree/main

外层 .xmake.lua
```lua
set_project("clipboard-url-clear")

set_version("0.0.3")

set_xmakever("2.8.5")

set_allowedplats("windows")
set_allowedmodes("debug", "release")

set_languages("c++20")

set_warnings("all")
add_rules("mode.debug", "mode.release")

if is_mode("debug") then
    set_policy("build.warning", true)
elseif is_mode("release") then
    set_optimize("smallest")
end

if is_plat("windows") then
    set_runtimes(is_mode("debug") and "MDd" or "MT")
    add_defines("UNICODE", "_UNICODE")
    add_cxflags("/permissive-", {tools = "cl"})
end

set_encodings("utf-8")

includes("src", "xmake", "test")
```
内层./xmake/xmake.lua

```lua
-- third party libraries
includes("package.lua")
-- project option
-- includes("option.lua")
-- project module config
includes("rule/module.lua")
-- project debug tool
includes("rule/debug.lua")
```
内层./xmake/package.lua
```lua
-- dev

if is_mode("debug") then
    add_requireconfs("*", {configs = {shared = true}})
end

package("fast_io")
    set_kind("library", {headeronly = true})
    set_homepage("https://github.com/cppfastio/fast_io")
    set_description("Significantly faster input/output for C++20")
    set_license("MIT")

    add_urls("https://github.com/cppfastio/fast_io.git")
    add_versions("2023.11.06", "804d943e30df0da782538d508da6ea6e427fc2cf")

    on_install("windows", "linux", "macosx", "msys", "mingw", function (package)
        os.cp("include", package:installdir())
    end)

    on_test(function (package)
        assert(package:check_cxxsnippets({test = [[
            #include <fast_io.h>
            void test() {
                fast_io::io::print("Hello, fast_io world!\n");
            }
        ]]}, {configs = {languages = "c++20"}}))
    end)
package_end()

-- cross-platform clipboard api
add_requires("clip 1.5")
-- https
add_requires("cpr 1.10.3", {configs = {ssl = true}})
-- url
add_requires("ada v2.6.7")
-- debug/concat
add_requires("fast_io")

add_requires("cppitertools")

if is_plat("windows") and is_mode("release") then
    add_requires("vc-ltl5 5.0.7")
end

-- test

add_requires("boost_ut v1.1.9", {optional = true})
```
目录 ./xmake/rule/debug.lua
```lua
rule("debug.asan")
    on_load(function (target)
        if not is_mode("debug") then
            return
        end

        import("lib.detect.find_tool")
        import("core.base.semver")

        target:add("cxflags", "-fsanitize=address")
        target:add("mxflags", "-fsanitize=address")
        target:add("ldflags", "-fsanitize=address")
        target:add("shflags", "-fsanitize=address")

        if not target:get("symbols") then
            target:set("symbols", "debug")
        end

        if target:is_plat("windows") and target:is_binary() then
            local msvc = target:toolchain("msvc")
            if msvc then
                local envs = msvc:runenvs()
                local vscmd_ver = envs and envs.VSCMD_VER
                if vscmd_ver and semver.match(vscmd_ver):ge("17.7") then
                    local cl = assert(find_tool("cl", {envs = envs}), "cl not found!")
                    target:add("runenvs", "Path", path.directory(cl.program))
                end
            end
        end
    end)
```
./xmake/rule/module.lua
```lua
rule("module.program")
    on_load(function (target)
        target:set("kind", "binary")
        target:set("rundir", "$(projectdir)")
        if target:is_plat("windows") and target:get("runtimes") == "MT" then
            target:add("packages", "vc-ltl5")
        end
    end)

    after_link(function (target)
        local enabled = target:extraconf("rules", "module.program", "upx")
        if (not enabled) or (not is_mode("release")) then
            return
        end

        import("core.project.depend")
        import("lib.detect.find_tool")

        local targetfile = target:targetfile()
        depend.on_changed(function ()
            local file = path.join("build", path.filename(targetfile))
            local upx = assert(find_tool("upx"), "upx not found!")

            os.tryrm(file)

            local argv = table.wrap(target:values("upx.flags"))
            table.insert(argv, targetfile)
            table.insert(argv, "-o")
            table.insert(argv, file)
            os.vrunv(upx.program, argv)
        end, {files = targetfile})
    end)

rule("module.component")
    on_load(function (target)
        if is_mode("debug") then
            target:set("kind", "shared")
            if target:is_plat("windows") then
                import("core.project.rule")
                local rule = rule.rule("utils.symbols.export_all")
                target:rule_add(rule)
                target:extraconf_set("rules", "utils.symbols.export_all", {export_classes = true})
            end
        elseif is_mode("release") then
            target:set("kind", "static")
        end
    end)

rule("module.test")
    on_load(function (target)
        target:set("default", false)
        target:set("policy", "build.warning", true)
        target:set("rundir", os.projectdir())
        target:set("group", "test")
        target:add("packages", "boost_ut")
    end)
```
./test/xmake.lua
```lua
add_rules("module.test")

target("test")
    set_kind("binary")
    add_tests("default")

    add_files("test.cpp")
    add_includedirs(path.join("$(projectdir)", "src"))

    add_cxxflags("cl::-wd4003")

    add_deps("component")
```
./src/xmake.lua
```lua
if is_plat("windows") then
    add_defines("WIN32_LEAN_AND_MEAN")
end

target("component")
    set_kind("$(kind)")
    add_rules("module.component")
    add_files("*.cpp|main.cpp")
    add_headerfiles("*.hpp")

    add_cxxflags("cl::-wd4003")

    add_packages("clip", "cpr", "ada", "fast_io", "cppitertools")

target("clear")
    add_rules("module.program", {upx = true})
    set_values("upx.flags", "--best")

    add_files("main.cpp")

    if is_plat("windows") then
        add_syslinks("user32")
    end

    add_deps("component")

```
## cmake

### 调用三方库

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

### 模板

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


## opencv
### 安卓交叉编译

参考链接

https://blog.csdn.net/manonggou/article/details/106105111

https://blog.51cto.com/u_16213462/13137452

https://blog.csdn.net/peterwanye/article/details/129797789

```bash

#生成工具链

./build/tools/make-standalone-toolchain.sh --arch=arm64 --platform=android-26 --install-dir=/home/naonao/demo/3rdparty/my_toolchain


# 下载安卓NDK  https://github.com/android/ndk/wiki/Unsupported-Downloads
#设置环境变量
export ANDROID_NDK=/path/to/android-ndk


# 进入opencv
cd opencv
mkdir build && cd build

cmake -DCMAKE_TOOLCHAIN_FILE=$ANDROID_NDK/build/cmake/android.toolchain.cmake \
-DCMAKE_ANDROID_NDK=$ANDROID_NDK \
-DANDROID_NATIVE_API_LEVEL=26 \
-DBUILD_ANDROID_PROJECTS=OFF \
-DBUILD_ANDROID_EXAMPLES=OFF \
-DANDROID_STL=c++_shared \
-DBUILD_SHARED_LIBS=ON \
-DCMAKE_BUILD_TYPE=Release  \
-DBUILD_JAVA=OFF  \
-DANDROID_ABI=arm64-v8a \
-DCMAKE_INSTALL_PREFIX=/home/naonao/demo/3rdparty/test/opencv410_android ..

sudo make -j8

sudo make install

# 其他问题 libtinfo5 的问题
# https://askubuntu.com/questions/1531760/how-to-install-libtinfo5-on-ubuntu24-04
sudo apt update
wget http://security.ubuntu.com/ubuntu/pool/universe/n/ncurses/libtinfo5_6.3-2ubuntu0.1_amd64.deb
sudo apt install ./libtinfo5_6.3-2ubuntu0.1_amd64.deb


# apt的问题
# https://askubuntu.com/questions/908800/what-does-this-apt-error-message-download-is-performed-unsandboxed-as-root
Download is performed unsandboxed as root as file '/var/cache/apt/archives/partial/samba-libs_2%3a4.5.8+dfsg-0ubuntu0.17.04.1_i386.deb' couldn't be accessed by user '_apt'. - pkgAcquire::Run (13: Permission denied)

sudo chown -Rv _apt:root /var/cache/apt/archives/partial/
sudo chmod -Rv 700 /var/cache/apt/archives/partial/
```

CMakeLists的编写

```cmake

cmake_minimum_required(VERSION 3.10)
project(OpenCVExample)

SET(EXECUTABLE_OUTPUT_PATH ${PROJECT_SOURCE_DIR}/bin)

set(CMAKE_INSTALL_PREFIX "../install")
set(OpenCV_DIR /home/naonao/demo/3rdparty/test/opencv410_android/sdk/native/jni) # xxxx目录包含OpenCVConfig.cmake
find_package(OpenCV REQUIRED) # 找到opencv库
message(${OpenCV_LIBRARIES})
include_directories(${OpenCV_INCLUDE_DIRS})
# aux_source_directory(./src SRCS)

FILE(GLOB SRCS ./src/*.cpp)
add_executable(${PROJECT_NAME} ${SRCS}) # *.cpp指要编译的那些源文件

target_link_libraries(${PROJECT_NAME} ${OpenCV_LIBRARIES})
install(TARGETS ${PROJECT_NAME}
    RUNTIME DESTINATION bin # 可执行文件安装路径
)

```

``` bash
export ANDROID_NDK=/home/naonao/demo/3rdparty/android-ndk-r17c
## 编译命令
cmake -DCMAKE_TOOLCHAIN_FILE=$ANDROID_NDK/build/cmake/android.toolchain.cmake \
    -DANDROID_ABI="arm64-v8a" \
    -DANDROID_NDK=$ANDROID_NDK \
    -DANDROID_PLATFORM=android-26 \
	-DANDROID_STL=c++_shared \
    ..

# 将 libc++_shared.so push 到板子上

adb push libc++_shared.so /data/www_test
# 板子上执行需要 环境变量
export LD_LIBRARY_PATH=/data/www_test/:$LD_LIBRARY_PATH

#执行
./OpenCVExample
```

```cmake
cmake_minimum_required(VERSION 3.10)

SET(CMAKE_TOOLCHAIN_FILE /home/naonao/demo/3rdparty/android-ndk-r17c/build/cmake/android.toolchain.cmake)
SET(ANDROID_ABI "arm64-v8a")
SET(ANDROID_NDK /home/naonao/demo/3rdparty/android-ndk-r17c)
SET(ANDROID_PLATFORM android-26)
SET(ANDROID_STL c++_shared)
SET(CMAKE_VERBOSE_MAKEFILE ON)

message(STATUS "${CMAKE_TOOLCHAIN_FILE}")
message(STATUS "${ANDROID_ABI}")
message(STATUS "${ANDROID_NDK}")
message(STATUS "${ANDROID_PLATFORM}")
message(STATUS "${ANDROID_STL}")

project(OpenCVExample)

if(NOT WIN32)
    string(ASCII 27 Esc)
    set(ColourReset "${Esc}[m")
    set(ColourBold "${Esc}[1m")
    set(Red "${Esc}[31m")
    set(Green "${Esc}[32m")
    set(Yellow "${Esc}[33m")
    set(Blue "${Esc}[34m")
    set(Magenta "${Esc}[35m")
    set(Cyan "${Esc}[36m")
    set(White "${Esc}[37m")
    set(BoldRed "${Esc}[1;31m")
    set(BoldGreen "${Esc}[1;32m")
    set(BoldYellow "${Esc}[1;33m")
    set(BoldBlue "${Esc}[1;34m")
    set(BoldMagenta "${Esc}[1;35m")
    set(BoldCyan "${Esc}[1;36m")
    set(BoldWhite "${Esc}[1;37m")
endif()

# install 设置
SET(EXECUTABLE_OUTPUT_PATH ${PROJECT_SOURCE_DIR}/bin)
set(CMAKE_INSTALL_PREFIX "../install")

# opencv
# xxxx目录包含OpenCVConfig.cmake
set(OpenCV_DIR /home/naonao/demo/3rdparty/test/opencv410_android/sdk/native/jni)
find_package(OpenCV REQUIRED)
message(STATUS "${Green} OpenCV_LIBRARIES is: ${OpenCV_LIBRARIES}")

# include
include_directories(${OpenCV_INCLUDE_DIRS})
message(STATUS "${Green} OpenCV_INCLUDE_DIRS is: ${OpenCV_INCLUDE_DIRS}")


# source
FILE(GLOB SRCS ./src/*.cpp)
add_executable(${PROJECT_NAME} ${SRCS}) # *.cpp指要编译的那些源文件
message(STATUS "${Green} Source file is: ${SRCS}")
message(" ${ColourReset}")

# link
target_link_libraries(${PROJECT_NAME} ${OpenCV_LIBRARIES}) # install


install(TARGETS ${PROJECT_NAME}
    RUNTIME DESTINATION bin # 可执行文件安装路径
)
message(STATUS "Include directories: ${INCLUDE_DIRECTORIES}")

```


```lua
set_project("test")
set_version("0.0.1")
set_languages("c++11")
add_rules("mode.release")

--显示构建目标路径
rule("rule_display")
     after_build(function (target)
     cprint("${green}  BIUD TARGET: %s", target:targetfile())
    end)
rule_end()


set_plat("android")
set_arch("arm64-v8a")
set_config("ndk", "/home/naonao/demo/3rdparty/android-ndk-r17c")
set_config("ndk_sdkver", "26")
set_config("runtimes", "c++_shared")


--[[
OpenCVConfig.cmake 文件的路径
方式一，自动添加路径
add_requires("cmake::OpenCV", {alias = "opencv", system = true,configs = {envs = {CMAKE_PREFIX_PATH = "/home/naonao/demo/3rdparty/test/opencv410_android/sdk/native/jni"}}})
add_packages("opencv")
方式二，手动添加opencv 的路径
add_includedirs(
        "$(projectdir)",
        "/home/naonao/demo/3rdparty/test/opencv410_android/sdk/native/jni/include"
    )
    add_linkdirs("/home/naonao/demo/3rdparty/test/opencv410_android/sdk/native/libs/arm64-v8a"

    )
    add_links("opencv_calib3d",
    "opencv_core",
    "opencv_dnn",
    "opencv_features2d",
    "opencv_flann",
    "opencv_gapi",
    "opencv_imgcodecs",
    "opencv_imgproc",
    "opencv_ml",
    "opencv_objdetect",
    "opencv_photo",
    "opencv_stitching",
    "opencv_video",
    "opencv_videoio")
--]]
add_requires("cmake::OpenCV", {alias = "opencv", system = true,configs = {envs = {CMAKE_PREFIX_PATH = "/home/naonao/demo/3rdparty/test/opencv410_android/sdk/native/jni"}}})


target("test02")
    set_kind("binary")
    add_packages("opencv")
    add_includedirs(
        "$(projectdir)"
        --"/home/naonao/demo/3rdparty/test/opencv410_android/sdk/native/jni/include"
    )
    -- add_linkdirs("/home/naonao/demo/3rdparty/test/opencv410_android/sdk/native/libs/arm64-v8a")
    -- add_links("opencv_calib3d",
    -- "opencv_core",
    -- "opencv_dnn",
    -- "opencv_features2d",
    -- "opencv_flann",
    -- "opencv_gapi",
    -- "opencv_imgcodecs",
    -- "opencv_imgproc",
    -- "opencv_ml",
    -- "opencv_objdetect",
    -- "opencv_photo",
    -- "opencv_stitching",
    -- "opencv_video",
    -- "opencv_videoio")

    add_ldflags(
        "--sysroot /home/naonao/demo/3rdparty/android-ndk-r17c/platforms/android-26/arch-arm64"
    )
    add_files("src/*.cpp")

```