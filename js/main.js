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
// let selecs_list = ['after','rest0', 'rest1', 'only'];
let selecs_list = ['rest0', 'rest1', 'only'];
let selecs = [];

let area = d3.line()
    .x(function (d) {
        return d[0];
    })
    .y(function (d) {
        return d[1];
    });


d3.json("data/main.json").then(function (data) {
    tdata = data;

    reportWindowSize();

    mains[0] = data;
    loadALlTraj();
    draw_arrowV2(600, tool[2] - 30, 180, -1)


});

bars_init(tool[0], tool[1], tool[2]);
drawImage(tool[0], 'assets/image3.jpeg', tool[2]);


function meta_change(filename, index) {

    d3.json("data/" + filename).then(function (data) {

        load_data(data, index)
    });
}

function load_data(data, index) {
    data = tofloat(data);
    let tbbox = tool[0].node().getBoundingClientRect();
    let traj_s = ((600 * tbbox.width) / 1300);
    tdata = data;

    console.log('lqlalqlq');


    if (curStep > tdata.hiddens.length - 1) {
        curStep = tdata.hiddens.length - 1
    }

    ve_init_rows(tool[0], tdata.hiddens, 685, 811, tdata.mask, index);
    $('.traj-sel').toggleClass('traj-sel');
    draw_traj(tdata.positions, tool[0], traj_s, traj_s, false, 'sec-traj traj-sel');
    update_bars(tool[0], tdata.probabilities[start + curStep]);
    draw_agent_path(tool[0], tdata.positions[start + curStep], tdata.orientations[start + curStep]);
    show_sel(curStep);
    up_curtxt(curStep, tdata.hiddens.length - 1);

    $('#timebar').attr('max', tdata.hiddens.length - 1);

    $('#timebar').val(curStep);
    update_time();
    d3.selectAll('.item').moveToFront()

    switch (stage) {
        case  "0":
            if (mains[iz] === undefined) {
                mains[iz] = data;
            }
            break;
        case  "1":
            if (random[iz] === undefined) {
                random[iz] = data;
            }
            break;
        case  "2":
            if (goplz)
                if (tops[iz] === undefined) {
                    tops[iz] = data;
                }
            break;
        case  "3":
            if (selecs[iz] === undefined && data !== mains[0]) {
                console.log('lalal');
                selecs[iz] = data;
            }
            break;
        case  "4":
            diy[iz] = data;
            break;

    }
}


function step() {

    curStep += 1;


    if (tdata.hiddens[start + curStep]) {
        up_curtxt(curStep, tdata.hiddens.length - 1);
        let tbar = $('#timebar');
        tbar.val(curStep);
        update_time();
        show_current(tool[0], (hst - 10) + (ve_w / 2), -10, curStep);
        show_sel(curStep);
        draw_agent_path(tool[0], tdata.positions[start + curStep], tdata.orientations[start + curStep]);
        drawImage(tool[0], 'data:image/png;base64,' + tdata.inputs[start + curStep], tool[2]);
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

        timer = setInterval(step, 200);
        step()
    } else {
        $(this).attr('src', 'assets/play-sign.svg');
        clearInterval(timer);
        timer = null
    }
})


