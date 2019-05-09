

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
class Line {
    // 默认传入的 pathData 只有 M C Z 这三种命令。
    constructor(pathData) {
        // this.start = start; // start 坐标 object(x, y)， 从 path 里拿
        // this.end = end;
        this.pathData = pathData; 

        const pathArray = Snap.parsePathString(pathData);
        if (!pathArray[0]) {
            console.error(pathData)
            console.log(typeof pathData)
        }
        this.start =  {
            x: pathArray[0][1],
            y: pathArray[0][2]
        };

        this.closed = false;   // 是否闭合。闭合的我称之为自闭线。
        const last = pathArray[pathArray.length - 1];
        if (last[0] == 'Z') {
            this.end = Object.assign({}, this.start);
            this.closed = true;
        } else {
            this.end = {
                x: last[last.length - 2],
                y: last[last.length - 1],
            }
        }

        
    }
    len() {
        // 获取 path 从 start 到 end 的长度
    };
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.lines = [];
    }
    addLine(line) {
        this.lines.push(line);
    }
} 


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
        console.log('复合的路径为');
        console.log(pathData);
        // const paperPath = new Path(pathData);
        const offsets = getOffsets(pathData, pathData);   //  求 path 自己和自己的交点，相对起点的距离
        console.log(Object.values(offsets))

        Object.values(offsets).forEach(item => {
            const lines = getLines(item.pathData, item.offsets);
            drawLines(lines);    // 线条可视化
            // drawLinesAnimation(lines, 1000);
        })


        // const lines = getLines(pathData, offsets);
        // console.log("TCL: createSelfLine -> lines", lines)
        
     
    
};

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
                console.log('zhi行')
                path.remove();
                draw();
            }, interval);
        }
        
    }
    draw();
}

const drawLines = (lines) => {
    lines.forEach(item => {
        const path = new CompoundPath(item.pathData);
        path.strokeWidth = 3
        path.strokeColor = getColor();
    })
}

// 获取 子path
const getChildrenPaths = (paperPath) => {
    class Child {
        constructor(pathData, id) {
            this.pathData = pathData;
            this.id = id;
            this.offsets = [];
        }
        addOffset(val) {
            this.offsets.push(val);
            this.offsets.sort((a,b) => a-b);   // 排序。
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

        children[item.id] = new Child(item.pathData, item.id);
        
        /* {
            pathData: item.pathData,
            id: item.id,
            offsets: [],
        } */

        
    })
    return children;
}

// 求自身的交点。
const getOffsets = (pathData) => {
    const path = new paper.CompoundPath(pathData);
    window.path = path;

    // 将 子 path 都保存起来。
    const childrenPaths = getChildrenPaths(path);
    console.log(childrenPaths);

    path.strokeColor = 'black';
    // path.selected = true;

    const curves = path.getCrossings(path);
    let offsets = [];  // 距离起点的距离。
    console.log(curves)
    curves.forEach(item => {
        offsets.push(item.offset);
        offsets.push(item.intersection.offset);

        childrenPaths[item.path.id].addOffset(item.offset);
        childrenPaths[item.intersection.path.id].addOffset(item.intersection.offset);
        

        // 绘制交点。
        drawPoint(item.point)

    });
    // console.log(offsets)
    offsets.sort((a,b) => a - b);  // 排序
    // return offsets;
    return childrenPaths;
}

// 求自己和自己相交切割后产生的 线条。
export const getLines = (d, offsets) => {
    if (offsets.length == 0) return [];   // 返回空数组。
    // offsets 排序
    // offsets.sort((a,b) => a - b);
    
    let lines = [];
    (() => {
        // 绘制第一条线
        let offset = offsets[0];
        let pathData = Snap.path.getSubpath(d, 0, offset);   // 这个可能不适合 复合path
        
        let point = Snap.path.getPointAtLength(d, offset);
        const circle = new Shape.Circle(new Point(point.x, point.y), 4);
        circle.fillColor = 'red';

        const line = new Line(pathData);
        lines.push(line);
    })()


    // 绘制中间部分的线
    for (let i = 1; i < offsets.length; i++) {
        const offset = offsets[i];
        // let prev = (index == 0) ? 0 : offsets[index - 1];
        const prev = offsets[i - 1];
        const pathData = Snap.path.getSubpath(d, prev, offset);

        // pathData 要取开头和结尾
        const line = new Line(pathData);
        lines.push(line);
        // line 可视化。

        let point = Snap.path.getPointAtLength(d, offset);
        const circle = new Shape.Circle(new Point(point.x, point.y), 4);
        circle.fillColor = 'black';
    }

    // 最后一条线合并进第一条线里面。
    (() => {
        let offset = offsets[offsets.length - 1];
        let pathData = Snap.path.getSubpath(d, offset, Infinity);

        console.log(lines[0].pathData)

        const a = new SVG.PathArray(lines[0].pathData);
        console.log(a)
        a.value.splice(0, 1);
        lines[0] = new Line(pathData + a.toString());

        // const line = new Line(pathData);
        // let lines[0]

        // lines.push(line);
        // 合并起点和终点
    })()
    return lines;
}

const getColor = (() => {
    let colors = [
            '#f173ac', '#6b2f1b', '#2468a2', '#de773f', '#ed1941',
            '#1d953f', '#F9D919', '#0084C6', '#B20BB7', '#ef4136', 
            '#585eaa', '#8009B2', '#ad8b3d'
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