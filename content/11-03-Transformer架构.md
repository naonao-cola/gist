---
title: 11-03-Transformer架构
tags: ["大模型", "LLM", "深度学习", "PyTorch"]
---

# 11-03-Transformer架构

> 父节点: [[11-00-大模型与深度学习]]
> 源文件: `dl/DL.md`
> 相关: [[11-01-PyTorch教程]] | [[11-04-vLLM]] | [[11-05-SGLang]]


## 相关笔记

[[11-08-LLM基础概念]]

---

- **Self-Attention / Multi-Head Attention**: 核心注意力机制
- **Positional Encoding**: 位置编码（正弦/余弦、可学习）
- **Encoder-Decoder**: 原始 Transformer 结构（BERT 用 Encoder，GPT 用 Decoder）
- **Layer Normalization & Residual Connection**

### 3.2 大语言模型（LLM）