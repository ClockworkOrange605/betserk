document.onreadystatechange = function () {
    if (document.readyState === 'complete') {
        const loading = setInterval(function() {
            if(document.querySelector('.main-screen') != null) {
                clearInterval(loading);

                const eventsLoader = new Events();
                const marketsLoader = new Markets();

                eventsLoader.init();
                marketsLoader.init();

                document.addEventListener('app.events.new', function(e) { 
                    var event = e.detail.event
                    
                })

                events(marketsLoader);

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
                    bets();
                    clearInterval(betting);
                }
            }, 200);
        // }
    })
}

function makeBet(nextBet, marketsLoader) {
    if(document.querySelector('.disabled_hand') == null){
        // console.log(document.querySelector('.markets-hand .market--selected').querySelector('.market-title .bbb').innerText.replace(/(\r\n|\n|\r)/gm," "));
        // if(document.querySelector('.markets-hand .market--selected').querySelector('.market-title .bbb').innerText.replace(/(\r\n|\n|\r)/gm," ") == nextBet) {
            console.log(document.querySelector('.markets-hand .market--selected').querySelector('.market-coeff').innerText);
            if(document.querySelector('.markets-hand .market--selected').querySelector('.market-coeff').innerText > 1.5) {

                marketsLoader.clearBetAmount()
                marketsLoader.selectBetAmount(10)
                marketsLoader.makeBet()

            } else {
                console.log('low coefficient')
            }
        // } else {
            // console.log('wrong market')
        // }
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