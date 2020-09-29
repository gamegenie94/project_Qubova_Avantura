Array.prototype.random = function () {
    return this[Math.floor((Math.random()*this.length))];
}

class Modal {

    constructor() {

        this.modal = document.getElementById('modal');
    }

    getModal() {

        let params = new URLSearchParams(location.search);
        const razred = params.get('razred') ?? null;
        const predmet = params.get('predmet') ?? null;

        const { imgSrc } = questions['predmet'][predmet];
        const { question, choiceA, choiceB, choiceC, correct } = questions['predmet'][predmet][`${razred}r`].random();
		
		console.log(question, correct);
		
        this.modal.innerHTML = `
            <div class="modal-content">
                <div id="quiz">
                    <div id="question">${question}</div>
                    <div id="qImg"><img src="./${imgSrc}"></div>
                    <div id="choices">
                        <div class="choice" id="A" onclick="checkAnswer(${correct === 'A'})">${choiceA}</div>
                        <div class="choice" id="B" onclick="checkAnswer(${correct === 'B'})">${choiceB}</div>
                        <div class="choice" id="C" onclick="checkAnswer(${correct === 'C'})">${choiceC}</div>
                    </div>
                </div>
            </div>
         `;
		
        this.modal.style.display = 'flex';
    }
}

let score = 0;

function checkAnswer(correct){
    if( correct ){
		var audio = new Audio('correct.mp3');
		audio.play();
		score = score + 100;
        answerIsCorrect();
		currentSpeed = 0;
		this.modal.style.display = 'none';
    }else{
		var audio = new Audio('wrong.mp3');
		audio.play();
		score = score - 50;
		modal.getModal(1, 'predmet');
		currentSpeed = 0;
		this.modal.style.display = 'flex';
    }
}

function answerIsCorrect(){
    console.log('Correct');
}

function answerIsWrong(){
    console.log('Wrong');
}

