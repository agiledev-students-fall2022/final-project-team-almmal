const express = require('express')
const finnhub = require('finnhub')
const router = express.Router()
const home = express() // instantiate an Express object
const path = require("path")

const Portfolio = require('../db/models/PortfolioModal')
const UsersModel = require('../db/models/UsersModal');
// import some useful middleware
const multer = require("multer") // middleware to handle HTTP POST requests with file uploads
const axios = require("axios") // middleware for making requests to APIs
require("dotenv").config({ silent: true }) // load environmental variables from a hidden file named .env
const morgan = require("morgan") // middleware for nice logging of incoming HTTP requests
const auth = require('../middleware/auth')
//const { db } = require('../db/models/PortfolioModal')

//finnhub stuff
const STOCK_API="https://finnhub.io/api/mash/"
const TOKEN="cdbkvuaad3ibgg4mqf8gcdbkvuaad3ibgg4mqf90"
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = TOKEN
const finnhubClient = new finnhub.DefaultApi()

finnhubClient.quote("AAPL", (error, data, response) => {
  // console.log("current price",data.c)
});






/**
 * Typically, all middlewares would be included before routes
 * In this file, however, most middlewares are after most routes
 * This is to match the order of the accompanying slides
 */

// use the morgan middleware to log all incoming http requests
router.use(morgan("dev")) // morgan has a few logging default styles - dev is a nice concise color-coded style

// use express's builtin body-parser middleware to parse any data included in a request
router.use(express.json()) // decode JSON-formatted incoming POST data
router.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data

// make 'public' directory publicly readable with static content
router.use("/static", express.static("public"))
// define the home page route


// using async/await in this route to show another way of dealing with asynchronous requests to an external API or database
router.get("/portfolioData", auth, async(req, res, next) => {
   try {
        const doc = await UsersModel.findById(req.user.id).orFail(() => {
            throw "ID not found"
        })
      const newInvestment=[]
      for (let i = 0; i < doc.investment.length; i++) {
        let entry = doc.investment[i]
        newInvestment.push(entry)
      }
      let findata=0;
      // for(let i=0;i<newInvestment.length;i++)
      // {
      //   finnhubClient.quote(newInvestment[i].ticker, (error, data, response) => {
      //       //console.log("current price of ticker: ",newInvestment[i].ticker,data.c)
      //       findata=data.c //setting the maketprice
      //       console.log("current price 1 of ticker: ",newInvestment[i].ticker,newInvestment[i].marketprice)
      //       //res.status(200).json(newInvestment[i])
      //  });    
      //  newInvestment[i].marketprice=findata
      //   console.log("current price 2 of ticker: ",newInvestment[i].ticker,newInvestment[i].marketprice)    
      //   newInvestment[i].profitloss=profitLossCalculator(newInvestment[i].price, newInvestment[i].marketprice, newInvestment[i].position, newInvestment[i].quantity)
      //   //console.log("current price of ticker and profitloss: ",newInvestment[i].ticker,newInvestment[i].marketprice,newInvestment[i].profitloss )
      // }

      //stockFetcher(newInvestment)
      // for(let i=0;i<newInvestment.length;i++)
      // {
      //   res=axios.get(`https://finnhub.io/api/v1/quote?symbol=${newInvestment[i].ticker}&token=${TOKEN}`)
      //               .then(apiResponse => apiResponse.data) // pass data along directly to client
      //               .then(data=>(newInvestment[i].marketprice=data.c))
      //               .then(data=>console.log("marketprice",newInvestment[i].marketprice))
      //               .catch(err => next(err)) // pass any errors to express
      // }
      //console.log("data 2:",res.c)
        //res.status(200).json({ success: true, newInvestment })//responsing with an array of json objects
      res.status(200).json(newInvestment)
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, error })
    }
    
})
  //Calculates the profit or loss for a single position (No need for Sprint-1)
  const profitLossCalculator = (price, currentPrice, position, quantity) => {
      let profitLoss = 0;

      if (currentPrice) {
          if (position === 'BUY') {
              profitLoss = (currentPrice - price) * quantity;
          } else {
              profitLoss = (price - currentPrice) * quantity;
          }
      }

      return profitLoss.toFixed(2);
  };

  //Calculates the profit or loss for the whole portfolio (No need for Sprint-1)
  // const profitLossTotalCalculator = (stocks) => {
  //     let profitLossTotal = 0;

  //     stocks.forEach((s) => {
  //         if (!isNaN(Number(s.profitLoss))) {
  //             profitLossTotal += Number(s.profitLoss);
  //         }
  //     });

  //     return profitLossTotal.toFixed(2);
  // };

  // const fetchPrices = () => {
  //     //Fetches prices and updates the state with current prices and profit or loss for the position
  //     stockFetcher(stocks, setStocks, profitLossCalculator);
  // };
