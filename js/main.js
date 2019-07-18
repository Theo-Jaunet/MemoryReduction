let tool = [d3.select('#tool'), $('#tool').width(), $('#tool').height()];

const tdata = d3.json("data/main.json").then(function (data) {
    console.log(data);
    return data;
});


let test_hidden = d3.range(128).map(() => {
    return getRandomArbitrary(-1, 1)
});

let test_proba = d3.range(5).map(() => {
    return getRandomArbitrary(0, 1)
});


ve_init_rows(tool[0], tdata['episode0'].hiddens[81], tool[2], tool[1]);


drawImage(tool[0], 'assets/image1.jpeg', tool[2]);

draw_line(test_proba, tool[0], 100, 100, tool[1] - 120, (tool[2] / 2) - 50);