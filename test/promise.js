/*
* @Author: liyunjiao2048@163.com
* @Date:   2020-01-08 00:11:39
* @Last Modified by:   liyunjiao2048@163.com
* @Last Modified time: 2020-01-08 09:04:27
*/

var promise = new MyPromise(function(resolve,reject){
      setTimeout(()=>{
         var ran = Math.random();
         ran = 0.1;
         if(ran>0.5){
             resolve(ran);
         } else {
             reject(new Error('mypromise error'));
         }

      },100)
}).then((value)=>{
    console.log('success',value)
    return value;
},(err)=>{
    console.log('error',err);
    return err;
}).then(()=>{console.log('success')})


function MyPromise(fn){
    var value = null;
    var FulfilledCbs = [];
    var RejeckedCbs = [];
    var state = 'pending'; // fulfilled,rejected
    var _this = this;
    this.then = function(fulfilled,rejected){
        return new MyPromise(function(res,rej){
            try{
                if(state==='pending'){
                    FulfilledCbs.push((value)=>{
                        var data = fulfilled(value);
                        res(data);
                    });
                    RejeckedCbs.push((value)=>{
                        var data = rejected(value);
                        res(data);
                    });
                    return;
                }
                if(state === 'fulfilled'){
                    var data = fulfilled(value);
                    res(data);
                    return;
                }
                if(state === 'rejected'){
                    console.log('rejected',rejected)
                    var data = rejected(value);
                    // promise 上一步失败，下一步也会成功
                    res(data);
                    return;
                }
            } catch(e){
                this.catch(e);
            }
        })
    }
    this.catch = (e)=>{
        console.log(e);
    }
    function exec(flag){
        var arr = flag?FulfilledCbs:RejeckedCbs;
        setTimeout(()=>{
            arr.forEach(cb=>{
                value = cb(value);
            });
        },0)
    }
    this.resolve = function(nw){
        state = 'fulfilled';
        value = nw;
        exec(true);
    }
    this.reject = function(reason){
        state = 'rejected';
        value = reason;
        exec(false);
    }
    fn(this.resolve,this.reject);
    
}