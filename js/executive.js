/**
 * Created by Victoria on 01.08.2014.
 */

'use strict';

//jQuery-solution
/*$.getJSON('js/competitors.json', function(competitors){
    console.log(competitors);
});*/

getJSON('js/competitors.json', mainExecutiveFunction);

function getJSON(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onreadystatechange = function(){
        if (this.readyState === 4) {
            if (this.status === 200) {
                callback(JSON.parse(this.responseText));
            }
            //else network error
        }
    };
    xhr.send(null);
}

function mainExecutiveFunction(data){
    var sortedArray;
    if (data.hasOwnProperty('competitors') && Array.isArray(data.competitors)) {
        createTableForArray(data.competitors);
        sortedArray = getSortedArrayOfObjects(data.competitors, sortByCityNameArlington);
        sortedArray = getSortedArrayOfObjects(sortedArray, sortByRoomCountGreater, [250]);
        sortedArray.sort(sortByStarIdAndState);

        createTableForArray(sortedArray).className = 'sorted';
    }
}

function createTableForArray(array) {
    var domRows = [], table, th, propertyNames;

    propertyNames = Object.getOwnPropertyNames(array[0]).sort();

    table = document.createElement('table');

    for (var i = 0; i <= array.length; i++) { //creating row for every element of array
        domRows[i] = document.createElement('tr');
        table.appendChild(domRows[i]);
    }
    document.body.appendChild(table);

    for (i = 0; i < propertyNames.length; i++) {
        th = document.createElement('th');
        th.innerHTML = propertyNames[i];
        domRows[0].appendChild(th);
        forEachCompetitor.call(array, createCellForProperty, propertyNames[i], domRows);
    }
    return table;
}

function forEachCompetitor(someFunction, property, rows){
    if(Array.isArray(this)){
        for(var i = 0; i < this.length; i++){
            someFunction.call(this[i], property, rows[i+1]);
        }
    }
}

function createCellForProperty(property, row){
    var domCell = document.createElement('td');
    domCell.innerHTML = this[property];
    row.appendChild(domCell);
}

function getSortedArrayOfObjects(array, comparatorFunc, compFuncArgs){
    var sortedArray = [];
    if(Array.isArray(array)){
        for(var i = 0; i < array.length; i++){
            if(comparatorFunc.apply(array[i], compFuncArgs)){
                sortedArray.push(array[i]);
            }
        }
    }
    return sortedArray;
}

function sortByCityNameArlington(){
    if(this instanceof Object && this.hasOwnProperty('cityName')){
        return (this.cityName === 'Arlington');
    }
}

function sortByRoomCountGreater(numberRoom){
    if(this instanceof Object && this.hasOwnProperty('roomCount')){
        return (this.roomCount >= numberRoom);
    }
}

function sortByStarIdAndState(obj1, obj2){
    if(obj1.hasOwnProperty('starId') && obj2.hasOwnProperty('starId') &&
       obj1.hasOwnProperty('state') && obj2.hasOwnProperty('state')){

        if (parseInt(obj1['starId'], 10) === parseInt(obj2['starId'], 10)){
            return ( obj1['state'].localeCompare(obj2['state']) );
        }
        return parseInt(obj1['starId'], 10) >= parseInt(obj2['starId'], 10);
    }
}