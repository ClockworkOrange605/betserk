var matchInfo = {};
var eventsList = [];
var betsList = {};

// chrome.storage.sync.set({
//     settings: {
//         betting: {
//             enabled: false
//         }
//     }
// });

// chrome.storage.onChanged.addListener(function(changes, namespace) {
//     for (var key in changes) {
//       var storageChange = changes[key];
//       console.log('Storage key "%s" in namespace "%s" changed. ' +
//                   'Old value was "%s", new value is "%s".',
//                   key,
//                   namespace,
//                   storageChange.oldValue,
//                   storageChange.newValue);
//     }
// });

document.onreadystatechange = function () {
    if (document.readyState === 'complete') {
        const loading = setInterval(function() {
            if(document.querySelector('.main-screen') != null) {
                clearInterval(loading);

                const eventsLoader = new Events();
                eventsLoader.init();

                match();
                events();
                bets();

                selectBet('Не Аут', 'right');
            }
        }, 100)
    }
}

var selectorLock = null;
function selectBet (market, direction) {
    var prevButton = document.querySelector('.swiper-button-prev');
    var nextButton = document.querySelector('.swiper-button-next');

    if (selectorLock == null) {
        selectorLock = true;
        var selector = setInterval(function() {
            if(document.querySelector('.markets-hand .market--selected').querySelector('.market-title .bbb').innerText.replace(/(\r\n|\n|\r)/gm," ") != market) {
                if(direction == 'left') {
                    prevButton.click();
                } else if (direction == 'right') {
                    nextButton.click();    
                }
            } else {
                clearInterval(selector);
                selectorLock = null;
            }
        }, 50);
    }
}

function match() {
    var infoContainer = document.querySelector('.info-container');
    var scoresContainer = infoContainer.querySelector('.info-score');
    var timeContainer = infoContainer.querySelector('.info-time');    

    matchInfo = 
        {
            teams: {
                home: {
                    name: scoresContainer.querySelector('.team.left').innerText,
                    score: scoresContainer.querySelector('.score.left').innerText
                },
                away: {
                    name: scoresContainer.querySelector('.team.right').innerText,
                    score: scoresContainer.querySelector('.score.right').innerText
                }
            },
            period: {
                name: timeContainer.querySelector('.info-time-left').innerText,
                time: timeContainer.querySelector('.info-time-right').innerText
            }
        }
    ;

    console.log(matchInfo);
}

var currentStreak = '';
var currentStreakCount = 0;

function events() {
    new MutationObserver(function(mutations) {
        mutations.forEach(mutation => {
            if(mutation.type === 'childList') {
                mutation.addedNodes.forEach(item => {
                    if(item.querySelector('.custom-event-log-item') == null) {
                        var event = {};
                        var data = item.querySelectorAll('.event-log-item-part:not(.--separator)');
    
                        if(data[0].classList.contains('home')) {
                            event.name = data[0].innerText;
                            event.time = data[1].innerText
                        } else if(data[0].classList.contains('away')) {
                            event.name = data[1].innerText;
                            event.time = data[0].innerText
                        }

                        console.log(event);
                        eventsList.push(event);
    
                        var nextBet = '';
                        if(event.name == 'Аут') {
                            nextBet = 'Аут'; 
                            selectBet(nextBet, 'left');
                        } else {
                            nextBet = 'Не Аут'; 
                            selectBet(nextBet, 'right');
                        }

                        if (currentStreak == nextBet) {
                            currentStreakCount++;
                        } else {
                            currentStreak = nextBet;
                            currentStreakCount = 1;
                        }
                        
                        console.log(currentStreak, currentStreakCount);

                        if(
                            (
                                nextBet == 'Аут' 
                                // && currentStreakCount < 2
                            ) || (
                                nextBet == 'Не Аут' 
                                // && currentStreakCount < 5
                            )
                        ) {
                            var betting = setInterval(function() {
                                if (selectorLock == null) {
                                    makeBet(nextBet);
                                    bets();
                                    clearInterval(betting);
                                }
                            }, 200);
                        }
                    }                    
                });
            }
        });
    }).observe(document.getElementById('event-log'), { 
        attributes: true, childList: true, subtree: true 
    });
}

function makeBet(nextBet) {
    if(document.querySelector('.disabled_hand') == null){
        console.log(document.querySelector('.markets-hand .market--selected').querySelector('.market-title .bbb').innerText.replace(/(\r\n|\n|\r)/gm," "));
        if(document.querySelector('.markets-hand .market--selected').querySelector('.market-title .bbb').innerText.replace(/(\r\n|\n|\r)/gm," ") == nextBet) {
            console.log(document.querySelector('.markets-hand .market--selected').querySelector('.market-coeff').innerText);
            if(document.querySelector('.markets-hand .market--selected').querySelector('.market-coeff').innerText > 1.5) {
                document.querySelector('.clear-btn').click();
                document.querySelectorAll('.chips-money .hand-bet-chip')[0].click();
                // document.querySelectorAll('.chips-money .hand-bet-chip')[0].click();
                // document.querySelector('.place-btn').click() //place bet
            } else {
                console.log('low coefficient')
            }
        } else {
            console.log('wrong market')
        }
    } else {
        console.log('betting  disabled')
    }
}

function bets() {
    var betHistoryContainer = document.querySelector('.history-container');
    var betList = betHistoryContainer.querySelectorAll('.match-history .simplebar-wrapper .table-content-container > div');

    var amount = 0;
    var payouts = 0;
    betList.forEach(betItem => {
        amount += parseFloat(betItem.querySelector('.table-row-item.--currency').innerText);
        payouts += Number.isNaN(parseFloat(betItem.querySelector('.table-row-item.--payout').innerText.replace(/^\D+/g, ''))) ?
            0 : parseFloat(betItem.querySelector('.table-row-item.--payout').innerText.replace(/^\D+/g, ''));
    });

    // console.log(amount, payouts);
    console.log(payouts - amount);

    if(payouts - amount > 30) { betDisabled = true };
}


//document.querySelector('.all-matches-btn').click()
//document.querySelector('.matches-all').querySelector('.table-matches').querySelector('.table-row').click()
//document.querySelector('.matches-all').querySelector('.table-matches').querySelector('.table-row.--planned').click()
//location.reload()