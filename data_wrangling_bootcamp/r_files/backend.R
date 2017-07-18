## http://thinktostart.com/twitter-authentification-with-r/
## https://mkmanu.wordpress.com/2014/08/05/sentiment-analysis-on-twitter-data-text-analytics-tutorial/

rm(list=ls())

library(openssl)
library(httr)
library(jsonlite)
library(bitops)
library(RCurl)
## library(rjson)
library(ROAuth)
library(DBI)
library(RPostgreSQL)
library(streamR)


source("library.R")

searcher <- function(dbCon, table, configurationData, refreshStrings, token=NULL)
{
    ## https://cran.r-project.org/web/packages/jsonlite/vignettes/json-apis.html
                                        #Create your own appication key at https://dev.twitter.com/apps
    ## https://dev.twitter.com/rest/reference/get/search/tweets

    hashTags <- configurationData[["Hashtag"]]
    

    downloadMinimum <- 1000
    sampleMaximum <- 2
    header <- "https://api.twitter.com/1.1/search/tweets.json"

    if (is.null(token) == TRUE)
    {
        print("Token is NULL.")
                                        #Use basic auth
        consumer_key <- configurationData[["APIPublicKey"]]
        consumer_secret <- configurationData[["APIPrivateKey"]]
        secret <- openssl::base64_encode(paste(consumer_key, consumer_secret, sep = ":"));
        req <- httr::POST("https://api.twitter.com/oauth2/token",
                          httr::add_headers(
                              "Authorization" = paste("Basic", secret),
                              "Content-Type" = "application/x-www-form-urlencoded;charset=UTF-8"
                          ),
                          body = "grant_type=client_credentials"
                          );

        ## print("req");print(req)
                                        #Extract the access token
        token <- paste("Bearer", httr::content(req)$access_token)
    }
    
    ## print("token");print(token)

    for (h in hashTags)
    {
        for (s in 1:sampleMaximum)
        {
            if(is.null(refreshStrings[[h]]) == TRUE)
            {
                base <- sprintf("?q=@%s&result_type=recent&count=100",
                                h)
            }
            else
            {
                base <- sprintf("%s&count=100", refreshStrings[[h]])
            }
            url <- sprintf("%s%s", header, base)
            ## print("url");print(url)
            numberOfCharacters <- downloadMinimum
            tryCatch(
            {
                
            req <- httr::GET(url, add_headers(Authorization = token))
            ## print("req");print(req)
            json <- httr::content(req, as = "text")
                numberOfCharacters <- nchar(json)
            d <- fromJSON(json)
            ## print("type of d"); print(typeof(d))
            ## print("head"); print(head(d))
            ## print("created_at")
            ## print(names(d))
            ## print("nrow(d[[\"statuses\"]])");             print(nrow(d[["statuses"]]))
            ## tweets <- as.data.frame(d[["statuses"]])
            tweets <- d[["statuses"]]
            ## print("names(tweets)");print(names(tweets))

            ## print(tweets[[1]])

            numberOfTweets <- length(tweets)
            print(sprintf("%s has %.0f tweets", h, numberOfTweets))
            if (numberOfTweets > 0)
            {
                for (i in 1:numberOfTweets)
                {
                    a <- tweets[[i]]$created_at
                    unixSeconds <- as.numeric(as.POSIXct(substr(a, 5, nchar(a)),
                                                         format="%B %d %T +0000 %Y"))
                    data <- unclass(base64(toJSON(tweets[[i]])))
                    ## print(sprintf("%.0f %s", unixSeconds, data))
                    ## print(sprintf("%.0f %.0f", i, unixSeconds, data))
                    updateTable(dbCon, table, unixSeconds, data, configurationData)
                    ## print(tweets[[i]])
                    ## chuck
                }
            }
            refreshStrings[[h]] <- d[["search_metadata"]]$next_results
            ## print(refreshStrings[[h]])
            },
            error = function(e){
                print(sprintf("Error processing sample %.0f for hashtag %s, sample skipped.",
                              s, h))
                }
            )
            
            if (numberOfCharacters < downloadMinimum)
            {
                print(sprintf("%s: pass %.0f: %.0f bytes downloaded, less than desired minimum of %.0f bytes.",
                              h, s, numberOfCharacters,  downloadMinimum))
                break
            }
        }
    }

    refreshStrings
}


