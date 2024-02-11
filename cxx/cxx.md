## 现代c++ 教程
高速上手C++ 11/14/17/20参考链接：

https://changkun.de/modern-cpp/pdf/modern-cpp-tutorial-zh-cn.pdf

https://zhuanlan.zhihu.com/p/266554398

https://github.com/changkun/modern-cpp-tutorial


c++那些事，参考链接：

https://light-city.github.io/

## 编码
跨win/linux项目的编码选择和编译选项设置，首选： UTF-8 With BOOM，以下是对编码造成问题的说明,参考链接

 https://github.com/lovepika/thinking_file_encoding_cpp

Visual Studio Code 配置 C/C++ 开发环境的最佳实践(VSCode + Clangd + XMake),参考链接

https://zhuanlan.zhihu.com/p/398790625

---

## c++代码调试的艺术

微信读书，讲解了VS2022的调试，以及linux下c++的调试技巧,参考链接:

https://weread.qq.com/web/reader/423320c07228f7b6423975a

在VS studio中调试dll的方法(软件调用dll)，可以附加到进程，也可以开启本地调试,参考链接：

https://blog.csdn.net/daidi1989/article/details/79916399

在VS studio查看内存的办法

```c++
#可以查看此地址的内存变量，适用于指针数组
（float*）,0xxxx00000,1000
```

---

## c++性能优化

要优化程序执行效率，第一步就是发现执行过程中的热点问题。大多数情况下，需要依靠专门的工具采集信息，并且将性能问题可视化。比如：火焰图、调用链路耗时分布图，cpu cache命中次数，段页切换次数等。
常见工具：gpref，valgrind，profiling(CLion内置，可一键生成火焰图)，SLS（特别适用于分布式场景，强烈推荐），vld，Arthas(阿里出品，Java程序性能分析神器)，apiMonitor，permon(windows自带性能分析工具)

参考链接：http://www.chunel.cn/archives/topic-01-performanceoptimization

---

## C++ DLL导出类 知识大全

普通的导入导出C++类的方式都是使用_declspec(dllexport) /_declspec(dllimport)来导入导出类，但是在公司的开发中我们没有导入导出，而是定义了一些只有纯虚函数的抽象类，然后定义了一个工厂类，将这个工厂类注册到框架的服务中心中，使用时从服务中心拿到这个工厂类，就可以创建Dll中的其它类。

参考链接

https://www.cnblogs.com/lidabo/p/7121745.html

```c++
//2011.10.6//cswuyg//dll导出类//dll跟其使用者共用的头文件
#pragma  once
#ifdef MATUREAPPROACH_EXPORTS
#define MATUREAPPROACH_API __declspec(dllexport)
#else
#define MATUREAPPROACH_API __declspec(dllimport)
#endif
class IExport
{
    public:
    virtual void Hi() = 0;
    virtual void Test() = 0;
    virtual void Release() = 0;
};
extern "C" MATUREAPPROACH_API IExport* _stdcall CreateExportObj();
extern "C" MATUREAPPROACH_API void _stdcall DestroyExportObj(IExport* pExport);
```

```c++
//2011.10.6//cswuyg//dll导出类// 实现类
#pragma once
#include "MatureApproach.h"
class ExportImpl : public IExport
{
    public:    virtual void Hi();
    virtual void Test();
    virtual void Release();
    ~ExportImpl();
    private:
};
```

---

## std::move

在开发过程中，全程传参和赋值中，采用的都是std::move和emplace的传递方式，尽可能的避免出现中间流程无意义copy的情况。

---

## std::unique_ptr

shared_ptr和unique_ptr在反复多次申请和来回赋值的情况下，有一定的性能差距，同时shared_ptr自身内存占用也比unique_ptr大（主要都是因为shared_ptr中的cas校验机制）。很多大型项目，是明文禁止使用shared_ptr的。大家平日写代码的时候，可以注意一下不需要共享所有权时应该使用unique_ptr而不是shared_ptr.
unique_ptr从概念上更简单，动作更加可预见（你知道析构动作什么时候发生）而且更快（不需要隐式维护使用计数）。
如果函数使用shared_ptr管理其内局部分配的对象，但是从来没有返回该智能指针或者将其传递个一个需要shared_ptr&的函数，发出警告。建议使用unique_ptr。

