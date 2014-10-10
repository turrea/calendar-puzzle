(function($){
    'use strict';

    var oneHourInMs = 1000 * 60 * 60;

    //offset is either CalendarEvent.start or CalendarEvent.end
    //dateObj is optional date object that can be passed in to use instead of new Date(), not currently used though
    function getCalendarEventDate(offset, dateObj){
        var now = dateObj || new Date(),
            today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        return new Date(today.getTime() + CalendarEvent.baseStartOfDay + offset * 60 * 1000);
    }

    ////////////////////

    function CalendarEvent(obj){
        this.start = obj.start || 0;
        this.end = obj.end || 0;
        this.position = { x:0, y:0 }

        //using javascript object property getter instead of separate method
        Object.defineProperty(this, "startDate", {
            get: function(){
                return getCalendarEventDate(this.start);
            }
        });

        Object.defineProperty(this, "endDate", {
            get: function(){
                return getCalendarEventDate(this.end);
            }
        });
    }

    CalendarEvent.baseStartOfDay = oneHourInMs * 9; //9AM

    ////////////////////

    function Calendar(options){
        this.events = options.events || [];

        for(var i=0, eventsLength=this.events.length; i<eventsLength; i++){

        }
    }

    ////////////////////

    //setup the jQuery plugin
    $.fn.calendarPuzzle = function(options){
        var defaults = {
            events: []
        };

        options = $.extend({}, defaults, options);

        this.addClass('calendar-puzzle');

        //create calendar object and store it in element's data, to maintain reference for potential use later
        this.data('calendarPuzzle', new Calendar(options));

        return this;
    };


})(jQuery);