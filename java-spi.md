## SPI 简介

**SPI** 全称为 **Service Provider Interface**，是一种服务发现机制。SPI的本质是将接口实现类（可以是一个或多个）配置在文件中，然后服务读取配置文件，加载指定接口的实现类。利用 SPI 机制很容易为程序提供拓展功能，使程序解耦。

SPI 可以分为 Java SPI 和框架自定义的 SPI，例如 Spring、Dubbo。

## Java SPI 示例

本节通过一个示例演示 Java SPI 的使用方法，首先定义一个接口，名称为 `Device`。

```java
public interface Device {
    void say();
}
```

接下来定义两个实现类，分别为 `Computer` 和 `Phone`。

```java
public class Computer implements Device {

    @Override
    public void say() {
        System.out.println("Hello, I am Computer");
    }
}

public class Phone implements Device {

    @Override
    public void say() {
        System.out.println("Hello, I am Phone");
    }
}
```

接下来在`META-INF/services`文件夹下创建一个文件，名称为 `Device` 的全限定名 `com.vczyh.spi.Device`，文件内容为实现类的全限定名，如下：

```
com.vczyh.spi.Computer
com.vczyh.spi.Phone
```

接下来编写代码进行测试。

```java
public class App {
    public static void main(String[] args) {
        ServiceLoader<Device> loader = ServiceLoader.load(Device.class);
        Iterator<Device> iterator = loader.iterator();
        while (iterator.hasNext()) {
            Device device = iterator.next();
            device.say();
        }
    }
}
// 运行结果
Hello, I am Computer
Hello, I am Phone
```

从运行结果可以看出，成功加载了接口的两个实现类，并创建了两个实现类的实例。需要注意的是在这个过程中，我们并没有显式创建实例，接下来剖析 `java.util.ServiceLoader` 做了哪些工作。

------

### ServiceLoader 源码

```java
// 扫描路径
private static final String PREFIX = "META-INF/services/";

// 被加载类的接口或者抽象类
private final Class<S> service;

// 类加载器
private final ClassLoader loader;

// 文件访问上下文，例如判断权限
private final AccessControlContext acc;

// 存放加载类的实例，key为实现类的全限定名，value为实现类的实例
private LinkedHashMap<String,S> providers = new LinkedHashMap<>();

// 懒查找迭代器
private LazyIterator lookupIterator;
```

```java
public static <S> ServiceLoader<S> load(Class<S> service) {
    // 如不指定 ClassLoader，指定默认 ClassLoader
    ClassLoader cl = Thread.currentThread().getContextClassLoader();
    // 创建 ServiceLoader 实例
    return ServiceLoader.load(service, cl);
}
```

```java
private ServiceLoader(Class<S> svc, ClassLoader cl) {
    service = Objects.requireNonNull(svc, "Service interface cannot be null");
    loader = (cl == null) ? ClassLoader.getSystemClassLoader() : cl;
    acc = (System.getSecurityManager() != null) ? AccessController.getContext() : null;
    reload();
}
```

```java
public void reload() {
	// 清空 providers
    providers.clear();
    // 创建新的迭代器
    lookupIterator = new LazyIterator(service, loader);
}
```

