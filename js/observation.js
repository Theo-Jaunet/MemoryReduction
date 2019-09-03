function drawModel(svg, height) {


    $('#model').remove();
    svg.append("svg:image")
        .attr('x', 288)
        .attr('y', height - 177)
        .attr('width', 360 * 1.22)
        .attr('height', 160 * 1.22)
        .attr('id', 'model')
        .attr("xlink:href", 'assets/DRL2.svg');

    link_model(svg, tdata.hiddens)
}


async function loadim(contain, imUrl) {

    if (!tdata['inputs']) {
        let con = can.node().getContext("2d");

        con.clearRect(0, 0, 500, 500);
        con.font = " 2em Raleway";
        con.fillText('Loading . . .', 50, 80);
        con.save();

        let image = new Image();


        image.onload = function () {
            contain['inputs'] = image;
            con.filter = "brightness(150%)";
            con.drawImage(image, 240 * curStep, 0, 240, 162, 0, 0, 274, 176);
            con.save()
        };
        image.src = imUrl;
    }
}


function stepIm() {
    let con = can.node().getContext("2d");

    if (tdata['inputs']) {
        con.filter = "brightness(150%)";
        con.drawImage(tdata['inputs'], 240 * curStep, 0, 240, 162, 0, 0, 274, 176);
        con.save()
    }

}
