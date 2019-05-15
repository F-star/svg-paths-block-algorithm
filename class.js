/**
 *  求点对应的 line 的顺序
 */

// id 生成器。
const createId = (() => {
    let index = -1;
    return () => {
        index++;
        return index;
    }
})()

export class Line {
    // 默认传入的 pathData 只有 M C Z 这三种命令。
    constructor(pathData, start, end) {
        // this.start = start; // start 坐标 object(x, y)， 从 path 里拿
        // this.end = end;
        this.pathData = pathData; 
        this.id = createId();
        this.start = {
            x: start.x,
            y: start.y
        };
        this.end = {
            x: end.x,
            y: end.y
        }
        // 注意有种特别的情况，就是 起点到第一个断点的线段 和 最后一个断点到终点 的两条线段需要合并。len要重新计算。
        this.len = undefined;
        this.getLength();    
        // this.len = this.getLength();
        this.visited = 0;
    }
    getLength() {
        // 获取 path 从 start 到 end 的长度
        const {x, y} = this.start;
        const {x: x2, y: y2} = this.end;
        let len = Math.sqrt( (x - x2)*(x - x2) + (y - y2) * (y - y2));
        /* if (Number.isNaN(len)) {
            console.log(this);
            console.log( this.start.x )
        } */
        this.len = len;
        // return len;
    };

    // 比较和 start 是否相等
    compareStartPoint(point) {
        const {x, y} = this.start;
        return (x == point.x && y == point.y);
    }
    
    compareEndPoint(point) {
        const {x, y} = this.end;
        return (x == point.x && y == point.y);
    }

    // 返回 start 为 `x,y` 形式的字符串
    getStartStr() {
        return this.start.x + ',' + this.start.y;
    }

    getEndStr() {
        return this.end.x + ',' + this.end.y;
    }
}

// 交点对象
export class Point_ {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.lines = [];
        this._order = false;
        this.pointStr = this.toString();
        
    }
    addLine(line) {
        // if (this.lines == undefined) this.lines = new LineList(); 
        this.lines = this.lines.concat(line);
    }

    removeLine(line) {
        const index = this.lines.indexOf(line);
        if (index < 0) throw new Error('line找不到！！')
        this.lines.splice(index, 1);
    }

    removeLen0Lines() {
        this.lines = this.lines.filter(item => item.len > 0);
    }

    // 对 lines 进行“逆时针”排序。
    orderLines() {

        if (this._order) return;
        // 获取 line 中长度最小的长度值
        const lines = this.lines;


        /* // 移除 len 为0 的line。。。（虽说写在这里不好。）
        this.lines = lines.filter(item => item.len > 0);
        console.log('??')
        console.log(this) */

        const lens = lines.map(item => item.len);

        let min = Math.min.apply(null, lens)

        
        // 生成一个圆，求喝其他线段的交点。
        const circle = new Shape.Circle({
            center: [this.x, this.y],
            radius: min * 0.8,
            // strokeColor: 'red',
        })
        let circlePath = circle.toPath();    // 圆是顺时针方向。
        if (circlePath.clockwise == false) circlePath.reverse();
        circle.remove();

        // 根据 offsets 对 lines 的线进行排序。
        const offsets = this.lines.map((line, index) => {
            let crossing = circlePath.getCrossings(new Path(line.pathData));
            // 如果报错说 crossing[0] 不存在，可能是应为圆和line 没有交点。
            return {
                offset: crossing[0].offset,
                line: line,
            }
        });
        offsets.sort((a, b) => b.offset - a.offset);
        // console.log(offsets)
        this.lines = offsets.map(item => item.line);

        // 可视化 测试
        /* this.lines.forEach((item, index) => {
            setTimeout(() => {
                const path = new Path(item.pathData);
                path.strokeColor = '#fff'
            }, index * 1000);
        }) */

        this._order = true;   // 标记为已排序
    }

    getNextLine(line) {
        const index = this.lines.indexOf(line);
        if (index < 0) throw new Error('提供的 line 并不存在于当前 point_ 对象下');

        return this.lines[ (index + 1) % this.lines.length ];
    }

    // 获取一条可用的线
 /*    getEnableLine() {

    } */

    // 根据 line id 移除某条线。
    removeLineById(id) {
        console.log('yyyy-----', id)
        let lines = this.lines;
        for (let i = 0, len = lines.length; i < len; i++) {
            if (lines[i].id == id) {
                lines.splice(i, 1)
                return true;
            }
        }
        console.log(`point.removeLineById 找不到 id 为${id} 的 line`)
        return false;
    }


    toString() {
        return this.x + ',' + this.y;
    }
} 

// 废弃。
export class LineList {
    constructor() {
        this.lines = [];
        this.isOrder = false;   // 是否已经排序。
    }

    // 排序。
    order () {
        this
    }

    concat(lines) {
        this.lines.concat(lines)
    }
    
}

