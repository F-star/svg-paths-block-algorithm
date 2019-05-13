import { getColor } from "./getBlocks.js";

/**
 * 获取 point 算法。
 */

// 对象要重新规划。。。

// point 对象要加一个 visited，记录访问了几次。
let blocks = [];
export const blockAlg = (points) => {

    //  取一个节点。先遍历一个
    // let blocks = [];
    let point;
    // for (let key in points) {
        
    //     point = points[key];   // 获取 point 对象。
    //     break;

    // }
/*     point = Object.values(points)[1]

    console.log(point)
    
    point.orderLines();
    
    //开始寻路 
    getEnclosePath(points, point); */

    // 遍历写法
   
    Object.values(points).forEach(point => {
        point.orderLines();

        console.log('----计算块的起点----')
        console.log(point);
        getEnclosePath(points, point);
    })

    console.log(blocks)
    drawBlocks(blocks)

   

}

const getEnclosePath = (points, start) => {

    // 初始化
    let point = start;

    // 1. 找可用一条线

    // let line = point.lines[0];
    // if (line.visited >= 2) throw new Error('该线已经被访问过两次了');


    // 都走一遍

    point.lines.forEach(line => {
        if (line.visited < 2) {
            // 找一个 闭合path。
            let lineArr = [];
            let throwFlag = false;    // 是否丢掉正在搜索的的路径。
            while (true) {
                
                let pathData_ = line.pathData;
                if (line.start.x == point.x && line.start.y == point.y) {  
                    point = points[ getPointString(line.end) ];
                } else {
                    point = points[ getPointString(line.start) ]; 
                    // line 需要反转。
                    pathData_ = reversePathData(pathData_);
                }
                line.visited++;
                lineArr.push(pathData_);
                console.log('查找路径的下一个 point', point)
                

                if (point == start) break;

                point.orderLines();
                line = point.getNextLine(line);
          
                if (line.visited >= 2) {
                    // console.log('是否为起点：', )
                    console.error('代码有bug，因为实现上不会第三次访问同一条线，除非这个点是起点')
          
                    throwFlag = true;
                    // break; 
                }
                // break;
            }
   


            // 恭喜，拿到一个闭合路径。
            // 注意判断顺逆时针。逆时针说明是最外围的
            let block = mergeLineString(lineArr);   
            // 检测 时针
            // if (throwFlag == false) {
                blocks.push({
                    block,
                    lines: lineArr
                });
            // }
            
            
            // 画出来看看
            /* (() => {
                if((new Path(block)).clockwise == true) { // 顺时针才会址

                    
                    // const path = new Path({
                    //     pathData: block,
                    //     fillColor: '#fff',
                    //     strokeColor: '#000'
                    // });
                }

            })() */


        }
    }) 

    
};


const drawBlocks = (blocks) => {
    const len = blocks.length;
    let i = -1;
    let path;
    let line;

    function draw() {
        i++;
        if (i < len) {
            setTimeout(() => {
                console.log('绘制！')
                path && path.remove();
                line && line.remove();

                path = new Path({
                    pathData: blocks[i].block,
                    fillColor: '#fff',
                    strokeColor: '#000'
                });

                // 绘制线条
                /* blocks[i].lines.forEach(line => {
                    
                }) */
                line = new Path({
                    pathData: blocks[i].lines[0],
                    strokeWidth: 4,
                    strokeColor: getColor()
                });
                

                draw();
            }, 1000)
        }
    }  
    draw();

}

// 点对象 => 字符串形式
const getPointString = (coord) => {
    return coord.x + ',' + coord.y
}

// pathData 反转方法

const reversePathData = (pathData) => {

    let p = new Path(pathData);
    p.reverse();
 
    pathData = p.pathData;
    p.remove();
    return pathData;
}

// 合并 线的pathString。
const mergeLineString = (lineArr) => {
    let len = lineArr.length;
    if (len == 0) throw new Error('提供的数组为空，代码有问题。')
    if (len == 1) return lineArr[0];
    
    
    let str = lineArr[0];
    for (let i = 1; i < len; i++) {
        // 这里的正则表达式并不严格，如果传入的字符串变得更不规律，请完善这个正则表达式。
        str += lineArr[i].replace(/^M[\d|\.]+[,| ][\d|\.]+/, function()  {return ''});
    }
    str += 'Z';
    console.log(str);
    return str;
}