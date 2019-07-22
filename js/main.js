let tool = [d3.select('#tool'), $('#tool').width(), $('#tool').height()];
let tdata;
let margin = 40;
let iz = 0;
let start = 0;
let pl = false;
let curStep = 0;
let timer = null;


let area = d3.line()
    .x(function (d) {
        return d[0];
    })
    .y(function (d) {
        return d[1];
    });


d3.json("data/main.json").then(function (data) {
    tdata = data;
    console.log(data);

    ve_init_rows(tool[0], tdata.hiddens, tool[2], tool[1]);
    // ve_init_rows(tool[0], tdata.hiddens[start], tool[2], tool[1]);
    traj_init(450, 450);
    draw_traj(tdata.positions, tool[0], 450, 450, 10, 10, true);
    // update_bars(tdata.probabilities[start], tool[0], tdata.probabilities[start].indexOf('' + Math.max(...tdata.probabilities[start])));
    update_bars(tool[0], tdata.probabilities[start]);
    draw_agent_path(tool[0], tdata.positions[start], tdata.orientations[start], 10, 10);
    place_items(tool[0], 10, 10, tdata.positions[start])

    init_current(tool[0], 650, -10, 0)

});

bars_init(tool[0], tool[1], tool[2]);
drawImage(tool[0], 'assets/image3.jpeg', tool[2]);

// draw_line(generate_fake()[1], tool[0], 100, 100, tool[1] - 100 - margin, (tool[2] / 2) - 50);


function change(type) {


    let filename = (type === 'rest' ? type + "" + iz + ".json" : type + ".json");

    d3.json("data/" + filename).then(function (data) {
            iz += 1;
            data = tofloat(data);

            tdata = data;
            ve_init_rows(tool[0], tdata.hiddens, tool[2], tool[1]);
            draw_traj(tdata.positions, tool[0], 350, 350, margin, tool[2] - 350 - margin, false);
            // update_bars(tdata.probabilities[start], tool[0], tdata.probabilities[start].indexOf('' + Math.max(...tdata.probabilities[start])))
            update_bars(tool[0], tdata.probabilities[start]);
            draw_agent_path(tool[0], tdata.positions[start], tdata.orientations[start]);
        }
    )
}


function step() {

    curStep += 1;


    if (tdata.hiddens[start + curStep]) {
        let tbar = $('#timebar');
        tbar.val(curStep);
        update_time();
        show_current(tool[0], 650, -10, curStep);
        show_sel(curStep);
        draw_agent_path(tool[0], tdata.positions[start + curStep], tdata.orientations[start + curStep], 10, 10);
        drawImage(tool[0], 'data:image/png;base64,' + tdata.inputs[start + curStep], tool[2]);
        // ve_update(tool[0], tdata.hiddens[start + curStep]);
        update_bars(tool[0], tdata.probabilities[start + curStep]);
        // update_bars(tdata.probabilities[start + curStep], tool[0], tdata.probabilities[start + curStep].indexOf('' + Math.max(...tdata.probabilities[start + curStep])))
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
    show_current(tool[0], 650, -10, curStep)

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


// d3.select('#tool');


