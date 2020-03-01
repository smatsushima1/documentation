################################################################################
# reset everything
################################################################################

# rm(list=ls())



################################################################################
# install and load packages
################################################################################

install.packages("BatchGetSymbols")
install.packages("reshape")
install.packages("dplyr")

library("BatchGetSymbols")
library("reshape")
library("dplyr")
library("httr")
library("jsonlite")



################################################################################
# pull tickers from api
################################################################################

api <- GET("https://api.worldtradingdata.com/api/v1/stock?symbol=AAPL,MSFT,HSBA.L&api_token=7zbwSAIzMl3IFXWzfd65pAsytXUi0pcD8px7Aq9C8UII2tUClAEL6NtLmbEF")  
api <- GET("https://api.worldtradingdata.com/api/v1/stock?symbol=AMZN&output=csv&api_token=7zbwSAIzMl3IFXWzfd65pAsytXUi0pcD8px7Aq9C8UII2tUClAEL6NtLmbEF")  
api2 <- GET("https://api.worldtradingdata.com/api/v1/stock?symbol=AMZN&api_token=7zbwSAIzMl3IFXWzfd65pAsytXUi0pcD8px7Aq9C8UII2tUClAEL6NtLmbEF")  

api2 <- GET(url = "https://api.worldtradingdata.com/api/v1/stock?",
            query = list(symbol="AMZN",
                         api_token="7zbwSAIzMl3IFXWzfd65pAsytXUi0pcD8px7Aq9C8UII2tUClAEL6NtLmbEF"
            ))

api2_data <- content(api2,
                     as = "text",
                     encoding = "UTF-8"
                    )

api3 <- GET(url = "https://api.worldtradingdata.com/api/v1/stock?",
            query = list(symbol="AMZN",
                         output="csv",
                         api_token="7zbwSAIzMl3IFXWzfd65pAsytXUi0pcD8px7Aq9C8UII2tUClAEL6NtLmbEF"
            ))



################################################################################
# pull tickers from date range
################################################################################

tickers <- read.csv("stocks.csv")

tickers <- tickers[,1]

all_stocks <- BatchGetSymbols(tickers = tickers,
                              first.date = Sys.Date() - 2,
                              last.date = Sys.Date(),
                              freq.data = 'daily'
                             )



################################################################################
# clean data
# 1. isolate data frame
# 2. change column names
# 3. pivot data
# 4. remove 2nd column
# 5. filter out data
################################################################################

all_stocks <- all_stocks$df.tickers

colnames(all_stocks) <- c("price_open",
                          "price_high",
                          "pride_low",
                          "price_close",
                          "volume",
                          "price_adjusted",
                          "ref_date",
                          "ticker",
                          "ret_adjusted_price",
                          "ret_closing_prices"
                         )

all_stocks <- cast(all_stocks,
                   ticker ~ ref_date,
                   value = "ret_closing_prices")

all_stocks <- all_stocks[,c(1,3)]



################################################################################
# write all data to csv
################################################################################

write.csv(all_stocks,
          file = "all_stocks.csv")


