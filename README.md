# vue双向绑定数据原理

在此代码示例中分别用到了以下几种原理：
* Object.defineProperty的getter 及 setter 生成数据观察者
* 使用发布者-订阅者模式更新视图
* 数据观察者在getter时，将订阅者放入发布者的队列中
* 使用观察者的setter时，触发发布者的notify方法，遍历发布者队列中的订阅者，执行订阅者的update方法更新视图