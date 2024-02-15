## 奇技淫巧

### zip

使用zip函数同时迭代多个可迭代对象

```python
names = ['Alice', 'Bob', 'Charlie']
ages = [25, 30, 35]
​
for name, age in zip(names, ages):
    print(f"{name} is {age} years old.")
​
# Alice is 25 years old.
# Bob is 30 years old.
# Charlie is 35 years old.
```
### lambda

使用lambda函数创建匿名函数

```python
multiply = lambda x, y: x * y
result = multiply(3, 4)
print(result)
​
# 12
```
### enumerate

使用enumerate函数同时获取索引和值

```python
fruits = ['apple', 'banana', 'cherry']
for index, fruit in enumerate(fruits):
    print(f"Index: {index}, Fruit: {fruit}")
​
# Index: 0, Fruit: apple
# Index: 1, Fruit: banana
# Index: 2, Fruit: cherry
```

### 字典推导式

字典推导式创建字典

```python
keys = ['a', 'b', 'c']
values = [1, 2, 3]
my_dict = {k: v for k, v in zip(keys, values)}
print(my_dict)
​
# {'a': 1, 'b': 2, 'c': 3}
```

### collections.Counter

使用collections.Counter统计元素出现次数

```python
from collections import Counter
my_list = [1, 2, 3, 1, 2, 1, 3, 4]
counter = Counter(my_list)
print(counter)
# Counter({1: 3, 2: 2, 3: 2, 4: 1})
```

### 多行字符串

多行字符串的快速拼接

```python
multiline_string = (
    "This is a"
    " multiline"
    " string."
)
print(multiline_string)
​
# This is a multiline string.
```

### *args和**kwargs

使用*args和**kwargs处理可变数量的参数

```python
def example_function(*args, **kwargs):
    print("Positional arguments:", args)
    print("Keyword arguments:", kwargs)
​
example_function(1, 2, 3, name='Alice', age=25)
​
# Positional arguments: (1, 2, 3)
# Keyword arguments: {'name': 'Alice', 'age': 25}
```

### try和except

使用try和except处理异常

```python
def safe_divide(x, y):
    try:
        result = x / y
        print("Result:", result)
    except ZeroDivisionError:
        print("Error: Division by zero")
​
safe_divide(10, 2)
safe_divide(5, 0)
​
# Result: 5.0
# Error: Division by zero

```

### map函数

使用map函数对可迭代对象的所有元素应用同一个函数
```python
numbers = [1, 2, 3, 4, 5]
squared_numbers = list(map(lambda x: x**2, numbers))
print(squared_numbers)
​
# [1, 4, 9, 16, 25]
```

### filter函数
使用filter函数过滤可迭代对象的元素

```python
numbers = [1, 2, 3, 4, 5]
even_numbers = list(filter(lambda x: x % 2 == 0, numbers))
print(even_numbers)
​
# [2, 4]
```
### 字符串拼接

```python
str1 = 'a'
str2 = 'b'
print('-'.join([str1, str2]))
```

```python
str1 = 'a'
str2 = 'b'
str = f'this is str1: {str1}, this is str2: {str2}.'
print(str)

name = "Eric"
age = 74
res = f"Hello, {name}. You are {age}."
print(res)


# 多行字符串
message = f"""
    Hi {name}.
    You are a {profession}.
    You were in {affiliation}.
 """
print(message)

# 引号
main_sql = f"""select role,
        day
    from xxx"""
print(main_sql)


res = f"The \"comedian\" is {name}, aged {age}."
print(res)

#大括号，为了使字符串出现大括号，必须使用双大括号：
res = f"{{74}}"
print(res)
```
### 一行 For 循环
```python
#For循环在一行我的列表 = [100, 200, 300, 400, 500]#原路
result = []
for x in mylist:
    if x > 250:
        result.append(x)
print(result) # [300, 400, 500]#One Line Way
result = [x for x in mylist if x > 250]
print(result) # [300, 400, 500]

```

要在一行中编写 IF Else 语句，我们将使用三元运算符。三元的语法是“[on true] if [expression] else [on false]”。
```python
#if Else 在一行中
#Example 1 if else
print("Yes") if 8 > 9 else print("No") # No
#Example 2 if elif else
E = 2
print("High") if E == 5 else print("数据STUDIO") if E == 2 else print("Low") # 数据STUDIO
#Example 3 only if
if 3 > 2: print("Exactly") # Exactly
```

```python
if alpha > 7:
    beta = 999
elif alpha == 7:
    beta = 99
else:
    beta = 0

#简化为
beta = 999 if alpha > 7 else 99 if alpha == 7 else 0
```
### 合并两个词典
```python
dict_1 = {'One':1, 'Two':2}
dict_2 = {'Two':2, 'Three':3}
dictionary = {**dict_1, **dict_2}
print(dictionary)
# {'One': 1, 'Two': 2, 'Three': 3}
```
### 交换两个变量
```python
a , b = 50 , 60
print(a,b)
a , b = b , a
print("After swapping",a,b)
```
### 多重赋值

让我们尝试增加前一个代码中的值的数量。可以将多个值赋给单个变量。将多个值赋给一个变量时，必须在变量名前使用星号。

```python
a , *b = 50 , 60 , 70
print(a)
print(b)
print(type(a))
print(type(b))

# 50
# [60, 70]
# <class 'int'>
# <class 'list'>
```

###  Web server
有时候需要一个临时的 Web server，可以直接`python3 -m http.server 12345`


## collections包

参考链接：  https://zhuanlan.zhihu.com/p/343747724
提供了各类型数据结构

