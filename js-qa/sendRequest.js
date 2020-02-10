/*
 请实现如下的函数，可以批量请求数据，
 所有的 URL 地址在 urls 参数中，
 同时可以通过 max 参数控制请求的并发度，
 当所有请求结束之后，需要执行 callback 回掉函数。
 发请求的函数可以直接使用 fetch 即可
*/

function sendRequest(urls, max, callback) {
    let manager = [];
    for(let i=0;i<urls.length;i++){
        if(i%max!==0){
            manager[Math.floor(i/max)].push(urls[i]);
        } else {
            manager[i/max] = [urls[i]];
        }
    }
    manager.forEach((group,i)=>{
        let promises = group.map(url=>fetch(url));
        Promise.allsettled(promises).then((res)=>{
            if(i===manager.length-1){
                callback(res);
            }
        },(err)=>{
            if(i===manager.length-1){
                callback(err);
            }
        })

    });
}

function fetch(url){
    return new Promise((resolve,reject)=>{
        let ran = Math.random();
        setTimeout(()=>{
            if(ran>0.5){
                resolve({url,msg:'success'});
            } else {
                reject({url,msg:'error'});
            }
        },100)
        
    })
}

Promise.allsettled = promises => new Promise((resolve,reject)=>{
    let count = promises.length;
    let values = [],errors = [];
    promises.forEach(p=>p.then(value=>{
        values.push(value);
        count--;
        if(count===0){
            resolve({values,errors});
        }
    },error=>{
        errors.push(error);
        count--;
        if(count==0){
            resolve({values,errors})
        }
    }));
});