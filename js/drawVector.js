let ve_h;
let ve_rows = [];
let ve_w = 15;
let col = d3.scaleLinear().domain([-1, 0, 1]).range(['#2266a6', '#effce5', '#bf6b09']).interpolate(d3.interpolateHcl);
let hst = 700;

function ve_init_rows(svg, data, height, width) {

    svg.selectAll('.hiddensgrp').remove();
    console.log(data);
    console.log(data[0]);
    let g = svg.append('g').attr('class', 'hiddensgrp');

    if (width < 1000) {
        hst = (700 * width) / 1200;
        hst += 50
    }

    ve_h = Math.min(((height - 30) / data[0].length), 60);
    ve_w = (width - hst) / data.length;

    for (let w = 0; w < data.length; w++) {

        let tg = g.append('g').attr('class', 'ht' + w);
        tg.selectAll('rect')
            .data(data[w])
            .enter()
            .append('rect')
            .attr('order', (d, i) => i)
            .attr('x', (hst + (w * ve_w)))
            .attr('y', (d, i) => {
                return (i * ve_h) + 20
            }).attr('nb', (d, i) => {
            return i
        }).attr('width', ve_w)
            .attr('height', ve_h)
            .attr('fill', (d) => {
                return col(d)
            }).on('click', svg_click);
    }
    ve_rows = g.selectAll('rect');
    init_current(tool[0], hst+(ve_w/2), -10, 0)
}

function ve_update(svg, data) {

    ve_rows.transition().duration(200)
        .attr('fill', (d, i) => {
            return col(data[i])
        })
}


function init_current(svg, offx, offy, step) {

    d3.selectAll('.curt').remove();


    svg.append('path')
    // .attr('d', "M 15.8,8.3 0.8,15.8 5,8.3 0.8,0.8 Z")
        .attr('d', "M 30.8,16.6 0.8,30.8 10,16.6 0.8,0.8 Z")
        .attr('class', 'curt')
        .attr('fill', '#a92234')
        .attr('transform', 'translate(' + (ve_w * (step - 1) + (ve_w / 2) + offx) + ',' + (0 + offy) + ') rotate(' + (90) + ' ' + (15) + ' ' + (15) + ')')

}

function show_current(svg, offx, offy, step) {

    svg.selectAll('.curt').transition().duration(150)
        .attr('transform', 'translate(' + (ve_w * (step - 1) + (ve_w / 2) + offx) + ',' + (0 + offy) + ') rotate(' + (90) + ' ' + (15) + ' ' + (15) + ')')

}

function show_sel(step) {

    d3.selectAll('.hsel rect').transition().duration(170).style('stroke-width', '0.5')
    $('.hsel').toggleClass('hsel');

    $('.ht' + step).toggleClass('hsel');

    d3.selectAll('.hsel rect').transition().duration(170).style('stroke-width', '2')


}