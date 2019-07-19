function draw_area(svg, dot) {

    svg.append("path").datum([[dot[0] - 20, dot[1]], [dot[0] + 20, dot[1]]]).attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 15 + "px")
        .attr("stroke-linejoin", "round")
        .attr("d", area)

}


function svg_click() {
    console.log(d3.mouse(this));

    draw_area(tool[0], d3.mouse(this))
}