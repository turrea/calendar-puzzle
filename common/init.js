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