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


d3.selection.prototype.moveToFront = function () {
    return this.each(function () {
        this.parentNode.appendChild(this);
    });
};


d3.selection.prototype.moveToBack = function () {
    return this.each(function () {
        var firstChild = this.parentNode.firstChild;
        if (firstChild) {
            this.parentNode.insertBefore(this, firstChild);
        }
    });
};


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
