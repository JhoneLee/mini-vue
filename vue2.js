 
class myVue{
    constructor(options){
        // 将data methods等存入自己的属性
        this.$data = options.data;
        this.$methods = options.methods;
        // 进行数据劫持
        this.observe(this.$data);
        // 对事件进行代理
        this.proxyMethod();
        // 对html进行编译
        const compiler = new Compile(options.el,this);
        // 执行生命周期
        options.created.call(this);
    }
    observe(data){
        // 接触数据
        if(typeof data === 'object'){
            for(let key in data){
                this.defineReactive(data,key);
                this.proxyData(key);
            }
        }
    }
    // 代理事件到this上
    proxyMethod(){
        Object.keys(this.$methods).forEach(key=>{
            Object.defineProperty(this,key,{
                get(){
                    return this.$methods[key];
                }
            });
        });
    }
    // 代理$data到this上
    proxyData(key){
        Object.defineProperty(this,key,{
            get(){
                return this.$data[key];
            },
            set(newVal){
                this.$data[key] = newVal;
            }
        });
    }
    // 实现数据劫持的方法
    defineReactive(obj,key){
        // 获取当前属性的值
        var value = obj[key];
        // 如果value是object，递归调用，实现深度数据劫持
        this.observe(value);
        // 为这个对象生成一个新的依赖收集器
        var dep = new Dep();
        Object.defineProperty(obj,key,{
            get(){
                // 为这个依赖收集器 添加订阅者
                dep.add(Dep.target);
                // 返回value
                return value;
            },
            set(newVal){
                if(newVal === value){
                    return;
                }
                value = newVal;
                // 触发依赖收集器的通知方法，以便执行各个订阅者的update方法
                dep.notify();
            }
        });
    }
}

// 定义依赖收集
class Dep{
    constructor(){
        // 构建收集队列
        this.deps = [];
    }
    add(dep){
        // 添加订阅者
        dep && this.deps.push(dep);
    }
    notify(){
        // 遍历订阅者，执行订阅者的update方法
        this.deps.forEach(dep=>{
            dep.update();
        })
    }
}

// 定义watcher
class Watcher{
    constructor(vm,key,updater){
        // 让订阅者知道自己从属于哪个vue实例，对应vm.$data上的哪个字段，updater是什么
        this.vm = vm;
        this.key = key;
        this.updater = updater;
        // 给Dep.target赋值上自己
        Dep.target = this;
        // 此行为触发数据劫持者的getter，执行dep.add方法，将订阅者放入依赖收集器
        this.value = this.vm[this.key];
        // 赶紧将target置空，防止被依赖收集器重复添加
        Dep.target = null;
    }
    update(){
        // 执行更新
        if(this.updater){
            this.updater(this.vm[this.key]);
        }
    }
}

