const request = require("request")
const csv = require("csv")
const fs = require("fs")
const client = require('./connection.js');

// var url = "https://howutrade.in/snapdata/?data=PreOpen_ALL_05Sep2018&export=csv"
let baseURL = "https://howutrade.in/snapdata/?data=PreOpen_ALL_"

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const futureStocks = ["ACC", "ADANIENT", "ADANIPORTS", "AMARAJABAT", "AMBUJACEM", "APOLLOHOSP", "APOLLOTYRE", "ASHOKLEY", "ASIANPAINT", "AUROPHARMA", "AXISBANK", "BAJAJ", "BAJFINANCE", "BAJAJFINSV", "BALKRISIND", "BANDHANBNK", "BANKNIFTY", "BANKBARODA", "BATAINDIA", "BERGEPAINT", "BEL", "BHARATFORG", "BHEL", "BPCL", "BHARTIARTL", "INFRATEL", "BIOCON", "BOSCHLTD", "BRITANNIA", "CADILAHC", "CANBK", "CHOLAFIN", "CIPLA", "COALINDIA", "COFORGE", "COLPAL", "CONCOR", "CUMMINSIND", "DABUR", "DIVISLAB", "DLF", "DRREDDY", "EICHERMOT", "ESCORTS", "EXIDEIND", "FEDERALBNK", "GAIL", "GLENMARK", "GMRINFRA", "GODREJCP", "GODREJPROP", "GRASIM", "HAVELLS", "HCLTECH", "HDFCBANK", "HDFCLIFE", "HEROMOTOCO", "HINDALCO", "HINDPETRO", "HINDUNILVR", "HDFC", "ITC", "ICICIBANK", "ICICIPRULI", "IDFCFIRSTB", "IBULHSGFIN", "IOC", "IGL", "INDUSINDBK", "NAUKRI", "INFY", "INDIGO", "JINDALSTEL", "JSWSTEEL", "FMCG", "KOTAKBANK", "L&TFH", "LT", "LICHSGFIN", "LUPIN", "MGL", "M&MFIN", "M&M", "MANAPPURAM", "MARICO", "MARUTI", "MFSL", "MINDTREE", "MOTHERSUMI", "MRF", "MUTHOOTFIN", "NATIONALUM", "NESTLEIND", "NMDC", "NTPC", "ONGC", "PAGEIND", "PETRONET", "PIDILITIND", "PEL", "PFC", "POWERGRID", "PNB", "PVR", "RBLBANK", "RECLTD", "RELIANCE", "NIFTY", "SBILIFE", "SHREECEM", "SRTRANSFIN", "SIEMENS", "SRF", "SBIN", "SAIL", "SUNPHARMA", "SUNTV", "TATACHEM", "TCS", "TATACONSUM", "TATAMOTORS", "TATAPOWER", "TATASTEEL", "TECHM", "RAMCOCEM", "TITAN", "TORNTPHARM", "TORNTPOWER", "TVSMOTOR", "ULTRACEMCO", "UBL", "MCDOWELL", "UPL", "VEDL", "IDEA", "VOLTAS", "WIPRO", "ZEEL"];

function generateStock(result, date) {
    const headers = result.slice(0,1)[0];
    console.log(headers);
    return result.forEach((stock, index) => {
        if(index == 0){
            return;
        }
        let stockObject = {
            Symbol: stock[headers.indexOf("Symbol")],
            NetChg: stock[headers.indexOf("NetChg")],
            PercentageChange: stock[headers.indexOf("PctChg")],
            PrevClose: stock[headers.indexOf("PrevClose")],
            TradedQty: stock[headers.indexOf("TradedQty")],
            TradedValue_lacks: stock[headers.indexOf("TradedValue(in lakhs)")],
            FFMarketCapital: stock[headers.indexOf("FFMarketCapital")],
            YearlyHigh: stock[headers.indexOf("YearlyHigh")],
            YearlyLow: stock[headers.indexOf("YearlyLow")],
            date: date.toString()
        };
        console.log(stockObject)
        client.index({
            index: 'pre_market_trade_data',
            body: stockObject
        },function(err,resp,status) {
            console.log(resp);
        });

    })
}

function insertDataInES(data, date) {
    csv.parse(data, (error,result) => {
        if(!error){
            let stocks = generateStock(result, date);
        }
    });
}

const getHighGapShares = function (data){

}

const getPreMarketData = function (data, date){
    const url = baseURL + date.getDate() + months[date.getMonth()].slice(0,3) + date.getFullYear() + "&export=csv";
    // request({
    //     url: url,
    //     json: true
    // }, function (error, response, body) {
    //     if (!error && response.statusCode === 200) {
            insertDataInES(data, date);
            getHighGapShares();
        // }else {
        //     console.log("Error while fetching data", error);
        // }
    // })
}

getPreMarketData(fs.readFileSync("./dummy_data.csv"), new Date("2020-08-31"));

// getPreMarketData(new Date("2020-08-31"));
