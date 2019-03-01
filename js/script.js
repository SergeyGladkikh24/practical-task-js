window.onload = () =>{

	var categoryList = ['id', 'firstName', 'lastName', 'email', 'phone']; //список заголовков таблицы
	var nowPage = 1; // активная страница;
	var amountData = 20; //  количество строк таблицы данных на странице;
	var arrData; // массив данных;
	var showList; // массив данных который отображается на 1-ой странице;
	var searchData; // массив который будем перебирать в функции поиска;

	$('.btn_load.first').on('click',startLoadFirst);
	$('.btn_load.second').on('click',startLoadSecond);
	$('.btn_prev').on('click', prevPage);
	$('.btn_next').on('click', nextPage);
	$('.search__btn').on('click', funcSearch);
	$('.search__input').on('keypress',funcSearch);


	// Функция 1-ой(1000чел) кнопки передает в функцию getData url

	function startLoadFirst(){
		$('.btn_load.second').off('click',startLoadSecond);
		var url = 'http://www.filltext.com/?rows=1000&id={number|1000}&firstName={firstName}&delay=3&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&adress={addressObject}&description={lorem|32}';
		getData(url);

	}


	// Функция 2-ой(32 чел) кнопки передает в функцию getData url

	function startLoadSecond(){
		$('.btn_load.first').off('click',startLoadSecond);
		var url = 'http://www.filltext.com/?rows=32&id={number|1000}&firstName={firstName}&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&adress={addressObject}&description={lorem|32}';
		getData(url);
	}


	//Функция принимает url и загружает по средствам ajax данные с сервера

	function getData(url){
		$.ajax({
			url: url,
			type:'GET',
			beforeSend:funcBefore,
			success:funcSuccess
		}).catch(function(err){
		console.error('Ошибка!Невозможно загрузить данные.',err);
		$('.sort-data__loading').css('display','none');
		$('.sort-data_error').html('Ошибка при загрузке данных с сервера');

		});
	}


	// Функция показывает процесс загрузки данных(progress-bar)

	function funcBefore(){
		$('.sort-data__loading ').css('display','block');
	}


	// Функция по завершению загрузки принимает данные с сервера в формате объекта и передает их функции которая создает таблицу с данными

	function funcSuccess(data){
		$('.sort-data_error').css('display','none');
		$('.sort-data__loading').css('display','none');
		$('.btn_load').css('display','none');
		searchData = data;
		arrData = searchData;

		createTable(arrData);
	}


	// Функция принимает данные и строит таблицу

	function createTable(arr,page){
		var elemsHTML = "<thead><tr class='sort-data__table-row'>";
		var newElem;

		showList = [];

		if(!page || page < 1){
			nowPage = 1;
		} else if(page > numPages()) {
			nowPage = numPages();
		}

		for (var i = (nowPage - 1) * amountData; i < nowPage * amountData && i < arr.length; i++) {
		    if (!arr[i]){
		    	break;
		    } else{
		    	 showList[i] = arr[i];
		    }
	  	}


	  	// Создаем заголовки таблицы

	  	for(var j = 0; j < categoryList.length; j++){
	  		newElem = "<td class=' sort-data__table-cell sort-data__table-cell_head'>" + categoryList[j] + "</td>";
	  		elemsHTML += newElem;
	  	}
	  	elemsHTML += "</tr></thead><tbody>";


	  	// Создание таблицы с данными в ячейках

	  	for(var k = 0; k < showList.length; k++){
	  		elemsHTML += "<tr class='sort-data__table-row'>";
    		newElem = '';

    		for(var key in showList[k]){
    			if (showList[k].hasOwnProperty(key)) { // Проверяем содержит ли элемент указанное значение

			        if ($.inArray(key, categoryList) !== -1) { // Метод проверяет наличие заданного элемента в массиве и возвращает индекс 
			          newElem += "<td class='sort-data__table-cell'>" + showList[k][key] + "</td>";
			        }
			    }

    		}

    		 elemsHTML += newElem + "</tr>";
	  	}

	  	elemsHTML += "</tbody>";

	  	// Вывод таблицы на экран браузера

	  	$('.sort-data__search, .sort-data__nav, .sort-data__view').removeClass('hide');
	  	$('.sort-data__table').html(elemsHTML);
  		$('.sort-data__page-number').html(nowPage + ' / ' + numPages());
  		$("tbody .sort-data__table-cell").on('click', showInfoWindow);
  		$(".sort-data__table-cell_head").on('click', sortData);
  		
  		$('.btn_load.first').on('click',startLoadFirst);
		$('.btn_load.second').on('click',startLoadSecond);

  		changeBtnState();



	}

	// Функция изменяет состояние кнопок пагинации

	function changeBtnState(){

		var buttonNext = $('.btn_next');
		var buttonPrev = $('.btn_prev');

		if(nowPage == 1){
			buttonPrev.attr('disabled','disabled');
		} else {
			buttonPrev.removeAttr('disabled');
		}

		if(nowPage == numPages()){
			buttonNext.attr('disabled','disabled');
		} else {
			buttonNext.removeAttr('disabled');
		}
	}


	// Функция генерирует колличество страниц 

	function numPages() {
 	 return Math.ceil(arrData.length / amountData);
	}

	// Функции настройки переключения страниц

	function prevPage(){
		if(nowPage > 1){
			nowPage--;
			createTable(arrData,nowPage);
		}
	}

	function nextPage(){
		if(nowPage < numPages()){
			nowPage++;
			createTable(arrData,nowPage);
		}
	}

	// Функция вывода информации о человеке в отдельном окне внизу

	function showInfoWindow(){
		var ind = $(this).parent().index();

		$('.contact__name').html(showList[ind].firstName + ' ' + showList[ind].lastName);
		$('.contact__descr').html(showList[ind].description);
		$('.contact__address').html(showList[ind].adress.streetAddress);
		$('.contact__city').html(showList[ind].adress.city);
		$('.contact__state').html(showList[ind].adress.state);
		$('.contact__index').html(showList[ind].adress.zip);
	}

	// Функция сортирует данные в таблице

	function sortData(){
		var index = $(this).index();

		if($(this).hasClass('increase')){
			$(this).removeClass('increase');
			arrData.reverse();
			createTable(arrData);
			return $($('.sort-data__table-cell_head')[index]).addClass('decrease');
		}

		var ind = categoryList[index];

		var sortArr = arrData.sort(sortFunc);

		function sortFunc(a,b){
			if(a[ind] > b[ind]){
				return 1;
			} else if (a[ind] === b[ind]){
				return 0;
			} else {
				return -1;
			}
		}

		createTable(sortArr);
		$($('.sort-data__table-cell_head')[index]).addClass('increase');

	}


	// Функция поиска по данным таблицы

	function funcSearch(event){
		if(event.type == 'click' || event.keyCode == 13){
			var value = $('.search__input').val();
			var newObj = [];
			arrData = [];
			for(var i = 0; i < searchData.length; i++){
				var obj = searchData[i];
				var transformArr = [obj.id, obj.firstName, obj.lastName, obj.email, obj.phone].join(' ');
				var index = transformArr.indexOf(value);
				if(index !== -1){
					newObj.push(obj);
				} 
			}

			if(newObj.length === 0){
				nowPage = 1;
   				$(".sort-data__table").html('<tr><td>Нет совпадений</tr></td>');
			} else {
				arrData = newObj;
				createTable(arrData);
			}
		}
	}	
}
//# sourceMappingURL=script.js.map
