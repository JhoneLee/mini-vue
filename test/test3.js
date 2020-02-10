/*
* @Author: liyunjiao2048@163.com
* @Date:   2020-01-08 09:40:31
* @Last Modified by:   liyunjiao2048@163.com
* @Last Modified time: 2020-01-08 09:40:31
*/


console.log('start');

setTimeout(()=>{
    console.log('setTimeout exec');
},0)


function async1(){
    console.log('async 1 exec');
    return new Promise(res=>{
        // setTimeout(()=>{
        //     res(100)
        // },0)
        res(100)
    })
}


async function async2(){
    console.log('async 2 exec');
    var k = await async1();
    console.log('async 2 end',k);
}

// async2();

var p = new Promise((res,rej)=>{
    console.log('promise exec');
    res();
}).then(()=>{
    console.log('promise then 1');
}).then(()=>{
    console.log('promise then 2')
}).then(()=>{
    console.log('promise then 3');
})

var p2 = new Promise((res,rej)=>{
    console.log('promise2 exec');
    res();
}).then(()=>{
    console.log('promise2 then 1');
}).then(()=>{
    console.log('promise2 then 2')
}).then(()=>{
    console.log('promise2 then 3');
})

// async2();


console.log('end');


function initList(data){
    var head = {
        data:data[0]
    };
    var current = head;
    for(var i=1;i<data.length;i++){
        var node = {
            data:data[i]
        };
        current.next = node;
        current = node;
    }
    current.next = null;
    return head;
}

