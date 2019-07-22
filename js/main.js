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
    traj_init(350, 350);
    draw_traj(tdata.positions, tool[0], 350, 350, margin, tool[2] - 350 - margin, true);
    // update_bars(tdata.probabilities[start], tool[0], tdata.probabilities[start].indexOf('' + Math.max(...tdata.probabilities[start])));
    update_bars(tool[0], tdata.probabilities[start]);

    place_items(tool[0], margin, tool[2] - 350 - margin, tdata.positions[start])

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
        }
    )
}


function play() {

    pl = !pl;

    if (pl) {
        $('#play').html('Pause');
        timer = setInterval(step, 200);
        step()
    } else {
        $('#play').html('Play');
        clearInterval(timer);
        timer = null
    }
}


function step() {

    curStep += 1;

    if (tdata.hiddens[start + curStep]) {
        drawImage(tool[0], 'data:image/png;base64,' + tdata.inputs[start + curStep], tool[2]);
        // ve_update(tool[0], tdata.hiddens[start + curStep]);
        update_bars(tool[0], tdata.probabilities[start + curStep]);
        // update_bars(tdata.probabilities[start + curStep], tool[0], tdata.probabilities[start + curStep].indexOf('' + Math.max(...tdata.probabilities[start + curStep])))
    } else {
        pl = false;
        $('#play').html('Play');
        curStep = 0;
        clearInterval(timer);
        timer = null
    }
}


function generate_fake() {

    return [d3.range(32).map(() => {
        return getRandomArbitrary(-1, 1)
    }), d3.range(5).map(() => {
        return getRandomArbitrary(0, 1)
    })];
}


d3.select('#tool');


