let stage = 0;

let stages = ['Full Memory', 'Random Memory Reductions', 'Top Activated Memory Elements', 'Memory Elements Selection', 'Do it Yourself!']


function update_stage(nb) {


    stage = nb;

    $('#card_title').html(stages[stage])

    switch (stage) {
        case  "0":
            change('main');
            break;
        case "1":
            console.log('lala');
            change('random/rest');
            let tbbox = tool[0].node().getBoundingClientRect();

            let traj_s = ((650 * tbbox.width) / 1300);
            $('.random').remove();
            for (let i = 0; i < random.length; i++) {
                draw_traj(random[i].positions, tool[0], traj_s, traj_s, 10, 10, false, 'random');
            }
            break;
    }
}

$('.card').on('mouseover', function () {

    if (random.length < 14) {
        chain_load('random/rest')

    } else {
        for (let i = 0; i < random.length; i++) {
            draw_traj(random[i].positions, tool[0], traj_s, traj_s, 10, 10, false, 'temptr');
        }
    }

});


$('.card').on('mouseout', function () {

    $('.temptr').remove();

});


$('.card').on('click', function () {

    $('.selected').toggleClass('selected');

    $(this).toggleClass('selected');

    update_stage($(this).attr('index'))

});


$('.right-card-arr').on('click', function () {

    if (stage + 1 <= 4) {
        stage += 1;

        $('.selected').toggleClass('selected');

        $('.nav[index=' + stage + ']').toggleClass('selected');

        update_stage(stage)
    }
});

$('.left-card-arr').on('click', function () {

    if (stage - 1 >= 0) {
        stage -= 1;

        $('.selected').toggleClass('selected');

        $('.nav[index=' + stage + ']').toggleClass('selected');

        update_stage(stage)
    }
});