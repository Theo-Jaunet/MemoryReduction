function drawImage(svg, url, height) {


    $('#obs').remove();
    svg.append("svg:image")
        .attr('x', 40)
        .attr('y',  50)
        .attr('width', 320)
        .attr('height', 180)
        .attr('id', 'obs')
        .attr("xlink:href", url)
        .style('filter', 'brightness(1.5)')


}