updateTable <- function(con, table, tweetTime, tweetData, configurationData)
{
    ## print(sprintf("%s() updating table %s with time %.0f",
    ##               as.character(match.call()[[1]]),
    ##               table,
    ##               tweetTime))
    df <- data.frame(tweetTime, tweetData, row.names=NULL)
    dbWriteTable(con, table,
                 value = df,
                 append = TRUE,
                 row.names = FALSE)
    if (is.null(configurationData[["CollectionFile"]]) == FALSE)
    {
        ## print(df)
        write.table(df, file=configurationData[["CollectionFile"]],
                    append=TRUE, sep=" ",
                    quote=FALSE, row.names = FALSE,
                    col.names=FALSE)
    }
}

createTables <- function(con, configurationData)
{
    table <- configurationData[["PostgresTable"]]
    user <- configurationData[["PostgresUser"]]

    print(sprintf("%s() dropping and creating the table %s",
                  as.character(match.call()[[1]]), table))
    
    sql_command <- sprintf("DROP TABLE IF EXISTS %s;
                            CREATE TABLE %s (
                                             time numeric,
                                              data varchar(800000))
                                             WITH (
                                               OIDS=FALSE
                                             );
                                             ALTER TABLE %s
                                               OWNER TO %s;"
                         , table, table, table, user)

    dbGetQuery(con, sql_command)

}

main <- function()
{
    configurationData <- parseConfigurationFile()

    ## print(configurationData)

    dbCon <- connectToDatabase(configurationData)

    if (configurationData[["ResetDatabase"]] == "TRUE")
    {
        createTables(dbCon, configurationData)
    }

    startTime <- 0
    diff <- 0
    sleepyTime <- as.numeric(configurationData[["SleepyTime"]])
    polls <- as.numeric(configurationData[["Poll"]])
    table <- configurationData[["PostgresTable"]]
    hashTags <- configurationData[["Hashtag"]]


    live <- TRUE
    con <- NULL
    
    if (is.null(configurationData[["SourceFile"]]) == FALSE)
    {
        print(sprintf("Source file = %s",configurationData[["SourceFile"]]))
        con <- file(configurationData[["SourceFile"]], "r")
        line <- readLines(con, n = 1)
        fields <- strsplit(line, split=" ")
        startTime <- as.numeric(fields[[1]][1])
        close(con)

        if (configurationData[["Offset"]] == "FALSE")
        {
            now <- unclass(Sys.time())
            diff <- now - startTime
        }
        else
        {
            diff <- 0
        }

        live <- FALSE
    }

    if (live == TRUE)
    {
                                        #Use basic auth
        consumer_key <- configurationData[["APIPublicKey"]]
        consumer_secret <- configurationData[["APIPrivateKey"]]
        secret <- openssl::base64_encode(paste(consumer_key, consumer_secret, sep = ":"));
        req <- httr::POST("https://api.twitter.com/oauth2/token",
                          httr::add_headers(
                              "Authorization" = paste("Basic", secret),
                              "Content-Type" = "application/x-www-form-urlencoded;charset=UTF-8"
                          ),
                          body = "grant_type=client_credentials"
                          );

        ## print("req");print(req)
                                        #Extract the access token
        token <- paste("Bearer", httr::content(req)$access_token)
    }
    else
    {
        con <- file(configurationData[["SourceFile"]], "r")
        line <- readLines(con, n = 1)
        fields <- strsplit(line, split=" ")
        replayBlockTime <- as.numeric(fields[[1]][1])
        replayBlockData <- fields[[1]][2]
    }

    timeEnd <- startTime + sleepyTime + diff

    eof <- FALSE
    credential <- NULL
    refreshStrings <- list()

    for (p in 1:polls)
    {
        if (live == TRUE)
        {
            refreshStrings <- searcher(dbCon, table, configurationData, refreshStrings, token)
        }
        else
        {
            while (replayBlockTime <= timeEnd)
        {
            updateTable(dbCon, table, replayBlockTime, replayBlockData, configurationData)
            line <- readLines(con, n = 1)
            if (identical(line, character(0)))
            {
                print(sprintf("Reached EOF on file: %s",configurationData[["SourceFile"]] ))
                eof <- TRUE
                break
            }
            fields <- strsplit(line, split=" ")
            replayBlockTime <- as.numeric(fields[[1]][1])
            replayBlockData <- fields[[1]][2]
        }
            Sys.sleep(sleepyTime)            

            timeEnd <- timeEnd + sleepyTime
        }

        print(sprintf("Completed poll %.0f of %.0f.",
                      p, polls))
        
        if(eof == TRUE)
            break
    }

    if (live == FALSE)
    {
        close(con)
    }
    print(sprintf("%s() has ended.",
                  as.character(match.call()[[1]])))
}


main()
