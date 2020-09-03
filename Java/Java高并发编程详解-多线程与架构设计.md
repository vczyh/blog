### Java高并发编程详解-多线程与架构设计

#### 第1章 快速认识线程

- `JConsole`工具的使用
- 线程的生命周期（五个）
  - new
  - runnable
  - running
  - blocked
  - terminated
- start()方法
  - 执行start()，然后执行start0()，start0是一个JNI，start0会自动调用run()
- Thread重写run方法，实现Runnable接口的run方法区别
  - 后者可以将线程的控制和逻辑分离开
  - 后者实现多个线程实例共用一个Runnable实例(比如成员变量)

#### 第2章 深入理解Thread构造函数

- 线程的命名

  - 默认命名
  - 构造函数
  - `setName()`  【启动前】

- 线程的父子关系

  - 一个线程的创建肯定是由另一个线程完成的
  - 被创建线程的父线程是创建它得线程
  - 默认子线程和父线程的Group、优先级、daemon相同

- ThreadGroup

  - main线程所在的ThreadGroup被称为main
  - 构建线程时没有显式的指定ThreadGroup，那么它的ThreadGroup同它父线程的ThreadGroup相同

- 虚拟机栈

  - Thread的构造方法参数stacksize的作用是指定虚拟机栈(每个线程的)，因此物理内存一定时，stacksize越大，可创建的线程数越少，但递归深度越深
  - -xss

- 守护线程

  - 父线程结束生命周期，守护线程就会结束生命周期，也就是当只有守护线程时，JVM会停止运行
  - `setDaemon(true|false)`

#### 第3章 Thread API的详细介绍

#### 第4章 线程安全与数据同步

#### 第5章 线程间通信

- 同步阻塞消息处理

- 异步非阻塞消息处理

- 单线程间通信

  - wait和notify是对象的方法，且只能在同步代码块中使用，同步对象和调用wait和notify方法的对象必须一致，否则抛出`IllegalMonitorStateException`

  - wait()

    - 线程执行某个对象的wait方法，该线程会加入到对象的wait set中

        - | 方法                   | sleep(long)          | wait()                                                    |
            | ---------------------- | -------------------- | --------------------------------------------------------- |
            | 所属类                 | Thread               | Object                                                    |
            | 可中断                 | 是                   | 是                                                        |
            | 暂停代码执行           | 是                   | 是                                                        |
            | 是否释放monitor lock   | 否                   | 是                                                        |
            | 可否一直暂停执行       | 否，必须传入休眠时间 | 是，<br />wait()会一直等待<br /> wait(long)会等待指定时间 |
          | 只能在同步代码块中使用 | 否                   | 是                                                        |
  
    
  
- notify()
  
    - notify方法可以唤醒wait set中的线程，该线程在获得monitor lock后会继续执行代码
    - notifyAll方法可以唤醒wait set中的所有线程
  
- 多线程间通信

  - 生产者与消费者
  - 线程休息室wait set

- 自定义显示锁BooleanLock解决synchronized缺陷

  - synchronized缺点
    - 不能控制阻塞超时时长
    - 阻塞不能被中断

#### 第6章 ThreadGroup详细讲解

#### 第7章 Hook线程以及捕获线程执行异常



  

  

