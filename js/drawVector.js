let ve_h;
let ve_rows = [];
let ve_w = 15;
let col = d3.scaleLinear().domain([-1, 0, 1]).range(['#2266a6', '#effce5', '#bf6b09']).interpolate(d3.interpolateHcl);
let hst = 800;

let mono_col = d3.scaleLinear().domain([0.35, 1]).range(['#FFF', '#bf542f']).interpolate(d3.interpolateHcl);

// let mono_col =  d3.scaleLinear().domain([0, 0.6, 0.8, 1]).range(["EFF0E8", '#f2e7e9', "#aa5b65", "#6b111c"]).interpolate(d3.interpolateHcl);

function ve_init_rows(svg, data, height, width, mask) {

    svg.selectAll('.hiddensgrp').remove();

    let g = svg.append('g').attr('class', 'hiddensgrp').attr('id', 'hiddensgrp');

    if (width < 1000) {
        hst = (710 * width) / 1200;
        hst += 50
    }

    ve_h = Math.min(((height - 100) / data[0].length), 60);
    ve_w = Math.min((width - hst) / data.length, 13);

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
                return (isMono ? mono_col(Math.abs(d)) : col(d))
            }).on('click', svg_click);
    }
    ve_rows = g.selectAll('rect');
    init_current(tool[0], (hst - 10) + (ve_w / 2), -10, 0)
    mask_elems(tool[0], mask, data.length)

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
        .attr('d', "M 30.8,16.6 0.8,30.8 10,16.6 0.8,0.8 Z")
        .attr('class', 'curt')
        .attr('fill', '#a92234')
        .attr('transform', 'translate(' + (ve_w * (step - 1) + (ve_w / 2) + offx) + ',' + (0 + offy) + ') rotate(' + (90) + ' ' + (15) + ' ' + (15) + ')')

}

function show_current(svg, offx, offy, step) {

    svg.selectAll('.curt')
        .attr('transform', 'translate(' + (ve_w * (step - 1) + (ve_w / 2) + offx) + ',' + (0 + offy) + ') rotate(' + (90) + ' ' + (15) + ' ' + (15) + ')')

}

function show_sel(step) {

    d3.selectAll('.hsel rect').style('stroke-width', '0.02px')
    $('.hsel').toggleClass('hsel');

    $('.ht' + step).toggleClass('hsel');

    d3.selectAll('.hsel rect').style('stroke-width', '2.2px')
}


function mask_elems(svg, mask, nb) {


    if (mask !== undefined) {
        console.log(mask);
        let tsvg = rough.svg(svg);

        $('#hiddensgrp path').remove();

        for (let i = 0; i < mask.length; i++) {

            if (mask[i] === 0) {
                let t = tsvg.rectangle(hst - getRandomArbitrary(0, 12), (i * ve_h) + 20 + (0.2 * ve_h), (ve_w * nb + (0.02 * nb)) + getRandomArbitrary(0, 12), ve_h * 0.6, {
                    fill: "rgb(10,10,10)",
                    fillWeight: getRandomArbitrary(5, 9), // thicker lines for hachure
                    hachureAngle: getRandomArbitrary(10, 70), // angle of hachure,
                    hachureGap: getRandomArbitrary(3, 4),
                    stroke: 'none'
                });

                document.getElementById('hiddensgrp').appendChild(t)
            }
        }
    }
}

function mask_elem(index) {
    let t = tsvg.rectangle(hst - getRandomArbitrary(0, 12), (index * ve_h) + 20, (ve_w * data.length + (0.02 * data.length)) + getRandomArbitrary(0, 12), ve_h * 0.8, {
        fill: "rgb(10,10,10)",
        fillWeight: getRandomArbitrary(3, 6), // thicker lines for hachure
        hachureAngle: getRandomArbitrary(10, 30), // angle of hachure,
        hachureGap: getRandomArbitrary(2, 4),

    });

    document.getElementById('hiddensgrp').appendChild(t)

}

function link_model(svg, data) {


    let st = [hst, (data[0].length * ve_h) + 20]
    let ed = [hst + (ve_w * data.length + (0.02 * data.length)), (data[0].length * ve_h) + 20]


    svg.append('line')
        .attr('x1', st[0])
        .attr('x2', 655)
        .attr('y1', st[1])
        .attr('y2', tool[2] - 55)
        .attr('stroke', '#000')
        .attr('stroke-width', '5')


        svg.append('line')
        .attr('x1', ed[0])
        .attr('x2', 665)
        .attr('y1', ed[1])
        .attr('y2', tool[2] - 55)
        .attr('stroke', '#000')
        .attr('stroke-width', '5')

}