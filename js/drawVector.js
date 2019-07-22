let ve_h;
let ve_rows = [];
let ve_w = 15;
let col = d3.scaleLinear().domain([-1, 0, 1]).range(['#2266a6', '#effce5', '#bf6b09']).interpolate(d3.interpolateHcl);

function ve_init_rows(svg, data, height, width) {

    svg.selectAll('.hiddensgrp').remove();
    console.log(data);
    console.log(data[0]);
    let g = svg.append('g').attr('class', 'hiddensgrp');


    ve_h = Math.min(((height-20) / data[0].length), 60);


    for (let w = 0; w < data.length; w++) {

        let tg = g.append('g').attr('class', 'ht' + w);
        tg.selectAll('rect')
            .data(data[w])
            .enter()
            .append('rect')
            .attr('order', (d, i) => i)
            .attr('x', (width / 2 - ((ve_w*data.length) / 2)) + (w * ve_w))
            .attr('y', (d, i) => {
                return (i * ve_h) + 10
            }).attr('nb', (d, i) => {
            return i
        }).attr('width', ve_w)
            .attr('height', ve_h)
            .attr('fill', (d) => {
                return col(d)
            }).on('click', svg_click);

        /*
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
        */


    }
    ve_rows = g.selectAll('rect');

}

function ve_update(svg, data) {

    ve_rows.transition().duration(200)
        .attr('fill', (d, i) => {
            return col(data[i])
        })
}

