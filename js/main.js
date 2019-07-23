let tool = [d3.select('#tool'), $('#tool').width(), $('#tool').height()];
let tdata;
let margin = 40;
let iz = 4;
let start = 0;
let pl = false;
let curStep = 0;
let isMono = true;
let timer = null;

let random = [];

// window.addEventListener('resize', reportWindowSize);


let area = d3.line()
    .x(function (d) {
        return d[0];
    })
    .y(function (d) {
        return d[1];
    });


d3.json("data/main.json").then(function (data) {
    tdata = data;

    reportWindowSize()

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
            ve_init_rows(tool[0], tdata.hiddens, tool[2], tool[1], tdata.mask);
            draw_traj(tdata.positions, tool[0], traj_s, traj_s, 10, 10, false, 'rand');
            update_bars(tool[0], tdata.probabilities[start]);
            draw_agent_path(tool[0], tdata.positions[start], tdata.orientations[start], 10, 10);
        }
    )
}


function step() {

    curStep += 1;


    if (tdata.hiddens[start + curStep]) {
        up_curtxt(curStep, tdata.hiddens.length-1)
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

    ve_init_rows(tool[0], tdata.hiddens, tool[2], tool[1], tdata.mask);

    drawModel(tool[0], tool[2]);
    show_sel(start)
    up_curtxt(curStep, tdata.hiddens.length-1)
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


function load_step(st) {

    curStep = st - 1;

    step();

}

function up_curtxt(step, total) {

    $('#stepctn').html('Step ' + (step < 10 ? '0' + step : step) + '/' + (total < 10 ? '0' + total : total))

}