let ve_h;
let ve_rows = [];
let ve_w = 15;
let col = d3.scaleLinear().domain([-1, 0, 1]).range(['#2266a6', '#effce5', '#bf6b09']).interpolate(d3.interpolateHcl);
let hst = 800;
let sels = [-1, -1];
let old_sels = [-1, -1];

let mono_col = d3.scaleLinear().domain([0.35, 1]).range(['#FFF', '#bf542f']).interpolate(d3.interpolateHcl);

// let mono_col =  d3.scaleLinear().domain([0, 0.6, 0.8, 1]).range(["EFF0E8", '#f2e7e9', "#aa5b65", "#6b111c"]).interpolate(d3.interpolateHcl);

let drag_behavior = d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged);

function ve_init_rows(svg, data, height, width, mask, elem) {
    d3.select('#linear-gradient stop').attr('offset', '0%');
    svg.selectAll('.hiddensgrp').remove();

    let g = svg.append('g').attr('class', 'hiddensgrp').attr('id', 'hiddensgrp');

    if (width < 1000) {
        hst = (710 * width) / 1200;
        hst += 30
    }

    ve_h = Math.min(((height - 120) / data[0].length), 60);
    ve_w = Math.min((width - hst - 10) / data.length, 13);

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
    init_current(tool[0], (hst - 10) + (ve_w / 2) + (curStep* ve_w), -10, 0);
    mask_elems(tool[0], mask, data.length);

    if (elem !== undefined)
        if (elem.length > 0) {
            sels = elem;
            mask_elem(sels);

            d3.select('#singleRed').moveToFront();
        }


    show_sel(curStep);

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
        .style('cursor', 'grab')
        .attr('transform', 'translate(' + (ve_w * (step - 1) + (ve_w / 2) + offx) + ',' + (0 + offy) + ') rotate(' + (90) + ' ' + (15) + ' ' + (15) + ')')
        .call(drag_behavior)

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
                let t = tsvg.rectangle(hst - getRandomArbitrary(0, 12), (i * ve_h) + 20 + (0.2 * ve_h), (ve_w * nb + (0.02 * nb)) + getRandomArbitrary(0, 12), ve_h * 0.6, {
                    fill: "url(#linear-gradient)",
                    fillWeight: getRandomArbitrary(5, 9), // thicker lines for hachure
                    hachureAngle: getRandomArbitrary(10, 70), // angle of hachure,
                    hachureGap: getRandomArbitrary(3, 4),
                    stroke: 'none'
                });


                // $(t).css('    stroke-dasharray: 5000 50000;
                document.getElementById('hiddensgrp').appendChild(t)
                d3.select('#linear-gradient stop').transition().duration(2500).attr('offset', '100%')
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


function dragstarted() {


}


function dragged() {


    let tm = hst + (ve_w * (tdata.hiddens.length - 1) + (ve_w / 2) - 10);

    let dx = d3.event.sourceEvent.offsetX;

    if (dx < hst - 10) {
        dx = hst - 10
    } else if (dx > tm) {
        dx = tm
    } else {

        let md = 999;
        let mi = -1;

        for (let i = 0; i < tdata.hiddens.length; i++) {
            if (md > Math.abs(dx - (hst + (ve_w * (i - 1 > 0 ? i - 1 : 0.2) + (ve_w / 2) - 10)))) {

                md = Math.abs(dx - (hst + (ve_w * (i - 1 > 0 ? i - 1 : 0.2) + (ve_w / 2) - 10)));
                mi = i

            }
        }

        curStep = mi;


        d3.selectAll('.curt')
            .attr("transform", shape => "translate(" + (dx) + ",-10)  rotate(90 15 15) ");
        up_curtxt(curStep, tdata.hiddens.length - 1);

        show_sel(mi);
        draw_agent_path(tool[0], tdata.positions[start + curStep], tdata.orientations[start + curStep], 10, 10);
        drawImage(tool[0], 'data:image/png;base64,' + tdata.inputs[start + mi], tool[2]);
        update_bars(tool[0], tdata.probabilities[start + mi]);
        show_current(tool[0], (hst - 10) + (ve_w / 2), -10, mi)

    }
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