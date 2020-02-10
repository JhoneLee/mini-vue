/*
 发布-订阅者 模式
*/

class EventEmitter {
    constructor(props) {
        this.events = {};
    }
    on(type,listener,prev){
        if(this.events[type]){
            if(prev){
                this.events[type].unshift(listener);
            } else {
                this.events[type].push(listener);
            }
        } else {
            this.events[type] = [listener];
        }
    }

    emit(type,args){
        let funcArr = this.events[type];
        if(funcArr && funcArr.length){
            funcArr.forEach(f=>{
                return f.call(this,args);
            });
        } else {
            throw new Error('没有该事件');
        }
    }

    once(type,listener){
        const only = ()=>{
            let args = Array.prototype.slice.call(arguments,0);
            listener.apply(this,args);
            this.off(type,only);
        }
        only.origin = listener;
        this.on(type,only);
    }

    off(type,listener){
        let funcArr = this.events[type];
        if(funcArr && funcArr.length){
            this.events[type] = funcArr.filter((f)=>{
                return f!==listener && f!==listener.origin;
            })
        }
    }
}

