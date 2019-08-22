function drawImage(svg, url, height) {

    let temp = svg.select('#obs')
    
  
    
    if (temp._groups[0][0] === null) {
   
    svg.append("svg:image")
        .attr('x', 290)
        .attr('y', height - 166)
        .attr('width', 250)
        .attr('height', 162)
        .attr('id', 'obs')
        .attr('stroke','#555555')
        .attr('stroke-width','1px')
        .attr("transform", "translate(160,65) skewY(-41) skewX(10)  scale(0.55,1) rotate(19) ")
        .attr("xlink:href", url)
        .attr('filter','url(#brightness)')
    }else {
     temp.attr("xlink:href", url)
    }
}


function drawModel(svg, height) {


    $('#model').remove();
    svg.append("svg:image")
        .attr('x', 517)
        .attr('y', height - 155)
        .attr('width', 280)
        .attr('height', 160)
        .attr('id', 'model')
        .attr("xlink:href", 'assets/DRL2.svg');

    link_model(svg, tdata.hiddens)
}
