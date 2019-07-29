let ve_h;
let ve_rows = [];
let ve_w = 15;
let col = d3.scaleLinear().domain([-1, 0, 1]).range(['#2266a6', '#effce5', '#bf6b09']).interpolate(d3.interpolateHcl);
let hst = 800;
let sels = [-1, -1];
let old_sels = [-1, -1];
let cur_tri = 'act';
let mono_col = d3.scaleLinear().domain([0.35, 1]).range(['#FFF', '#bf542f']).interpolate(d3.interpolateHcl);
let goplz = false;
let tri = {
    'act': [17, 12, 19, 31, 16, 6, 10, 3, 11, 0, 8, 1, 15, 7, 30, 25, 29, 22, 4, 2, 14, 18, 28, 24, 5, 21, 27, 20, 13, 23, 9, 26],
    'ch': [29, 12, 8, 7, 25, 15, 11, 24, 3, 30, 14, 22, 20, 21, 19, 27, 18, 2, 23, 9, 0, 5, 28, 10, 13, 4, 6, 26, 16, 1, 31, 17]
};

tri['nm'] = d3.range(32);


function ve_init_rows(svg, data, height, width, mask, elem) {
    d3.select('#linear-gradient stop').attr('offset', '0%');
    svg.selectAll('.hiddensgrp').remove();

    let g = svg.append('g').attr('class', 'hiddensgrp').attr('id', 'hiddensgrp');

    if (width < 1000) {
        hst = (710 * width) / 1200;
        hst += 30
    }

    ve_h = Math.min(((height - 140) / data[0].length), 60);
    ve_w = Math.min((width - hst - 10) / data.length, 13);

    for (let w = 0; w < data.length; w++) {

        let tg = g.append('g').attr('class', 'ht' + w);
        tg.selectAll('rect')
            .data(data[w])
            .enter()
            .append('rect')
            .style('cursor', (stage === '4' ? 'pointer' : 'default'))
            .attr('order', (d, i) => {
                if (goplz) return tri[cur_tri][i]; else return i
            })
            .attr('x', (hst + (w * ve_w)))
            .attr('y', (d, i) => {
                if (goplz) return (tri[cur_tri].indexOf(i) * ve_h) + 20; else return (i * ve_h) + 20
            }).attr('nb', (d, i) => {
            return i
        }).attr('width', ve_w)
            .attr('height', ve_h)
            .attr('fill', (d, i) => {
                if (mask !== undefined && mains[0] !== undefined) {
                    if (mask[i] < 0.1) {
                        d = mains[0].hiddens[w][i]
                    }
                } else if (elem !== undefined) {
                    if (elem.length > 0) {
                        if (i === elem[0] || i === elem[1])
                            d = mains[0].hiddens[w][i]
                    }
                }
                return (isMono ? mono_col(Math.abs(d)) : col(d))
            }).on('click', svg_click);
    }


    ve_rows = g.selectAll('rect');


    init_current(tool[0], (hst - 10) + (ve_w / 2) + (curStep * ve_w), -10, 0);

    if (stage !== '2' || goplz) {

        if (goplz) {
            // ve_update_reorder(cur_tri)
        }
        mask_elems(tool[0], mask, data.length);

        if (elem !== undefined)
            if (elem.length > 0) {
                sels = elem;
                mask_elem(sels);

                d3.select('#singleRed').moveToFront();
            }

    }
    show_sel(curStep);

}

function init_current(svg, offx, offy, step) {

    d3.selectAll('.curt').remove();


    svg.append('path')
        .attr('d', "M 30.8,16.6 0.8,30.8 10,16.6 0.8,0.8 Z")
        .attr('class', 'curt')
        .attr('fill', '#183d4e')
        .style('cursor', 'grab')
        .attr('transform', 'translate(' + (ve_w * (step - 1) + (ve_w / 2) + offx) + ',' + (0 + offy) + ') rotate(' + (90) + ' ' + (15) + ' ' + (15) + ')')

}

function show_current(svg, offx, offy, step) {

    svg.selectAll('.curt')
        .attr('transform', 'translate(' + (ve_w * (step - 1) + (ve_w / 2) + offx) + ',' + (0 + offy) + ') rotate(' + (90) + ' ' + (15) + ' ' + (15) + ')')

}

function show_sel(step) {

    d3.selectAll('.hsel rect').style('stroke-width', '0.02px');
    $('.hsel').toggleClass('hsel');

    $('.ht' + step).toggleClass('hsel');

    d3.selectAll('.hsel rect').style('stroke-width', '2.2px')
}


function mask_elems(svg, mask, nb) {


    if (mask !== undefined) {
        d3.select('#linear-gradient stop').interrupt();
        d3.select('#linear-gradient stop').attr('offset', '0%');

        let tsvg = rough.svg(svg);

        $('#hiddensgrp path').remove();

        for (let i = 0; i < mask.length; i++) {

            if (mask[i] < 0.1) {

                let ind = i;

                if (goplz) {
                    ind = tri[cur_tri].indexOf(i)
                }
                let t = tsvg.rectangle(hst - getRandomArbitrary(0, 12), (ind * ve_h) + 20 + (0.2 * ve_h), (ve_w * nb + (0.02 * nb)) + getRandomArbitrary(0, 12), ve_h * 0.6, {
                    fill: "url(#linear-gradient)",
                    fillWeight: getRandomArbitrary(5, 9), // thicker lines for hachure
                    hachureAngle: getRandomArbitrary(10, 70), // angle of hachure,
                    hachureGap: getRandomArbitrary(3, 4),
                    stroke: 'none'
                });


                // $(t).css('    stroke-dasharray: 5000 50000;
                document.getElementById('hiddensgrp').appendChild(t)
                d3.select('#linear-gradient stop').transition().duration(2500).attr('offset', '100%')
                let tg = d3.select(t).attr('index', ind).attr('class', 'mask').data([ind])
                tg.selectAll('path').data([ind])
                /*

                                d3.selectAll('#hiddensgrp path').style('stroke-dasharray', () => '2600px 2600px')
                                    .style('stroke-dashoffset', '2600px')
                                    .transition().duration(20000)
                                    .style('stroke-dashoffset', '1800')
                */


            }
        }
    }
}

