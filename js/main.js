let tool = [d3.select('#svg-tool'), $('#svg-tool').width(), $('#svg-tool').height()];
let tdata;
let margin = 20;
let iz = 0;
let start = 0;
let pl = false;
let curStep = 0;
let isMono = true;
let timer = null;
let top_list = ['halfact', 'quatact', 'halfch', 'quatch'];
let tops = [];
let diy = [];
let random = [];
let mains = [];
let stfold = ['main', 'random', "top", "sel", 'diy'];
let selecs_list = ['rest0', 'rest1'];
let selecs = [];
let can = d3.select('#input');


let area = d3.line()
    .x(function (d) {
        return d[0];
    })
    .y(function (d) {
        return d[1];
    });


d3.json("data/main/res.json").then(function (data) {
    tdata = data;

    loadALlTraj();
    reportWindowSize();
    d3.json("data/humanTraj.json").then(function (data) {
        let tbbox = tool[0].node().getBoundingClientRect();
        let traj_s = ((520 * tbbox.width) / 1300);

        draw_traj(data.positions.slice(12, -1), tool[0], traj_s, traj_s, true, 'fufu');
        d3.selectAll('.item').moveToFront();
    });
    mains[0] = tdata;
    draw_arrowV2(380, 500, 180, -1);
    moreInf(20, 20, 180);
    loadim(mains[0], 'main/images/main.jpg');

});


function meta_change(filename, index) {

    if (index !== undefined && index !== -1) {
        if (Math.min(...index) !== -1) {
            iz = Math.min(...index) + '_' + Math.max(...index);
        } else {
            iz = Math.max(...index) + '_' + Math.min(...index);
        }
    }

    d3.json("data/" + filename).then(function (data) {
        load_data(data, index)
    });
}

function load_data(data, index) {
    let tbbox = tool[0].node().getBoundingClientRect();
    let traj_s = ((600 * tbbox.width) / 1300);
    tdata = data;

    if (curStep > tdata.hiddens.length - 1) {
        curStep = tdata.hiddens.length - 1
    }
    ve_init_rows(tool[0], tdata.hiddens, 633, 811, tdata.mask, index);
    $('.traj-sel').toggleClass('traj-sel');
    draw_traj(tdata.positions, tool[0], traj_s, traj_s, false, 'sec-traj traj-sel');
    update_bars(tool[0], tdata.probabilities[start + curStep]);
    draw_agent_path(tool[0], tdata.positions[start + curStep], tdata.orientations[start + curStep]);
    show_sel(curStep);
    up_curtxt(curStep, tdata.hiddens.length - 1);

    $('#timebar').attr('max', tdata.hiddens.length - 1);

    $('#timebar').val(curStep);
    update_time();
    d3.selectAll('.item').moveToFront();
    switch (stage) {
        case  "0":
            if (index !== -1) {

                diy[iz] = data;
                loadim(diy[iz], 'diy/images/red28_-1.jpg');
            }
            else if (mains[iz] === undefined) {
                mains[iz] = data;
                loadim(mains[iz], 'main/images/main.jpg')
            }
            break;
        case  "1":
            if (random[iz] === undefined) {
                random[iz] = data;
                loadim(random[iz], 'random/images/random' + iz + '.jpg')
            }
            break;
        case  "2":
            if (goplz)
                if (tops[iz] === undefined) {
                    tops[iz] = data;
                    loadim(tops[iz], 'top/images/top' + iz + '.jpg')
                }
            break;
        case  "3":
            if (selecs[iz] === undefined && data !== mains[0]) {
                selecs[iz] = data;
                loadim(selecs[iz], 'sel/images/sel' + iz + '.jpg')
            }
            break;
        case  "4":

            diy[iz] = data;
            if (iz !== 0) {
                loadim(diy[iz], 'diy/images/red' + iz + '.jpg');
            } else {
                stepIm()
            }
            break;
    }

    stepIm()
}


function step() {

    curStep += 1;


    if (tdata.hiddens[start + curStep]) {

        up_curtxt(curStep, tdata.hiddens.length - 1);
        let tbar = $('#timebar');
        tbar.val(curStep);
        stepIm();
        update_time();
        show_current(tool[0], (hst - 10) + (ve_w / 2), -10, curStep);
        show_sel(curStep);
        draw_agent_path(tool[0], tdata.positions[start + curStep], tdata.orientations[start + curStep]);
        update_bars(tool[0], tdata.probabilities[start + curStep]);
        d3.selectAll('.item').moveToFront()

    } else {
        pl = false;
        $('.play ').attr('src', 'assets/play-sign.svg');
        curStep = 0;
        clearInterval(timer);
        timer = null
    }
}


