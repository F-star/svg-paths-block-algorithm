// 该文件的代码，负责path拆分为线和点的实现

import { Point_, Line } from "./class.js";
import { blockAlg, mergeLineString, reversePathData } from "./blockAlg.js";


class Path_ {    // 重新定义一个 Path_ 类，来包装 peperjs 对象 喝 snapsvg 对象。
    constructor() {
        this.pathData = pathData
        this.paper_ =  new paper.Shape.Path
    }
    paper() {
        
    }
}

// class Path 
// 暴露的方法


const getBlocks = (paths) => {

    let points = [];
    

    // 1. 将 复合path转换为 简单path
    // 2. 进行两两 path 求交点，如果有交点，生成 line 保存到 交点下。
}

// 
const getIntersections = () => {

    // getIntersections(path)
}


// 绘制 segment 的 3个点。

const drawReferPoint = (seg) => {
    
}


// 先实现第一个算法
// path 自切割，生成 lines
export const createSelfLine = (pathDatas) => {
    // 1. 计算 offset
      
        const pathData = pathDatas.join(' ');
        // console.log('路径的 pathData 为：');
        // console.log('  ' + pathData);
        // const paperPath = new Path(pathData);

        //  求 path 自己和自己的交点，相对起点的距离
        const offsets = getOffsets(pathData, pathData);   
        // console.log('paper 计算出来的交点')
        // console.log(Object.values(offsets))

        let allLines = [];
        let allMapPoints = {};
        Object.values(offsets).forEach(item => {
            const {mapPoints, lines} = getLines(item.pathData, item.offsets);   // 

            // 子 path 生成的线条，进行合并
            allLines = allLines.concat(lines);
            drawLines(lines);    // 线条可视化
            // drawLinesAnimation(lines, 1000);

            // 点集进行合并。
            // if ()
            mergeMapPoint(allMapPoints, mapPoints);
            
        })
        console.log('线条对象：')
        console.log(allLines);

        simplifyPoints(allMapPoints);
        console.log('交点');
        console.log(allMapPoints)

        // TODO 合并只有两条边的交点。
        

        // TODO 没有交点的情况。

        drawFirstPoint(allMapPoints);   // 绘制第一个交点


        // 遍历，找闭合path。
        blockAlg(allMapPoints);

};

// TODO 将只有两个 line 的 point 合并到其他 point。
const simplifyPoints = (points) => {
    let count = 0;
    Object.values(points).forEach(point => {
        if (point.lines.length > 2) return;

        count++;
        
        let line1 = point.lines[0];
        let line2 = point.lines[1];

        let prev; // line1的前一个点
        let next;

        let flag1 = false; // pathData 合并前是否需要反转。
        let flag2 = false;

        // pathData 合并。
        // 检查是 line1 是 start 为当前 point
        if ( line1.compareStartPoint(point) ) {
            // line1 的 start 为 point
            prev = points[line1.getEndStr()];
            flag1 = true;
        } else {
            // end
            prev = points[line1.getStartStr()];
        }

        if ( line2.compareStartPoint(point) ) {
            // line2 的 start 为 point
            next = points[line2.getEndStr()]; 
        } else {
            // end
            next = points[line2.getStartStr()];
            flag2 = true;
        }

        // 计算新 line 的 pahData
        let pathData1 = flag1 ? reversePathData(line1.pathData) : line1.pathData;
        let pathData2 = flag2 ? reversePathData(line2.pathData) : line2.pathData;
        const newPathData = mergeLineString([pathData1, pathData2]);
        console.log('=========')
        console.log(newPathData)

        // 这里大概可以比较 prev 和 next 是否相等。如果相等，就可以把合并的 newPath 作为 特殊path


        // 移除prev 和 next原来的 line，添加新的 line
        prev.removeLineById(line1.id);
        next.removeLineById(line2.id);
        let newLine = new Line(newPathData, prev, next)
        console.log('新线条的id', newLine.id)
        prev.addLine(newLine);
        next.addLine(newLine);
        // const newPathData = 

        // 从 points 中移除当前点
        delete points[point.x+','+point.y];
    });

    console.log(`共移除${count}个交点`)
}

