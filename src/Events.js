class Events {

    constructor() {
        this.events = []
        this.container = document.querySelector('#event-log')
    }

    init() {
        this.parseEvents()
        this.watchEvents()
    }

    parseEvents() {
        const eventsBlockList = this.container.querySelectorAll('.event-log-item')
        eventsBlockList.forEach(eventBlock => {
            this.mapEvent(eventBlock)
        })
    }

    watchEvents() {
        var self = this

        new MutationObserver(function(mutations) {
            mutations.forEach(mutation => {
                if(mutation.type === 'childList') {
                    mutation.addedNodes.forEach(eventBlock => {
                        var event = self.mapEvent(eventBlock)

                        if(event.name != undefined) {
                            // Process betting                           
                        }
                    });
                }
            });
        }).observe(this.container, { 
            childList: true
        });
    }

    mapEvent(eventBlock) {        
        let event = {}

        if(eventBlock.querySelector('.custom-event-log-item') == null) {
            let eventInfo = eventBlock.querySelectorAll('.event-log-item-part:not(.--separator)');

            if(eventInfo[0].classList.contains('home')) {
                event.name = eventInfo[0].innerText
                event.time = eventInfo[1].innerText
                event.team = 'home'
            }

            if(eventInfo[0].classList.contains('away')) {
                event.name = eventInfo[1].innerText
                event.time = eventInfo[0].innerText
                event.team = 'away'
            }

            this.events.push(event)
        }

        return event
    }
}