let v_space = 13;
let or = ['270', '90', '0 ', '315', '45'];

let bheight = 8;

let scale = d3.scaleLinear().range([0, 22]).domain([0, 1]);


function bars_init(svg, width, height) {

    let g = svg.append('g').attr('class', 'distrib');

    let st = height - 128;


    g.selectAll('.bar').data([0, 0, 0, 0, 0]).enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', 775)
        .attr('y', (d, i) => {
                draw_arrow(757, st + (i * v_space) + (i * bheight), or[i], i);
                return st + (i * v_space) + (i * bheight)
            }
        )
        .attr('width', (d) => scale(d) + 7)
        .attr('height', bheight)
        .attr('fill', 'steelblue')
        .attr("stroke-width", 2)
        .attr('stroke-style', '#f0f1f1')


}


function update_bars(svg, data) {

    let id = data.indexOf('' + Math.max(...data));
    if (id === -1)
        id = data.indexOf(Math.max(...data));
    let bars = svg.selectAll(".bar").data(data).attr('width', (d) => scale(d) + 7).attr('fill', (d, i) => (i === id ? '#a92234' : 'steelblue'))

}


function draw_arrow(x, y, z, ind) {

    let g = tool[0].append('g').attr('class', 'arrow');

    g.append('line')
        .attr('class', 'hiddensli')
        .attr('x1', 10)
        .attr('x2', 10)
        .attr('y1', 2.5)
        .attr('y2', 15)
        .attr('stroke', '#183d4e')
        .attr("stroke-linejoin", "round")
        .attr('stroke_width', '4');


    g.append('line')
        .attr('class', 'hiddensli')
        .attr('x1', 10)
        .attr('x2', 6)
        .attr('y1', 2.5)
        .attr('y2', 7.5)
        .attr('stroke', '#183d4e')
        .attr("stroke-linejoin", "round")
        .attr('stroke_width', '4');

    g.append('line')
        .attr('class', 'hiddensli')
        .attr('x1', 10)
        .attr('x2', 14)
        .attr('y1', 2.5)
        .attr('y2', 7.5)
        .attr("stroke-linejoin", "round")
        .attr('stroke', '#183d4e')
        .attr('stroke_width', '4');

    g.attr('transform', 'translate(' + (ind === 1 ? x + 4 : x) + ',' + (ind === 4 || ind === 1 ? y - 7 : (ind === 0 ? y + 4 : (ind === 2 ? y - 4 : y))) + ') rotate(' + z + ' ' + 4 + ' ' + 6.25 + ')')


}