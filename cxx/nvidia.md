## 常用命令

```bash
//代码简单时，编译器会进行优化
nvprof --metrics branch_efficiency 

// 每个SM在每个cycle能够达到的最大active warp数目占总warp的比例
nvprof --metrics achieved_occupancy

//带宽  全局内存加载事务数
nvprof --metrics gld_throughput

//带宽比值
nvprof --metrics gld_efficiency


nvprof --metrics gst_efficiency

//每个warp上执行的指令数目的平均值
nvprof --metrics inst_per_warp

//同一个thread中如果能有更多的独立的load/store操作
nvprof --metrics dram_read_throughput


//用来验证由于__syncthreads导致更少的warp
nvprof --metrics stall_sync

//图表
nvvp 

//设备 主机 调用情况
nvprof

//
nvprof --devices 0 --metrics gld_efficiency

//全局内存存储事务数
nvprof --devices 0 --metrics gld_efficiency --metrics gst_efficiency

nvprof --devices 0 --metrics gld_efficiency,gst_efficiency

//功能被转移到ncu了
ncu --metrics
```
