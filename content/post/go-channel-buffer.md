---
title: GO 无缓冲通道和有缓冲通道
date: 2020-11-02
categories:
  - 后端
sidebar: false
tags:
  - Go
---


## 无缓冲通道

```go
func main() {
	c := make(chan int)

	go func() {
		time.Sleep(3 * time.Second)
		fmt.Println("receive")
		fmt.Println(<-c)
	}()

	c <- 1
	fmt.Println("send")
}
```

执行结果。

```
receive
1
send
```

对于无缓冲通道，必须得`send goroutine`和`receive goroutine`双发都得准备好，如果两个 `goroutine`没有同时准备好，通道会导致先执行`send`或`receive`操作的`goroutine`阻塞等待。

这意味着执行`c<-1`时，发现没有`receive`方，于是阻塞等待，这就解释了为什么以上主程序执行到`c<-1`，然后阻塞，同时另一个`goroutine`三秒后打印，从`channel`中取值，最后主程序结束。

## 有缓冲通道

有缓冲通道有一个缓冲区，这个大小在声明时指定。所以他不要求`goroutine`同时完成`send`和`receive`，只有缓冲区满的时候，`send`操作才会阻塞，只有缓冲区空的时候，`receive`操作才会阻塞，试着为上面程序的通道加上缓冲区。

```go
func main() {
	c := make(chan int, 1)

	go func() {
		time.Sleep(3 * time.Second)
		fmt.Println("receive")
		fmt.Println(<-c)
	}()

	c <- 1
	fmt.Println("send")
}
```

执行结果。

```
send
```

