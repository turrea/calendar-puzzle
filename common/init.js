//layOutDay is placed on global scope, but nothing defined within will be,
//deps: jQuery

layOutDay = (function($){

    function layOutDay(events, element){
        events = events || [];

        if(typeof element === 'string'){
            element = $(element);
        }

        element = element || $('#calendar');

        if(element.length === 0){
            throw "No container element specified or no element with ID \"calendar\" specified."
        }

        $(element).calendarPuzzle({ events: events });
    }

    return layOutDay;

})(jQuery);

test = (function(){

    var events = [
        { start:30, end:150 },
        { start: 150, end:180 },
        { start: 720, end: 750 }
    ];

    function test(){
        layOutDay(events);
    }

    return test
})();