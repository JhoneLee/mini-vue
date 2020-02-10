/*
* @Author: liyunjiao2048@163.com
* @Date:   2019-11-19 14:55:48
* @Last Modified by:   liyunjiao2048@163.com
* @Last Modified time: 2020-01-07 20:44:32
*/

function MVue(opt){
    let {data,el} = opt;
    this.$data = data || {};
    this.$el = el;
    // 用观察者监听数据
    obverser(this.$data);
    // 找到宿主dom
    let elem = document.querySelector(this.$el);
    // 向宿主dom中注入被vue处理后的节点
    elem.appendChild(nodeToFragement(elem,this));
}

/*
    vue进行编译时，将挂载目标的所有子节点劫持到DocumentFragment中，
    经过解析等处理后，再将DocumentFragment整体挂载到目标节点上。
*/
function nodeToFragement(node,vm){
    let fragement = document.createDocumentFragment();
    let child;
    while(child = node.firstChild){
        // 编译vue节点
        compile(child,vm);
        if(child.firstChild){
            let dom = nodeToFragement(child);
            child.appendChild(dom);
        }
        // fragement在appendChild的时候会删除child的原始节点
        fragement.appendChild(child);
    }
    return fragement;
}

// 定义模板编译器
function compile(node,vm){
    let reg = /\{\{(.*)\}\}/;
    // 如果是元素节点
    if(node.nodeType==1){
        // 解读节点上的指令
        let attrs = node.attributes;
        for(let attr of attrs){
            // 只解析v-mode指令
            if(attr.nodeName==='v-mode'){
                let name = attr.nodeValue;
                // 监听input事件，进行数据同步
                node.addEventListener('input',(e)=>{
                    vm.$data[name] = e.target.value;
                });
                // value初始化
                node.value = vm.$data[name] || '';
                // 卸磨杀驴，防止重复绑定
                node.removeAttribute('v-model');
            }
        }
    } else if(node.nodeType==3){
        // 文本节点
        if(reg.test(node.nodeValue)){
            // RegExp.$1 保存上一次匹配的第一个捕获组结果 $2-$99 以此类推
            let name = RegExp.$1 && RegExp.$1.trim() ;
            // 备份模板字符串
            node.tplStr = node.nodeValue;
            // 定义节点的订阅者
            new Watcher(node,vm,name);
        }
    }
}
// 定义更新视图用的 发布者
function Dep(){
    this.subs = [];
}
Dep.prototype = {
    addSub(sub){
        this.subs.push(sub);
    },
    notify(){
        // 通知全部的订阅者
        this.subs.forEach((sub)=>{
            // 订阅者执行自身的update方法，更新视图
            sub.update();
        })
    }
}

// 定义订阅者
function Watcher(node,vm,name){
    this.node = node;
    this.vm = vm;
    this.name = name;
    // 将订阅者和发布者联系起来，将订阅者暂存在发布者的target中
    Dep.target = this;
    // 初始化订阅者的值
    // 会从观察者绑定的数据中取值，触发数据观察者的get方法
    // 观察者的get方法中会将 Dep.target存入 此发布者的订阅者队列
    this.update();
    // 为其他订阅者腾地方
    Dep.target = null;
}
Watcher.prototype = {
    update(){
        this.get();
        if(this.node.nodeType==3){
            this.node.nodeValue = this.node.tplStr.replace(new RegExp('\\{\\{\\s*(' + name + ')\\s*\\}\\}'), this.value);
        }
        // this.node.nodeValue = ;
        
        // 此处触发观察者的getter，将订阅者存入管理观察者的队列
        this.value = this.vm.$data[this.name]
    },
    get(){
        
    }
}

// 定义观察者监听对象的setter

function obverser(object){
    Object.keys(object).forEach((e)=>{
        // 循环递归遍历object中的每一项属性
        if (object.hasOwnProperty(e)) {
            if (object[e].constructor === 'Object') {
                obverser(object[e])
            }
            // 为每一个对象的属性绑定setter
            defineReactive(object, e);
        }
    });
}

function defineReactive(obj,key){
    let _value = obj[key];
    let dep = new Dep();
    console.log('执行咯',obj,key)
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        set (newVal) {
            if (_value === newVal) {
                return;
            }
            _value= newVal;
            // 作为发布者发出通知给全部的订阅者
            dep.notify();
        },
        get () {
            // 如果订阅者存在，添加到此发布者的订阅者队列中
            if (Dep.target) {
                dep.addSub(Dep.target);
            }
            return _value
        }
    })
}

