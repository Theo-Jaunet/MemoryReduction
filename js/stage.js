let stage = "0";

let stages_titles = ['Full Memory', 'Random Memory Reductions', 'Top Memory Elements', 'Memory Elements Selection', 'Do it Yourself!'];
let stages_txt = [

    'In order to solve the task of playing Doom, the artificial player at each instant receives, an observed image (a screen capture) corresponding to its field of view.\n' +
    '                From this image, it decides which action it should do. As the game goes on, the agent ' +
    '                  builds an inner representation of the previously seen game captures: a memory. To do so, it combines the current game capture and its previous memory. From this memory, the agent decides which action it should do.' +
    'The memory\n' +
    '                is a vector <i>(1x32)</i> with values in a scale from inactive <span class="cell"></span> to active <span class="cell" style="background-color: rgb(191, 84, 47)"></span>. ' +
    'Each memory vector (column) is vertically aligned in the order in which it is produced.' +
    '<br>' +
    'In the generated trajectory, we can see that the agent gathered all items in the correct order. ' +
    /*    'In addition, as the green armor entered its field of view in <a onclick="load_step(4)">step 4</a>, some <a> memory elements (rows)</a> ' +
        'changed from inactive to active. This suggests that they may be encoding the presence of the armor in the agent\'s field. ' +*/
    // '<br>' +
    // '<br>' +
    'Also, the <a onmouseover="highelems([28])"  class="hoverable" onmouseout="resetelems()"> element #29</a> (row) remained active until the agent ' +
    'gathered the red armor and inactive after. How would the agent behave without row#29 of its memory? <a onclick="meta_change(\'diy/red28_-1.json\', [28,-1])">Let\'s find out! </a><br> ' +
    'The new trajectory starts as the previous one; however once the agent gathered the red armor, it turned left instead of right. ' +
    'What if we go further and remove more memory elements? Having smaller models would be useful as they may be more interpretable, but also requiring less computing power and have a lower energy consumption footprint.     ' +
    '<br>',

    'A naive approach is to randomly remove memory elements regardless of their activation. In this scenario here, they each have 1 chance out of 2 to be erased. ' +
    'We generated 3 different random memory reductions.' +
    '<br><br>' +
    'In <a onclick="meta_switch(0)">Random #1</a>, the agent only has  31% of its memory. In the resulting trajectory, it gathered the soul-sphere before gathering the health pack which ended the game (fail). ' +
    '<br><br>' +
    ' In <a onclick="meta_switch(3)">Random #2</a> the agent\'s memory is reduced to 59% which made it turn left instead of right after it gathered the red armor, and therefore failed to gather all items in the given time.   ' +
    '<br><br>' +
    'Finally, in <a onclick="meta_switch(10)">Random #3</a>, with 50% memory, the agent successfully gathered all items in less steps than when it used its full memory. ' +
    'This suggests that some memory elements may be more important than others for the agent to decide, ' +
    'and that reducing the memory while preserving its performances is possible. ',

    'One intuition we have is that the most activated elements may be the most involved in decisions, while the most changing ones may convey information from the current input. To explore such an intuition, we remove elements based on their activity through the game while the player had a full memory.' +
    '<br><br>' +
    'From the top activated order (average activation, higher is better) we can observe that with the <a onclick="meta_switch(0)"> top 16 elements</a> ' +
    ' the agent gathered the green armor, but failed to reach the red armor. Using only the <a onclick="meta_switch(1)"> top 8 </a>, ' +
    ' the agent got stuck in a loop altering 2 actions. This may indicate that elements related to the red armor are not be among the top activated elements.' +
    '<br>' +
    '<br>' +
    /*

        'Among the top activated elements (computed with the sum of all values per element) we can observe that <a onclick="meta_switch(0)"> with 50% memory </a>' +
        ', the agent gathered the green armor, but failed to reach the red armor and turned left instead.' +
        ' With <a onclick="meta_switch(1)"> 25% of its memory </a>, the agent got stuck in a loop altering right and left actions. ' +
        'This may indicate that key elements related to armors may not be in the top activated elements.' +
        '<br><br>' +
    */


    'Using only the  <a onclick="meta_switch(2)"> top 16 elements</a>, from the top changing order (average difference between steps, higher is better), the agent successfully gathered the red armor, but got stuck in a loop of actions. ' +
    ' But, with the <a onclick="meta_switch(3)"> top 8 </a>, the agent successfully gathered the red armor and moved towards the health pack. ' +
    '<br>' +
    'This suggests that indeed core information is represented in the top elements. However, the resulting trajectories still need to be improved to complete the task as the agent did with full memory. '
    ,


    'Here, our goal is to enhance previous reductions with human knowledge. To do so, we manually selected different groups of elements based on their activations.' +
    ' We start from the previous memory reduction with the<a class="hoverable" onmouseover="highelems([8, 29, 12, 25, 11, 7, 15, 24])" onmouseout="resetelems()"> top 8 changing elements</a>, which we combined with <a class="hoverable" onmouseover="highelems([21, 5])" onmouseout="resetelems()">elements ' +
    'active at the end</a>. We selected those elements because they are active when only the health pack is in the agent\'s field of view, and thus may encode its presence. ' +
    'In <a onclick="meta_switch(0)"> the resulting trajectory</a>, the agent was able to gather the health pack, which indicates the added elements may be related to it. ' +
    ' <br><br>' +
    'To go further, the next goal is to make the agent also gather the soul-sphere. To do so, we continued to add <a class="hoverable" onmouseover="highelems([10, 3, 0])" onmouseout="resetelems()">3 elements also active at the end</a>. We can observe that the <a onclick="meta_switch(1)">agent\'s trajectory</a>  ' +
    ' made it gather all items in the correct order. And therefore we can conclude that the agent is able to solve its task, in the current configuration (walls, items, and agent initiate position), while only using 13 elements.' +
    ' We would like to point out the obvious, namely that the task has been\n' +
    'solved for a single episode, and that this selection will normally need to\n' +
    'be confirmed on a larger hold out set of episodes.' +
    ' <br><br>'
    /* 'The combination of those <a onmouseover="highelems( [1, 10, 4, 3, 22, 0, 17, 5])" onmouseout="resetelems()">both reductions</a>, outputs a <a onclick="meta_switch(2)">trajectory</a> in which the agent moved towards the health pack instead of the armor. ' +
     'This provides clues that those elements may indeed encode information related to the armor.' +
     '  <br><br>' +
     'When the agent only uses those elements the <a onclick="meta_switch(3)"> resulting trajectory</a> the agent moved towards the armor, however, it was not able to gather it, and moved in circles. ' +
     'This can be interpreted as the agent needing other memory elements to gather the armor, perhaps some encoding whether the agent is close to an item or not.  ',

 */,
    'You can remove up to 2 elements by clicking on them, and replay the generated trajectory. Such a process is limited to 2 elements at the ' +
    'same time because each combination is pre-generated and therefore, the complete set of memory reduction is not computable. <br><br> ' +
    'The reduction of <a class="hoverable" onmouseover="highelems( [0])" onmouseout="resetelems()" > element #1</a> ' +
    'is enough to <a onclick="meta_change(\'diy/red0_-1.json\', [0,-1])"> make the agent turn left </a> instead of gathering the red armor. In addition, we can observe other elements are impacted and remain inactive.' + '<br><br>' +
    'Going further, removing <a class="hoverable" onmouseover="highelems( [23])" onmouseout="resetelems()"> element #24</a> and <a class="hoverable" onmouseover="highelems([5])" onmouseout="resetelems()"> element #6</a>, makes the agent <a onclick="meta_change(\'diy/red5_23.json\', [5,23])"> avoid the green armor</a>. ' +
    'This indicates that those elements are essential for the agent to decide. ' +
    '<br><br> The possibility to remove up to 2 memory elements provides <i>528</i> combinations possible. If you found any interesting reduction, or have any suggestions to improve this tool, please feel free to visit our <a href="https://github.com/Theo-Jaunet/MemoryReduction">github</a>. '];


function update_stage(nb) {
    goplz = false;


    stage = '' + nb;

    if (stage === "4") {
        $('#nextarr').css('visibility', 'hidden');
        $('#sco').css('visibility', 'visible');
    } else {
        $('#nextarr').css('visibility', 'visible');
        $('#sco').css('visibility', 'hidden');
    }

    resetelems();
    $('#card_title').html(stages_titles[stage]);
    $('#card_txt').html(stages_txt[stage]);
    sels = [-1, -1];
    if (stage !== '4') {
        $('#singleRed').remove();
    }
    d3.select('#linear-gradient stop').interrupt();
    d3.select('#linear-gradient stop').attr('offset', '0%');


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
            break;
        case  "2":
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