// 显示第一个交点
const drawFirstPoint = (map) => {
    let point = Object.values(map)[0];
    const circle = new Shape.Circle(new Point(point.x, point.y), 5);
    circle.fillColor = '#f04';
}

// 合并 mapPoints。主要是将 offset 进行扩充
const mergeMapPoint = (target, points) => {
    // console.log(points)
    Object.keys(points).forEach(key => {

        if (target[key]) {
            // console.log(target[key])
            target[key].addLine(points[key].lines);
        } else {
            target[key] = points[key];
        }

    })

} 

const drawPoint = (point) => {
    const circle = new Shape.Circle(point, 4);
    circle.fillColor = '#000';
}

// 动画演示绘制的 subPath
const drawLinesAnimation = (lines, interval = 700) => {
    
    let len = lines.length;
    let i = 0;
    const draw = () => {
        const path = new Path(lines[i].pathData);
        path.strokeWidth = 3;
        path.strokeColor = getColor();
       
        i++;
        if (i < len) {
            setTimeout(() => {
                console.log('定时执行。')
                path.remove();
                draw();
            }, interval);
        }
        
    }
    draw();
}

const drawLines = (lines) => {
    if (!lines) return;
    lines.forEach(item => {
        const path = new CompoundPath(item.pathData);
        path.strokeWidth = 3
        path.strokeColor = getColor();
    })
}

// 获取 子path
const getChildrenPaths = (paperPath) => {
    class ChildPath {
        constructor(pathData, id) {
            this.pathData = pathData;
            this.id = id;
            this.offsets = [];
        }
        addOffset(val) {
            this.offsets.push(val);
            this.offsets.sort((a,b) => a.val-b.val);   // 排序。
        }
    }
    let children = {};
    paperPath.children.forEach(item => {
        /* children.push({
            pathData: item.pathData,
            id: item.id,
            // start,
            // end,
        }); */

        children[item.id] = new ChildPath(item.pathData, item.id);
        
        /* {
            pathData: item.pathData,
            id: item.id,
            offsets: [],
        } */

        
    })
    return children;
}

// Offset 对象。
class Offset {
    constructor(val, coord) {
        this.val = val;
        this.point = {
            x: coord.x,
            y: coord.y
        }
    }
}

// 求自身的交点。
const getOffsets = (pathData) => {
    const path = new paper.CompoundPath(pathData);
    path.strokeColor = 'black';
    window.path = path;

    // 将 子 path 都保存起来。
    const childrenPaths = getChildrenPaths(path);
    const curves = path.getCrossings(path);

    // console.log('交点的情况：')
    // console.log(curves)
    curves.forEach(item => {
        

       /*  console.log(item.point.x, item.point.y);
        console.log(item.intersection.point.x, item.intersection.point.y); */

        childrenPaths[item.path.id].addOffset( 
            new Offset(item.offset, item.point) 
        );
        childrenPaths[item.intersection.path.id].addOffset( 
            new Offset(item.intersection.offset, item.point)
        );

        // 绘制交点。
        drawPoint(item.point)


    });
    return childrenPaths;
}

