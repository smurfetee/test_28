const headElem = document.getElementById("head");
const buttonsElem = document.getElementById("buttons");
const pagesElem = document.getElementById("pages");

//Класс, который представляет сам тест
class Quiz
{
	constructor(type, questions, results)
	{
		//Тип теста: 1 - классический тест с правильными ответами, 2 - тест без правильных ответов
		this.type = type;

		//Массив с вопросами
		this.questions = questions;

		//Массив с возможными результатами
		this.results = results;

		//Количество набранных очков
		this.score = 0;

		//Номер результата из массива
		this.result = 0;

		//Номер текущего вопроса
		this.current = 0;
	}

	Click(index)
	{
		//Добавляем очки
		let value = this.questions[this.current].Click(index);
		this.score += value;

		let correct = -1;

		//Если было добавлено хотя одно очко, то считаем, что ответ верный
		if(value >= 1)
		{
			correct = index;
		}
		else
		{
			//Иначе ищем, какой ответ может быть правильным
			for(let i = 0; i < this.questions[this.current].answers.length; i++)
			{
				if(this.questions[this.current].answers[i].value >= 1)
				{
					correct = i;
					break;
				}
			}
		}

		this.Next();

		return correct;
	}

	//Переход к следующему вопросу
	Next()
	{
		this.current++;
		
		if(this.current >= this.questions.length) 
		{
			this.End();
		}
	}

	//Если вопросы кончились, этот метод проверит, какой результат получил пользователь
	End()
	{
		for(let i = 0; i < this.results.length; i++)
		{
			if(this.results[i].Check(this.score))
			{
				this.result = i;
			}
		}
	}
} 

//Класс, представляющий вопрос
class Question 
{
	constructor(text, answers)
	{
		this.text = text; 
		this.answers = answers; 
	}

	Click(index) 
	{
		return this.answers[index].value; 
	}
}

//Класс, представляющий ответ
class Answer 
{
	constructor(text, value) 
	{
		this.text = text; 
		this.value = value; 
	}
}

//Класс, представляющий результат
class Result 
{
	constructor(text, value)
	{
		this.text = text;
		this.value = value;
	}

	//Этот метод проверяет, достаточно ли очков набрал пользователь
	Check(value)
	{
		if(this.value <= value)
		{
			return true;
		}
		else 
		{
			return false;
		}
	}
}

//Массив с результатами
const results = 
[
	new Result("вы ничего не знаете", 2),
	new Result("вы знаете хоть что-то", 4),
	new Result("вы почти молодец", 6),
	new Result("вы молодцы", 8)
	new Result("вы гений", 10)
];

//Массив с вопросами
const questions = 
[
	new Question("что делают рыбы?", 
	[
		new Answer("летают", 0),
		new Answer("ползают", 0),
		new Answer("плавают", 1),
		new Answer("прыгают", 0)
	]),

	new Question("рыбы млекопитающие?", 
	[
		new Answer("не знаю", 0),
		new Answer("да", 0),
		new Answer("нет", 1),
		new Answer("может быть", 0)
	]),

	new Question("у рыб есть жабры?", 
	[
		new Answer("нет", 0),
		new Answer("да", 1),
		new Answer("возможно", 0),
		new Answer("не знаю", 0)
	]),

	new Question("ты рыба?", 
	[
		new Answer("нет", 1),
		new Answer("да", 0),
		new Answer("возможно частично", 0),
		new Answer("кто такие рыбы?", 0)
	]),

	new Question("рыбы откладывают икру?", 
	[
		new Answer("нет", 0),
		new Answer("да", 1),
		new Answer("нет, они откладывают яйца", 0),
		new Answer("они не рожают", 0)
	]),

	new Question("рыб едят люди?", 
	[
		new Answer("нет", 0),
		new Answer("не знаю", 0),
		new Answer("да", 1),
		new Answer("когда-то ели", 0)
	])
	
	new Question("рыб едят другие животные?", 
	[
		new Answer("нет", 0),
		new Answer("да", 1),
		new Answer("не знаю", 0),
		new Answer("они не вкусные", 0)
	]),

	new Question("рыбы дышат?", 
	[
		new Answer("нет", 0),
		new Answer("да", 1),
		new Answer("не знаю", 0),
		new Answer("у них нет легких", 0)
	]),
	
	new Question("рыбам холодно?", 
	[
		new Answer("да", 0),
		new Answer("нет", 1),
		new Answer("не знаю", 0),
		new Answer("смотря где", 0)
	]),

	new Question("рыбы теплые?", 
	[
		new Answer("да", 0),
		new Answer("нет", 1),
		new Answer("не знаю", 0),
		new Answer("не трогал", 0)
	]),
];

//Сам тест
const quiz = new Quiz(1, questions, results);

Update();

//Обновление теста
function Update()
{
	//Проверяем, есть ли ещё вопросы
	if(quiz.current < quiz.questions.length) 
	{
		//Если есть, меняем вопрос в заголовке
		headElem.innerHTML = quiz.questions[quiz.current].text;

		//Удаляем старые варианты ответов
		buttonsElem.innerHTML = "";

		//Создаём кнопки для новых вариантов ответов
		for(let i = 0; i < quiz.questions[quiz.current].answers.length; i++)
		{
			let btn = document.createElement("button");
			btn.className = "button";

			btn.innerHTML = quiz.questions[quiz.current].answers[i].text;

			btn.setAttribute("index", i);

			buttonsElem.appendChild(btn);
		}
		
		//Выводим номер текущего вопроса
		pagesElem.innerHTML = (quiz.current + 1) + " / " + quiz.questions.length;

		//Вызываем функцию, которая прикрепит события к новым кнопкам
		Init();
	}
	else
	{
		//Если это конец, то выводим результат
		buttonsElem.innerHTML = "";
		headElem.innerHTML = quiz.results[quiz.result].text;
		pagesElem.innerHTML = "Очки: " + quiz.score;
	}
}

function Init()
{
	//Находим все кнопки
	let btns = document.getElementsByClassName("button");

	for(let i = 0; i < btns.length; i++)
	{
		//Прикрепляем событие для каждой отдельной кнопки
		//При нажатии на кнопку будет вызываться функция Click()
		btns[i].addEventListener("click", function (e) { Click(e.target.getAttribute("index")); });
	}
}

function Click(index) 
{
	//Получаем номер правильного ответа
	let correct = quiz.Click(index);

	//Находим все кнопки
	let btns = document.getElementsByClassName("button");

	//Делаем кнопки серыми
	for(let i = 0; i < btns.length; i++)
	{
		btns[i].className = "button button_passive";
	}

	//Если это тест с правильными ответами, то мы подсвечиваем правильный ответ зелёным, а неправильный - красным
	if(quiz.type == 1)
	{
		if(correct >= 0)
		{
			btns[correct].className = "button button_correct";
		}

		if(index != correct) 
		{
			btns[index].className = "button button_wrong";
		} 
	}
	else
	{
		//Иначе просто подсвечиваем зелёным ответ пользователя
		btns[index].className = "button button_correct";
	}

	//Ждём секунду и обновляем тест
	setTimeout(Update, 1000);
}