```c++
//反面示例
void f()
 {
     shared_ptr<Base> base = make_shared<Derived>();
     // use base locally, without copying it -- refcount never exceeds 1
 } // destroy base

 //下面的代码更高效
 void f()
 {
     unique_ptr<Base> base = make_unique<Derived>();
     // use base locally
 } // destroy base
```

---

## 模板编程

github 的一个仓库这个可以主要看一下。参考链接： https://github.com/wuye9036/CppTemplateTutorial

小彭老师的课程也可以看一下,看一下模板编程的内容。

B站主页： https://space.bilibili.com/263032155/channel/collectiondetail?sid=53025

github链接： https://github.com/parallel101/course

![](../images/c++_1.png)


[filename](./Template.html ':include width=1200 height=1600px' )

---

## 设计模式

22种设计模式的C++实现
参考链接：

https://zhuanlan.zhihu.com/p/476220724

另外的比较简洁的代码实现。
参考链接：

https://gitee.com/naoano/design_pattern

常用的设计模式：工厂模式，桥接模式，观察者模式，状态模式。

---

## 多线程

### openmp
```c++
 void main()
{
    int beginClock = clock();//记录开始时间
#pragma omp parallel for
    for (int testtime = 0; testtime<8; testtime++)
    {
        test();//运行计算
    }
    printf("运行时间为：%dms\n", clock() - beginClock);//输出图像处理花费时间信息
    system("pause");
}

#pragma omp parallel for num_threads(12)
    for (int i = 0; i < basis_info_vec.size(); i++) {
        // 循环检测每个小基座
        basis_find_line(src, algo_result, basis_info_vec[i], i);
    }


//归约
void blog4::Test2(int argc, char* argv[])
{
    int thread_count = strtol(argv[1], NULL, 10);

    double global_result = 0.0;

#pragma omp parallel num_threads(thread_count) reduction(+: global_result)
    {
        global_result += Trap(0, 3, 1024);
    }


    printf("%f\n", global_result);
}

/*
for循环还是被自动分成N份来并行执行，但我们用#pragma omp critical将 if (temp > max) max = temp 括了起来，
它的意思是：各个线程还是并行执行for里面的语句，但当你们执行到critical里面时，要注意有没有其他线程正在里面执行，
如果有的话，要等其他线程执行完再进去执行。这样就避免了race condition问题，但显而易见，它的执行速度会变低，因为可能存在线程等待的情况。
*/
#include <iostream>
int main()
{
    int max = 0;
    int a[10] = {11,2,33,49,113,20,321,250,689,16};
#pragma omp parallel for
    for (int i=0;i<10;i++)
    {
        int temp = a[i];
#pragma omp critical10
        {
        if (temp > max)
        max = temp;
        }
    }
    std::cout<<"max: "<<max<<std::endl;
    return 0;
}
/*
parallel sections里面的内容要并行执行，具体分工上，每个线程执行其中的一个section，如果section数大于线程数，
那么就等某线程执行完它的section后，再继续执行剩下的section。在时间上，这种方式与人为用vector构造for循环的方式差不多，
但无疑该种方式更方便，而且在单核机器上或没有开启openMP的编译器上，该种方式不需任何改动即可正确编译，并按照单核串行方式执行。
*/
#pragma omp parallel sections
{
    #pragma omp section
    {
        function1();
    }
    #pragma omp section
    {
        function2();
    }
}
```
### 自旋锁
```c++
#include <atomic>
class USpinLock
{
public:
    /**
     * 加锁
     */
    void lock()
    {
        // memory_order_acquire 后面访存指令勿重排至此条指令之前
        while (flag_.test_and_set(std::memory_order_acquire)) {
        }
    }
    /**
     * 解锁
     */
    void unlock()
    {
        // memory_order_release 前面访存指令勿重排到此条指令之后
        flag_.clear(std::memory_order_release);
    }
    /**
     * 尝试加锁。若未加锁，会上锁
     * @return
     */
    bool tryLock()
    {
        return !flag_.test_and_set();
    }
private:
    std::atomic_flag flag_ = ATOMIC_FLAG_INIT;  // 标志位
};
```
---

## 线程池