```java
private class LazyIterator implements Iterator<S> {
	// 被加载类的接口或者抽象类
    Class<S> service;
    // 类加载器
    ClassLoader loader;
    // 路径为 PREFIX + service.getName() 的文件URL
    Enumeration<URL> configs = null;
    // 当前configs的URL对应文件中的所有实现类的全限定名
    Iterator<String> pending = null;
    String nextName = null;

    private LazyIterator(Class<S> service, ClassLoader loader) {
        this.service = service;
        this.loader = loader;
    }

    private boolean hasNextService() {
        if (nextName != null) {
            return true;
        }
        // 第一次调用（延迟加载）
        if (configs == null) {
            try {
                // 文件路径
                String fullName = PREFIX + service.getName();
                // 获取文件URL
                // 这里会查找classpath下所有jar包里的fullName文件，因此可能有多个重名文件，所以configs可能有多个URL
                if (loader == null)
                    configs = ClassLoader.getSystemResources(fullName);
                else
                    configs = loader.getResources(fullName);
            } catch (IOException x) {
                fail(service, "Error locating configuration files", x);
            }
        }
        // 第一次调用，或者当前文件中的所有实现类已遍历完
        while ((pending == null) || !pending.hasNext()) {
            // 所有URL已遍历完
            if (!configs.hasMoreElements()) {
                return false;
            }
            // 还有URL没有遍历，继续解析下一个URL对应的文件，以获取该文件中的所有实现类
            // 而且会对文件中相同的实现类进行去重
            pending = parse(service, configs.nextElement());
        }
        // 当前文件中的下一个实现类
        nextName = pending.next();
        return true;
    }

    private S nextService() {
        if (!hasNextService())
            throw new NoSuchElementException();
        String cn = nextName;
        nextName = null;
        Class<?> c = null;
        try {
            // 加载实现类，第二个参数为false表示不进行初始化（执行static代码），初始化会放在实例化步骤进行
            c = Class.forName(cn, false, loader);
        } catch (ClassNotFoundException x) {
            fail(service,
                 "Provider " + cn + " not found");
        }
        // c不是service的子类型
        if (!service.isAssignableFrom(c)) {
            fail(service,
                 "Provider " + cn  + " not a subtype");
        }
        try {
            // 初始化，实例化c，并将实例转换为service类型
            S p = service.cast(c.newInstance());
            // 添加到providers中
            providers.put(cn, p);
            return p;
        } catch (Throwable x) {
            fail(service,
                 "Provider " + cn + " could not be instantiated",
                 x);
        }
        throw new Error();          // This cannot happen
    }

    public boolean hasNext() {
        if (acc == null) {
            return hasNextService();
        } else {
            // 具有特权
            PrivilegedAction<Boolean> action = new PrivilegedAction<Boolean>() {
                public Boolean run() { return hasNextService(); }
            };
            return AccessController.doPrivileged(action, acc);
        }
    }

    public S next() {
        if (acc == null) {
            return nextService();
        } else {
            PrivilegedAction<S> action = new PrivilegedAction<S>() {
                public S run() { return nextService(); }
            };
            return AccessController.doPrivileged(action, acc);
        }
    }

    public void remove() {
        // 不支持 remove 操作
        throw new UnsupportedOperationException();
    }

}
```

```java
public Iterator<S> iterator() {
    return new Iterator<S>() {
		
        Iterator<Map.Entry<String,S>> knownProviders
            = providers.entrySet().iterator();

        public boolean hasNext() {
            // 先遍历providers，再懒加载
            if (knownProviders.hasNext())
                return true;
            return lookupIterator.hasNext();
        }

        public S next() {
            // 先遍历providers，再懒加载
            if (knownProviders.hasNext())
                return knownProviders.next().getValue();
            return lookupIterator.next();
        }

        public void remove() {
            // 不支持remove操作
            throw new UnsupportedOperationException();
        }

    };
}
```

------

### ServiceLoader 流程

1. 读取所有jar包里路径为 `META-INF/services/service.getName()` 的文件。
2. 遍历文件获取每个文件中配置的实现类。
3. 判断实现类是否为 `service` 的子类型。
4. 实例化实现类。
5. key为实现类全限定名，value为实现类的实例，添加到 `providers` 中。

------

### Java SPI 在 JDBC 中的应用

Java 提供了驱动标准接口 `java.sql.Driver`，驱动的具体实现的一个例子如下：

```java
public class CustomDriver implements Driver {
    @Override
    public Connection connect(String url, Properties info) throws SQLException {
        // implement
    }
	// other methods
}
```

可以这样使用驱动。

```java
CustomDriver driver = new CustomDriver();
Properties props = new Properties();
props.setProperty("username", "root");
props.setProperty("password", "root");
Connection con = driver.connect("jdbc:mysql://localhost:3306/test", props);
```

如果我们想实现驱动具体实现和代码解耦，可以通过Java SPI，首先编写SPI配置文件 `META-INF/services/java.sql.Driver`：

```
com.vczyh.spi.CustomDriver
```

接下来使用该驱动。

```java
ServiceLoader<Driver> loader = ServiceLoader.load(Driver.class);
Iterator<Driver> iterator = loader.iterator();
while (iterator.hasNext()) {
    Driver driver = iterator.next();
    Properties props = new Properties();
    props.setProperty("username", "root");
    props.setProperty("password", "root");
    Connection con = driver.connect("jdbc:mysql://localhost:3306/test", props);
}
```

这样就实现了通过修改配置文件达到加载不同驱动的目的，下面再看看平时我们如何连接数据库的。

```java
@Test
public void connect() throws SQLException {
    String url = "jdbc:mysql://192.168.22.130:3306/test";
    String username = "vczyh";
    String password = "vczyh";
    Connection con = DriverManager.getConnection(url, username, password);
}
```

