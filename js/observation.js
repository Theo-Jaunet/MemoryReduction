function drawImage(svg, url, height) {


    $('#obs').remove();
    svg.append("svg:image")
        .attr('x', 60)
        .attr('y', height - 172)
        .attr('width', 288)
        .attr('height', 162)
        .attr('id', 'obs')
        .style('filter', 'brightness(1.3)')
        .attr("xlink:href", url)
        .style('filter', 'brightness(1.5)')


}


function drawModel(svg, height) {


    $('#model').remove();
    svg.append("svg:image")
        .attr('x', 400)
        .attr('y', height - 120)
        .attr('width', 300)
        .attr('height', 160)
        .attr('id', 'model')
        .attr("xlink:href", 'assets/DRL.svg')
    }