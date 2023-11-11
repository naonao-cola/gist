
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
