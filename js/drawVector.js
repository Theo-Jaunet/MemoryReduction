let ve_h;
let ve_rows = [];
let ve_w = 20;
let col = d3.scaleLinear().domain([-1, 0, 1]).range(['#2266a6', '#effce5', '#bf6b09']).interpolate(d3.interpolateHcl);


function ve_init_rows(svg, data, height,width) {


    console.log(data);
    let g = svg.append('g').attr('class', 'hiddensgrp');

    ve_h = Math.min(((height) / data.length), 60);

    g.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('order', (d, i) => i)
        .attr('x', (width/2-(ve_w/2)))
        .attr('y', (d, i) => {
            return (i * ve_h) + 10
        }).attr('nb', (d, i) => {
        return i
    }).attr('width', ve_w)
        .attr('height', ve_h)
        .attr('fill', (d) => {
            return col(d)
        });

    svg.append('line')
        .attr('class', 'hiddensli')
        .attr('x1', 45 + ve_w)
        .attr('x2', 45 + ve_w)
        .attr('y1', 10)
        .attr('y2', (ve_h * data.length) + 10);

    svg.append('line')
        .attr('class', 'hiddensli')

        .attr('x1', 45)
        .attr('x2', 45)
        .attr('y1', 10)
        .attr('y2', (ve_h * data.length) + 10);

    svg.append('line')
        .attr('class', 'hiddensli')

        .attr('x1', 45 + ve_w)
        .attr('x2', 45)
        .attr('y1', 10)
        .attr('y2', 10);

    svg.append('line')
        .attr('class', 'hiddensli')
        .attr('x1', 45 + ve_w)
        .attr('x2', 45)
        .attr('y1', (ve_h * data.length) + 10)
        .attr('y2', (ve_h * data.length + 1) + 10);

    ve_rows = svg.selectAll('rect');

}