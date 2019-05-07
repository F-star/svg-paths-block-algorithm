

// 暴露的方法
class Line {
    constructor(path) {
        this.start = start; // start 坐标 object(x, y)， 从 path 里拿
        this.end = end;
        this.path = path; 
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


export const getLines = (d, offsets) => {
    // offsets 排序
    offsets.sort((a,b) => a - b);

    // Snap.path.getSubpath(d, );
    offsets.forEach( (offset, index) => {
        const point = Snap.path.getPointAtLength(d, offset);   // 求交点
        console.log(point)
        const circle = new Shape.Circle(new Point(point.x, point.y), 4);
        circle.fillColor = 'black'


        let prev = (index == 0) ? 0 : offsets[index - 1];

        const pathStr = Snap.path.getSubpath(d, prev, offset);
        const line = new Path(pathStr);

        line.strokeColor = getColor();
        // line
    });
    const pathStr = Snap.path.getSubpath(d, offsets[offsets.length - 1], Infinity);
    const lastLine = new Path(pathStr);
    lastLine.strokeColor = getColor();
}

const getColor = (() => {
    let colors = ['red', 'green', 'blue', 'pink', '#F9D919', '#0084C6', '#B20BB7'],
        i = 0;

    return () => {
        // if (i >= colors.length) throw new Error('颜色值不够');
        const color = colors[i];
        i = (i + 1) % (colors.length - 1);
        return color;
    }
})()