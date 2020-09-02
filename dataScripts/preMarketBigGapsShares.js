const request = require("request")
const csv = require("csv")
const fs = require("fs")
const client = require('./connection.js');

// var url = "https://howutrade.in/snapdata/?data=PreOpen_ALL_05Sep2018&export=csv"
let baseURL = "https://howutrade.in/snapdata/?data=PreOpen_ALL_"

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const futureStocks = ["ACC", "ADANIENT", "ADANIPORTS", "AMARAJABAT", "AMBUJACEM", "APOLLOHOSP", "APOLLOTYRE", "ASHOKLEY", "ASIANPAINT", "AUROPHARMA", "AXISBANK", "BAJAJ", "BAJFINANCE", "BAJAJFINSV", "BALKRISIND", "BANDHANBNK", "BANKNIFTY", "BANKBARODA", "BATAINDIA", "BERGEPAINT", "BEL", "BHARATFORG", "BHEL", "BPCL", "BHARTIARTL", "INFRATEL", "BIOCON", "BOSCHLTD", "BRITANNIA", "CADILAHC", "CANBK", "CHOLAFIN", "CIPLA", "COALINDIA", "COFORGE", "COLPAL", "CONCOR", "CUMMINSIND", "DABUR", "DIVISLAB", "DLF", "DRREDDY", "EICHERMOT", "ESCORTS", "EXIDEIND", "FEDERALBNK", "GAIL", "GLENMARK", "GMRINFRA", "GODREJCP", "GODREJPROP", "GRASIM", "HAVELLS", "HCLTECH", "HDFCBANK", "HDFCLIFE", "HEROMOTOCO", "HINDALCO", "HINDPETRO", "HINDUNILVR", "HDFC", "ITC", "ICICIBANK", "ICICIPRULI", "IDFCFIRSTB", "IBULHSGFIN", "IOC", "IGL", "INDUSINDBK", "NAUKRI", "INFY", "INDIGO", "JINDALSTEL", "JSWSTEEL", "FMCG", "KOTAKBANK", "L&TFH", "LT", "LICHSGFIN", "LUPIN", "MGL", "M&MFIN", "M&M", "MANAPPURAM", "MARICO", "MARUTI", "MFSL", "MINDTREE", "MOTHERSUMI", "MRF", "MUTHOOTFIN", "NATIONALUM", "NESTLEIND", "NMDC", "NTPC", "ONGC", "PAGEIND", "PETRONET", "PIDILITIND", "PEL", "PFC", "POWERGRID", "PNB", "PVR", "RBLBANK", "RECLTD", "RELIANCE", "NIFTY", "SBILIFE", "SHREECEM", "SRTRANSFIN", "SIEMENS", "SRF", "SBIN", "SAIL", "SUNPHARMA", "SUNTV", "TATACHEM", "TCS", "TATACONSUM", "TATAMOTORS", "TATAPOWER", "TATASTEEL", "TECHM", "RAMCOCEM", "TITAN", "TORNTPHARM", "TORNTPOWER", "TVSMOTOR", "ULTRACEMCO", "UBL", "MCDOWELL", "UPL", "VEDL", "IDEA", "VOLTAS", "WIPRO", "ZEEL"];
let indexName = "pre_market_trade_data";

async function createIndexIfNotPresentAndInsertData(data, date) {
    client.indices.getMapping({index: indexName}, function (error, response) {
        if (error && error.status === 404) {
            let reqBody = {
                mappings: {
                    "properties": {
                        "tag": {"type": "text"},
                        "type": {"type": "text"},
                        "namespace": {"type": "text"},
                        "tid": {"type": "text"},
                        "shareSymbol": {"type": "text"},
                        "netChg": {"type": "float"},
                        "percentageChange": {"type": "float"},
                        "prevClose": {"type": "float"},
                        "tradedQty": {"type": "float"},
                        "tradedValueLacks": {"type": "float"},
                        "fFMarketCapital": {"type": "float"},
                        "yearlyHigh": {"type": "float"},
                        "yearlyLow": {"type": "float"},
                        "date": {"type": "date", "format": "dd-MM-yyyy"}
                    }
                }
            }
            client.indices.create({index: indexName, body: reqBody}, (err, resp, status) => {
                if (err) {
                    console.error("error while creating index with mapping", err, status);
                } else {
                    console.log('Successfully Created Index', status, resp);
                    insertStockData(data, date);
                }
            });
        }
    });
}

function insertStockData(result, date) {
    const headers = result.slice(0, 1)[0];
    return result.forEach((stock, index) => {
        if (index === 0) {
            return;
        }
        let formatDate = `${roundOfNumber(date.getDate())}-${roundOfNumber(date.getMonth()+1)}-${date.getFullYear()}`;
        let stockObject = {
            shareSymbol: stock[headers.indexOf("Symbol")],
            netChg: stock[headers.indexOf("NetChg")],
            percentageChange: stock[headers.indexOf("PctChg")],
            prevClose: stock[headers.indexOf("PrevClose")],
            tradedQty: stock[headers.indexOf("TradedQty")],
            tradedValueLacks: stock[headers.indexOf("TradedValue(in lakhs)")],
            fFMarketCapital: stock[headers.indexOf("FFMarketCapital")],
            yearlyHigh: stock[headers.indexOf("YearlyHigh")],
            yearlyLow: stock[headers.indexOf("YearlyLow")],
            date: formatDate
        };
        client.index({
            index: 'pre_market_trade_data',
            body: stockObject
        }, function (err, resp, status) {
            console.log(resp);
        });

    })
}

function insertDataInES(data, date) {
    csv.parse(data, (error, result) => {
        if (!error) {
            createIndexIfNotPresentAndInsertData(result, date)
                .catch(() => console.log());
        }
    });
}

const getHighGapShares = function (data) {

}

function roundOfNumber(givenNumber) {
    let dateNumber = givenNumber + ""
    if (dateNumber.length < 2) {
        dateNumber = "0" + dateNumber;
    }
    return dateNumber;
}

const getPreMarketData = function (date) {
    let dateNumber = roundOfNumber(date.getDate());
    const url = baseURL + dateNumber + months[date.getMonth()].slice(0, 3) + date.getFullYear() + "&export=csv";
    console.log(url);
    request({
        url: url,
        json: true
    }, function (error, response, body) {
        console.log(response.statusCode)
        if (!error && response.statusCode === 200) {
            insertDataInES(body, date);
            getHighGapShares();
        } else {
            console.log("Error while fetching data", error);
        }
    })
}

// getPreMarketData(fs.readFileSync("./dummy_data.csv"), new Date("2020-08-31"));

getPreMarketData(new Date("2020-09-02"));

// createIndexIfNotPresentAndInsertData()
//     .catch(console.log);

