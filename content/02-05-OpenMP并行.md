---
title: 02-05-OpenMP并行
tags: ["C++", "cpp", "编程"]
---

# 02-05-OpenMP并行

> 父节点: [[02-00-C++现代编程]]
> 源文件: `cxx/cxx.md`
> 相关: [[02-03-原子操作与内存序]] | [[05-00-Nvidia-CUDA与SIMD]]


## 相关笔记

[[05-03-CUDA内存层次]]

---


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
//高级用法
/*
自定义规约操作，适用于vector 的push
参考：	https://github.com/meiqua/shape_based_matching
原理实例： https://blog.mangoeffect.net/parallel-programming/learn-openmp-custom-reduction
*/
#pragma omp declare reduction \
    (omp_insert: std::vector<Match>: omp_out.insert(omp_out.end(), omp_in.begin(), omp_in.end()))

#pragma omp parallel for reduction(omp_insert:matches)

/*
第二部分参考
https://juejin.cn/post/7154346614566584356
*/
#include <stdio.h>
#include <omp.h>
#include <time.h>
/*
请利用指令 reduction 编写程序实现对实数数组 x(i,j) = (i + j) / (i * j) (i,j = 1~10) 取最小值并指出最小值对应的下标。
*/

#define m 100
#define n 100
double x[m + 1][n + 1];
struct compare
{
    float val;
    int index;
    int index1;
};
struct compare add_matrix(struct compare X, struct compare Y)
{
    struct compare temp;
    if (X.val < Y.val)
    {
        temp.val = X.val;
        temp.index = X.index;
        temp.index1 = X.index1;
    }
    else
    {
        temp.val = Y.val;
        temp.index = Y.index;
        temp.index1 = Y.index1;
    }
    return temp;
}
int main()
{
    int tid, nthreads;
    for (int i = 1; i <= m; i++)

    {
        for (int j = 1; j <= n; j++)

        {
            x[i][j] = (float)(i + j) / (i * j);
        }
    }

    double x_mymin = 1000;
    int mymin_i, mymin_j;
    // omp_set_nested(1);
    omp_set_dynamic(0);
    omp_set_num_threads(10);
    struct compare mymin;
    mymin.val = x[1][1];
    mymin.index = 1;
    mymin.index1 = 1;
    int i = 1;
    int j = 1;
    clock_t begin, end;
    begin = clock();
#pragma omp declare reduction(p_add_matrix     \
                              : struct compare \
                              : omp_out = add_matrix(omp_out, omp_in)) initializer(omp_priv = {100})
    {
#pragma omp parallel for private(tid, nthreads, i, j) shared(x) reduction(p_add_matrix \
                                                                          : mymin)

        for (i = 1; i <= m; i++)

        {
            for (j = 1; j <= n; j++)

            {
                tid = omp_get_thread_num();
                nthreads = omp_get_num_threads();
                if (x[i][j] < mymin.val)

                {
                    mymin.val = x[i][j];
                    mymin.index = i;
                    mymin.index1 = j;
                }

                // printf("*****inner:tid = %d,nthreads = %d,x[%d][%d] = %lf\n", tid, nthreads, i, j, x[i][j]);
            }
            // printf("*****outer:tid = %d,nthreads = %d,x[%d][%d] = %lf\n", tid, nthreads, mymin.index, mymin.index1, mymin.val);
        }
    }
    printf("mymin:--------x[%d][%d] = %lf ", mymin.index, mymin.index1, mymin.val);
    end = clock();
    double cost;
    cost = (double)(end - begin) / CLOCKS_PER_SEC;
    printf("CLOCKS_PER_SEC is %d\n", CLOCKS_PER_SEC);
    printf("time cost is: %lf secs\n", cost);
    return 0;
}

```


vs studio 不支持openmp高级写法，下面两种都可以。

```c++
//第一种写法

