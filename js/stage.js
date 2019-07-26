let stage = 0;

let stages_titles = ['Full Memory', 'Random Memory Reductions', 'Top Memory Elements', 'Memory Elements Selection', 'Do it Yourself!'];
let stages_txt = [

    'We begin with a fully trained agent using 100% of its memory. With the generated trajectory, we can see that the agent moved towards the armor as it should, and then stepped back to where it started instead of moving towards the health pack.' +
    'This suggests that the agent forgot that it saw the health pack at the beginning.' +
    '<br>' +
    '<br>' +
    'Once the agent has gathered the armor in <a onclick="load_step(15)">step 15</a> the first <a onmouseover="highelems([0,1,2])" onmouseout="resetelems()">3 elements</a> changed their activations from either active to inactive or the other way around.' +
    '<br>' +
    '<br>' +
    'The <a onmouseover="highelems([31])" onmouseout="resetelems()"> last element</a> is inactive during this trajectoy. How the agent would behave without it? <a onclick="meta_change(\'nDIY/red31_-1.json\', [31,-1])">Let\'s find out! </a><br> We can see that the new trajectory is exactly the same as the previous one, thus we can conclude that is element has no impact in the agent\'s decision process for this sequence.' +
    '<br>' +
    '<br>' +
    'What if we go further and remove more memory elements? Having smaller models would be useful as they may be more interpretable, but also requiring less computing power and less energy consumption footprint.     ' +
    '<br>',


    'How can we decide how many, and which memory elements can we remove without affecting the agent\'s performance?' +
    ' <br>' +
    'A naive approach is to randomly remove memory elements regardless of their activation. Here, they each have 50% chance to be erased.' +
    '<br><br>' +
    'Despite having only 56% of its memory, the agent is still able to gather the armor in the same amount of steps.' +
    'However, instead of stepping back, it continued in the same direction. In the <a onclick="meta_switch(2)">second run</a>, the agent also gathered the armor but then rushed into the wall.' +
    '<br>' +
    'While having around than 38% of its memory, the agent moved towards the health pack instead of the armor.' +
    'Such trajectory was either <a  onclick="meta_switch(4)">confident</a> or  <a  onclick="meta_switch(3)">hesitant</a>. ' +
    'Similarly in <a  onclick="meta_switch(5)"> run 5</a>, the agent with around 28% of its memory, aimed for the soul-sphere and got stuck in a loop alternating left and right actions in front of it.' +
    '<br>' +
    'Finally, despite only having 13 elements removed in the<a  onclick="meta_switch(10)"> last run</a>, the agent ended up confused and turned around.' +
    'This suggest that some elements may be essential for the agent\'s decisions.' +
    '<br>' +
    '<br>',
    'If some memory elements are essential, are they among the top activated? The top changing? Or top projected?' +
    'We now sort the memory according to different metrics and remove either the bottom 50% or 75%.' +
    '<br><br>' +
    'Among the top activated elements we can observe that in <a onclick="meta_switch(0)"> run with 50% </a>' +
    'memory, the agent moved towards the armor but avoided it.' +
    'n the <a onclick="meta_switch(1)"> run with 25% </a> memory, the agent seems lost and moved in circle. This may indicate that key elements may be in the second top quarter of elements.' +
    '<br><br>' +
    'While using only the most changing elements the  <a onclick="meta_switch(2)"> run with 50% </a>, the agent moved towards the armor but turned around. But, in the <a onclick="meta_switch(3)"> one with 25% </a>, despite sub-optimal trajectory, the agent successfullt gathered the armor.' +
    'One hypothesis to draw is that some elements may be cancelling each others.' +
    '<br><br>' +
    'This suggests that despite having core information represented in the top elements, the agent performances can still be a bit erratic, therefore this cannot be a reliable reducing strategy.' +
    'Perhaps, Humans can be of assistance in this matter.',


    'We manually selected different groups of elements ....',


    'You can select up to 2 elements by clicking on them, and replay the generated trajectory. You can cancel a reduction by clicking on it. <br' +
    '><br> The reduction of both <a onclick="meta_change(\'nDIY/red10_23.json\', [10,23])"> elements 10 and 23 </a> ' +
    'is enough to make the agent move towards the healh pack. This indicates that those elements are essential for the agent to decide. ' +
    'However, removing only one result on the agent having the same trajectory as when it used its full memory.'];


function update_stage(nb) {


    stage = '' + nb;
    resetelems();
    $('#card_title').html(stages_titles[stage]);
    $('#card_txt').html(stages_txt[stage]);
    sels = [-1, -1]
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
            iz = 0;

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
                // chain_load_DIY();
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