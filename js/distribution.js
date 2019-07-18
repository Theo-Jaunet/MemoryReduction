let positions = [[0, 1], [2, 1], [1, 0], [0, 0], [2, 0]];
let or = ['270 38.4 40', '90 40 41.6', '0 38.4 38.4', '315 36.8 40', '45 44.8 44.8'];
let sz = d3.scaleOrdinal()
    .range(["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5"]);


function rotate_arrow(act) {

    d3.select('#dir_arrow').attr('transform', 'rotate(' + or[act] + ')')

}


function update_bars(data, svg, width, height, act) {


    for (let i = 0; i < data.length; i++) {

        draw_bar(svg, height / 3, positions[i], data[i], sz(i), i);
    }

    rotate_arrow(parseInt(act))

}

function draw_bar(svg, hratio, pos, value, color, i) {

    let y = d3.scaleLinear().rangeRound([hratio, 0]).domain([0.01, 0.99]);


    svg.selectAll('.bar[nb="' + i + '"]').transition()
        .duration(120)
        .attr("y", () => {
            return hratio * pos[1] + hratio - (hratio - y(value));
        })
        .attr("height", () => {
            return Math.abs(hratio - y(value))
        })
        .attr('fill', () => {
            return color;
        })


}


function draw_line(data, svg, width, height, offx, offy) {

    let g = svg.append('g').attr('class', 'distrb');

    let wratio = width / 3;
    let hratio = height / 3;

    let data_line = [
        { // HORIZONTALS

            'x1': 0 + offx,
            'y1': hratio + offy,
            'x2': width + offx,
            'y2': hratio + offy
        },
        {
            'x1': 0 + offx,
            'y1': wratio * 2 + offy,
            'x2': width + offx,
            'y2': wratio * 2 + offy
        }, // VERTICALS
        {
            'x1': wratio + offx,
            'y1': 0 + offy,
            'x2': wratio + offx,
            'y2': height + offy
        }, {
            'x1': wratio * 2 + offx,
            'y1': 0 + offy,
            'x2': wratio * 2 + offx,
            'y2': height + offy
        }
    ];


    g.selectAll('line')
        .data(data_line)
        .enter()
        .append('line')
        .attr('stroke', '#000019')
        .attr('x1', function (d) {
            return d.x1
        })
        .attr('x2', function (d) {
            return d.x2
        })
        .attr('y1', function (d) {
            return d.y1
        })
        .attr('y2', function (d) {
            return d.y2
        })
        .attr('stroke-dasharray', '5,5');

    let y = d3.scaleLinear().rangeRound([hratio, 0]).domain([0, 0.95]);

    for (let i = 0; i < data.length; i++) {
        g.append('rect')
            .attr('class', 'bar')
            .attr("x", () => {
                return wratio * positions[i][0] + offx;
            })
            .attr("y", () => {
                return hratio * positions[i][1] + hratio - (hratio - y(data[i])) + offy;
            })
            .attr("width", wratio)
            .attr("height", () => {
                return Math.max(0, hratio - y(data[i]));
            })
            .attr('fill', () => {
                return sz(i);
            }).attr("stroke-width", 0.5)
            .attr('stroke', '#000019')
            .attr('nb', i)
            .style('opacity', '0.7')
    }


    g.append('text')
        .attr('font-family', 'FontAwesome')
        .attr('font-size', '17pt')
        .attr('id', 'dir_arrow')
        // .style('transform', () => {
        //     return 'translate(' + (wratio - 25 + wratio / 2) + 'px , ' + (hratio + 25 + hratio / 2) + 'px)';
        // })
        .text(function (d) {
            return '\u2b06';
        })

        .attr("x", () => {
            return wratio - 12 + wratio / 2 + offx;
        })
        .attr("y", () => {
            return hratio + 12 + hratio / 2 + offy;
        });

}