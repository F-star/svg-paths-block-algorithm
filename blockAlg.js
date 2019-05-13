
/**
 * 获取 point 算法。
 */

// 对象要重新规划。。。

// point 对象要加一个 visited，记录访问了几次。

export const blockAlg = (points) => {

    //  取一个节点。先遍历一个
    let blocks = [];
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
        getEnclosePath(points, point);
    })

   

}

const getEnclosePath = (points, start) => {

    // 初始化
    let point = start;
    let lineArr = [];
    // 1. 找可用一条线

    let line = point.lines[0];
    if (line.visited >= 2) throw new Error('该线已经被访问过两次了');


    // 都走一遍

    // point.lines.forEach(line => {
    //     if (line.visited >= 2) } {}
    // }) 

    // 找一个 闭合path。
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
        console.log('下一个 point', point)
        

        if (point == start) break;

        point.orderLines();
        line = point.getNextLine(line);
        console.log('下一个line', line)
        if (line.visited >= 2) {
            // console.log('是否为起点：', )
            console.error('代码有bug，因为实现上不会第三次访问同一条线，除非这个点是起点')
            console.log(point)
            break; 
        }
        // break;
    }
    console.log(lineArr)


    // 恭喜，拿到一个闭合路径。
    // 注意判断顺逆时针。逆时针说明是最外围的
    let block = mergeLineString(lineArr);   
    // 检测 时针
    
    
    // 画出来看看
    (() => {
        if((new Path(block)).clockwise == true) { // 顺时针才会址

       
            const path = new Path({
                pathData: block,
                fillColor: '#fff',
                strokeColor: '#000'
            });
        }

    })()


};

// 点对象 => 字符串形式
const getPointString = (coord) => {
    return coord.x + ',' + coord.y
}

// pathData 反转方法

const reversePathData = (pathData) => {
    console.log(pathData)
    let p = new Path(pathData);
    p.reverse();
    console.log(p)
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