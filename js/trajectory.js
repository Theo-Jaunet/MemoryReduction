let mapx, mapy, traj_x, traj_y;
let offx = -6;
let offy = 90;
let agent;

function traj_init(width, height) {

    mapx = [-500, 300];
    mapy = [600, -300];

    traj_x = d3.scaleLinear().range([0, width]);
    traj_y = d3.scaleLinear().range([0, height]);

    traj_x.domain(mapx);
    traj_y.domain(mapy);

}


function draw_traj(data, svg, width, height, cs, cla) {

    let line = d3.line()
        .x(function (d) {
            return traj_x(d[0]) + offx;
        })
        .y(function (d) {
            return traj_y(d[1]) + offy;
        });

    if (cs) {

        let g = svg.select('.traj');


        g.append("path")
            .data([data])
            .attr("d", line)
            .attr('stroke', '#fff')
            .attr('class', 'traj_bg')
            .style('stroke-width', '7px')
            .style("fill", "none");

        let tpath = g.append("path")
            .data([data])
            .attr("d", line)
            .attr('stroke', 'steelblue')
            .style('stroke-width', '5px')
            .attr('class', 'traj_top ' + cla)
            .style("fill", "none");


        let totalLength = tpath.node().getTotalLength();

        tpath.attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(4500)
            .attr("stroke-dashoffset", 0)


    } else {
        let g = svg.select('.traj');
        let tpath
        if (data['pos']) {
            tpath = g.append("path")
                .data([data['pos']])
                .attr("d", line)
                .attr('class', cla)
                .style('opacity', '0.3')
                .attr('stroke', 'steelblue')
                .style("fill", "none");

        } else {
            tpath = g.append("path")
                .data([data])
                .attr("d", line)
                .attr('class', cla)
                .style('opacity', '0.3')
                .attr('stroke', 'steelblue')
                .style("fill", "none");
        }

        let totalLength = tpath.node().getTotalLength();

        tpath.attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(4500)
            .attr("stroke-dashoffset", 0)
    }
    // d3.selectAll('.traj_bg').moveToBack();
    // d3.selectAll('.traj_top').moveToBack();

    d3.selectAll('.traj_bg').moveToFront();
    d3.selectAll('.traj_top').moveToFront();
    d3.selectAll('.traj-sel').moveToFront();
    d3.selectAll('#agent').moveToFront();
    d3.selectAll('.item').moveToFront();

}


function place_items(svg, st) {

    let g = svg.select('.traj');


    g.append("svg:image")
        .attr('x', traj_x(80) + offx + 1)
        .attr('y', traj_y(80) + offy - 15.5 + 1)
        .attr('width', 38)
        .attr('height', 38)
        .attr('class', 'item')

        .attr("xlink:href", 'assets/armorGreen.png')

    g.append("svg:image")
        .attr('x', traj_x(-400) + offx + 1)
        .attr('y', traj_y(-80) + offy - 13.5 + 1)
        .attr('width', 33)
        .attr('height', 27)
        .attr('class', 'item')
        .attr("xlink:href", 'assets/armorRed.png')


    g.append("svg:image")
        .attr('x', traj_x(-240) + offx + 1)
        .attr('y', traj_y(240) + offy - 13.5 + 1)
        .attr('width', 33)
        .attr('height', 27)
        .attr('class', 'item')
        .attr("xlink:href", 'assets/hp.png');


    g.append("svg:image")
        .attr('x', traj_x(-240) + offx + 1)
        .attr('y', traj_y(80) + offy - 26.5 + 1)
        .attr('width', 29)
        .attr('height', 29)
        .attr('class', 'item')
        .attr("xlink:href", 'assets/soul.png');


    g.append("circle")
        .attr('cx', traj_x(st[0]) + offx)
        .attr('cy', traj_y(st[1]) + offy)
        .attr('r', '7')
        .style('opacity', '0.8')
        .attr('stroke', 'black')
        .attr('class', 'item')
        .style("fill", "black");


    /*    g.append("text")
            .attr('x', traj_x(st[0]) + offx + 35)
            .attr('y', traj_y(st[1]) + offy - 190)
            .attr('font-size', '12pt')
            .style('opacity', '0.8')
            .text('Fail')
            .attr('font-weight', '600')
            .style("fill", "black");*/

    g.append("text")
        .attr('x', traj_x(st[0]) + offx - 18)
        .attr('y', traj_y(st[1]) + offy - 18)
        .attr('font-size', '12pt')
        .style('opacity', '0.8')
        .text('Start')
        .attr('class', 'item')
        .attr('font-weight', '600')
        .style("fill", "black");

    /*
        g.append("text")
            .attr('x', traj_x(st[0]) + offx + 277)
            .attr('y', traj_y(st[1]) + offy + 65)
            .attr('font-size', '12pt')
            .style('opacity', '0.8')
            .text('Not Optimal')
            .attr('font-weight', '600')
            .style("fill", "black");*/


    draw_walls(svg, offx, offy);
}


function draw_walls(svg, offx, offy) {

    let walls = [[-480.0, -480.0, -480.0, 320.0], [320.0, 320.0, 320.0, -480.0], [-320.0, -335.0, -320.0, -147.0], [-160.0, -480.0, -160.0, -320.0], [-160.0, -325.0, -160.0, -160.0], [-160.0, 160.0, -160.0, 320.0], [-160.0, 0.0, 0.0, 0.0], [0.0, 0.0, 160.0, 0.0], [0.0, 160.0, 160.0, 160.0], [160.0, -160.0, 320.0, -160.0]]


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
        .attr('stroke-width', (d) => ((d[3] === 320.0 && d[1] === -480.0) || (d[1] === 320.0 && d[3] === -480.0)) ? '8' : '13')
        .attr("stroke-linejoin", "round");

    g.append('line')
        .attr('x1', 0 + offx)
        .attr('x2', 345.7 + offx)
        .attr('y1', 107.5 + offy)
        .attr('y2', 107.5 + offy)
        .attr('stroke', '#555555')
        .attr('stroke-width', '8')
        .attr("stroke-linejoin", "round");

    g.append('line')
        .attr('x1', 6 + offx)
        .attr('x2', 345.7 + offx)
        .attr('y1', 399 + offy)
        .attr('y2', 399 + offy)
        .attr('stroke', '#555555')
        .attr('stroke-width', '8')
        .attr("stroke-linejoin", "round");

    d3.selectAll('.item').moveToFront();
}

function draw_agent_path(svg, pos, or) {


    if (agent === undefined) {


        svg.append('path')

            .attr('d', "M 30.8,16.6 0.8,30.8 10,16.6 0.8,0.8 Z")
            .attr('id', 'agent')
            .attr('fill', '#a92234')
            .attr('stroke', '#555555')
            .attr('stroke-width', '1')
            .attr('transform', 'translate(' + ((traj_x(pos[0]) - 15) + offx) + ',' + ((traj_y(pos[1]) - 15) + offy) + ') rotate(' + (360 - or) + ' ' + (15) + ' ' + (15) + ')')


        agent = d3.select('#agent')
    } else {
        agent.transition().duration(10).attr('transform', 'translate(' + ((traj_x(pos[0]) - 15) + offx) + ',' + ((traj_y(pos[1]) - 15) + offy) + ') rotate(' + (360 - or) + ' ' + (15) + ' ' + (15) + ')')
    }
}





