/*
* @Author: liyunjiao2048@163.com
* @Date:   2020-01-07 20:43:25
* @Last Modified by:   liyunjiao2048@163.com
* @Last Modified time: 2020-01-07 20:44:28
*/

// 普通lazyman
function LazyMan(name){
    return new lazyman(name);
}

class lazyman {
    constructor(name){
        this.tasks = [];
        let task = ()=>{
            console.log(`Hi my name is ${name}`);
            this.next();
        }
        this.tasks.push(task)
        setTimeout(()=>{
            this.next();
        },0)
    }
    next(){
        let task = this.tasks.shift();
        task&&task();
    }
    eat(some){
        let task = ()=>{
            console.log(`I am eat ${some}`);
            this.next();
        }
        this.tasks.push(task);
        return this;
    }
    sleep(time){
        let task = ()=>{
            setTimeout(()=>{
                console.log(`wake up after ${time} s`);
                this.next();
            },time*1000);
        }
        this.tasks.push(task);
        return this;
    }
    firstSleep(time){
        let task = ()=>{
            setTimeout(()=>{
                console.log(`wake up after ${time} s`);
                this.next();
            },time*1000);
        }
        this.tasks.unshift(task);
        return this;
    }
}



// 订阅发布者lazyman
function LazyMan(name){
    return new Lazyman(name);
}

class Lazyman {
    constructor(name){
        this.tasks = [];
        this.subscribe('init',name);
        setTimeout(()=>{
            this.next();
        },0);
    }
    next(){
        let task = this.tasks.shift();
        task && this.run(task);
    }
    subscribe(){
        if(arguments.length==0){
            console.log('不能没有参数');
        }
        var type = arguments[0],params = arguments[1];
        if(type=='firstSleep'){
            this.tasks.unshift({type,params});
        } else {
            this.tasks.push({type,params});
        }
    }
    run(opt){
        let {type,params} = opt;
        switch(type){
            case 'eat':
                return eat.call(this,params);
                break;
            case 'firstSleep':
                return firstSleep.call(this,params);
                break;
            case 'sleep':
                return sleep.call(this,params);
                break;
            default: 
                return ((params)=>{
                    console.log('hi,I am '+ params);
                    this.next();
                })(params);
        }
    }
    sleep(time){
        this.subscribe('sleep',time);
        return this;
    }
    firstSleep(time){
        this.subscribe('firstSleep',time);
        return this;
    }
    eat(food){
        this.subscribe('eat',food);
        return this;
    }
}

function sleep(time){
    setTimeout(()=>{
        console.log('wake up after '+time+' s!');
        this.next();
    },time*1000);
}
function firstSleep(time){
    setTimeout(()=>{
        console.log('first wake up after '+time+' s!');
        this.next();
    },time*1000);
}
function eat(food){
    console.log('eat '+food);
    this.next();
}