// 求自己和自己相交切割后产生的 线条 以及 交点对象。
export const getLines = (d, offsets) => {
    let lines = [];
    let mapPoints = {};
    let closed = /[Z|z]\s*$/.test(d);   // 是否为闭合子path。

    if (offsets.length == 0) {
        return {mapPoints, lines};   
    }

    // 生成point（如果point不存在），并将 line 放入 point。
    function addMapPoint(point, line) {
        const {x, y} = point;
        const key = x + ',' + y;
        if (!mapPoints[key]) {
            mapPoints[key] = new Point_(x, y);
        }
        mapPoints[key].addLine(line);
    }

    // if (closed == true) {
    //     // 第一条线和最后一天线合并。

    //     /**** 获取第一条 line ****/
    //     let offset = offsets[0];
    //     let pathData = Snap.path.getSubpath(d, 0, offset.val); 

    //     // 绘制起点位置。
    //     const circle = new Shape.Circle(new Point(point.x, point.y), 4);
    //     circle.fillColor = 'red';
  

    //     /*** 获取最后一条 line */
    //     let offset2 = offsets[offsets.length - 1];
    //     let pathData2 = Snap.path.getSubpath(d, offset2.val, Infinity);
    //     // const a = new SVG.PathArray(lines[0].pathData);
    //     // a.value.splice(0, 1); 
    //     let newPathData = mergeLineString([pathData2, pathData], false);




    //     const line = new Line(pathData, {}, offset.point);
    //     lines.push(line);

    //     addMapPoint(offset.point, line); 
    // }

    if (closed == true) {
        // 绘制第一条线
        let offset = offsets[0];
        let pathData = Snap.path.getSubpath(d, 0, offset.val); 

        // 绘制起点位置。
        const circle = new Shape.Circle(new Point(offset.point.x, offset.point.y), 4);
        circle.fillColor = 'red';

        const line = new Line(pathData, {}, offset.point);
        lines.push(line);

        addMapPoint(offset.point, line);
    }

    // 最后一条线和最后一条合并
    if (closed == true) {
        let offset = offsets[offsets.length - 1];
        let pathData = Snap.path.getSubpath(d, offset.val, Infinity);
        const a = new SVG.PathArray(lines[0].pathData);
        a.value.splice(0, 1);
        // lines[0] = new Line(pathData + a.toString());
        lines[0].pathData = pathData + a.toString();
        lines[0].start = {
            x: offset.point.x,
            y: offset.point.y
        }
        addMapPoint(offset.point, lines[0]);

        lines[0].getLength();   
        // const line = new Line(pathData);
        // let lines[0]

        // lines.push(line);
        // 合并起点和终点
    }


    // 绘制中间部分的线
    for (let i = 1; i < offsets.length; i++) {
        const offset = offsets[i];
        // let prev = (index == 0) ? 0 : offsets[index - 1];
        const prev = offsets[i - 1];


        const pathData = Snap.path.getSubpath(d, prev.val, offset.val);

        // pathData 要取开头和结尾


        // 这里的 line 应该没问题才对。
        if (prev.point.x == offset.point.x && prev.point.y == offset.point.y) {
            console.log('是个闭合！！！ 进行特殊处理')
            // 归纳到特殊 path 里。
            continue;
        }
        const line = new Line(pathData, prev.point, offset.point);
        lines.push(line);
        
        // 重要：添加到 mapPoints
        addMapPoint(prev.point, line);
        addMapPoint(offset.point, line);
        

        // 点的可视化
        /* let point = Snap.path.getPointAtLength(d, offset.val);
        const circle = new Shape.Circle(new Point(point.x, point.y), 4);
        circle.fillColor = 'black'; */
    }

    // console.log('点集：')
    // console.log(mapPoints);

    // 去掉起点和终点相同的点。
    // 找到 len 为 0 的line，找他们的

    // 移除长度为 0 的 line。
    Object.keys(mapPoints).forEach(key => {
        const point = mapPoints[key];
        point.removeLen0Lines();  // 移除长度为 0 的线。
        
        if (point.lines.length == 0) {
            delete mapPoints[key] 
        }
    })

    return {mapPoints, lines};
}


// 获取颜色值
export const getColor = (() => {
    let colors = [
            '#f173ac', '#6b2f1b', '#2468a2', '#de773f', '#ed1941',
            '#1d953f', '#F9D919', '#0084C6', '#B20BB7', '#ef4136', 
            '#585eaa', '#8009B2', '#ad8b3d', '#7fb80e', '#00ae9d'
        ],
        i = 0;

    return () => {
        // if (i >= colors.length) throw new Error('颜色值不够');
        const color = colors[i];
        i = (i + 1) % (colors.length - 1);
        return color;
    }
})()

/**
 * 算法叙述
 * 
 * 
 * 1. compoundPath => simple path
 * 2. 检查 path 自身与自身的交点。如果有，自切割。知道所有 path 子切割，得到点 和 线。
 * 3. 剩下的 path 和 line 进行两两p
 */