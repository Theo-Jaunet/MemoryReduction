function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}


function tofloat(data) {
    data.hiddens = data.hiddens.slice(0, data.hiddens.length).map(function (d) {
        for (let i = 0; i < d.length; i++) {
            d[i] = parseFloat(d[i])
        }
        return d
    });


    data.probabilities = data.probabilities.slice(0, data.probabilities.length).map(function (d) {
        for (let i = 0; i < d.length; i++) {
            d[i] = parseFloat(d[i])
        }
        return d
    });

    return data;
}


function generate_fake() {

    return [d3.range(32).map(() => {
        return getRandomArbitrary(-1, 1)
    }), d3.range(5).map(() => {
        return getRandomArbitrary(0, 1)
    })];
}
