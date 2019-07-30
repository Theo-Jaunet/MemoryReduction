let stage = 0;

let stages_titles = ['Full Memory', 'Random Memory Reductions', 'Top Memory Elements', 'Memory Elements Selection', 'Do it Yourself!'];
let stages_txt = [

    'In order to play doom, the artificial doom player receive at each time-steps game capture (image) corresponding to its field of view.\n' +
    '                From this game capture, it decides which action it should do. As the artificial doom player\n' +
    '                 decides, it builds an inner representation of the previously seen game captures using the combination of given game capture, and its current inner representation. Such representation,\n' +
    '                is a vector <i>(1x32)</i> with values in a scale from <span class="cell"></span> inactive to <span class="cell" style="background-color: rgb(191, 84, 47)"></span> active. ' +
    'Those vectors are vertically aligned per time-steps in which they are produced' +
    '<br>' +
    '<br>' +
    'In the generated trajectory, we can see that the agent gathered all items in the correct order. ' +
    'In addition, as the green armor entered its field of view in <a onclick="load_step(4)">step 4</a>, some <a> memory elements (rows)</a> ' +
    'changed from inactive to active. This suggests that they may be encoding the presence of the armor in the agent\'s field. '+
    '<br>' +
    '<br>' +
    'We can also note that the element <a onmouseover="highelems([28])" onmouseout="resetelems()"> # 28</a> remained active until the agent' +
    'gathered the red armor and inactive after. How the agent would behave without it? <a onclick="meta_change(\'nDIY/red28_-1.json\', [28,-1])">Let\'s find out! </a><br> ' +
    'The new trajectory stars as the previous one, however once the agent gathered the red armor, it turned left instead of right. ' +
    'What if we go further and remove more memory elements? Having smaller models would be useful as they may be more interpretable, but also requiring less computing power and less energy consumption footprint.     ' +
    '<br>',

    'A naive approach is to randomly remove memory elements regardless of their activation. Here, they each have 1 chance out of 2 to be erased. ' +
    'We generated 3 different random memory reductions: <a onclick="meta_switch(0)">Random #1</a>, <a onclick="meta_switch(3)">Random #2</a> and <a onclick="meta_switch(10)">Random #3</a>.' +
    '<br><br>' +
    'In Random #1, the agent only has  31% of its memory. In resulting trajectory, it gathered the soul-sphere before gathering the health pack which ended the game (fail). ' +
    '<br><br>' +
    ' In Random #2, the ag' +
    '<br><br>' +
    'Finally, despite only having 13 elements removed in the<a  onclick="meta_switch(10)"> last run</a>, the agent ended up confused and turned around. ' +
    'This suggest that some elements may be essential for the agent\'s decisions.' +
    '<br>' +
    '<br>',


    'If some memory elements are essential, are they among the <a onclick="ve_update_reorder(\'act\')">top activated?</a> The <a  onclick="ve_update_reorder(\'ch\')">top changing?</a> ' +
    'We now sort the memory according to different metrics and remove either the bottom 50% or 75%.' +
    '<br><br>' +
    'Among the top activated elements we can observe that <a onclick="meta_switch(0)"> with 50% memory </a>' +
    ', the agent moved towards the armor but avoided it.' +
    ' With <a onclick="meta_switch(1)">  25% of its memory </a>, the agent was able to gather the armor. This may indicate that key elements may be in the top activated quarter of elements, ' +
    'and that some elements in the second quarter may change the information they encode.' +
    '<br><br>' +
    'While using only <a onclick="meta_switch(2)"> the 50% most changing elements</a>, the agent gathered the armor and bumped into a wall. But, with <a onclick="meta_switch(3)"> 25% of its memory </a>, the agent successfully gathered the armor without hitting any wall, and had a smoother trajectory. ' +
    '<br><br>' +
    'This suggests that indeed core information is represented in the top elements. However, the resulting trajectories takes on average 10 more steps to reach the armor than the agent with full memory. Therefore only using top elements may not be a reliable reducing strategy. ' +
    'Perhaps, Humans can be of assistance in this matter.',


    'We manually selected different groups of elements based on their activations.' +
    ' <br><br>' +
    ' We start with <a onmouseover="highelems([1, 4, 22])" onmouseout="resetelems()">elements only active after the agent gathered the armor</a>. ' +
    'In <a onclick="meta_switch(0)"> this trajectory</a> the agent is still able to reach the armor, however it decided to continue in the same direction rather than turning around as it did with its full memory.' +
    ' <br><br>' +
    'While removing the <a onmouseover="highelems([10, 3, 0])" onmouseout="resetelems()">elements only actives before the gathered the armor</a>, we can observe that the <a onclick="meta_switch(1)">agent\'s trajectory</a>  ' +
    'that the agent is still able to gather the armor.' +
    ' <br><br>' +
    'The combination of those <a onmouseover="highelems( [1, 10, 4, 3, 22, 0, 17, 5])" onmouseout="resetelems()">both reductions</a>, outputs a <a onclick="meta_switch(2)">trajectory</a> in which the agent moved towards the health pack instead of the armor. ' +
    'This provides clues that those elements may indeed encode information related to the armor.' +
    '  <br><br>' +
    'When the agent only uses those elements the <a onclick="meta_switch(3)"> resulting trajectory</a> the agent moved towards the armor, however, it was not able to gather it, and moved in circles. ' +
    'This can be interpreted as the agent needing other memory elements to gzather the armor, perhaps some encoding whether the agent is close to an item or not.  ',


    'You can remove up to 2 elements by clicking on them, and replay the generated trajectory. <br' +
    '><br> The reduction of both <a  onmouseover="highelems( [10, 23])" onmouseout="resetelems()" onclick="meta_change(\'nDIY/red10_23.json\', [10,23])"> elements 10 and 23 </a> ' +
    'is enough to make the agent move towards the healh pack. This indicates that those elements are essential for the agent to decide. ' +
    'However, removing only one result on the agent having the same trajectory as when it used its full memory.'];


function update_stage(nb) {
    goplz = false;

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
                draw_traj(random[i].positions, tool[0], traj_s, traj_s, false, 'sec-traj');
            }
            if (random.length < 11) {
                chain_load('random/rest')
            }
            break;
        case  "2":
            /*            iz = 0;

                        if (tops[iz] === undefined) {
                            meta_change('top/' + top_list[iz] + '.json', -1, tops);
                        } else {
                            load_data(tops[iz])
                        }

                        for (let i = 0; i < tops.length; i++) {
                            draw_traj(tops[i].positions, tool[0], traj_s, traj_s, false, 'temptr');
                        }
*/
            /*chain_load_top();*/

            iz = 0;
            if (mains[iz] === undefined) {
                meta_change('main.json', -1, mains);
            } else {
                load_data(mains[iz])
            }
            break;
        case "3":
            iz = 0;
            if (mains[iz] === undefined) {
                meta_change('main.json', -1, mains);
            } else {
                load_data(mains[iz])
            }
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
            iz = 0;
            if (mains[iz] === undefined) {
                meta_change('main.json', -1, mains);
            } else {
                load_data(mains[iz])
            }
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
                draw_traj(random[i].positions, tool[0], traj_s, traj_s, false, 'temptr');
            }

            if (random.length < 14) {
                chain_load('random/rest')
            }
            break;
        case  "2":

            for (let i = 0; i < top.length; i++) {
                draw_traj(top[i].positions, tool[0], traj_s, traj_s, false, 'temptr');
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
                draw_traj(diy[i].positions, tool[0], traj_s, traj_s, false, 'temptr');
            }

            if (diy.length < 10) {
                // chain_load_DIY();
            }
            break;
        default:
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