void Detector::matchClass(const LinearMemoryPyramid &lm_pyramid,
                          const std::vector<Size> &sizes,
                          float threshold, std::vector<Match> &matches,
                          const std::string &class_id,
                          const std::vector<TemplatePyramid> &template_pyramids) const
{
#pragma omp declare reduction \
    (omp_insert: std::vector<Match>: omp_out.insert(omp_out.end(), omp_in.begin(), omp_in.end()))

#pragma omp parallel for reduction(omp_insert:matches)
    for (size_t template_id = 0; template_id < template_pyramids.size(); ++template_id)
    {
        const TemplatePyramid &tp = template_pyramids[template_id];
        // First match over the whole image at the lowest pyramid level
        /// @todo Factor this out into separate function
        const std::vector<LinearMemories> &lowest_lm = lm_pyramid.back();

        std::vector<Match> candidates;
        {
            // Compute similarity maps for each ColorGradient at lowest pyramid level
            Mat similarities;
            int lowest_start = static_cast<int>(tp.size() - 1);
            int lowest_T = T_at_level.back();
            int num_features = 0;

            {
                const Template &templ = tp[lowest_start];
                num_features += static_cast<int>(templ.features.size());

                if (templ.features.size() < 64){
                    similarity_64(lowest_lm[0], templ, similarities, sizes.back(), lowest_T);
                    similarities.convertTo(similarities, CV_16U);
                }else if (templ.features.size() < 8192){
                    similarity(lowest_lm[0], templ, similarities, sizes.back(), lowest_T);
                }else{
                    CV_Error(Error::StsBadArg, "feature size too large");
                }
            }

            // Find initial matches
            for (int r = 0; r < similarities.rows; ++r)
            {
                ushort *row = similarities.ptr<ushort>(r);
                for (int c = 0; c < similarities.cols; ++c)
                {
                    int raw_score = row[c];
                    float score = (raw_score * 100.f) / (4 * num_features);

                    if (score > threshold)
                    {
                        int offset = lowest_T / 2 + (lowest_T % 2 - 1);
                        int x = c * lowest_T + offset;
                        int y = r * lowest_T + offset;
                        candidates.push_back(Match(x, y, score, class_id, static_cast<int>(template_id)));
                    }
                }
            }
        }


        // Locally refine each match by marching up the pyramid
        for (int l = pyramid_levels - 2; l >= 0; --l)
        {
            const std::vector<LinearMemories> &lms = lm_pyramid[l];
            int T = T_at_level[l];
            int start = static_cast<int>(l);
            Size size = sizes[l];
            int border = 8 * T;
            int offset = T / 2 + (T % 2 - 1);
            int max_x = size.width - tp[start].width - border;
            int max_y = size.height - tp[start].height - border;

            Mat similarities2;
            for (int m = 0; m < (int)candidates.size(); ++m)
            {
                Match &match2 = candidates[m];
                int x = match2.x * 2 + 1; /// @todo Support other pyramid distance
                int y = match2.y * 2 + 1;

                // Require 8 (reduced) row/cols to the up/left
                x = std::max(x, border);
                y = std::max(y, border);

                // Require 8 (reduced) row/cols to the down/left, plus the template size
                x = std::min(x, max_x);
                y = std::min(y, max_y);

                // Compute local similarity maps for each ColorGradient
                int numFeatures = 0;

                {
                    const Template &templ = tp[start];
                    numFeatures += static_cast<int>(templ.features.size());

                    if (templ.features.size() < 64){
                        similarityLocal_64(lms[0], templ, similarities2, size, T, Point(x, y));
                        similarities2.convertTo(similarities2, CV_16U);
                    }else if (templ.features.size() < 8192){
                        similarityLocal(lms[0], templ, similarities2, size, T, Point(x, y));
                    }else{
                        CV_Error(Error::StsBadArg, "feature size too large");
                    }
                }

                // Find best local adjustment
                float best_score = 0;
                int best_r = -1, best_c = -1;
                for (int r = 0; r < similarities2.rows; ++r)
                {
                    ushort *row = similarities2.ptr<ushort>(r);
                    for (int c = 0; c < similarities2.cols; ++c)
                    {
                        int score_int = row[c];
                        float score = (score_int * 100.f) / (4 * numFeatures);

                        if (score > best_score)
                        {
                            best_score = score;
                            best_r = r;
                            best_c = c;
                        }
                    }
                }
                // Update current match
                match2.similarity = best_score;
                match2.x = (x / T - 8 + best_c) * T + offset;
                match2.y = (y / T - 8 + best_r) * T + offset;
            }

            // Filter out any matches that drop below the similarity threshold
            std::vector<Match>::iterator new_end = std::remove_if(candidates.begin(), candidates.end(),
                                                                  MatchPredicate(threshold));
            candidates.erase(new_end, candidates.end());
        }

        matches.insert(matches.end(), candidates.begin(), candidates.end());
    }
}

//第二种写法

