var initialBalance = 0
var bettingEnabled = true

document.onreadystatechange = function () {
    if (document.readyState === 'complete') {
        const loading = setInterval(function() {
            if(document.querySelector('.main-screen') != null) {
                clearInterval(loading);

                const eventsLoader = new Events();
                const marketsLoader = new Markets();

                eventsLoader.init();
                marketsLoader.init();

                initialBalance = parseFloat(document.querySelector('.balance__state').querySelector('.anim-num').innerText)
                events(marketsLoader);
                // document.addEventListener('app.events.new', function(e) { 
                //     var event = e.detail.event
                // })                

                match();
                bets();
            }
        }, 100)
    }
}

var matchInfo = {};

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

function events(marketsLoader) {
    document.addEventListener('app.events.new', function(e) { 
        var event = e.detail.event

        if(lockPendingBet) {
            console.log('clear pending bet')
            clearInterval(betInterval)
            lockPendingBet = false
        }

        console.log(event);

        var nextBet = '';
        if(event.name == 'Аут') {
            nextBet = 'Аут'; 
        } else {
            nextBet = 'Не Аут'; 
        }

        marketsLoader.selectMarket(nextBet)

        // if (currentStreak == nextBet) {
        //     currentStreakCount++;
        // } else {
        //     currentStreak = nextBet;
        //     currentStreakCount = 1;
        // }
        
        // console.log(currentStreak, currentStreakCount);

        // if(
        //     (
        //         nextBet == 'Аут' 
        //         // && currentStreakCount < 2
        //     ) || (
        //         nextBet == 'Не Аут' 
        //         // && currentStreakCount < 5
        //     )
        // ) {
            var betting = setInterval(function() {
                if (!marketsLoader.lockSlider) {
                    makeBet(nextBet, marketsLoader);
                    clearInterval(betting);
                }
            }, 200);
        // }

        var currentBalance = parseFloat(document.querySelector('.balance__state').querySelector('.anim-num').innerText)
        console.log(currentBalance, initialBalance)
        console.log(currentBalance - initialBalance)

        if(currentBalance - initialBalance < -30) {
            bettingEnabled = false
            console.log('turn off betting')
        }
    })
}

var lockPendingBet = false
var betInterval = null

function makeBet(nextBet, marketsLoader) {
    if(lockPendingBet) {
        clearInterval(betInterval)
        lockPendingBet = false
    }

    lockPendingBet = true
    betInterval = setInterval(function() {
        if(document.querySelector('.disabled_hand') == null){
            if(document.querySelector('.markets-hand .market--selected').querySelector('.market-coeff').innerText > 1.5) {
                console.log(document.querySelector('.markets-hand .market--selected').querySelector('.market-coeff').innerText);
    
                clearInterval(betInterval)
                lockPendingBet = false

                marketsLoader.clearBetAmount()
                marketsLoader.selectBetAmount(10)

                if(bettingEnabled) {                    
                    marketsLoader.makeBet()
                } else {
                    console.log('loosing streak')
                    document.querySelector('.all-matches-btn').click()

                    var switchMatch = setInterval(function() {
                        if(document.querySelector('.matches-all') != null) {
                            clearInterval(switchMatch)

                            console.log('next match')
                            document.querySelector('.matches-all').querySelector('.table-matches').querySelector('.table-row.--planned').click()
                        }                        
                    }, 1000)
                }
    
            } else {
                console.log('low coefficient')
            }
        } else {
            console.log('betting  disabled')
        }
    }, 1000)
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

    console.log(payouts - amount);
}

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

//document.querySelector('.all-matches-btn').click()
//document.querySelector('.matches-all').querySelector('.table-matches').querySelector('.table-row').click()
//document.querySelector('.matches-all').querySelector('.table-matches').querySelector('.table-row.--planned').click()
//location.reload()

//document.querySelector('.mtexp-overlay')