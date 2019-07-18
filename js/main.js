let tool = [d3.select('#tool'), $('#tool').width(), $('#tool').height()];
let tdata;
let margin = 20;

let iz = 0;
d3.json("data/main.json").then(function (data) {
    tdata = data;
    console.log(data);

    ve_init_rows(tool[0], tdata.hiddens[16], tool[2], tool[1]);
    traj_init(240, 240);
    draw_traj(tdata.positions, tool[0], 240, 240, tool[1] - 240 - margin, tool[2] - 240 - margin, true);
    update_bars(tdata.probabilities[16], tool[0], tdata.probabilities[16].indexOf('' + Math.max(...tdata.probabilities[16])))

});


let test_hidden = d3.range(128).map(() => {
    return getRandomArbitrary(-1, 1)
});

let test_proba = d3.range(5).map(() => {
    return getRandomArbitrary(0, 1)
});


drawImage(tool[0], 'assets/image1.jpeg', tool[2]);

draw_line(test_proba, tool[0], 100, 100, tool[1] - 100 - margin, (tool[2] / 2) - 50);

// draw_line(test_proba, tool[0], 100, 100, tool[1] - 100 - margin, (tool[2] / 2) - 50);


function change(type) {

    d3.json("data/" + type + "" + iz + ".json").then(function (data) {
            iz+=1;
            tdata = data;
            ve_update(tool[0], tdata.hiddens[16]);
            draw_traj(tdata.positions, tool[0], 240, 240, tool[1] - 240 - margin, tool[2] - 240 - margin, false);
            update_bars(tdata.probabilities[16], tool[0], tdata.probabilities[16].indexOf('' + Math.max(...tdata.probabilities[16])))
        }
    )

};

