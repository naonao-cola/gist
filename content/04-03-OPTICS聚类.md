---
title: 04-03-OPTICS聚类
tags: ["OpenCV", "视觉", "计算机视觉"]
---

# 04-03-OPTICS聚类

> 父节点: [[04-00-OpenCV视觉算法]]
> 源文件: `opencv/opencv.md`
> 相关: [[04-02-霍夫变换]] | [[04-05-FLANN匹配]] | [[12-00-算法集锦]]


## 相关笔记

[[04-04-光斑拟合]]

---


```c++
//cluster.h
#include <limits>
#include <set>
#include <vector>
#include <opencv2/opencv.hpp>

namespace nao::algorithm::cluster {

	/** @brief   最大最小距离算法
	 @param data  输入样本数据，每一行为一个样本，每个样本可以存在多个特征数据
	 @param Theta 阈值，一般设置为0.5，阈值越小聚类中心越多
	 @param centerIndex 聚类中心的下标
	 @return 返回每个样本的类别，类别从1开始，0表示未分类或者分类失败
	*/
	cv::Mat MaxMinDisFun(cv::Mat data, float Theta, std::vector<int>& cerIndex);


//optics 聚类
namespace optics{
		//数据结构
		typedef double real;
		const real UNDEFINED = std::numeric_limits<real>::max();
		//点类型
		class DataPoint;
		//用于根据数据点的可达距离对其进行比较。
		//对于左手侧和右手侧操作数，可达性距离值都不能为UNDEFINED。
		struct comp_datapoint_ptr_f{
			bool operator()(const DataPoint* lhs,const DataPoint* rhs)const;
		};

		//数据集
		typedef std::set<DataPoint*, comp_datapoint_ptr_f> DataSet;
		typedef std::vector<DataPoint*> DataVector;


		 /** Performs the classic OPTICS algorithm.
		  * @param db All data points that are to be considered by the algorithm. Changes their values.
		  * @param eps The epsilon representing the radius of the epsilon-neighborhood.
		  * @param min_pts The minimum number of points to be found within an epsilon-neigborhood.
		  * @return Return the OPTICS ordered list of Data points with reachability-distances set.
		  */
		DataVector optics(DataVector& db, const real eps, const unsigned int min_pts);

	}//namespace optics
}
```

