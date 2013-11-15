http://rawgithub.com/sameoldmadness/6-api-and-markup/master/index.html

# Работа с API, верстка и анимации

Ваша задача — реализовать страницу с динамическим отображением результатов запроса к API «Популярных» Яндекс.Фоткок.

В качестве исходных данных — коллекция популярных фоток в формате JSON, полученных из API 
по запросу: [api-fotki.yandex.ru/api/top/?format=json](http://api-fotki.yandex.ru/api/top/?format=json).

На основе обработанного ответа требуется динамически построить «простыню» картинок аналогичную 
результатам поиска по Яндекс.Картинкам (например: [images.yandex.ru/yandsearch?text=котята&stype=image&lr=54&noreask=1&source=wiz](http://images.yandex.ru/yandsearch?text=котята&stype=image&lr=54&noreask=1&source=wiz)).
При наведении на фотографию аналогичным образом должен показываться заголовок фотографии, информация об авторе со ссылкой 
на его страницу на сервисе Фоток, отформатированная дата публикации, а так же ссылка на оригинал.
По клику на фото в виде «раздвижных дверей» открывается фото в более крупном формате с возможностью навигации 
«влево-вправо» (как в Яндексах.Картинках).

В дополнение к основному заданию вы можете реализовать:
* выпадающий список для перехода к более крупным вариантам фотографии, если таковые есть
* постраничную навигацию
* хоткеи ← / → / esc / ctrl+← / ctrl+→
* возможность переключения с просмотра «Популярных» фотографий на «фото дня» или на «новые интересные фотографии»

Документация:
* [Постраничная выдача коллекций](http://api.yandex.ru/fotki/doc/operations-ref/collection-partial-lists.xml)
* [Получение коллекции популярных фотографий](http://api.yandex.ru/fotki/doc/operations-ref/top-photos-get.xml)
* [Получение коллекции «Фото дня»](http://api.yandex.ru/fotki/doc/operations-ref/day-photos-get.xml)
* [Получение коллекции новых интересных фотографий](http://api.yandex.ru/fotki/doc/operations-ref/interesting-photos-get.xml)
