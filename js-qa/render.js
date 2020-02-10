// 实现渲染虚拟dom的函数

var demoNode = ({
    tagName: 'ul',
    props: {'class': 'list'},
    children: [
        ({tagName: 'li', children: ['douyin']}),
        ({tagName: 'li', children: ['toutiao']})
    ]
});

function render(vdom){
    var {tagName,props,children} = vdom;
    var dom = document.createElement(tagName);
    for(var item in props){
        dom.setAttribute(item,props[item]);
    }
    children.forEach(e=>{
        if(typeof e==='string'){
            dom.innerHTML = e;
        } else {
            dom.appendChild(render(e));
        }
    });
    return dom;
}