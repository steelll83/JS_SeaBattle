var seabattle = {
	// игровое поле
	field: [],

	// значение тгрового поля по умолчанию
	size: 10,

	// функция ввода размера поля и проверкой размера в пределах от 10 до 100,
	// если вне диапазона выводит ошибку и после этого запрашивает размер снова
	init: function () {
		this.size = parseInt( prompt('Enter fieldsize (10 to 100)', 10));
		if ((this.size < 10) || (this.size > 100)){  //проверка, что поле в допустимых размерах от 10 до 100
			alert('Error fieldsize, please enter valid size');
			this.init(); //после вывода сообщения об ошибке снова запрашиваем ввод поля
		}
		for (var i = 0; i < this.size; i++) {
			this.field[i] = [];
			for (var j = 0; j < this.size; j++) {
				this.field[i].push({chip: false, opened: false, msg: 'Miss!'});
			}
		}
	},

	// функция установки корабля в одну ячейку
	putChip: function (x, y) {
		if (!this.validate(x, y)) return;  // проверяем, а вдруг мы обратились к неуществующе ячейке,
		this.field[x][y].chip = true;  // указывает в ячейке что тут корабль
	},

	// функция остановки многопалубного корабля
	putChipFull: function (x, y, lon, direct) { // x,y - координаты начала, long - длинна корабля, dir =0 - горизонтальный, dir=1 - вертикальный
		if (!this.validate(x, y)) return;  // проверяем, а вдруг мы обратились к неуществующе ячейке,
		//проверка, что  длинна корабля не более 5
		if (lon < 1 || lon > 5){
			alert('Error Ship Size');
		}
		//проверка, что  код ориентации нормальный
		if (direct > 1) {
			alert('Error Ship Direction');
		}
		// проверка, а влезет ли корабль?
		if (direct == 0 && x+lon > this.size-1) {
			alert('Not enought space to put Ship');
		}
		if (direct == 1 && y+lon > this.size-1) {
			alert('Not enought space to put Ship');
		}

		//проверка, а не стоит ли рядом корабль
		if (x != 0) {
			if (this.field[x-1][y].chip == true) {
				alert('Nearby ship already exists')
			}
		}
		if (x != this.size-1) {
			if (this.field[x+1][y].chip == true) {
				alert('Nearby ship already exists')
			}
		}
		if (y != 0) {
			if (this.field[x][y-1].chip == true) {
				alert('Nearby ship already exists')
			}
		}
		if (y != this.size-1) {
			if (this.field[x][y+1].chip == true) {
				alert('Nearby ship already exists')
			}
		}

		// устанавливаем корабль в зависимости от условий
		if (direct==0) { // горизонтальный
			for (var i = 0; i <= lon; i++) {
				this.putChip(x+i, y)
			}
		}
		else { // вертикальный
			for (var i = 0; i <= lon; i++) {
				this.putChip(x, y+i)
			}
		}

	},

	// установка сообщения клетке (но зачем она нужна?)
	setMsg: function (x, y, message) {
		if (!this.validate(x, y)) return;  // проверяем, а вдруг мы обратились к неуществующе ячейке,
		this.field[x][y].msg = message; // задает указанной клетке сообщение
	},

	// функция выстрела, обращения к ячейке: если пустая - выдаем "Мимо", иначе выдаем или "ранил" или "убил"
	hit: function (x, y) {
		if (!this.validate(x, y)) return;  // проверяем, а вдруг мы обратились к неуществующе ячейке,
		if (this.field[x][y].opened == true) {
			alert('You hit in this area again');
		}
		if (this.field[x][y].chip == false) {
			alert('Miss!'); //если тут корабля не оказалось - выдаем "Промазал"
		}
		else {
			alert (this.hitOrDestroy(x, y)); //если тут есть корабль вызываем функцию проверки и выдачи сообщения "ранил"" или "убил"
		}

		this.field[x][y].opened = true; // задает что по этой ячейке стреляли
		if (this.hasChips() == false) { //если нет пустых леток, т.е. все корабли подбиты
			alert('Game over')
		}
	},

	// функция проверки остались ли еще корабли
	hasChips: function () { // проходит весь массив и проверет, есть ли элементы
		for (var i = 0; i < this.size; i++) {
			for (var k = 0; k< this.size; k++) {
				if (this.field[i][k].opened == false) {
					return true;
				}
			};
		};
		return false;
	},

	// функция проверки и выдачи сообщения "ранил" или "убил"
	hitOrDestroy: function (x, y) {
		msg1 = 'Ship Destroyed!';
		for (var i = 1; i <= 4; i++) {
			if (x-i < 0) {break;} // дошли до края поля, слева ничего нет. больше ничего не проверяем
			if (this.field[x-i][y].chip == false)  {break;} //в клетке слева нет корабля, больше ничего слева не проверяем
			if (this.field[x-i][y].opened == false) {continue;} // в клетку слева еще не стреляли, проверяем следующую слева, вдруг там есть корабль, в который попадали
			else {msg1 = 'Ship Hit, but not Destroyed';}
		}

		for (var i = 1; i <= 4; i++) {
			if (x+i > this.size-1) {break;} // дошли до края поля, справа ничего нет. больше ничего не проверяем
			if (this.field[x+i][y].chip == false)  {break;} //в клетке справа нет корабля, больше ничего справа не проверяем
			if (this.field[x+i][y].opened == false) {continue;} // в клетку справа еще не стреляли, проверяем следующую справа, вдруг там есть корабль, в который попадали
			else {msg1 = 'Ship Hit, but not Destroyed';}
		}

		for (var i = 1; i <= 4; i++) {
			if (y-i < 0) {break;} // дошли до края поля, снизу ничего нет. больше ничего не проверяем
			if (this.field[x][y-i].chip == false)  {break;} //в клетке снизу нет корабля, больше ничего снизу не проверяем
			if (this.field[x][y-i].opened == false) {continue;} // в клетку снизу еще не стреляли, проверяем следующую снизу, вдруг там есть корабль, в который попадали
			else {msg1 = 'Ship Hit, but not Destroyed';}
		}

		for (var i = 1; i <= 4; i++) {
			if (y+i > this.size-1) {break;} // дошли до края поля, сверху ничего нет. больше ничего не проверяем
			if (this.field[x][y+i].chip == false)  {break;} //в клетке сверху нет корабля, больше ничего сверхуне проверяем
			if (this.field[x][y+i].opened == false) {continue;} // в клетку сверху еще не стреляли, проверяем следующую сверху, вдруг там есть корабль, в который попадали
			else {msg1 = 'Ship Hit, but not Destroyed';}
		}
		return (msg1);
	},

	//функция проверки адекватности обращения к клетке
	validate: function (x, y) { // проверяет существует ли вообще такая ячейка, может поле игровое меньше
		return (typeof this.field[x][y] !== 'undefined')  //!== это строгая проверка
	}
}

seabattle.init();
seabattle.putChipFull(5,5,3,1)
