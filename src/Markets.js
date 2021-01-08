class Markets {

    constructor() {
        this.markets = []
        this.container = document.querySelector('.markets-hand')

        this.lockSlider = false
        this.buttonPrev = document.querySelector('.swiper-button-prev')
        this.buttonNext = document.querySelector('.swiper-button-next')        
    }

    init() {
        this.parseMarkets()

        // this.selectMarket('Аут')
        // this.selectMarket('Не Аут')
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

    parseMarkets() {
        this.markets = []
        const marketsBlockList = this.container.querySelectorAll('.market')
        marketsBlockList.forEach((marketBlock) => {
            this.mapMarket(marketBlock)
        })
    }

    mapMarket(marketBlock) {
        var market = {}

        market.name = marketBlock.querySelector('.market-title .bbb').innerText.replace(/(\r\n|\n|\r)/gm," "),
        market.coefficient = marketBlock.querySelector('.market-coeff').innerText

        this.markets.push(market)

        return market
    }
}