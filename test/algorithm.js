/*
* @Author: liyunjiao2048@163.com
* @Date:   2020-01-07 20:45:19
* @Last Modified by:   liyunjiao2048@163.com
* @Last Modified time: 2020-01-07 20:48:19
*/

// 冒泡排序  插入排序 快速排序 和 二分查找法


var arr = [2,1,4,3,6,5,7,9,8];

function bubbleSort(arr){
    for(var i=0;i<arr.length;i++){
        for(var j=i+1;j<arr.length;j++){
            if(arr[i]>arr[j]){
                var temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
    }
    return arr;
}

function quickSort(arr){
    if(arr.length<1) return [];
    var left = [],right = [];
    var m = Math.ceil(arr.length/2);
    console.log(m,arr)
    var mid = arr.splice(m,1);
    for(var i=0;i<arr.length;i++){
        if(arr[i]>mid[0]){
            right.push(arr[i]);
        } else {
            left.push(arr[i]);
        }
    }
    return quickSort(left).concat(mid,quickSort(right));
}


function insertSort(arr){
    var len = arr.length;
    var result = [];
    for(var i=0;i<arr.length;i++){
        var j=i-1;
        var temp = arr[i];
        while(j>=0 && result[j]>temp){
            result[j+1] = result[j];
            j--;
        }
        result[j+1] = temp;
    }
    return result;
}


function search(arr,val){
    var start = 0,end = arr.length-1;
    while(start<=end){
        var mid = start+Math.floor((end-start)/2);
        if(arr[mid]>val){
            end = mid-1;
        } else if(arr[mid]<val){
            start = mid+1;
        } else {
            return mid;
        }
    }
    return -1;
}