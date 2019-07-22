let stage = 0;

let stages = ['Optimal Path with Full Memory', 'Random Memory Reductions', 'Top Activated Memory Elements', 'Memory Elements Selection', 'Do it Yourself!']


function update_stage(nb) {


    stage = nb

    $('#card_title').html(stages[stage])
}

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