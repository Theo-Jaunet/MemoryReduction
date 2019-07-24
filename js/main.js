let tool = [d3.select('#tool'), $('#tool').width(), $('#tool').height()];
let tdata;
let margin = 40;
let iz = 4;
let start = 0;
let pl = false;
let curStep = 0;
let isMono = true;
let timer = null;
let top_list = ['halfact', 'quatact', 'halfch', 'quatch', 'halftsn', 'quattsn'];
let tops = [];
let diy = []
let random = [];

// window.addEventListener('resize', reportWindowSize);

$(function () {
    /**
     * Smooth scrolling to a specific element
     **/
    function scrollTo(target) {
        if (target.length) {
            $("html, body").stop().animate({scrollTop: target.offset().top}, 1500);
        }
    }


});


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
    loadALlTraj();
    draw_arrowV2(100, tool[2] - 50, 180, -1)
});

bars_init(tool[0], tool[1], tool[2]);
drawImage(tool[0], 'assets/image3.jpeg', tool[2]);

function change(type) {

    let filename = (type === 'random/rest' ? type + "" + iz + ".json" : type + ".json");

    d3.json("data/" + filename).then(function (data) {
        if (type === 'random/rest')
            iz += 1;
        data = tofloat(data);
        let tbbox = tool[0].node().getBoundingClientRect();
        let traj_s = ((450 * tbbox.width) / 1300);
        tdata = data;
        ve_init_rows(tool[0], tdata.hiddens, tool[2], tool[1], tdata.mask, -1);
        draw_traj(tdata.positions, tool[0], traj_s, traj_s, 10, 10, false, 'rand');
        update_bars(tool[0], tdata.probabilities[start]);
        draw_agent_path(tool[0], tdata.positions[start], tdata.orientations[start], 10, 10);
    })
}


function change_DIY(type, index) {
    let filename = (type === 'random/rest' ? type + "" + iz + ".json" : type + ".json");

    d3.json("data/" + filename).then(function (data) {
        if (type === 'random/rest')
            iz += 1;
        data = tofloat(data);
        let tbbox = tool[0].node().getBoundingClientRect();
        let traj_s = ((450 * tbbox.width) / 1300);
        tdata = data;
        ve_init_rows(tool[0], tdata.hiddens, tool[2], tool[1], tdata.mask, index);
        draw_traj(tdata.positions, tool[0], traj_s, traj_s, 10, 10, false, 'rand');
        update_bars(tool[0], tdata.probabilities[start]);
        draw_agent_path(tool[0], tdata.positions[start], tdata.orientations[start], 10, 10);
        // mask_elem(index)
    })
}


function change_Top(type, index) {
    let filename = (type === 'random/rest' ? type + "" + iz + ".json" : type + ".json");

    d3.json("data/" + filename).then(function (data) {

        data = tofloat(data);
        let tbbox = tool[0].node().getBoundingClientRect();
        let traj_s = ((450 * tbbox.width) / 1300);
        tdata = data;
        ve_init_rows(tool[0], tdata.hiddens, tool[2], tool[1], tdata.mask, index);
        draw_traj(tdata.positions, tool[0], traj_s, traj_s, 10, 10, false, 'rand');
        update_bars(tool[0], tdata.probabilities[start]);
        draw_agent_path(tool[0], tdata.positions[start], tdata.orientations[start], 10, 10);
        // mask_elem(index)
    })
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
        draw_agent_path(tool[0], tdata.positions[start + curStep], tdata.orientations[start + curStep], 10, 10);
        drawImage(tool[0], 'data:image/png;base64,' + tdata.inputs[start + curStep], tool[2]);
        update_bars(tool[0], tdata.probabilities[start + curStep]);
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
    draw_agent_path(tool[0], tdata.positions[start + curStep], tdata.orientations[start + curStep], 10, 10);
    drawImage(tool[0], 'data:image/png;base64,' + tdata.inputs[start + curStep], tool[2]);
    // ve_update(tool[0], tdata.hiddens[start + curStep]);
    update_bars(tool[0], tdata.probabilities[start + curStep]);
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

    let traj_s = ((650 * tbbox.width) / 1300);
    drawImage(tool[0], 'assets/image3.jpeg', tool[2]);

    console.log(traj_s);
    $('.traj').remove();
    $('.distrib').remove();
    $('.arrow').remove();
    traj_init(traj_s, traj_s);
    draw_traj(tdata.positions, tool[0], traj_s, traj_s, 10, 10, true, 'main');

    place_items(tool[0], 10, 10, tdata.positions[start])
    draw_agent_path(tool[0], tdata.positions[start], tdata.orientations[start], 10, 10);

    bars_init(tool[0], tool[1], tool[2]);
    update_bars(tool[0], tdata.probabilities[start]);

    ve_init_rows(tool[0], tdata.hiddens, tool[2], tool[1], tdata.mask, -1);

    drawModel(tool[0], tool[2]);
    show_sel(start)
    up_curtxt(curStep, tdata.hiddens.length - 1)
}

