const stocks = ['AAPL' ,'MSFT' ,'GOOGL' ,'AMZN' ,'PYPL' ,'TSLA' ,'JPM' ,'NVDA', 'NFLX', 'DIS'];
const stockStatsDataUrl = "https://stocks3.onrender.com/api/stocks/getstockstatsdata";


async function getStockData(stockName){
    try{
        const result = await fetch(stockStatsDataUrl);
        const data = await result.json();
        const bookValue = data.stocksStatsData[0][stockName].bookValue;
        const profit = data.stocksStatsData[0][stockName].profit;
        return {bookValue, profit};
    }catch(error){
        console.error(error);
    }
}

async function renderList(){
    const listSectionEl = document.querySelector('.list-section');
    for(let stock of stocks){
        getStockData(stock).then(({bookValue, profit}) => {
            const listSectionItemEl = document.createElement('div');
            listSectionItemEl.classList.add('list-section-item');
            listSectionItemEl.innerHTML = `
            <div id="button">
                <button>${stock}</button>
            </div>
            <div style="color: white; margin-right: 12px; font-size: large; font-weight: bold;" id="bookV">
                <span>$ ${bookValue.toFixed(2)}</span>
            </div>
            <div style="color: white; font-size: large; font-weight: bold;" id="profit">
                <span>${profit.toFixed(2)}%</span>
            </div>
            `
            listSectionEl.appendChild(listSectionItemEl);
        });
    }
}

renderList();

