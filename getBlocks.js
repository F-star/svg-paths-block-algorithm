import { Point_, Line } from "./class.js";
import { blockAlg } from "./blockAlg.js";


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

        console.log('交点');
        console.log(allMapPoints)


        // TODO 没有交点的情况。

        drawFirstPoint(allMapPoints);   // 绘制第一个交点


        // 取出一个交点对象，做测试
        /* const p_ = Object.values(allMapPoints)[2];
        console.log(p_)
        p_.orderLines() */;


        // 遍历，找闭合path。
        blockAlg(allMapPoints);

};

// 显示第一个交代呢
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

    if (offsets.length == 0) {
        return {mapPoints, lines};   
    }

    function addMapPoint(point, line) {
        const {x, y} = point;
        const key = x + ',' + y;
        if (!mapPoints[key]) {
            mapPoints[key] = new Point_(x, y);
        }
        mapPoints[key].addLine(line);
    }

    (() => {
        // 绘制第一条线
        let offset = offsets[0];
        let pathData = Snap.path.getSubpath(d, 0, offset.val);   // 这个可能不适合 复合path
        
        let point = Snap.path.getPointAtLength(d, offset.val);

        // 绘制起点位置。
        const circle = new Shape.Circle(new Point(point.x, point.y), 4);
        circle.fillColor = 'red';

        const line = new Line(pathData, {}, offset.point);
        lines.push(line);

        addMapPoint(offset.point, line);
    })();

    // 最后一条线合并进第一条线里面。
    (() => {
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
    })();


    // 绘制中间部分的线
    for (let i = 1; i < offsets.length; i++) {
        const offset = offsets[i];
        // let prev = (index == 0) ? 0 : offsets[index - 1];
        const prev = offsets[i - 1];


        const pathData = Snap.path.getSubpath(d, prev.val, offset.val);

        // pathData 要取开头和结尾


        // 这里的 line 应该没问题才对。
        /* if (prev.point.x == offset.point.x && prev.point.y == offset.point.y) {
            console.log('是个闭合')
        } */
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