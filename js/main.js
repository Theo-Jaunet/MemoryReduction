let megadata = {};

function fake_data() {

    megadata['hidden'] = d3.range(128).map(() => {
        return getRandomArbitrary(-1, 1)
    });

    megadata['proba'] = d3.range(5).map(() => {
        return getRandomArbitrary(0, 1)
    })
}


