import { getLines } from "./getBlocks.js";



// const path1 = new Path('M56 42C41 56 16 146 55 161C94 176 188 179 201 162C214 145 238 58 201 36C164 14 74 27 56 42Z ');
const path1 = new Path('M147 121C132 135 22 127 44 185C107 185 38 99 89 56C132 28 243 84 199 26C162 4 165 106 147 121Z ');
const path2 = new Path('M152 216C167 223 265 241 275 211C285 181 293 115 261 102C229 89 141 71 127 95C113 119 133 203 152 216Z ')

// path1.strokeColor = 'black';
// path1.selected = true;


path2.strokeColor = 'black';
path2.selected = true;

window.path1 = path1;
window.path2 = path2;
const curves = window.curves = path1.getCrossings(path1)
// const curves = window.curves = path1.getIntersections(path1)

console.log(curves);

let offsets = [];  // 距离起点的距离。
curves.forEach(item => {
    // console.log(item.points)
    

    // const circle = new Shape.Circle(item.point, 4);
    // circle.fillColor = 'red';

    offsets.push(item.offset);
    offsets.push(item.intersection.offset);
    // 显示交点的 segment 的几个点
    // console.log(item.segment)
    // const interiorPath = new Path({
    //     segments: [item.segment],
    //     fillColor: '#f04',
    //     strokeColor: 'black'
    // });
    // interiorPath.selected = true;
    // console.log(interiorPath);
});

console.log(offsets)

getLines(path1.pathData, offsets)



