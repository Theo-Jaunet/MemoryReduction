let stage = 0;

let stages_titles = ['Full Memory', 'Random Memory Reductions', 'Top Memory Elements', 'Memory Elements Selection', 'Do it Yourself!'];
let stages_txt = [' We begin with a fully trained agent using 100% of its memory. During this interval, the agent moved towards the armor, and then towards where it started instead of reaching the health pack.\n' +
'                This suggests that the agent forgot that it saw the health pack at the beginning.\n' +
'                <br>\n' +
'                <br>\n' +
'                Once the agent has gathered the armor in <a onclick="load_step(15)">step 15</a> the first <a>3 elements</a> change their activations from either active to inactive or the other way around.\n' +
'                <br>\n' +
'                <br>\n' +
'                The <a> last element</a> is inactive during this interval. How the agent would behave without it? <a onclick="change_DIY(\'DIY/red31\', 31)">Let\'s find out! </a> We can see that the new trajectory is exactly the same as the previous one, thus we can conclude that is element has no impact in the agent\'s decision process during this sequence.\n' +
'                <br>\n' +
'                <br>\n' +
'                What if we go further and remove more memory elements? This would be useful to have smaller models which may be more interpretable as they may contain less memory dimensions, but also requiring less computing power and reduce the energy consumption footprint.     \n' +
'                <br>\n',
    '  How many memory elements can we remove without affecting the agent\'s performance?\n' +
    '                And how can we decide which elements can be remove?\n' +
    '                A naive approach is to randomly remove memory element regardless of their activation. Now, each element has 50% chance to be erased.\n' +
    '\n' +
    '                <br>\n' +
    '\n' +
    '                We can observe that despite having only 18 elements (i.e. 56% of its memory), the agent is still able to gather the armor in the same amount of steps.\n' +
    '                However, instead of turning around the agent continues in the same direction. In <a>run 3, step 13</a>, the agent gathered the armor and then rushed into the wall.\n' +
    '                <br>\n' +
    '\n' +
    '                While having more than 62% of its memory elements removed, the agent moved towards the health pack instead of the armor and avoided it.\n' +
    '                Such trajectory is either confident like <a> run 5</a> or such hesitant such as <a> run 4</a> in which the agent first aim for the soul-sphere and then move towards the health pack.\n' +
    '                Similarly, in <a> run 6</a> where almost 72% of the memory is reduced, the agent first aim for the soul-sphere, and got stuck in a loop alternating left and right actions.\n' +
    '\n' +
    '\n' +
    '                <br>\n' +
    '                Finally, despite only having 13 elements removed in <a> run XX</a>, the agent ended up confused and turning around.\n' +
    '                This suggest that some elements may be essential for the agent\'s decisions.\n' +
    '\n' +
    '                <br>\n' +
    '                <!--\n' +
    '                                We can also observe that removing some dimensions may have a an impact on other dimensions values, as the element XX,\n' +
    '                                remains inactive during the run 3 despite being active while the agent used its full memory.-->\n' +
    '\n' +
    '                <br>\n', '', '', ''];


function update_stage(nb) {


    stage = '' + nb;

    $('#card_title').html(stages_titles[stage]);
    // $('#card_txt').html(stages_txt[stage]);

    if (stage !== '4') {
        $('#singleRed').remove();
    }
      d3.select('#linear-gradient stop').interrupt();
    d3.select('#linear-gradient stop').attr('offset', '0%');

    let tbbox = tool[0].node().getBoundingClientRect();
    let traj_s = ((650 * tbbox.width) / 1300);

    switch (stage) {
        case  "0":
            iz = 0;
            if (mains[iz] === undefined) {
                meta_change('main.json', -1, mains);
            } else {
                load_data(mains[iz])
            }
            break;
        case "1":
            iz = 0;
            if (random[iz] !== undefined) {
                load_data(random[iz])
            } else {
                meta_change('random/rest' + iz + '.json', -1, random)
            }

            $('.random').remove();

            for (let i = 0; i < random.length; i++) {
                draw_traj(random[i].positions, tool[0], traj_s, traj_s, 10, 10, false, 'sec-traj');
            }
            if (random.length < 11) {
                chain_load('random/rest')
            }
            break;
        case  "2":
            // iz = 0;

            if (tops[iz] === undefined) {
                meta_change('top/' + top_list[iz] + '.json', -1, tops);
            } else {
                load_data(tops[iz])
            }

            for (let i = 0; i < tops.length; i++) {
                draw_traj(tops[i].positions, tool[0], traj_s, traj_s, 10, 10, false, 'temptr');
            }

            chain_load_top();
            break;
        case "3":
            change('main');
            break;
        case "4":
            iz = 0;
            if (mains[iz] === undefined) {
                meta_change('main.json', -1, mains);
            } else {
                load_data(mains[iz])
            }
            break;
        default:
            change('main');
            break;
    }
}

$('.card').on('mouseover', function () {

    let nb = $(this).attr('index');

    let tbbox = tool[0].node().getBoundingClientRect();
    let traj_s = ((650 * tbbox.width) / 1300);
    switch (nb) {
        case  "0":
            break;
        case "1":
            for (let i = 0; i < random.length; i++) {
                draw_traj(random[i].positions, tool[0], traj_s, traj_s, 10, 10, false, 'temptr');
            }

            if (random.length < 14) {
                chain_load('random/rest')
            }
            break;
        case  "2":

            for (let i = 0; i < top.length; i++) {
                draw_traj(top[i].positions, tool[0], traj_s, traj_s, 10, 10, false, 'temptr');
            }
            if (top.length < 3) {
                chain_load_top();
            }
            break;
        case  "3":
            // change('main');
            break;
        case  "4":

            for (let i = 0; i < diy.length; i++) {
                draw_traj(diy[i].positions, tool[0], traj_s, traj_s, 10, 10, false, 'temptr');
            }

            if (diy.length < 10) {
                chain_load_DIY();
            }
            break;
        default:
            change('main');
            break;
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

    stage = parseInt(stage)
    if (stage + 1 < 5) {
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