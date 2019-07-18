let mapx, mapy, traj_x, traj_y;


function init() {

    mapx = [-650, 500];
    mapy = [-650, 500];


    traj_x = d3.scaleLinear().range([0, width]);
    traj_y = d3.scaleLinear().range([height, 0]);


    traj_x.domain(mapx);
    traj_y.domain(mapy);

}


function draw_traj(data, svg, width, height, offx, offy, cs) {

    let line = d3.line()
        .x(function (d) {
            return traj_x(d[0]);
        })
        .y(function (d) {
            return traj_y(d[1]);
        });


    let g = svg.append("g").attr('class', 'traj');

    g.append("path")
        .data([data])
        .attr("class", cs)
        .attr("d", line)
        .attr('stroke', 'steelblue')
        .style("fill", "none")
}
