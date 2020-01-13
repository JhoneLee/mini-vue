/*
* @Author: liyunjiao2048@163.com
* @Date:   2020-01-08 09:04:23
* @Last Modified by:   liyunjiao2048@163.com
* @Last Modified time: 2020-01-08 09:22:12
*/

var arr = [2,1,4,3,6,5,7,9,8];

function bubbleSort(array){
    var arr = array.slice(0);
    for(var i=0;i<arr.length;i++){
        for(var j = i+1;j<arr.length;j++){
            if(arr[i]>arr[j]){
                var temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
    }
    return arr;
}

bubbleSort(arr);


function insertSort(array){
    var arr = [];
    for(var i=0;i<array.length;i++){
        var j = i-1;
        var temp = array[i];
        while(j>=0 && temp<arr[j]){
            arr[j+1] = arr[j];
            j--;
        }
        arr[j+1] = temp;
    }
    return arr;
}
insertSort(arr);

function quickSort(array){
    var arr = array.slice(0);
    if(arr.length<2) return arr;
    var left = [],right = [];
    var mid = arr.splice(Math.floor(arr.length/2),1);
    for(var i=0;i<arr.length;i++){
        if(arr[i]<mid[0]){
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    return quickSort(left).concat(mid,quickSort(right));
}
quickSort(arr);

function search(arr,val){
    var s=0,e=arr.length-1;
    while(s<=e){
        var mid = s+Math.floor((e-s)/2);
        if(arr[mid]>val){
            e = mid - 1;
        } else if(arr[mid]<val){
            s = mid + 1;
        } else {
            return mid;
        }
    }
    return -1;
}
search(quickSort(arr),10)