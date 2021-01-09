class Markets {

    constructor() {
        this.markets = []
        this.chips = []
        this.container = document.querySelector('.markets-hand')

        this.lockSlider = false
        this.buttonPrev = document.querySelector('.swiper-button-prev')
        this.buttonNext = document.querySelector('.swiper-button-next')
        
        this.buttonClear = this.container.querySelector('.clear-btn')
        this.buttonMakeBet = this.container.querySelector('.place-btn')
    }

    init() {
        this.parseMarkets()
        this.parseChips()
    }

    selectMarket(market) {
        var self = this

        if (!self.lockSlider) {
            self.lockSlider = true;

            var selector = setInterval(function() {
                var activeMarket = self.container.querySelector('.market--selected')
                    .querySelector('.market-title .bbb').innerText.replace(/(\r\n|\n|\r)/gm," ")

                var activeMarketIndex = self.markets.indexOf(self.markets.find(item => item.name == activeMarket))
                var searchingMarketIndex = self.markets.indexOf(self.markets.find(item => item.name == market))

                if(
                    searchingMarketIndex > activeMarketIndex
                ) {
                    self.buttonNext.click();
                } else if(
                    searchingMarketIndex < activeMarketIndex
                ) {
                    self.buttonPrev.click();    
                } else if(
                    searchingMarketIndex == activeMarketIndex
                ) {
                    clearInterval(selector);
                    self.lockSlider = false;
                }
            }, 50);
        }
    }

    clearBetAmount() {
        this.buttonClear.click()
    }

    selectBetAmount(amount) {
        const chipBlockList = this.container.querySelector('.hand-container')
            .querySelector('.chip-container')
            
        
        if(this.chips.find(chip => chip.value == amount)) {
            this.chips.find(chip => chip.value == amount).selector.click()
        } else {
            console.error(amount, 'wrong bet amount')            
        }        
    }

    makeBet() {
        this.buttonMakeBet.click()
    }

    parseMarkets() {
        this.markets = []
        
        const marketsBlockList = this.container.querySelectorAll('.market')

        marketsBlockList.forEach((marketBlock) => {
            this.mapMarket(marketBlock)
        })
    }

    parseChips() {
        this.chips = []

        const chipsBlockList = this.container.querySelector('.hand-container').querySelector('.chip-container')
            .querySelectorAll('.hand-bet-chip')

        chipsBlockList.forEach((chipBlock) => {
            this.mapChip(chipBlock)
        })
    }

    mapMarket(marketBlock) {
        var market = {}

        market.name = marketBlock.querySelector('.market-title .bbb').innerText.replace(/(\r\n|\n|\r)/gm," "),
        market.coefficient = marketBlock.querySelector('.market-coeff').innerText

        this.markets.push(market)

        return market
    }

    mapChip(chipBlock) {
        var chip = {}
        
        chip.value = parseInt(chipBlock.innerText)
        chip.selector = chipBlock

        this.chips.push(chip)
    }
}