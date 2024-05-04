const stocks = ['AAPL' ,'MSFT' ,'GOOGL' ,'AMZN' ,'PYPL' ,'TSLA' ,'JPM' ,'NVDA', 'NFLX', 'DIS'];
const stockStatsDataUrl = "https://stocks3.onrender.com/api/stocks/getstockstatsdata";
const stockSummaryUrl = "https://stocks3.onrender.com/api/stocks/getstocksprofiledata";
const chartDataUrl = "https://stocks3.onrender.com/api/stocks/getstocksdata";
let stock;
renderSummary(stocks[0]);
createChart('5y',stocks[0]);

async function createChart(timeFrame, stockName){
    try {
        stock = stockName;
        const result = await fetch(chartDataUrl);
        const data = await result.json();
        const extractedData = data.stocksData[0][stockName][timeFrame];
        const values = extractedData.value;
        const timeStamps = extractedData.timeStamp;
        const newTime_stamp = timeStamps.map((data)=>{
            return new Date(data*1000).toLocaleString();
        });
        const trace = {
            x: newTime_stamp,
            y: values,
            type: 'scatter',
            mode: 'lines',
            marker: { color: 'green' },
            hoverinfo: 'y+text',
            text: newTime_stamp
        };
    
        // Define layout options for the chart
        const layout = {
            xaxis: {
                showticklabels: false // Hide tick labels on the x-axis
            },
            yaxis: {
                // title: 'Y Axis',
                showticklabels: false // Hide tick labels on the y-axis
            },
            plot_bgcolor: 'rgb(1 1 102);',
            margin: {
                l: 0,
                r: 0,
                t: 0,
                b: 0
            },
            hovermode: 'x',
            hoverdistance: 20,
            shapes: [],
        };
    
        // Plot the chart inside the div with class "chart"
        Plotly.newPlot('chart', [trace], layout);

    } catch (error) {
        console.error(error);
    }
}

document.getElementById('one-month').addEventListener('click', ()=>{
    createChart('1mo', stock);
    renderSummary(stock);
});

document.getElementById('three-months').addEventListener('click', ()=>{
    createChart('3mo', stock);
    renderSummary(stock);
});

document.getElementById('one-year').addEventListener('click', ()=>{
    createChart('1y', stock);
    renderSummary(stock);
});

document.getElementById('five-years').addEventListener('click', ()=>{
    createChart('5y', stock);
    renderSummary(stock);
});

async function getStockSummary(stockName){
    try{
        const result = await fetch(stockSummaryUrl);
        const data = await result.json();
        const summary = data.stocksProfileData[0][stockName].summary;
        return summary;
    }catch(error){
        console.error(error);
    }
}

async function renderSummary(stock, bookV, p){
    const summary = await getStockSummary(stock);
    if(bookV === undefined || p === undefined){
        const {bookValue, profit} = await getStockData(stock);
        bookV = bookValue;
        p = profit;
    }
    const summaryEl = document.querySelector('.summary');
    summaryEl.innerHTML = `
        <div class="summary-heading">
            <span id="stock-name">${stock}</span>
            <span id="bookValue">$${bookV}</span>
            <span id="profit">${p}%</span>
        </div>
        <div class="summary-content">
            <p style="font-size: 'smaller';">
                ${summary}
            </p>
        </div>
    `;

    const bookValueEl = summaryEl.querySelector('#bookValue');
    const profitEl = summaryEl.querySelector('#profit');
    bookValueEl.style.color = 'green';
    if(profit<=0){
        profitEl.style.color = 'red';
    }

}

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
                <span>$${bookValue.toFixed(2)}</span>
            </div>
            <div style="color: white; font-size: large; font-weight: bold;" id="profit">
                <span>${profit.toFixed(2)}%</span>
            </div>
            `
            const profitEl = listSectionItemEl.querySelector('#profit');
            if(profit <= 0){
                profitEl.style.color = 'red';
            }
            listSectionEl.appendChild(listSectionItemEl);
            listSectionItemEl.addEventListener("click", ()=>{
                renderSummary(stock, bookValue, profit);
                createChart('5y', stock);
            });
        });
    }
}

renderList();