$('#timebar').on('input', function () {

    update_time();

    curStep = parseInt($(this).val());
    show_sel(curStep);
    draw_agent_path(tool[0], tdata.positions[start + curStep], tdata.orientations[start + curStep]);
    drawImage(tool[0], 'data:image/png;base64,' + tdata.inputs[start + curStep], tool[2]);
    // ve_update(tool[0], tdata.hiddens[start + curStep]);
    update_bars(tool[0], tdata.probabilities[start + curStep]);
    up_curtxt(curStep, tdata.hiddens.length - 1)
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

    let traj_s = ((600 * tbbox.width) / 1300);
    drawImage(tool[0], 'assets/image3.jpeg', tool[2]);

    console.log(traj_s);
    $('.traj').remove();
    $('.distrib').remove();
    $('.arrow').remove();
    traj_init(traj_s, traj_s);
    draw_traj(tdata.positions, tool[0], traj_s, traj_s, true, 'main');

    place_items(tool[0], tdata.positions[start]);
    draw_agent_path(tool[0], tdata.positions[start], tdata.orientations[start]);

    bars_init(tool[0], tool[1], tool[2]);
    update_bars(tool[0], tdata.probabilities[start]);

    ve_init_rows(tool[0], tdata.hiddens, 811, tool[1], tdata.mask, -1);

    drawModel(tool[0], tool[2]);
    show_sel(start);

    up_curtxt(curStep, tdata.hiddens.length - 1);

    show_current(tool[0], (hst - 10) + (ve_w / 2), -10, curStep);


    $('#card_title').html(stages_titles[stage]);
    $('#card_txt').html(stages_txt[stage]);

}

function chain_load(type) {

    for (let i = random.length; i < 11; i++) {
        let filename = (type === 'random/rest' ? type + "" + i + ".json" : type + ".json");
        d3.json("data/" + filename).then(function (data) {
            data = tofloat(data);
            let tbbox = tool[0].node().getBoundingClientRect();
            let traj_s = ((400 * tbbox.width) / 1300);
            draw_traj(data.positions, tool[0], traj_s, traj_s, false, 'temptr');
            random[i] = data
        })

    }
}


function chain_load_top() {

    for (let i = 0; i < top_list.length; i++) {
        let filename = 'top/' + top_list[i] + ".json";
        d3.json("data/" + filename).then(function (data) {
            data = tofloat(data);
            let tbbox = tool[0].node().getBoundingClientRect();
            let traj_s = ((450 * tbbox.width) / 1300);
            draw_traj(data.positions, tool[0], traj_s, traj_s, false, 'temptr');
            top[i] = data
        })

    }
}

function chain_load_DIY() {

    for (let i = 0; i < 32; i++) {
        let filename = 'DIY/red' + i + ".json";
        d3.json("data/" + filename).then(function (data) {
            data = tofloat(data);
            let tbbox = tool[0].node().getBoundingClientRect();
            let traj_s = ((450 * tbbox.width) / 1300);
            draw_traj(data.positions, tool[0], traj_s, traj_s, false, 'temptr');
            diy[i] = data
        })
    }
}


function load_step(st) {

    curStep = st - 1;

    step();

}

function up_curtxt(step, total) {

    $('#stepctn').html('Step ' + (step < 10 ? '0' + step : step) + '/' + (total < 10 ? '0' + total : total))

}


function loadALlTraj() {
    d3.json("data/pos.json").then(function (data) {
        let tbbox = tool[0].node().getBoundingClientRect();

        tool[1] = tbbox.width;
        tool[2] = tbbox.height;

        let traj_s = ((650 * tbbox.width) / 1300);
        let keys = Object.keys(data);

        for (let i = 0; i < keys.length; i++) {
            draw_traj(data[keys[i]], tool[0], traj_s, traj_s, false, 'traj-bg');
        }

    })
}


function meta_switch(run) {
    iz = run

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

    let g = tool[0].append('g').attr('class', 'scro').style('cursor', 'pointer');


    g.append('text')
        .attr('x', x - 10)
        .attr('y', y - 5)
        .text('More information');

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

    g.selectAll('line').attr('transform', 'translate(' + (x + 55) + ',' + y + ') rotate(' + z + ' ' + 8 + ' ' + 12.5 + ')')

    animateScro();

    function animateScro() {

        g.selectAll('line').transition().duration(3000).attr('transform', 'translate(' + (x + 55) + ',' + (y + 10) + ') rotate(' + z + ' ' + 8 + ' ' + 12.5 + ')').transition().duration(3000).attr('transform', 'translate(' + (x + 55) + ',' + y + ') rotate(' + z + ' ' + 8 + ' ' + 12.5 + ')').on("end", animateScro);

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

