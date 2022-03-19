---
title: 位运算及应用
date: 2021-12-28
draft: false
categories:
  - 算法
---

## Go支持的位运算

| 位运算符        | 示例     | 说明                                                         |
| --------------- | -------- | ------------------------------------------------------------ |
| `\|`（按位或） | `a \| b` | 对应位有一个是1则返回1，否则返回0                            |
| `&`（按位与）     | `a & b`  | 对应位都是1则返回1，否则返回0                                |
| `^`（按位异或）   | `a ^ b`  | 对应位不相同则返回1，否则返回0                               |
| `&^`（Bit clear） | `a &^ b` | 结果假设为a，然后a中为1的位和对应b的位都为1，则将a此位置0    |
| `<<`（左移）      | `a << n` | 乘以2^n，将a左移n位，高位丢弃，低位补0                       |
| `>>`（右移）      | `a >> n` | 除以2^n，将a右移n位，低位丢弃，但高位不是简单的补0（需要注意符号） |

```go
var tables = []struct {
  p1     int
  p2     int
  symbol string
}{
  {4, 5, "|"},
  {4, 5, "&"},
  {4, 5, "^"},
  {6, 11, "&^"},
  {4, 2, "<<"},
  {4, 1, ">>"},
}

for _, t := range tables {
  var result int
  switch t.symbol {
  case "|":
    result = t.p1 | t.p2
  case "&":
    result = t.p1 & t.p2
  case "^":
    result = t.p1 ^ t.p2
  case "<<":
    result = t.p1 << t.p2
  case ">>":
    result = t.p1 >> t.p2
  case "&^":
    result = t.p1 &^ t.p2
  default:
    continue
  }
  fmt.Printf("%d(%b) %s %d(%b) = %d(%b)\n", t.p1, t.p1, t.symbol, t.p2, t.p2, result, result)
}

// 4(100) | 5(101) = 5(101)
// 4(100) & 5(101) = 4(100)
// 4(100) ^ 5(101) = 1(1)
// 6(110) &^ 11(1011) = 4(100)
// 4(100) << 2(10) = 16(10000)
// 4(100) >> 1(1) = 2(10)
```

## 表达包含关系

- `|`表示`添加`
- `^`表示`删除`
- 通过`&`判断是否`包含`

```go
const (
  Sunday    int = 1 << iota // 1
  Monday                    // 2
  Tuesday                   // 4
  Wednesday                 // 8
  Thursday                  // 16
  Friday                    // 32
  Saturday                  // 64
)

var source = Monday | Wednesday | Friday | Saturday
source = source ^ Wednesday

fmt.Printf("include Sunday: %v\n", source&Sunday == Sunday)
fmt.Printf("include Monday: %v\n", source&Monday == Monday)
fmt.Printf("include Tuesday: %v\n", source&Tuesday == Tuesday)
fmt.Printf("include Wednesday: %v\n", source&Wednesday == Wednesday)
fmt.Printf("include Thursday: %v\n", source&Thursday == Thursday)
fmt.Printf("include Friday: %v\n", source&Friday == Friday)
fmt.Printf("include Saturday: %v\n", source&Saturday == Saturday
   
// include Sunday: false
// include Monday: true
// include Tuesday: false
// include Wednesday: false
// include Thursday: false
// include Friday: true
// include Saturday: true
```

## 加密

[XOR 加密简介-阮一峰](http://www.ruanyifeng.com/blog/2017/05/xor.html)