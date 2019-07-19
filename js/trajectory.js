let mapx, mapy, traj_x, traj_y;


function traj_init(width, height) {

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
            return traj_x(d[0]) + offx;
        })
        .y(function (d) {
            return traj_y(d[1]) + offy;
        });

    if (cs) {

        let g = svg.append("g").attr('class', 'traj');

        g.append("path")
            .data([data])
            .attr("d", line)
            .attr('stroke', 'steelblue')
            .style("fill", "none")

    } else {
        let g = svg.select('.traj');
        g.append("path")
            .data([data])
            .attr("d", line)
            .style('opacity', '0.3')
            .attr('stroke', 'steelblue')
            .style("fill", "none")
    }
}


function place_items(svg, offx, offy,st) {

    let g = svg.select('.traj');


    g.append("circle")
        .attr('cx', traj_x(-387.54) + offx)
        .attr('cy', traj_y(79.60) + offy)
        .attr('r', '5')
        .style('opacity', '0.8')
        .attr('stroke', 'red')
        .style("fill", "red")


    g.append("circle")
        .attr('cx', traj_x(-409.64) + offx)
        .attr('cy', traj_y(-84.40) + offy)
        .attr('r', '5')
        .style('opacity', '0.8')
        .attr('stroke', 'green')
        .style("fill", "green")


    g.append("circle")
        .attr('cx', traj_x(st[0]) + offx)
        .attr('cy', traj_y(st[1]) + offy)
        .attr('r', '5')
        .style('opacity', '0.8')
        .attr('stroke', 'black')
        .style("fill", "black")


}