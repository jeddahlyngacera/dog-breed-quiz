var page_no = 1;
let choices_json = fetch('/data/choices').then(function(r) {
    return r.json();
    })
function choices() {
    choices_json.then(function(json) {
        document.querySelector('.question').innerText = "Pupper "+page_no+" of 10:"
        document.querySelector('.quiz_pic').src = "data/"+page_no+".jpg";
        document.querySelector('.robot_gif').src = "data/robot"+page_no+".gif";
        let inner1 = '<input type="radio" name="radio" value=';
        let inner2 = '><span class="checkmark"></span>';
        document.querySelector('.option1').innerHTML = json[page_no]['options'][0]+inner1+'0'+inner2;
        document.querySelector('.option2').innerHTML = json[page_no]['options'][1]+inner1+'1'+inner2;
        document.querySelector('.option3').innerHTML = json[page_no]['options'][2]+inner1+'2'+inner2;
        document.querySelector('.option4').innerHTML = json[page_no]['options'][3]+inner1+'3'+inner2;
    })
}
function answer(ev) {
    choices_json.then(function(json) {
        let cont = document.querySelector(".answer1");
        cont.innerHTML = "";
        let answer1 = document.createElement('div');
        answer1.innerText = json[page_no]['options'][ev.target.value];
        answer1.className = "answer1_value"
        answer1.id = ev.target.value;
        cont.append(answer1);
    })
}
function result() {
    choices_json.then(function(json) {
        answer1 = document.querySelector('.answer1_value').id
        res = (answer1==json[page_no]['answer']) ? 0 : 1;
        let cont = document.querySelector(".answer_reveal");
        cont.innerHTML = "";
        let answer_key = document.createElement('h2');
        let next_btn = (page_no==10) ? '<br><button class="next_q">FINISH!</button>': '<br><button class="next_q">Next</button>';
        answer_key.innerHTML = (res==0) ? "That's correct! Good job!"+next_btn: 'Uh-oh! Wrong dog :('+next_btn;
        cont.append(answer_key);
        document.querySelector('.next_q').addEventListener('click', next_question);
        document.querySelector('.next_q').addEventListener('click', finale);

        let score1_elem = document.querySelector('.left_score');
        let cur_score1 = score1_elem.innerText;
        let new_score_win = parseInt(cur_score1)+1;
        let new_score_win_str = (new_score_win==10) ? String(new_score_win): '0'+String(new_score_win);
        score1_elem.innerText = (res==0) ? new_score_win_str: cur_score1;

        let answer2 = document.querySelector('.predictions1').innerText;
        res2 = (answer2==json[page_no]['options'][json[page_no]['answer']]) ? 0 : 1;
        document.querySelector('.answer2_result').innerText = (res2==0) ? "Nice! He got it right!": "Oh no! He got it wrong :(";
        let score2_elem = document.querySelector('.right_score');
        let cur_score2 = score2_elem.innerText;
        let new_score_win2 = parseInt(cur_score2)+1;
        let new_score_win_str2 = (new_score_win2==10) ? String(new_score_win2): '0'+String(new_score_win2);
        score2_elem.innerText = (res2==0) ? new_score_win_str2: cur_score2;
    })
}
function predict() {
    fetch('/quiz/question/'+page_no).then(function(r) {
        return r.json();
    }).then(function(json) {
        let cont = document.querySelector(".prediction");
        cont.innerHTML = "<p class='robot_text'>Done! I'm ready!</p><h2 class='answer2_reveal_text'>Pl(ai)er 2's answers:</h2>";
        for (let p=0; p<json['top3'].length; p++) {
            let pred1 = document.createElement('span');
            let pred2 = document.createElement('span');
            let br = document.createElement('br');
            pred1.innerText = json['top3'][p][0];
            pred2.innerText = ' - '+json['top3'][p][1]+'%';
            pred1.className = 'predictions1';
            pred2.className = 'predictions2';
            cont.append(pred1);
            cont.append(pred2);
            cont.append(br);
        }
        document.querySelector('.submit_btn_cont').innerHTML = '<button class="submit" style="margin-left: 20%;">Submit</button>';
        document.querySelector('.submit').addEventListener('click', result);
        document.querySelector('.submit').addEventListener('click', predict_reveal);
        
    })
}
function predict_reveal() {
    document.querySelector('.answer2_reveal_text').className = 'answer2_reveal_text2';
    document.querySelectorAll('.predictions1').forEach(pred => pred.className = 'predictions1_2');
    document.querySelector('.predictions1_2').className = 'predictions1_2 top1';
    document.querySelectorAll('.predictions2').forEach(pred => pred.className = 'predictions2_2');
    document.querySelector('.robot_text').remove();
}
function next_question() {
    page_no += 1;
    if (page_no!==11) {
        choices();
        document.querySelector(".prediction").innerHTML = '<p class="robot_text">Predicting in real time...</p>';
        document.querySelector(".answer_reveal").innerHTML = "";
        document.querySelector('.answer2_result').innerText = "";
        document.querySelector('.submit_btn_cont').innerHTML = "";
        predict();
    }
    
}
function finale() {
    if (page_no==11) {
        let finalscore1 = parseInt(document.querySelector('.left_score').innerText);
        let finalscore2 = parseInt(document.querySelector('.right_score').innerText);
        document.querySelector(".row").innerHTML = "";
        let body = document.querySelector("body");
        body.style.backgroundImage = "url('data/final_pup.jpg')";
        body.style.backgroundSize = "cover";
        if (finalscore1 > finalscore2) {
            msg = 'Congratulations! You beat Pl(ai)er! Paw-fect!';
            gif = 'data/robot_win.gif'
        } else if (finalscore1 < finalscore2) {
            msg = '*whimper* Chews better next time!';
            gif = 'data/robot_lose.gif'
        } else {
            msg = 'Congratulations! You tied with Pl(ai)er!';
            gif = 'data/robot_win.gif'
        }
        let p_score1 = document.createElement('h1');
        p_score1.innerText = "Your score: "+finalscore1;
        p_score1.className = "scoresf1";
        let p_score2 = document.createElement('h1');
        p_score2.innerText = "Pl(ai)er's score: "+finalscore2;
        p_score2.className = "scoresf2";
        let result_msg = document.createElement('h1');
        result_msg.innerText = msg;
        result_msg.className = 'message';
        let img_end = document.createElement('img');
        img_end.src = gif;
        img_end.className = "img_end";
        let sign = document.createElement('p');
        sign.innerText = "Created by Jeddahlyn Gacera";
        sign.className = "sign";
        let info = document.createElement('a');
        info.className = 'info';
        info.href = "https://neurohive.io/en/popular-networks/vgg16/";
        info.innerText = "Click here for more info on VGG16";
        let reset = document.createElement('a');
        reset.className = 'reset_btn';
        reset.href = "main.html";
        reset.innerText = "Try Again!";
        body.append(p_score1);
        body.append(p_score2);
        body.append(result_msg);
        body.append(img_end);
        body.append(sign);
        body.append(info);
        body.append(reset);
    }
}
choices();
predict();
document.querySelector('.option1').addEventListener('click', answer);
document.querySelector('.option2').addEventListener('click', answer);
document.querySelector('.option3').addEventListener('click', answer);
document.querySelector('.option4').addEventListener('click', answer);