$('.play').on('click', function () {
    pl = !pl;
    if (pl) {
        $(this).attr('src', 'assets/round-pause-button.svg');

        timer = setInterval(step, 115);
        step()
    } else {
        $(this).attr('src', 'assets/play-sign.svg');
        clearInterval(timer);
        timer = null
    }
});


$('#timebar').on('input', function () {

    update_time();

    curStep = parseInt($(this).val());
    show_sel(curStep);
    draw_agent_path(tool[0], tdata.positions[start + curStep], tdata.orientations[start + curStep]);
    // drawImage(tool[0], 'data:image/png;base64,' + tdata.inputs[start + curStep], tool[2]);
    // drawImage(tool[0], 'data:image/png;base64,', tool[2]);
    // ve_update(tool[0], tdata.hiddens[start + curStep]);
    stepIm();
    update_bars(tool[0], tdata.probabilities[start + curStep]);
    up_curtxt(curStep, tdata.hiddens.length - 1);
    show_current(tool[0], (hst - 10) + (ve_w / 2), -10, curStep)

});

function update_time() {

    let tbar = $('#timebar');

    let val = (tbar.val() - tbar.attr('min')) / (tbar.attr('max') - tbar.attr('min'));

    tbar.css('background-image',
        '-webkit-gradient(linear, left top, right top, '
        + 'color-stop(' + val + ', #233E34), '
        + 'color-stop(' + val + ', #C5C5C5)'
        + ')'
    );
}


function reportWindowSize() {
    let tbbox = tool[0].node().getBoundingClientRect();

    tool[1] = tbbox.width;
    tool[2] = tbbox.height;

    let traj_s = ((510 * tbbox.width) / 1300);

    $('.traj').remove();
    $('.distrib').remove();
    $('.arrow').remove();
    traj_init(traj_s, traj_s);
    tool[0].append("g").attr('class', 'traj');
    draw_traj(tdata.positions, tool[0], traj_s, traj_s, true, 'hum');

    place_items(tool[0], tdata.positions[start]);
    draw_agent_path(tool[0], tdata.positions[start], tdata.orientations[start]);

    bars_init(tool[0], tool[1], tool[2]);
    update_bars(tool[0], tdata.probabilities[start]);

    ve_init_rows(tool[0], tdata.hiddens, 633, 811, tdata.mask, -1);

    draw_border(tool[0], tdata.hiddens);

    drawModel(tool[0], tool[2]);
    show_sel(start);

    up_curtxt(curStep, tdata.hiddens.length - 1);

    show_current(tool[0], (hst - 10) + (ve_w / 2), -10, curStep);


    $('#card_title').html(stages_titles[stage]);
    $('#card_txt').html(stages_txt[stage]);

}


function load_step(st) {

    curStep = st - 1;

    step();

}

function up_curtxt(step, total) {

    $('#stepctn').html('Step ' + (step < 10 ? '0' + step : step) + '/' + (total < 10 ? '0' + total : total))

}


async function loadALlTraj() {

    d3.json("data/pos.json").then(function (data) {
        let tbbox = tool[0].node().getBoundingClientRect();

        tool[1] = tbbox.width;
        tool[2] = tbbox.height;
        tool[0].append("g").attr('class', 'traj');

        let traj_s = ((50 * tbbox.width) / 1300);
        let keys = Object.keys(data);

        for (let i = 0; i < keys.length; i++) {
            draw_traj(data[keys[i]], tool[0], traj_s, traj_s, false, 'traj-bg ' + data[keys[i]]['traj_id']);
        }


    })
}


function meta_switch(run) {
    iz = run;

    switch (stage) {
        case  "0":
            if (mains[iz] !== undefined) {
                load_data(mains[iz])
            } else {
                meta_change('main.json', -1)
            }
            break;
        case  "1":
            if (random[iz] !== undefined) {
                load_data(random[iz])
            } else {
                meta_change('random/rest' + iz + '.json', -1,)
            }
            break;
        case  "2":

            goplz = true;

            if (tops[iz] !== undefined) {
                load_data(tops[iz])
            } else {

                meta_change('top/' + top_list[iz] + '.json', -1)
            }
            break;
        case  "3":

            if (selecs[selecs_list[iz]] !== undefined) {
                load_data(selecs[selecs_list[iz]])
            } else {

                meta_change('sel/' + selecs_list[iz] + '.json', -1)
            }
            break;
    }

}

