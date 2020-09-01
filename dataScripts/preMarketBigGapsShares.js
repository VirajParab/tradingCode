const request = require("request")

// var url = "https://howutrade.in/snapdata/?data=PreOpen_ALL_05Sep2018&export=csv"
let baseURL = "https://howutrade.in/snapdata/?data=PreOpen_ALL_"

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const futureStocks = ["ACC", "ADANIENT", "ADANIPORTS", "AMARAJABAT", "AMBUJACEM", "APOLLOHOSP", "APOLLOTYRE", "ASHOKLEY", "ASIANPAINT", "AUROPHARMA", "AXISBANK", "BAJAJ", "BAJFINANCE", "BAJAJFINSV", "BALKRISIND", "BANDHANBNK", "BANKNIFTY", "BANKBARODA", "BATAINDIA", "BERGEPAINT", "BEL", "BHARATFORG", "BHEL", "BPCL", "BHARTIARTL", "INFRATEL", "BIOCON", "BOSCHLTD", "BRITANNIA", "CADILAHC", "CANBK", "CHOLAFIN", "CIPLA", "COALINDIA", "COFORGE", "COLPAL", "CONCOR", "CUMMINSIND", "DABUR", "DIVISLAB", "DLF", "DRREDDY", "EICHERMOT", "ESCORTS", "EXIDEIND", "FEDERALBNK", "GAIL", "GLENMARK", "GMRINFRA", "GODREJCP", "GODREJPROP", "GRASIM", "HAVELLS", "HCLTECH", "HDFCBANK", "HDFCLIFE", "HEROMOTOCO", "HINDALCO", "HINDPETRO", "HINDUNILVR", "HDFC", "ITC", "ICICIBANK", "ICICIPRULI", "IDFCFIRSTB", "IBULHSGFIN", "IOC", "IGL", "INDUSINDBK", "NAUKRI", "INFY", "INDIGO", "JINDALSTEL", "JSWSTEEL", "FMCG", "KOTAKBANK", "L&TFH", "LT", "LICHSGFIN", "LUPIN", "MGL", "M&MFIN", "M&M", "MANAPPURAM", "MARICO", "MARUTI", "MFSL", "MINDTREE", "MOTHERSUMI", "MRF", "MUTHOOTFIN", "NATIONALUM", "NESTLEIND", "NMDC", "NTPC", "ONGC", "PAGEIND", "PETRONET", "PIDILITIND", "PEL", "PFC", "POWERGRID", "PNB", "PVR", "RBLBANK", "RECLTD", "RELIANCE", "NIFTY", "SBILIFE", "SHREECEM", "SRTRANSFIN", "SIEMENS", "SRF", "SBIN", "SAIL", "SUNPHARMA", "SUNTV", "TATACHEM", "TCS", "TATACONSUM", "TATAMOTORS", "TATAPOWER", "TATASTEEL", "TECHM", "RAMCOCEM", "TITAN", "TORNTPHARM", "TORNTPOWER", "TVSMOTOR", "ULTRACEMCO", "UBL", "MCDOWELL", "UPL", "VEDL", "IDEA", "VOLTAS", "WIPRO", "ZEEL"];

const getPreMarketData = function (date){
    const url = baseURL + date.getDate() + months[date.getMonth()].slice(0,3) + date.getFullYear() + "&export=csv";
    request({
        url: url,
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body)
        }
    })
}

function generateStock(result) {

}

const removeNonFutureStocks = function (data, date){

}

const removeNonFutureStocks = function (data){

}

const getHighGapShares = function (data){

}

// getPreMarketData(new Date("2020-08-31"));