void Detector::matchClass(const LinearMemoryPyramid &lm_pyramid,
                          const std::vector<Size> &sizes,
                          float threshold, std::vector<Match> &matches,
                          const std::string &class_id,
                          const std::vector<TemplatePyramid> &template_pyramids) const
{
#ifdef _OPENMP
#pragma omp parallel
    {
#endif
        std::vector<Match> match_private;
#ifdef _OPENMP
#pragma omp for nowait
#endif
    for (int template_id = 0; template_id < template_pyramids.size(); ++template_id)
    {
        const TemplatePyramid &tp = template_pyramids[template_id];
        // First match over the whole image at the lowest pyramid level
        /// @todo Factor this out into separate function
        const std::vector<LinearMemories> &lowest_lm = lm_pyramid.back();

        std::vector<Match> candidates;
        {
            // Compute similarity maps for each ColorGradient at lowest pyramid level
            Mat similarities;
            int lowest_start = static_cast<int>(tp.size() - 1);
            int lowest_T = T_at_level.back();
            int num_features = 0;

            {
                const Template &templ = tp[lowest_start];
                num_features += static_cast<int>(templ.features.size());

                if (templ.features.size() < 64){
                    similarity_64(lowest_lm[0], templ, similarities, sizes.back(), lowest_T);
                    similarities.convertTo(similarities, CV_16U);
                }else if (templ.features.size() < 8192){
                    similarity(lowest_lm[0], templ, similarities, sizes.back(), lowest_T);
                }else{
                    CV_Error(Error::StsBadArg, "feature size too large");
                }
            }

            // Find initial matches
            for (int r = 0; r < similarities.rows; ++r)
            {
                ushort *row = similarities.ptr<ushort>(r);
                for (int c = 0; c < similarities.cols; ++c)
                {
                    int raw_score = row[c];
                    float score = (raw_score * 100.f) / (4 * num_features);

                    if (score > threshold)
                    {
                        int offset = lowest_T / 2 + (lowest_T % 2 - 1);
                        int x = c * lowest_T + offset;
                        int y = r * lowest_T + offset;
                        candidates.push_back(Match(x, y, score, class_id, static_cast<int>(template_id)));
                    }
                }
            }
        }


        // Locally refine each match by marching up the pyramid
        for (int l = pyramid_levels - 2; l >= 0; --l)
        {
            const std::vector<LinearMemories> &lms = lm_pyramid[l];
            int T = T_at_level[l];
            int start = static_cast<int>(l);
            Size size = sizes[l];
            int border = 8 * T;
            int offset = T / 2 + (T % 2 - 1);
            int max_x = size.width - tp[start].width - border;
            int max_y = size.height - tp[start].height - border;

            Mat similarities2;
            for (int m = 0; m < (int)candidates.size(); ++m)
            {
                Match &match2 = candidates[m];
                int x = match2.x * 2 + 1; /// @todo Support other pyramid distance
                int y = match2.y * 2 + 1;

                // Require 8 (reduced) row/cols to the up/left
                x = std::max(x, border);
                y = std::max(y, border);

                // Require 8 (reduced) row/cols to the down/left, plus the template size
                x = std::min(x, max_x);
                y = std::min(y, max_y);

                // Compute local similarity maps for each ColorGradient
                int numFeatures = 0;

                {
                    const Template &templ = tp[start];
                    numFeatures += static_cast<int>(templ.features.size());

                    if (templ.features.size() < 64){
                        similarityLocal_64(lms[0], templ, similarities2, size, T, Point(x, y));
                        similarities2.convertTo(similarities2, CV_16U);
                    }else if (templ.features.size() < 8192){
                        similarityLocal(lms[0], templ, similarities2, size, T, Point(x, y));
                    }else{
                        CV_Error(Error::StsBadArg, "feature size too large");
                    }
                }

                // Find best local adjustment
                float best_score = 0;
                int best_r = -1, best_c = -1;
                for (int r = 0; r < similarities2.rows; ++r)
                {
                    ushort *row = similarities2.ptr<ushort>(r);
                    for (int c = 0; c < similarities2.cols; ++c)
                    {
                        int score_int = row[c];
                        float score = (score_int * 100.f) / (4 * numFeatures);

                        if (score > best_score)
                        {
                            best_score = score;
                            best_r = r;
                            best_c = c;
                        }
                    }
                }
                // Update current match
                match2.similarity = best_score;
                match2.x = (x / T - 8 + best_c) * T + offset;
                match2.y = (y / T - 8 + best_r) * T + offset;
            }

            // Filter out any matches that drop below the similarity threshold
            std::vector<Match>::iterator new_end = std::remove_if(candidates.begin(), candidates.end(),
                                                                  MatchPredicate(threshold));
            candidates.erase(new_end, candidates.end());
        }

        match_private.insert(match_private.end(), candidates.begin(), candidates.end());
    }
#ifdef _OPENMP
#pragma omp critical
        {
#endif
        matches.insert(matches.end(), match_private.begin(), match_private.end());
#ifdef _OPENMP
        }
    }
#endif

}
```
```c++
cv::Mat duplicate_remove(cv::Mat data,double remain) {
	int length = data.rows;
	cv::Mat matrix = cv::Mat::zeros(length,length,CV_32FC1);
	double min_value = std::numeric_limits<double>::max();
	double max_value = 0.f;
	Timer t1;

#pragma omp parallel for reduction(min:min_value) reduction(max:max_value)
	for (int i = 0; i < data.rows;i++) {
		cv::Mat p1 = data.rowRange(i, i + 1);
		for (int j = 0; j < data.rows;j++) {
			cv::Mat p2 = data.rowRange(j,j+1);
			double diff = cv::norm((p1-p2))/(p1.cols *1.f);
			matrix.ptr<float>(i)[j] = diff;
			if (diff < min_value && diff >0.0000001) {
				min_value = diff;
			}
			if (diff > max_value) {
				max_value = diff;
			}
		}
	}
	t1.out("duplicate_remove 计算差值");
	double remain_max = max_value  - (max_value - min_value) * remain;
	cv::Mat remain_mat = matrix > remain_max;
	std::vector<std::pair<int, int>> d1;
	std::vector<std::vector<std::pair<int, int>>> local_d1(omp_get_max_threads());
#pragma omp parallel for
	for (int i = 0; i < remain_mat.rows; ++i) {
		uchar* p = remain_mat.ptr<uchar>(i);
		int thread_id = omp_get_thread_num(); // 获取当前线程的 ID
		for (int j = 0; j < remain_mat.cols; ++j) {
			if (i == j) continue;
			int value = p[j];
			if (value < 127) {
				local_d1[thread_id].push_back(std::make_pair(i, j));
			}
		}
	}
	// 合并所有线程的局部结果
	for (auto& local_vector : local_d1) {
		d1.insert(d1.end(), local_vector.begin(), local_vector.end());
	}
	t1.out("duplicate_remove 选择特征图");

	std::set<int> duploc;
	for (int i = 0; i < d1.size();i++) {
		duploc.insert(d1[i].first);
		duploc.insert(d1[i].second);
	}
	cv::Mat ret;
	for (int i = 0; i < length;i++) {
		if (duploc.count(i) > 0) {
			continue;
		}
		cv::Mat p1 = data.rowRange(i, i + 1);
		ret.push_back(p1);
	}
	return ret;
}