`DriverManager` 做了以下工作：

1. 获取所有驱动。
2. 依次调用驱动的 `connect()`方法，获取连接成功的驱动。

加载 `DriverManager` 时会执行 static 代码块：

```java
static {
    loadInitialDrivers();
    println("JDBC DriverManager initialized");
}
```

```java
private static void loadInitialDrivers() {
    String drivers;
    try {
        drivers = AccessController.doPrivileged(new PrivilegedAction<String>() {
            public String run() {
                // 获取通过环境变量设置的驱动
                return System.getProperty("jdbc.drivers");
            }
        });
    } catch (Exception ex) {
        drivers = null;
    }
	// 获取并实例化通过SPI设置的驱动
    AccessController.doPrivileged(new PrivilegedAction<Void>() {
        public Void run() {

            ServiceLoader<Driver> loadedDrivers = ServiceLoader.load(Driver.class);
            Iterator<Driver> driversIterator = loadedDrivers.iterator();
            try{
                while(driversIterator.hasNext()) {
                    driversIterator.next();
                }
            } catch(Throwable t) {
            // Do nothing
            }
            return null;
        }
    });

    println("DriverManager.initialize: jdbc.drivers = " + drivers);

    if (drivers == null || drivers.equals("")) {
        return;
    }
    // 通过环境变量设置的多个驱动通过:分割
    String[] driversList = drivers.split(":");
    println("number of Drivers:" + driversList.length);
    for (String aDriver : driversList) {
        try {
            println("DriverManager.Initialize: loading " + aDriver);
            // 加载驱动，并初始化（执行static代码）
            Class.forName(aDriver, true,
                    ClassLoader.getSystemClassLoader());
        } catch (Exception ex) {
            println("DriverManager.Initialize: load failed: " + ex);
        }
    }
}
```

`loadInitialDrivers()` 方法执行完后，通过环境变量设置的驱动全部初始化，通过SPI设置的驱动全部实例化（当然，在实例化之前已经初始化）。再来看看 `DriverManager.getConnection()` 方法，这里只截取了关键代码。

```java
// private final static CopyOnWriteArrayList<DriverInfo> registeredDrivers = new CopyOnWriteArrayList<>();
// registeredDrivers 存放驱动实例
for(DriverInfo aDriver : registeredDrivers) {
    // If the caller does not have permission to load the driver then
    // skip it.
    if(isDriverAllowed(aDriver.driver, callerCL)) {
        try {
            println("    trying " + aDriver.driver.getClass().getName());
            // 尝试建立连接
            Connection con = aDriver.driver.connect(url, info);
            if (con != null) {
                // 连接成功
                println("getConnection returning " + aDriver.driver.getClass().getName());
                return (con);
            }
        } catch (SQLException ex) {
            // 连接失败
            if (reason == null) {
                reason = ex;
            }
        }

    } else {
        println("    skipping: " + aDriver.getClass().getName());
    }

}
```

`registeredDrivers` 中的驱动实例什么时候添加进去的，谁添加进去的。打开 `java.sql.Driver`，有这么一段注释： 

> When a Driver class is loaded, it should create an instance of itself and register it with the DriverManager.

要求驱动实现类被加载的时候，实现类应该创建一个自身的实例，并且注册到 `DriverManager` 中。接下来看看 MySQL 驱动具体代码：

```java
public class Driver extends NonRegisteringDriver implements java.sql.Driver {
    static {
        try {
            // 关键
            // 初始化时主动将自身注册到DriverManager中
            java.sql.DriverManager.registerDriver(new Driver());
        } catch (SQLException E) {
            throw new RuntimeException("Can't register driver!");
        }
    }

    /**
     * Construct a new driver and register it with DriverManager
     * 
     * @throws SQLException
     *             if a database error occurs.
     */
    public Driver() throws SQLException {
        // Required for Class.forName().newInstance()
    }
}
```

JDBC整个过程：

1. `DriverManager` 初始化时执行 `loadInitialDrivers()` 方法，通过两种方式获取驱动（环境变量和SPI），最终获取的驱动都会初始化。
2. 驱动初始化时会将自身实例注册到 `DriverManager` 。
3. 执行 `DriverManager.getConnection()` 方法时，依次尝试连接，直到连接成功，然后返回。

## Spring SPI

Spring SPI 的配置文件为 `META-INF/spring.factories`，内容为 Properties 格式，例如在 `spring-boot-2.3.1.RELEASE.jar` 中，部分配置如下：