function chain_load(type) {

    for (let i = random.length; i < 14; i++) {
        let filename = (type === 'random/rest' ? type + "" + i + ".json" : type + ".json");
        d3.json("data/" + filename).then(function (data) {
            data = tofloat(data);
            let tbbox = tool[0].node().getBoundingClientRect();
            let traj_s = ((450 * tbbox.width) / 1300);
            draw_traj(data.positions, tool[0], traj_s, traj_s, 10, 10, false, 'temptr');
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
            draw_traj(data.positions, tool[0], traj_s, traj_s, 10, 10, false, 'temptr');
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
            draw_traj(data.positions, tool[0], traj_s, traj_s, 10, 10, false, 'temptr');
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
            draw_traj(data[keys[i]], tool[0], traj_s, traj_s, 10, 10, false, 'traj-bg');
        }
    })
}


function draw_arrowV2(x, y, z, ind) {

    let g = tool[0].append('g').attr('class', 'scro').style('cursor', 'pointer');


    g.append('text')
        .attr('x', x - 100)
        .attr('y', y - 40)
        .text('Scroll for more information')

    g.append('line')
        .attr('class', 'hiddensli')
        .attr('x1', 20 * 1.5)
        .attr('x2', 20 * 1.5)
        .attr('y1', 5 * 1.5)
        .attr('y2', 30 * 1.5)
        .attr('stroke', '#183d4e')
        .attr("stroke-linejoin", "round")
        .attr('stroke_width', '4');


    g.append('line')
        .attr('class', 'hiddensli')
        .attr('x1', 20 * 1.5)
        .attr('x2', 12 * 1.5)
        .attr('y1', 5 * 1.5)
        .attr('y2', 15 * 1.5)
        .attr('stroke', '#183d4e')
        .attr("stroke-linejoin", "round")
        .attr('stroke_width', '4');

    g.append('line')
        .attr('class', 'hiddensli')
        .attr('x1', 20 * 1.5)
        .attr('x2', 28 * 1.5)
        .attr('y1', 5 * 1.5)
        .attr('y2', 15 * 1.5)
        .attr("stroke-linejoin", "round")
        .attr('stroke', '#183d4e')
        .attr('stroke_width', '4')


    g.append('rect')
        .attr('class', 'hiddensli')
        .attr('x', x - 100)
        .attr('y', y - 80)
        .attr('width', 210)
        .attr('height', 150)
        .style('cursor', 'pointer')
        .attr('stroke', 'none')
        .attr('fill', 'rgba(255,255,255,0)');

    g.selectAll('line').attr('transform', 'translate(' + x + ',' + y + ') rotate(' + z + ' ' + 8 + ' ' + 12.5 + ')')

    animateScro();

    function animateScro() {

        g.selectAll('line').transition().duration(3000).attr('transform', 'translate(' + x + ',' + y + ') rotate(' + z + ' ' + 8 + ' ' + 12.5 + ')').transition().duration(3000).attr('transform', 'translate(' + x + ',' + (y + 20) + ') rotate(' + z + ' ' + 8 + ' ' + 12.5 + ')').on("end", animateScro);

    }

}


$('body').on('click', '.scro rect', function () {

    document.getElementById('navprob').scrollIntoView({block: 'center', behavior: 'smooth'})
})




