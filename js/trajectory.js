let mapx, mapy, traj_x, traj_y;
let offx = -5;
let offy = 40;

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


    d3.select('.traj_bg').moveToFront()
    d3.select('.traj_top').moveToFront()
    d3.select('.item').moveToFront()
    d3.select('.traj-sel').moveToFront()
}


function place_items(svg, st) {

    let g = svg.select('.traj');


    g.append("svg:image")
        .attr('x', traj_x(80) + offx + 1)
        .attr('y', traj_y(80) + offy - 15.5 + 1)
        .attr('class', 'item')
        .attr('width', 45)
        .attr('height', 57)
        .attr("xlink:href", 'assets/armorGreen.png')

    g.append("svg:image")
        .attr('x', traj_x(-400) + offx + 1)
        .attr('y', traj_y(-80) + offy - 13.5 + 1)
        .attr('class', 'item')
        .attr('width', 33)
        .attr('height', 27)
        .attr("xlink:href", 'assets/armorRed.png')


    g.append("svg:image")
        .attr('x', traj_x(-240) + offx + 1)
        .attr('y', traj_y(240) + offy - 13.5 + 1)
        .attr('width', 33)
        .attr('class', 'item')
        .attr('height', 27)
        .attr("xlink:href", 'assets/hp.png');


    g.append("svg:image")
        .attr('x', traj_x(-240) + offx + 1)
        .attr('y', traj_y(80) + offy - 13.5 + 1)
        .attr('width', 33)
        .attr('height', 27)
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

    let walls = [[-480.0, -480.0, -480.0, 320.0], [320.0, 320.0, 320.0, -480.0], [-320.0, -320.0, -320.0, -160.0], [-160.0, -480.0, -160.0, -320.0], [-160.0, -320.0, -160.0, -160.0], [-160.0, 160.0, -160.0, 320.0], [-160.0, 0.0, 0.0, 0.0], [0.0, 0.0, 160.0, 0.0], [0.0, 160.0, 160.0, 160.0], [160.0, -160.0, 320.0, -160.0]]


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

function draw_agent_path(svg, pos, or) {

    d3.selectAll('.agent').remove();

    svg.append('path')

        .attr('d', "M 30.8,16.6 0.8,30.8 10,16.6 0.8,0.8 Z")
        .attr('class', 'agent')
        .attr('fill', '#a92234')
        .attr('stroke', '#555555')
        .attr('stroke-width', '1')
        .attr('transform', 'translate(' + ((traj_x(pos[0]) - 15) + offx) + ',' + ((traj_y(pos[1]) - 15) + offy) + ') rotate(' + (360 - or) + ' ' + (15) + ' ' + (15) + ')')
}





