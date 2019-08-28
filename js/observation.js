function drawImage(svg, url, height) {
    let temp = d3.select('#obs');
    let tfinam = '';
    switch (stage) {
        case  "0":
            tfinam = '';
            break;
        case  "1":
            tfinam = 'rest' + iz + '_';
            break;
        case  "2":
            tfinam = top_list[iz] + '_';
            break;
        case  "3":
            tfinam = selecs_list[iz] + '_';
            break;
        case  "4":
            tfinam = 'red' + iz + '_';
            break;
        default:
            tfinam = '';
            break
    }

    url = ('data/' + stfold[stage] + '/images/' + tfinam + 'input' + curStep + '.jpg');

    if (tdata['inputs'] !== undefined) {
        if (tdata['inputs'][curStep] !== undefined) {

            url = 'data:image/png;base64,' + tdata['inputs'][curStep];
        }
    }
    if (temp._groups[0][0] === null) {

        svg.append("svg:image")
            .attr('x', 0)
            .attr('y', height - 166)
            .attr('width', 250)
            .attr('height', 162)
            .attr('id', 'obs')
            .attr('stroke', '#555555')
            .attr('stroke-width', '1px')
            // .attr("transform", "translate(160,65) skewY(-41) skewX(10)  scale(0.55,1) rotate(19) ")
            .attr("xlink:href", url)
            .attr('filter', 'url(#brightness)')
    } else {
        temp.attr("xlink:href", url)
    }
}

async function getBase64ImageFromUrl(imageUrl) {
    var res = await fetch(imageUrl);
    var blob = await res.blob();

    return new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.addEventListener("load", function () {
            resolve(reader.result);
        }, false);

        reader.onerror = () => {
            return reject(this);
        };
        reader.readAsDataURL(blob);
    })
}


function drawModel(svg, height) {


    $('#model').remove();
    svg.append("svg:image")
        .attr('x', 288)
        .attr('y', height - 165)
        .attr('width', 360 * 1.22)
        .attr('height', 160 * 1.22)
        .attr('id', 'model')
        .attr("xlink:href", 'assets/DRL2.svg');

    link_model(svg, tdata.hiddens)
}
