# 05-06-Nsight工具

> 父节点: [[05-00-Nvidia-CUDA与SIMD]]
> 源文件: `nvidia/nvidia.md`
> 相关: [[05-03-CUDA内存层次]] | [[05-04-Reduction优化]]

---

<!-- from line 266 -->

https://zhuanlan.zhihu.com/p/632244210

nvprof工具的使用

https://zhuanlan.zhihu.com/p/595136588

nsight systems 使用

<!-- from line 270 -->

https://zhuanlan.zhihu.com/p/595136588

nsight systems 使用

https://blog.csdn.net/HaoZiHuang/article/details/121885850

https://blog.csdn.net/NXHYD/article/details/112915968

<!-- from line 296 -->

# https://blog.csdn.net/m0_67392409/article/details/123598464

# https://zmurder.github.io/CUDA/Nsight/Nsight%20Compute%E7%A4%BA%E4%BE%8B1_%E6%80%BB%E8%A7%88/

# 代码简单时，编译器会进行优化 原 branch_efficiency
# 非发散分支与总分支的比率
ncu  --metrics smsp__sass_average_branch_targets_threads_uniform.pct

<!-- from line 300 -->

# 代码简单时，编译器会进行优化 原 branch_efficiency
# 非发散分支与总分支的比率
ncu  --metrics smsp__sass_average_branch_targets_threads_uniform.pct



# 每个SM在每个cycle能够达到的最大active warp数目占总warp的比例 ，原 achieved_occupancy

<!-- from line 305 -->


# 每个SM在每个cycle能够达到的最大active warp数目占总warp的比例 ，原 achieved_occupancy
# 可以猜测的到的是，拥有更多的block并行性更好。这个猜测可以使用nvprof 的 achieved_occupancy这个metric参数来验证。
# 每个SM在每个cycle能够达到的最大active warp数目占总warp的比例
ncu --metrics sm__warps_active.avg.pct_of_peak_sustained_active



<!-- from line 307 -->
# 每个SM在每个cycle能够达到的最大active warp数目占总warp的比例 ，原 achieved_occupancy
# 可以猜测的到的是，拥有更多的block并行性更好。这个猜测可以使用nvprof 的 achieved_occupancy这个metric参数来验证。
# 每个SM在每个cycle能够达到的最大active warp数目占总warp的比例
ncu --metrics sm__warps_active.avg.pct_of_peak_sustained_active


# 带宽  全局内存加载事务数，原 gld_throughput
# memory load和memory store,查看memory的throughput

<!-- from line 313 -->
# 带宽  全局内存加载事务数，原 gld_throughput
# memory load和memory store,查看memory的throughput
# 高load throughput有可能是一种假象，如果需要的数据在memory中存储格式未对齐不连续，会导致许多额外的不必要的load操作，
ncu --metrics l1tex__t_bytes_pipe_lsu_mem_global_op_ld.sum.per_second


# 带宽比值 原 gld_efficiency
# gld_efficiency来度量load efficiency, ，加载的效率

<!-- from line 321 -->
# 该metric参数是指我们确切需要的 global load throughput与实际得到global load memory的比值。
# 这个metric参数可以让我们知道，APP的 load操作利用device memory bandwidth的程度：
#
ncu --metrics smsp__sass_average_data_bytes_per_sector_mem_global_op_ld.pct


# 原 gst_efficiency，存储
# 请求的全局内存存储吞吐量与所需的全局内存存储吞吐量的比率

<!-- from line 326 -->

# 原 gst_efficiency，存储
# 请求的全局内存存储吞吐量与所需的全局内存存储吞吐量的比率
ncu --metrics smsp__sass_average_data_bytes_per_sector_mem_global_op_st.pct



# gld_transactions_per_request 被每个全局内存加载请求执行的全局内存加载事务的平均数

<!-- from line 340 -->

# 每个warp上执行的指令数目的平均值， 原 inst_per_warp
# 可以查看是否有许多不必要的操作也执行了
ncu --metrics smsp__average_inst_executed_per_warp.ratio


# 原 dram_read_throughput
# 同一个thread中如果能有更多的独立的load/store操作，会产生更好的性能，因为这样做memory latency能够更好的被隐藏。

<!-- from line 346 -->
# 原 dram_read_throughput
# 同一个thread中如果能有更多的独立的load/store操作，会产生更好的性能，因为这样做memory latency能够更好的被隐藏。
# device read throughtput和unrolling程度是正比的：
ncu --metrics dram__bytes_read.sum.per_second


# shared_load_transactions_per_request  每次共享内存加载时执行的平均共享内存加载事务数
# shared_store_transactions_per_request 每次共享内存加载时执行的平均共享内存写入事务数

<!-- from line 351 -->

# shared_load_transactions_per_request  每次共享内存加载时执行的平均共享内存加载事务数
# shared_store_transactions_per_request 每次共享内存加载时执行的平均共享内存写入事务数
# 两个参数来衡量相应的bank-conflict 。 ncu没有这个参数了。

# 用来验证由于__syncthreads导致更少的warp, 原 stall_sync
ncu --metrics smsp__warp_issue_stalled_barrier_per_warp_active.pct + smsp__warp_issue_stalled_membar_per_warp_active.pct


<!-- from line 354 -->
# 两个参数来衡量相应的bank-conflict 。 ncu没有这个参数了。

# 用来验证由于__syncthreads导致更少的warp, 原 stall_sync
ncu --metrics smsp__warp_issue_stalled_barrier_per_warp_active.pct + smsp__warp_issue_stalled_membar_per_warp_active.pct

# 生成ncu-rep 文件
ncu --set full -f -o 09 ./09


<!-- from line 356 -->
# 用来验证由于__syncthreads导致更少的warp, 原 stall_sync
ncu --metrics smsp__warp_issue_stalled_barrier_per_warp_active.pct + smsp__warp_issue_stalled_membar_per_warp_active.pct

# 生成ncu-rep 文件
ncu --set full -f -o 09 ./09

```


<!-- from line 357 -->
ncu --metrics smsp__warp_issue_stalled_barrier_per_warp_active.pct + smsp__warp_issue_stalled_membar_per_warp_active.pct

# 生成ncu-rep 文件
ncu --set full -f -o 09 ./09

```

### 理论