```properties
# PropertySource Loaders
org.springframework.boot.env.PropertySourceLoader=\
org.springframework.boot.env.PropertiesPropertySourceLoader,\
org.springframework.boot.env.YamlPropertySourceLoader

# Run Listeners
org.springframework.boot.SpringApplicationRunListener=\
org.springframework.boot.context.event.EventPublishingRunListener

# Error Reporters
org.springframework.boot.SpringBootExceptionReporter=\
org.springframework.boot.diagnostics.FailureAnalyzers

# Application Context Initializers
org.springframework.context.ApplicationContextInitializer=\
org.springframework.boot.context.ConfigurationWarningsApplicationContextInitializer,\
org.springframework.boot.context.ContextIdApplicationContextInitializer,\
org.springframework.boot.context.config.DelegatingApplicationContextInitializer,\
org.springframework.boot.rsocket.context.RSocketPortInfoApplicationContextInitializer,\
org.springframework.boot.web.context.ServerPortInfoApplicationContextInitializer
```

Spring Boot 通过 SPI 灵活控制实例，减少了对框架的入侵 。接下来看看实现 SPI 的关键类 `org.springframework.core.io.support.SpringFactoriesLoader` 。

```java
// 获取指定类型的所有实例
public static <T> List<T> loadFactories(Class<T> factoryType, @Nullable ClassLoader classLoader) {
    Assert.notNull(factoryType, "'factoryType' must not be null");
    // 获取ClassLoader
    ClassLoader classLoaderToUse = classLoader;
    if (classLoaderToUse == null) {
        classLoaderToUse = SpringFactoriesLoader.class.getClassLoader();
    }
    // 往下看
    List<String> factoryImplementationNames = loadFactoryNames(factoryType, classLoaderToUse);
    if (logger.isTraceEnabled()) {
        logger.trace("Loaded [" + factoryType.getName() + "] names: " + factoryImplementationNames);
    }
    List<T> result = new ArrayList<>(factoryImplementationNames.size());
    for (String factoryImplementationName : factoryImplementationNames) {
        // 实例化，然后将实例添加到集合中
        result.add(instantiateFactory(factoryImplementationName, factoryType, classLoaderToUse));
    }
    // 根据优先级排序
    AnnotationAwareOrderComparator.sort(result);
    return result;
}
```

```java
public static List<String> loadFactoryNames(Class<?> factoryType, @Nullable ClassLoader classLoader) {
    String factoryTypeName = factoryType.getName();
    return loadSpringFactories(classLoader).getOrDefault(factoryTypeName, Collections.emptyList());
}
```

```java
// 获取所有配置
private static Map<String, List<String>> loadSpringFactories(@Nullable ClassLoader classLoader) {
    // 从缓存中获取
    MultiValueMap<String, String> result = cache.get(classLoader);
    // 当前的ClassLoader扫描过配置文件，直接返回缓存中的数据
    if (result != null) {
        return result;
    }

    try {
        // 获取所有配置文件
        Enumeration<URL> urls = (classLoader != null ?
                classLoader.getResources(FACTORIES_RESOURCE_LOCATION) :
                ClassLoader.getSystemResources(FACTORIES_RESOURCE_LOCATION));
        result = new LinkedMultiValueMap<>();
        // 遍历所有配置文件
        while (urls.hasMoreElements()) {
            URL url = urls.nextElement();
            UrlResource resource = new UrlResource(url);
            // 将配置文件转换为Properties对象，方便操作
            Properties properties = PropertiesLoaderUtils.loadProperties(resource);
            // 遍历配置文件中所有的数据
            for (Map.Entry<?, ?> entry : properties.entrySet()) {
                // 配置文件中key为接口全限定名，value为一个或多个实现类全限定名（用逗号分隔）
                String factoryTypeName = ((String) entry.getKey()).trim();
                for (String factoryImplementationName : StringUtils.commaDelimitedListToStringArray((String) entry.getValue())) {
                    // 一个key对应多个value
                    result.add(factoryTypeName, factoryImplementationName.trim());
                }
            }
        }
        // 放入缓存
        cache.put(classLoader, result);
        return result;
    }
    catch (IOException ex) {
        throw new IllegalArgumentException("Unable to load factories from location [" +
                FACTORIES_RESOURCE_LOCATION + "]", ex);
    }
}
```

------

### 优点

对比 Java SPI，Spring SPI 有以下优点：

- 相同的 ClassLoader 多次调用只扫描一次配置文件。
- 当配置文件有多个实现类时，可以使用 Spring 提供的`Order` 注解标记优先级。





