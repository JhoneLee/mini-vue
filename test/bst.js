/*
* @Author: liyunjiao2048@163.com
* @Date:   2020-01-07 20:46:36
* @Last Modified by:   liyunjiao2048@163.com
* @Last Modified time: 2020-01-07 20:46:55
*/

// 搜索二叉树的深度遍历和广度遍历

var tree = {
    val:1,
    left:{
        val:2,
        left:{
            val:4,
            left:{
                val:8,
                left:null,
                right:{
                    val:9,
                    left:null,
                    right:null
                }
            }
        },
        right:{
            val:5,
            left:{
                val:10,
                left:null,
                right:null
            }
        }
    },
    right:{
        val:3,
        left:{
            val:6,
            left:null,
            right:null
        },
        right:{
            val:7,
            left:null,
            right:null
        }
    }
}

function ergodicTree(tree){
    if(tree==null) return;
    console.log(tree.val);
    ergodicTree(tree.left);
    ergodicTree(tree.right);
}

function ergodicTree2(tree){
    var arr = [];
    function et(node,i){
        if(node==null){
            return;
        } else {
            arr[i] = arr[i] || [];
            arr[i].push(node.val);
        }
        et(node.left,i+1);
        et(node.right,i+1);
    }
    et(tree,0);
    console.log(arr);
}