```c++
#include "cluster.h"

nao::algorithm::cluster {
    /*计算欧式距离*/

float calcuDistance(uchar * ptr, uchar* ptrCen, int cols)
{
	float d = 0.0;
	for (size_t j = 0; j < cols; j++) {
		d += (double)(ptr[j] - ptrCen[j]) * (ptr[j] - ptrCen[j]);
	}
	d = std::sqrt(d);
	return d;
}
// https://blog.csdn.net/guyuealian/article/details/80255524
cv::Mat MaxMinDisFun(cv::Mat data, float Theta, std::vector<int>& cerIndex)
{
    double maxDistance = 0;
    // 初始选一个中心点
    int start = 0;
    // 相当于指针指示新中心点的位置
    int index = start;
    // 中心点计数，也即是类别
    int k = 0;
    // 输入的样本数
    int dataNum = data.rows;
    // vector<int>	centerIndex;//保存中心点
    // 表示所有样本到当前聚类中心的距离
    cv::Mat distance = cv::Mat::zeros(cv::Size(1, dataNum), CV_32FC1);
    // 取较小距离
    cv::Mat minDistance = cv::Mat::zeros(cv::Size(1, dataNum), CV_32FC1);
    // 表示类别
    cv::Mat classes = cv::Mat::zeros(cv::Size(1, dataNum), CV_32SC1);
    // 保存第一个聚类中心
    centerIndex.push_back(index);

    for (size_t i = 0; i < dataNum; i++) {
        uchar* ptr1 = data.ptr<uchar>(i);
        uchar* ptrCen = data.ptr<uchar>(centerIndex.at(0));
        float d = calcuDistance(ptr1, ptrCen, data.cols);
        distance.at<float>(i, 0) = d;
        classes.at<int>(i, 0) = k + 1;
        if (maxDistance < d) {
            maxDistance = d;
            // 与第一个聚类中心距离最大的样本
            index = i;
        }
    }

    minDistance = distance.clone();
    double minVal;
    double maxVal;
    cv::Point minLoc;
    cv::Point maxLoc;
    maxVal = maxDistance;
    while (maxVal > (maxDistance * Theta)) {
        k = k + 1;
        // 新的聚类中心
        centerIndex.push_back(index);
        for (size_t i = 0; i < dataNum; i++) {
            uchar* ptr1 = data.ptr<uchar>(i);
            uchar* ptrCen = data.ptr<uchar>(centerIndex.at(k));
            float d = calcuDistance(ptr1, ptrCen, data.cols);
            distance.at<float>(i, 0) = d;
            // 按照当前最近临方式分类，哪个近就分哪个类别
            if (minDistance.at<float>(i, 0) > distance.at<float>(i, 0)) {
                minDistance.at<float>(i, 0) = distance.at<float>(i, 0);
                classes.at<int>(i, 0) = k + 1;
            }
        }
        // 查找minDistance中最大值
        cv::minMaxLoc(minDistance, &minVal, &maxVal, &minLoc, &maxLoc);
        index = maxLoc.y;
    }
    return classes;
}

namespace optics {
// https://zhuanlan.zhihu.com/p/408243818
class DataPoint {
private:
    std::vector<real> data_;
    real reachability_distance_;
    bool is_processed_;

public:
    DataPoint()
        : data_(std::vector<real>())
        , reachability_distance_(UNDEFINED)
        , is_processed_(false)
    {
    }
    virtual ~DataPoint() { }

public:
    inline void reachability_distance(real d)
    {
        assert(d >= 0 && "Reachability distance must not be negative.");
        reachability_distance_ = d;
    }
    inline real reachability_distance() const { return reachability_distance_; }
    inline void processed(bool b) { is_processed_ = b; }
    inline bool is_processed() const { return is_processed_; }
    inline std::vector<real>& data() { return data_; }
    inline const std::vector<real>& data() const { return data_; }
    inline real operator[](const std::size_t idx) const
    {
        assert(data_.size() > idx && "Index must be within OPTICS::DataPoint::data_'s range.");
        return data_[idx];
    }
} // class DataPoint

template <typename T = int>
class LabelledDataPoint : public DataPoint {

private:
    T label_;

public:
    // 将可达性距离设置为OPTICS:：UNDEFINED，并将已处理的标志设置为false。
    LabelledDataPoint(T label)
        : DataPoint()
        , label_(label)
    {
    }
    ~LabelledDataPoint() { }

public:
    inline void label(const T& l) { label_ = l; }
    inline const T& label() const { return label_ };

} // class LabelledDataPoint

/// A Comp_DataPoint_f comparison functor ()-operator implementation.
bool
comp_datapoint_ptr_f::operator()(const DataPoint* lhs, const DataPoint* rhs) const
{
    assert(lhs != nullptr && "nullptr objects are not allowed");
    assert(rhs != nullptr && "nullptr objects are not allowed");
    assert(lhs->data().size() == rhs->data().size() && "Comparing DataPoints requires them to have same dimensionality");

    // return lhs->reachability_distance() < rhs->reachability_distance();
    if (lhs->reachability_distance() < rhs->reachability_distance())
        return true;
    else if (lhs->reachability_distance() == rhs->reachability_distance() && lhs < rhs)
        return true;
    else /*lhs->reachability_distance() == rhs->reachability_distance() && lhs >= rhs || lhs->reachability_distance() > rhs->reachability_distance()*/
        return false;
}

/** Retrieves the squared euclidean distance of two DataPoints.
 * @param a The first DataPoint.
 * @param b The second DataPoint. Both data points must have the same dimensionality.
 */
real squared_distance(const DataPoint* a, const DataPoint* b)
{
    const std::vector<real>& a_data = a->data();
    const std::vector<real>& b_data = b->data();
    const unsigned int vec_size = static_cast<unsigned int>(a_data.size());
    assert(vec_size == b_data.size() && "Data-vectors of both DataPoints must have same dimensionality");
    real ret(0);

    for (unsigned int i = 0; i < vec_size; ++i) {
        ret += std::pow(a_data[i] - b_data[i], 2);
    }
    // return std::sqrt( ret);
    return ret;
}

/** Updates the seeds priority queue with new neighbors or neighbors that now have a better
 * reachability distance than before.
 * @param N_eps All points in the the epsilon-neighborhood of the center_object, including p itself.
 * @param center_object The point on which to start the update process.
 * @param c_dist The core distance of the given center_object.
 * @param o_seeds The seeds priority queue (aka set with special comparator function) that will be modified.
 */
void update_seeds(const DataVector& N_eps, const DataPoint* center_object, const real c_dist, DataSet& o_seeds)
{
    assert(c_dist != OPTICS::UNDEFINED && "the core distance must be set <> UNDEFINED when entering update_seeds");
    for (DataVector::const_iterator it = N_eps.begin(); it != N_eps.end(); ++it) {
        DataPoint* o = *it;

        if (o->is_processed())
            continue;

        const real new_r_dist = std::max(c_dist, squared_distance(center_object, o));
        // *** new_r_dist != UNDEFINED ***

        if (o->reachability_distance() == OPTICS::UNDEFINED) {
            // *** o not in seeds ***
            o->reachability_distance(new_r_dist);
            o_seeds.insert(o);

        } else if (new_r_dist < o->reachability_distance()) {
            // *** o already in seeds & can be improved ***
            o_seeds.erase(o);
            o->reachability_distance(new_r_dist);
            o_seeds.insert(o);
        }
    }
}

/** Finds the squared core distance of one given point.
 * @param p The point to be examined.
 * @param min_pts The minimum number of points to be found within an epsilon-neigborhood.
 * @param N_eps All points in the the epsilon-neighborhood of p, including p itself.
 * @return The squared core distance of p.
 */
real squared_core_distance(const DataPoint* p, const unsigned int min_pts, DataVector& N_eps)
{
    assert(min_pts > 0 && "min_pts must be greater than 0");
    real ret(UNDEFINED);
    if (N_eps.size() > min_pts) {
        std::nth_element(N_eps.begin(),
            N_eps.begin() + min_pts,
            N_eps.end(),
            [p](const DataPoint* a, const DataPoint* b) { return squared_distance(p, a) < squared_distance(p, b); });
        ret = squared_distance(p, N_eps[min_pts]);
    }
    return ret;
}

/** Retrieves all points in the epsilon-surrounding of the given data point, including the point itself.
 * @param p The datapoint which represents the center of the epsilon surrounding.
 * @param eps The epsilon value that represents the radius for the neigborhood search.
 * @param db The database consisting of all datapoints that are checked for neighborhood.
 * @param A vector of pointers to datapoints that lie within the epsilon-neighborhood
 *        of the given point p, including p itself.
 */
DataVector get_neighbors(const DataPoint* p, const real eps, DataVector& db)
{
    assert(eps >= 0 && "eps must not be negative");
    DataVector ret;
    const real eps_sq = eps * eps;
    for (auto q_it = db.begin(); q_it != db.end(); ++q_it) {
        DataPoint* q = *q_it;
        if (squared_distance(p, q) <= eps_sq) {
            ret.push_back(q);
        }
    }
    return ret;
}

/** Expands the cluster order while adding new neighbor points to the order.
 * @param db All data points that are to be considered by the algorithm. Changes their values.
 * @param p The point to be examined.
 * @param eps The epsilon representing the radius of the epsilon-neighborhood.
 * @param min_pts The minimum number of points to be found within an epsilon-neigborhood.
 * @param o_ordered_vector The ordered vector of data points. Elements will be added to this vector.
 */
void expand_cluster_order(DataVector& db, DataPoint* p, const real eps, const unsigned int min_pts, DataVector& o_ordered_vector)
{
    assert(eps >= 0 && "eps must not be negative");
    assert(min_pts > 0 && "min_pts must be greater than 0");

    DataVector N_eps = get_neighbors(p, eps, db);
    p->reachability_distance(UNDEFINED);
    const real core_dist_p = squared_core_distance(p, min_pts, N_eps);
    p->processed(true);
    o_ordered_vector.push_back(p);

    if (core_dist_p == UNDEFINED)
        return;

    DataSet seeds;
    update_seeds(N_eps, p, core_dist_p, seeds);

    while (!seeds.empty()) {
        DataPoint* q = *seeds.begin();
        seeds.erase(seeds.begin()); // remove first element from seeds

        DataVector N_q = get_neighbors(q, eps, db);
        const real core_dist_q = squared_core_distance(q, min_pts, N_q);
        q->processed(true);
        o_ordered_vector.push_back(q);
        if (core_dist_q != OPTICS::UNDEFINED) {
            // *** q is a core-object ***
            update_seeds(N_q, q, core_dist_q, seeds);
        }
    }
}

DataVector optics(DataVector& db, const real eps, const unsigned int min_pts)
{
    assert(eps >= 0 && "eps must not be negative");
    assert(min_pts > 0 && "min_pts must be greater than 0");
    DataVector ret;
    for (auto p_it = db.begin(); p_it != db.end(); ++p_it) {
        DataPoint* p = *p_it;

        if (p->is_processed())
            continue;

        expand_cluster_order(db, p, eps, min_pts, ret);
    }
    return ret;
}

} // namespace optics
}
;

```
## 高斯拟合求光斑