let v_space = 30;

let bheight = 20;

let scale = d3.scaleLinear().range([0, 90]).domain([0, 1]);


function bars_init(svg, width, height) {

    let g = svg.append('g').attr('class', 'distrib');

    let st = (height / 2) - (v_space+bheight)*5;


    g.selectAll('.bar').data([0, 0, 0, 0, 0]).enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', width - margin - 100)
        .attr('y', (d, i) =>
            st + (i * v_space) + (i * bheight)
        )
        .attr('width', (d) => scale(d)+7)
        .attr('height', bheight)
        .attr('fill', 'steelblue')
        .attr("stroke-width", 2)
        .attr('stroke-style', '#f0f1f1')

}


function update_bars(svg, data) {


    let bars = svg.selectAll(".bar").data(data).transition().duration(300).attr('width', (d) => scale(d)+7)
}