function draw_arrowV2(x, y, z, ind) {


    tool[0].append('rect')
        .attr('x', x - 12)
        .attr('y', 275)
        .attr('width', '13')
        .attr('height', '13')
        .attr('stroke-width', '0.5')
        .attr('stroke', 'rgb(85, 85, 85)')
        .attr('fill', '#19c157');


    tool[0].append('text')
        .attr('x', x + 22)
        .attr('y', 286)
        .text('Human');


    tool[0].append('rect')
        .attr('x', x - 12)
        .attr('y', 325)
        .attr('width', '13')
        .attr('height', '13')
        .attr('stroke-width', '0.5')
        .attr('stroke', 'rgb(85, 85, 85)')
        .attr('fill', '#e2d509');

    tool[0].append('text')
        .attr('x', x + 22)
        .attr('y', 336)
        .text('Full Memory');


    tool[0].append('rect')
        .attr('x', x - 12)
        .attr('y', 375)
        .attr('width', '13')
        .attr('height', '13')
        .attr('stroke-width', '0.5')
        .attr('stroke', 'rgb(85, 85, 85)')
        .attr('fill', '#ff5000');

    tool[0].append('text')
        .attr('x', x + 22)
        .attr('y', 386)
        .text('Current');


    tool[0].append('text')
        .attr('x', 102)
        .attr('y', 660)
        .text('Input');


    tool[0].append('text')
        .attr('x', x - 22)
        .attr('y', 660)
        .text('Image Processing (CNN)');


    tool[0].append('text')
        .attr('x', x + 260)
        .attr('y', 660)
        .text('Memory');

    tool[0].append('text')
        .attr('x', x + 372)
        .attr('y', 660)
        .text('Output');


}


function moreInf(x, y, z) {

    let g = d3.select('#sco').append('g').attr('class', 'scro').style('cursor', 'pointer');
    g.append('text')
        .attr('x', x - 10)
        .attr('y', y - 5)
        .text('More information');

    g.append('text')
        .attr('x', x + 30)
        .attr('y', y + 10)
        .text('below');

    g.append('line')
        .attr('class', 'hiddensli')
        .attr('x1', 20 * 0.8)
        .attr('x2', 20 * 0.8)
        .attr('y1', 5 * 0.8)
        .attr('y2', 30 * 0.8)
        .attr('stroke', '#183d4e')
        .attr("stroke-linejoin", "round")
        .attr('stroke_width', '4');


    g.append('line')
        .attr('class', 'hiddensli')
        .attr('x1', 20 * 0.8)
        .attr('x2', 12 * 0.8)
        .attr('y1', 5 * 0.8)
        .attr('y2', 15 * 0.8)
        .attr('stroke', '#183d4e')
        .attr("stroke-linejoin", "round")
        .attr('stroke_width', '4');

    g.append('line')
        .attr('class', 'hiddensli')
        .attr('x1', 20 * 0.8)
        .attr('x2', 28 * 0.8)
        .attr('y1', 5 * 0.8)
        .attr('y2', 15 * 0.8)
        .attr("stroke-linejoin", "round")
        .attr('stroke', '#183d4e')
        .attr('stroke_width', '4');


    g.append('rect')
        .attr('class', 'hiddensli')
        .attr('x', x - 50)
        .attr('y', y - 17)
        .attr('width', 160)
        .attr('height', 100)
        .style('cursor', 'pointer')
        .attr('stroke', 'none')
        .attr('fill', 'rgba(255,255,255,0)');

    g.selectAll('line').attr('transform', 'translate(' + (x + 55) + ',' + (y + 12) + ') rotate(' + z + ' ' + 8 + ' ' + 12.5 + ')')

    animateScro();

    function animateScro() {

        g.selectAll('line').transition().duration(3000).attr('transform', 'translate(' + (x + 55) + ',' + (y + 20) + ') rotate(' + z + ' ' + 8 + ' ' + 12.5 + ')').transition().duration(3000).attr('transform', 'translate(' + (x + 55) + ',' + (y + 12) + ') rotate(' + z + ' ' + 8 + ' ' + 12.5 + ')').on("end", animateScro);

    }
}


$('body').on('click', '.scro rect', function () {

    document.getElementById('scrolltxt').scrollIntoView({block: 'center', behavior: 'smooth'})
});


function highelems(elems) {

    //TODO: Detected close elements


    tool[0].selectAll('.hiddensgrp rect[order]').transition().duration(900).style('opacity', '0.3');

    for (let i = 0; i < elems.length; i++) {

        tool[0].selectAll('.hiddensgrp rect[order="' + elems[i] + '"]').interrupt().style('opacity', '1')
    }
}


function resetelems() {
    tool[0].selectAll('.hiddensgrp rect[order]').transition().duration(900).style('opacity', '1');
}

