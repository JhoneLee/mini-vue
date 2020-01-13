class Compile{
    constructor(el,vm) {
        this.$el = document.querySelector(el);
        this.$vm = vm;
        // 将dom转换到fragment中进行编译
        this.node2Fragment();
        // 编译模板
        this.compile(this.$frag);
        // 编译完毕插入dom
        this.$el.appendChild(this.$frag);
    }
    node2Fragment(){
        this.$frag = document.createDocumentFragment();
        let child = this.$el.childNodes;
        // 将child存入 fragment， 使用forEach遍历NodeList向dom或fragment 插入时，无法得到nodeType==1 的节点
        // 需要将其转换为数组
        // 如果child是HTMLCollection 集合，元素节点可以被appendChild到fragment、dom中
        Array.from(child).forEach((e,i)=>{
            this.$frag.appendChild(e);
        });
    }

    compile(node){
        var nodeList = node.childNodes;
        if(nodeList.length){
            nodeList.forEach((node)=>{
                if(this.isNode(node)){
                    // 编译节点
                    const attr = node.attributes;
                    Array.from(attr).forEach((e)=>{
                        // 检测是否为指令
                        if(this.isDirect(e)){
                            const direct = e.localName.substring(2);
                            // direct = model
                            const key = e.value;
                            // key = lang
                            // 执行指令函数
                            if(this[direct]){
                                this[direct](key,node,this.$vm);
                            }
                        } else if(this.isEvent(e)){
                            // 获取 @click 指令
                            const event = e.localName.substring(1);
                            // event = click
                            const callback = e.value;
                            this.bindEvent(event,node,this.$vm,this.$vm[callback]);
                        }
                    });

                } else if(this.isInsert(node)){
                    // 编译文本
                    this.compileText(node);
                }
                this.compile(node);
            });

        }

    }
    //是否为dom node
    isNode(node){
        return node.nodeType === 1;
    }
    // 是否为插值节点
    isInsert(node){
        const reg = /\{\{(.*)\}\}/;
        return node.nodeType===3 && reg.test(node.textContent);
    }
    // 判断属性是否为指令
    isDirect(attr){
        return attr.localName.indexOf('v-') === 0;
    }
    // 判定是否为事件
    isEvent(attr){
        return attr.localName.indexOf('@')===0;
    }
    // 编译文本
    compileText(node){
        const reg = /\{\{(.*)\}\}/;
        const text = node.textContent;
        // 用正则匹配出{{}} 中的数据
        const key = text.match(reg)[1];
        // 调用统一的updater函数
        this.updater('text',key,node,this.$vm);
    }
    updater(type,key,node,vm){
        //根据传入的type不同执行不同的updater具体方法
        const fn = this[`${type}Updater`];
        if(vm[key]){
            // 先执行方法想模板中的字段绑定数据
            fn(vm[key],node);
            // 建立订阅者去时刻等待数据改变
            new Watcher(vm,key,function(value){
                // 数据改变后执行的回调函数，其实就是该节点类型对应的update方法
                fn(value,node);
            });
        }
    }
    // 文本类型节点的更新方法
    textUpdater(value,node){
        node.textContent = value;
    }
    // 插入innerHtml节点的对应方法
    htmlUpdater(value,node){
        node.innerHTML = value;
    }
    // 双向绑定对应的更新方法
    modelUpdater(value,node){
        node.value = value;
    }

    // 指令操作 
    // 插入文本指令，复用文本类型节点更新方法
    text(key,node,vm){
        this.updater('text',key,node,vm);
    }
    // 插入html指令，复用html更新方法

    html(key,node,vm){
        this.updater('html',key,node,vm);
    }
    // 双向绑定指令，在更新数据的同时还要注册input函数
    model(key,node,vm){
        this.updater('model',key,node,vm);
        // 使用同一的bindEvent进行事件绑定
        this.bindEvent('input',node,vm,function(e){
            this[key] = e.target.value;
        });
    }

    // 绑定事件
    bindEvent(type,node,_this,callback){
        window.addEventListener(type,function(e){
            // var args = Array.prototype.slice.call(arguments,1)
            callback.call(_this,e);
        });
    }

}