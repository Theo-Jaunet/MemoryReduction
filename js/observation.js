function drawImage(svg, url, height) {

    svg.append("svg:image")
        .attr('x', 0)
        .attr('y', (height / 2) - 90)
        .attr('width', 320)
        .attr('height', 180)
        .attr("xlink:href", url)
        .style('filter', 'brightness(1.5)')


}