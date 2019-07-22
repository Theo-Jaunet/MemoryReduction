function drawImage(svg, url, height) {


    $('#obs').remove();
    svg.append("svg:image")
        .attr('x', 10)
        .attr('y',  height-235)
        .attr('width', 400)
        .attr('height', 225)
        .attr('id', 'obs')
        .style('filter','brightness(1.3)')
        .attr("xlink:href", url)
        .style('filter', 'brightness(1.5)')


}