double work( double *a, double *b, size_t n )
{
    using batch_type = xsimd::batch<double, xsimd::default_arch>;
	std::size_t inc  = batch_type::size;
    std::size_t vec_size = n - n % inc;
    double sum = 0.0;
#pragma omp parallel for reduction(+:sum)
    for (long i=0; i < vec_size; i += inc) {
        batch_type v1 = xsimd::load_unaligned(a + i);
        batch_type v2 = xsimd::load_unaligned(b + i);
        batch_type batch_c = v1 + v2;
        sum += xsimd::reduce_add(batch_c);
    }
#pragma omp parallel for reduction(+:sum)
    for (long i = vec_size; i < n; ++i)
    {
        sum += (a[i] + b[i]);
    }

   return sum;
}

double sum_xsimd(const double* data, std::size_t size) {
    using batch_type = xsimd::batch<double>;
    constexpr std::size_t batch_size = batch_type::size;
    double sum = 0.0;

    // 处理整数倍于 batch_size 的部分
#pragma omp parallel for reduction(+:sum)
    for (long i = 0; i <= size - batch_size; i += batch_size) {
        auto batch = xsimd::load_unaligned(data + i);
        sum += xsimd::reduce_add(batch);
    }

    // 处理剩余的部分
#pragma omp parallel for reduction(+:sum)
    for (long i = (size / batch_size) * batch_size; i < size; ++i) {
        sum += data[i];
    }

    return sum;
}

```

使用openmp 的一些测评

https://zhuanlan.zhihu.com/p/685435667

https://blog.csdn.net/10km/article/details/84579465

```bash
# -fopenmp 打开OpenMP预处理指令支持开关，使用此选项，代码中的#pragma omp simd预处理指令才有效。
#-mavx2 指定使用intel AVX2指令集。如果目标CPU不支持AVX，也可以根据目标CPU的类型改为低版本的-msse4.1 -msse4.2 -msse4 -mavx
$ gcc -O3 -fopt-info  -fopenmp  -mavx2 -o test_simd test_simd.c
# 对于mips平台，编译方式是这样的,与x86平台唯一的不同就是-mavx2改为-mmsa
$ mips-linux-gnu-gcc  -O3 -fopt-info  -fopenmp  -mmsa -o test_simd_msa test_simd.c
# 如果是arm平台，编译方式应该是这样的
$ arm-none-linux-gnueabi-gcc -mfpu=neon -ftree-vectorize -ftree-vectorizer-verbose=1 -c test_simd.c

# 编译选项 https://gcc.gnu.org/onlinedocs/gcc/Option-Summary.html#Option-Summary
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