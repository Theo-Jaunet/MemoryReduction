let mapx, mapy, traj_x, traj_y;


function traj_init(width, height) {

    mapx = [-500, 100];
    mapy = [300, -200];


    traj_x = d3.scaleLinear().range([0, width]);
    traj_y = d3.scaleLinear().range([0, height]);


    traj_x.domain(mapx);
    traj_y.domain(mapy);

}


function draw_traj(data, svg, width, height, offx, offy, cs, cla) {

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
            .attr('stroke', '#fff')
            .attr('class', 'traj_bg')
            .style('stroke-width', '10px')
            .style("fill", "none")

        g.append("path")
            .data([data])
            .attr("d", line)
            .attr('stroke', 'steelblue')
            .style('stroke-width', '6px')
            .attr('class', 'traj_top')
            .style("fill", "none")


    } else {
        let g = svg.select('.traj');
        g.append("path")
            .data([data])
            .attr("d", line)
            .attr('class', cla)
            .style('opacity', '0.3')
            .attr('stroke', 'steelblue')
            .style("fill", "none")
    }

/*    d3.select('.traj_bg').moveToFront()
    d3.select('.traj_top').moveToFront()*/
}


function place_items(svg, offx, offy, st) {

    let g = svg.select('.traj');


    /*
        g.append("circle")
            .attr('cx', traj_x(-80) + offx)
            .attr('cy', traj_y(80) + offy)
            .attr('r', '6')
            .style('opacity', '0.8')
            .attr('stroke', 'red')
            .style("fill", "red");
    */


    g.append("svg:image")
        .attr('x', traj_x(-80) + offx - 16.5)
        .attr('y', traj_y(80) + offy - 13.5)
        .attr('width', 33)
        .attr('height', 27)
        .attr("xlink:href", 'assets/armor.png')


    /*
        g.append("circle")
            .attr('cx', traj_x(-240) + offx)
            .attr('cy', traj_y(80) + offy)
            .attr('r', '6')
            .style('opacity', '0.8')
            .attr('stroke', 'blue')
            .style("fill", "blue");
    */

    g.append("svg:image")
        .attr('x', traj_x(-240) + offx - 16.5)
        .attr('y', traj_y(80) + offy - 13.5)
        .attr('width', 33)
        .attr('height', 27)
        .attr("xlink:href", 'assets/soul.png');


    /*    g.append("circle")
            .attr('cx', traj_x(-415) + offx)
            .attr('cy', traj_y(206) + offy)
            .attr('r', '6')
            .style('opacity', '0.8')
            .attr('stroke', 'gray')
            .style("fill", "gray");*/


    g.append("svg:image")
        .attr('x', traj_x(-415) + offx - 16.5)
        .attr('y', traj_y(206) + offy - 13.5)
        .attr('width', 33)
        .attr('height', 27)
        .attr("xlink:href", 'assets/hp.png');


    g.append("circle")
        .attr('cx', traj_x(st[0]) + offx)
        .attr('cy', traj_y(st[1]) + offy)
        .attr('r', '7')
        .style('opacity', '0.8')
        .attr('stroke', 'black')
        .style("fill", "black")


    g.append("text")
        .attr('x', traj_x(st[0]) + offx - 15)
        .attr('y', traj_y(st[1]) + offy + 30)
        .attr('font-size', '12pt')
        .style('opacity', '0.8')
        .text('Start')
        .attr('font-weight', '600')
        .style("fill", "black");


    draw_walls(svg, offx, offy);
}


function draw_walls(svg, offx, offy) {

    let walls = [[-320.0, -160.0, -160.0, -160.0], [-160.0, -160.0, -160.0, 0.0], [-320.0, 160.0, -160.0, 160.0], [-160.0, -160.0, 0.0, -160.0], [0.0, 0.0, 0.0, 160.0], [-160.0, 160.0, 0.0, 160.0], [0.0, 160.0, 160.0, 160.0]]


    let g = svg.select('.traj');


    g.selectAll('.walls')
        .data(walls)
        .enter()
        .append('line')
        .attr('x1', (d) => traj_x(d[0]) + offx)
        .attr('x2', (d) => traj_x(d[2]) + offx)
        .attr('y1', (d) => traj_y(d[1]) + offy)
        .attr('y2', (d) => traj_y(d[3]) + offy)
        .attr('stroke', '#555555')
        .attr('stroke-width', '6')
        .attr("stroke-linejoin", "round")
}

function draw_agent_path(svg, pos, or, offx, offy) {

    d3.selectAll('.agent').remove();

    svg.append('path')
    // .attr('d', "M 15.8,8.3 0.8,15.8 5,8.3 0.8,0.8 Z")
        .attr('d', "M 30.8,16.6 0.8,30.8 10,16.6 0.8,0.8 Z")
        .attr('class', 'agent')
        .attr('fill', '#a92234')
        .attr('transform', 'translate(' + ((traj_x(pos[0]) - 15) + offx) + ',' + ((traj_y(pos[1]) - 15) + offy) + ') rotate(' + (360 - or) + ' ' + (15) + ' ' + (15) + ')')

}