// using async/await in this route to show another way of dealing with asynchronous requests to an external API or database
router.get("/portfolioChartData", auth, (req, res, next) => {
    axios
        .get("https://my.api.mockaroo.com/chart_data.json?key=8052c770")
        .then(apiChartResponse => apiChartResponse.data) // pass data along directly to client
        .then(data=>res.json(data))
        .catch(err => next(err)) // pass any errors to express
    
})

router.get('/', auth, (req, res) => {
    res.send('Profile page')
})


let storeData=[];
// receive POST data from the client, adding investment to specific user databases
router.post("/", auth, async(req, res) => {
  // now do something amazing with the data we received from the client
  //console.log(req.body)
  try{
    const doc = await UsersModel.findById(req.user.id).orFail(() => {
            throw "No user registered"
        })

      const newdata ={
      //user_id:req.user.id,
      key:req.body.key,
      ticker: req.body.ticker,
      position: req.body.position,
      quantity: req.body.quantity,
      price: req.body.price,
      timestamp:req.body.timestamp,
      // marketprice:0,
      // profitloss:0,

  }
  //newdata.save()
    doc.investment.push(newdata)
    console.log("New Data Added: ",newdata )
    for (let i = 0; i < doc.investment.length; i++) {
        console.log("New Data Added : ",i,doc.investment[i] )
        }
    await doc.save()
    return res.status(200).json({ success: true })

  }
  catch(error){
    return res.status(500).json({ success: false, error })

  }
  // const data = new Portfolio({
  //     user_id:req.body.id,
  //     //key:req.body.key,
  //     ticker: req.body.ticker,
  //     position: req.body.position,
  //     quantity: req.body.quantity,
  //     price: req.body.price,
  //     timestamp:req.body.timestamp, 
  // })
  // data.save()
  // //.then(result=>{res.json(result)})
  // .catch(err=>console.log(err))
  // storeData.push(data)
  // console.log("IN BACKEND",data)
  // // ... then send a response of some kind to client
  // res.json(storeData)
  //console.log(storeData)
  //res.send(storeData)
})


// receive POST data from the client
router.get("/", auth, async(req, res) => {
  // now do something amazing with the data we received from the client

  res.send(storeData)
})


// //Function which fetches the current prices and updates our state with current prices and profit/loss
const stockFetcher = (newInvestment) => {
    newInvestment.forEach(async (s) => {
        try {
          let i=0
           // const stockName = s.ticker.replace('', '');
            const stockName = s.ticker
            await axios.get(`https://finnhub.io/api/v1/quote?symbol=${stockName}&token=${TOKEN}`)
                    .then(apiResponse => apiResponse.data) // pass data along directly to client
                    .then(data=>(s.marketprice=data.c))
                    .then(data=>console.log("marketprice",data.c))
                    .catch(err => next(err)) // pass any errors to express
            // const response = await fetch(
            //      `${STOCK_API}/quote?symbol=${stockName}&token=${TOKEN}`
            //  );
            //const data = await response.json();
            //newInvestment[0].marketprice=data.c;
            
            // const profitLoss = profitLossCalculator(
            //     s.price,
            //     data.c,
            //     s.position,
            //     s.quantity
            // );

            // const stockWithPrice = {
            //     ...s,
            //     currentPrice: data.c.toFixed(2),
            //     profitLoss,
            // };

            // const indexOfStock = stocks.indexOf(s);
            // setStocks((stocks) => [
            //     ...stocks.slice(0, indexOfStock),
            //     stockWithPrice,
            //     ...stocks.slice(indexOfStock + 1),
            // ]);
            i++
        } catch (error) {
            /*The option how to handle the error is totally up to you. 
                Ideally, you can send notification to the user */
            console.log(error);
        }
    });
};

// // using async/await in this route to show another way of dealing with asynchronous requests to an external API or database
// router.get("/portfolioData", auth, (req, res, next) => {
//     axios
//         .get("https://my.api.mockaroo.com/stock_data.json?key=8052c770")
//         .then(apiResponse => apiResponse.data) // pass data along directly to client
//         .then(data=>res.json(data))
//         .catch(err => next(err)) // pass any errors to express
    
// })

// // using async/await in this route to show another way of dealing with asynchronous requests to an external API or database
// router.get("/portfolioChartData", auth, (req, res, next) => {
//     axios
//         .get("https://my.api.mockaroo.com/chart_data.json?key=8052c770")
//         .then(apiChartResponse => apiChartResponse.data) // pass data along directly to client
//         .then(data=>res.json(data))
//         .catch(err => next(err)) // pass any errors to express
    
// })


module.exports = router
//module.exports = home