function mask_elem(index) {
    $('#singleRed').remove();

    let g = tool[0].append('g').attr('id', 'singleRed');

    let nb = tdata.hiddens.length;

    d3.select('#linear-gradient stop').interrupt();
    d3.select('#linear-gradient stop').attr('offset', '0%');

    // change('DIY/red' + index);

    for (let w = 0; w < index.length; w++) {
        let tsvg = rough.svg(tool[0]);
        if (index[w] > -1) {
            let t = tsvg.rectangle(hst - getRandomArbitrary(0, 12), (index[w] * ve_h) + 20, (ve_w * tdata.hiddens.length + (0.02 * tdata.hiddens.length)) + getRandomArbitrary(0, 12), ve_h * 0.8, {
                fill: (!old_sels.includes(index[w]) ? "url(#linear-gradient)" : "rgb(10,10,10)"),
                fillWeight: getRandomArbitrary(5, 9), // thicker lines for hachure
                hachureAngle: getRandomArbitrary(10, 70), // angle of hachure,
                hachureGap: getRandomArbitrary(3, 4),
                stroke: 'none'
            });
            document.getElementById('singleRed').appendChild(t);
            d3.select(t).attr('index', index[w]).style('cursor', 'pointer').on('click', deler)
        }

    }

    old_sels = sels.slice();
    d3.select('#singleRed').moveToFront();


    d3.select('#linear-gradient stop').transition().duration(1000).attr('offset', '100%')
}

function link_model(svg, data) {


    let st = [hst, (data[0].length * ve_h) + 20];
    let ed = [hst + (ve_w * data.length + (0.02 * data.length)), (data[0].length * ve_h) + 20];


    svg.append('line')
        .attr('x1', st[0])
        .attr('x2', 655)
        .attr('y1', st[1])
        .attr('y2', tool[2] - 79)
        .attr('stroke', '#555555')
        .attr('stroke-dasharray', "4,2")
        .attr('stroke-width', '3');


    svg.append('line')
        .attr('x1', ed[0])
        .attr('x2', 665)
        .attr('y1', ed[1])
        .attr('y2', tool[2] - 79)
        .attr('stroke', '#555555')
        .attr('stroke-dasharray', "4,2")
        .attr('stroke-width', '3');
}


function svg_click() {


    if (stage === '4') {
        let index = $(this).attr('nb');

        if (Math.min(...sels) !== -1) {

            sels.shift()
            sels.push(parseInt(index))

        } else {
            sels[sels.indexOf(-1)] = parseInt(index)
        }


        if (Math.min(...sels) !== -1) {
            iz = Math.min(...sels) + '_' + Math.max(...sels);
        } else {
            iz = Math.max(...sels) + '_' + Math.min(...sels);

        }
        if (diy[iz] === undefined) {

            meta_change('nDIY/red' + iz + '.json', sels);

        } else {
            load_data(diy[iz], sels)
        }
        // mask_elem(index);
    }

}


function ve_update_reorder(type) {
    /*    if (type !== cur_tri) {
            d3.selectAll('.mask path').transition()
                .duration(2575)
                .style('transform', (d) => {


                    // let v1 = ve_h * d;
                    let v1 = ve_h * tri[cur_tri].indexOf(d);

                    return 'translateY(' + (Math.abs(v1 - (ve_h * tri[type].indexOf(d))) + 20 + 'px)');
                })
        }*/

    if (type === 'act') {
        cur_tri = type;
        or = tri[cur_tri]
    } else {
        cur_tri = type;
        or = tri[cur_tri]
    }

    ve_rows
        .attr('order', (d, i) => or.indexOf(i % 32))
        .transition()
        .duration(2575)
        .attr('y', (d, i) => {
            return (ve_h * or.indexOf(i % 32)) + 20;
        }).on('end', mask_elems(tool[0], tdata.mask, tdata.hiddens.length))
}


function deler() {


    let g = d3.select(this);

    sels[sels.indexOf(parseInt(g.attr('index')))] = -1;

    let iz;
    if (sels[0] === -1 && sels[1] === -1) {
        iz = 0;
        if (mains[iz] === undefined) {
            g.remove();
            meta_change('main.json', -1, mains);
        } else {
            load_data(mains[iz])
        }
    } else {
        if (Math.min(...sels) !== -1) {
            iz = Math.min(...sels) + '_' + Math.max(...sels);
        } else {
            iz = Math.max(...sels) + '_' + Math.min(...sels);

        }
        if (diy[iz] === undefined) {

            meta_change('nDIY/red' + iz + '.json', sels);

        } else {
            load_data(diy[iz], sels)
        }

    }
}