(function($){
    'use strict';

    var oneHourInMs = 1000 * 60 * 60;

    function getToday(){
        var now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    //offset is either CalendarEvent.start or CalendarEvent.end
    //dateObj is optional date object that can be passed in to use instead of new Date(), not currently used though
    function getCalendarEventDate(offset, dateObj){
        var now = dateObj || new Date(),
            today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        return new Date(today.getTime() + CalendarEvent.baseStartOfDay + offset * 60 * 1000);
    }

    //converts number to left zero padded string
    function zeroPad(num){
        return (num < 10 ? "0" + num.toString() : num.toString());
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

    function Calendar(element, options){
        this.element = $(element);
        this.options = options;
        this.events = [];
        this.currentDay = getToday();

        for(var i=0, eventsLength=options.events.length; i<eventsLength; i++){
            this.events.push(new CalendarEvent(options.events[i]));
        }

        this.init();
    }

    Calendar.prototype.init = function(){
        this.element.html('');
        this.renderTimeSlots();
        this.renderEventsContainer();
    };

    Calendar.prototype.renderTimeSlots = function(){
        var self = this,
            timeSlotsEle = $('<ul>').addClass('time-slots'),
            timeIndexInMs = this.currentDay.getTime() + this.options.startOfDay * 60 * 60 * 1000,
            endOfDayInMs = this.currentDay.getTime() + this.options.endOfDay * 60 * 60 * 1000,
            timeIncrementInMs = this.options.timeIncrement * 60 * 1000,
            addRow = function(timeInMs){
              var timeSlotEle = $('<li>').addClass('time-slot'),
                  currentDate = new Date(timeInMs),
                  currentHour = currentDate.getHours(),
                  timeWrapEle = $('<span>').addClass('time-wrap'),
                  timeEle = $('<span>').addClass('time'),
                  ampmEle = $('<span>').addClass('ampm');

                if(self.options.timeFormat === 'standard') {
                    ampmEle.append(currentHour > 11 ? 'pm' : 'am');

                    if(currentHour === 0) {
                        currentHour = 12;
                    }
                    else if (currentHour > 12){
                        currentHour -= 12;
                    }
                }

                //append time to timeEle
                timeEle.append(currentHour + ':' + zeroPad(currentDate.getMinutes()));

                //append time and ampm to timewrap
                timeWrapEle.append(timeEle).append(ampmEle);

                //append timewrap to timeslot
                timeSlotEle.append(timeWrapEle);

                //add new timeslot
                timeSlotsEle.append(timeSlotEle);
            };

        //starting at base time, we want to have row for each increment
        while(timeIndexInMs <= endOfDayInMs) {
            addRow(timeIndexInMs);
            timeIndexInMs += timeIncrementInMs;
        }

        //add timeslots to calendar element
        this.element.append(timeSlotsEle);
    };

    Calendar.prototype.renderEventsContainer = function(){
        var eventsContainer = $('<div>');
        eventsContainer.addClass('events');
        this.element.append(eventsContainer);
    };


    ////////////////////

    //setup the jQuery plugin
    $.fn.calendarPuzzle = function(options){

        //merge passed in options with default options into new object
        options = $.extend({}, $.fn.calendarPuzzle.defaults, options);

        return this.each(function(){
            $(this).addClass('calendar-puzzle');

            //create calendar object and store it in element's data, to maintain reference for potential use later
            $(this).data('calendarPuzzle', new Calendar(this, options));
        });

    };

    $.fn.calendarPuzzle.defaults = {
        events: [],
        startOfDay: 9, //hours
        endOfDay: 21, //hours
        timeIncrement: 30, //minutes
        timeFormat: 'standard' //standard or military
    };


})(jQuery);