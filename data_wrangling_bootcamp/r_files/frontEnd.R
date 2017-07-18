rm(list=ls())

library(methods)
library(bitops)
library(DBI)
library(RPostgreSQL)
library(rjson)
library(RCurl)
library(streamR)
library(NLP)
library(tm)
library(SnowballC)
library(httr)
library(ggplot2)
library(ggmap)
library(maps)
library(mapdata)
library(mapproj)
library(mapplots)

source("library.R")


plotLocationData <- function(configurationData, dbCon, positiveWords, negativeWords, stopWords, hashTags, jsonTweetFile)
{
    locationSaveFile <- "locationData"

    if (file.exists(locationSaveFile) == TRUE)
    {
        print(sprintf("Loading locationData from file %s", locationSaveFile))
        load(locationSaveFile)

    }
    else
    {
        locationData <- list()
        failedAttempts <- list()
    }

    doWork <- TRUE
    table <- configurationData[["PostgresTable"]]

    skip <- 0

    sqlQuery <- sprintf("select count(time) from %s",
                        table)

    results <- dbGetQuery(dbCon, sqlQuery)

    skipLimit <- results[1,1]

    ## skipLimit <- 1000
    
    ## desiredResults <- 1000

    desiredResults <- skipLimit

    
    missingTags <- 0
    missingLocationData <- 0
    
    emptyClassifications <- classify(NULL, positiveWords, negativeWords, configurationData, count = 0)

    scaleFactor <- 0.2

    scaleFactorSet <- FALSE

    locationSummary <- list()

    results <- getTweetsAsJSON(configurationData, saveFile=jsonTweetFile)
    numberOfResults <- length(results)

    numberOfResults <- min(numberOfResults, desiredResults, skipLimit)
    ## numberOfResults <- 10

    while(doWork == TRUE)
    {
        if (numberOfResults > 0)
        {
            for (i in 1:numberOfResults)
            {
                foundLocationData <- TRUE
                ## tryCatch(
                ## {
                ## json <- base64Decode(results$data[i])
                json <- results[i]
                df <- parseTweets(json, simplify=FALSE, verbose=FALSE)
                ## print(names(df))
                ## print(sprintf("Some location data %s %s %s", df$location, df$place_id, df$lat))
                ## print(sprintf("Tweet text:%s",df$text))
                locationName <- df$location
                rawTweet <- df$text

                tweetText <- processText(rawTweet, stopWords)
                ## print(tweetText)
                classifications <- classify(tweetText, positiveWords, negativeWords, configurationData)
                ## print(classifications)
                foundHashTag <- FALSE
                for (h in hashTags)
                {
                    if (hashTagIncluded(h, tweetText) == TRUE)
                    {
                        foundHashTag <- TRUE
                        ## print(sprintf("Processing %s",h))
                        if (is.null(locationSummary[[h]]) == TRUE)
                        {
                            ## print("is null")
                            locationSummary[[h]] <- list()
                        }
                        else
                        {
                            ## print("not null")
                            ## print(is.null(locationSummary[[h]]))
                        }
                        
                        ## print(is.null(locationSummary[[h]][[sourceName]]))
                        foundLocationData <- FALSE
                        if (is.na(locationName) == FALSE)
                        {
                            if (is.null(locationSummary[[h]][[locationName]]) == TRUE)
                            {
                                ## print(sprintf("first \"%s\" for %s", sourceName, h))
                                locationSummary[[h]][[locationName]] <- emptyClassifications
                            }
                            foundLocationData <- TRUE
                            temp <- locationSummary[[h]][[locationName]]
                            ## print("updating plotting data");print(h);print(temp)
                            locationSummary[[h]][[locationName]] <- list("positive" = (temp[["positive"]] + classifications[["positive"]]),
                                                                         "negative" = (temp[["negative"]] + classifications[["negative"]]),
                                                                         "neutral" = (temp[["neutral"]] + classifications[["neutral"]]),
                                                                         "count" = (as.numeric(temp[["count"]]) + as.numeric(classifications[["count"]]))
                                                                         )
                            ## print(locationSummary[[h]][[sourceName]])
                        }
                    }
                }

                if (foundHashTag == FALSE)
                {
                    print(sprintf("Result %.0f of %.0f. No hashtag found in tweet text: %s.",
                                  i, numberOfResults, rawTweet))
                    print(sprintf("Tweet location: %s", locationName))
                    missingTags <- missingTags + 1
                }
                if (foundLocationData == FALSE)
                {
                    print(sprintf("Result %.0f of %.0f. No location found in tweet text.",
                                  i, numberOfResults))
                    missingLocationData <- missingLocationData + 1
                }
                ## },
                ## error = function(e){
                ##     print(sprintf("Error processing %.0f of %.0f records.  Line skipped.", i, numberOfResults))
                ## }
                ## )


                if ((is.na(locationName) == FALSE) && (is.null(locationName) == FALSE) && (nchar(locationName) > 0))
                {
                    if (is.null(locationData[[locationName]]) == TRUE)
                    {
                        if (is.null(failedAttempts[[locationName]]) == TRUE)
                        {
                            print(sprintf("Attempting to add %s to location data base.", locationName))
                            ## url <- "http://maps.googleapis.com/maps/api/geocode/json?address=Burlington,VT&sensor=true"

                            url <- sprintf("http://maps.googleapis.com/maps/api/geocode/json?address=%s&sensor=true",
                                           URLencode(locationName))
                            req <- httr::GET(url)
                            ## print("req");print(req)
                            json <- httr::content(req, as = "text")
                            numberOfCharacters <- nchar(json)
                            d <- fromJSON(json)
                            
                            ## print("d from google query");print(d)

                            if (length(d$results) > 0)
                            {
                                locationData[[locationName]] <- list(lat = d$results[[1]]$geometry$location$lat,
                                                                     lon = d$results[[1]]$geometry$location$lng
                                                                     )
                            }
                            else
                            {
                                print(sprintf("No results from url:%s", url))
                                print(sprintf("Marking location \"%s\" as failed.", locationName))
                                failedAttempts[[locationName]] <- "failed"
                            }
                        }
                    }
                    else
                    {
                        print(sprintf("Location %s already in location data base.", locationName))
                    }
                }
                else
                {
                    print(sprintf("No location data found in tweet %s of %s.",
                                  prettyNum(i,big.mark=","),
                                  prettyNum(numberOfResults,big.mark=",")))
                }
            }
        }

        skip <- skip + numberOfResults
        print(sprintf("Processed first %s tweets of maximum %s.",
                      prettyNum(skip,big.mark=","),
                      prettyNum(skipLimit,big.mark=",")
                      ))
        if ((desiredResults >= numberOfResults) || (skip >= skipLimit))
        {
            doWork <- FALSE
        }
    }
    print(sprintf("Processed %s tweets, %s missing hashtags, %s missing location data.",
                  prettyNum(skipLimit, big.mark=","),
                  prettyNum(missingTags, big.mark=","),
                  prettyNum(missingLocationData, big.mark=",")))

    places <- locationDataToDataFrame(locationData)
    
    ## print(locationSummary)

    ## print(locationData)
    ## oldPar <- par()
    ## par(mfrow=c(length(names(locationSummary)),1))

    for(n in names(locationSummary))
    {
        ## print(names(locationSummary[[n]]))
        dfPos <- data.frame(location=as.character(),
                            lat=as.numeric(),
                            lon=as.numeric(),
                            count=as.numeric())
        dfNeu <- dfPos
        dfNeg <- dfPos

        for (p in names(locationSummary[[n]]))
        {
            ## print(sprintf("Processing tag:%s, name %s", n, p))

            g <- locationData[[p]]
            if (is.null(g) == FALSE)
            {
                ## print(g)
                ## print(locationSummary[[n]][[p]]$positive)
                temp <- data.frame(location = p,
                                   lat = g$lat,
                                   lon = g$lon,
                                   count = locationSummary[[n]][[p]]$positive
                                   )
                dfPos <- rbind(dfPos, temp)
                temp <- data.frame(location = p,
                                   lat = g$lat,
                                   lon = g$lon,
                                   count = locationSummary[[n]][[p]]$negative
                                   )
                dfNeg <- rbind(dfNeg, temp)
                temp <- data.frame(location = p,
                                   lat = g$lat,
                                   lon = g$lon,
                                   count = locationSummary[[n]][[p]]$neutral
                                   )
                dfNeu <- rbind(dfNeu, temp)
            }
            else
            {
                print(sprintf("Tag:%s, location:\"%s\" not in location database, skipping entry,", n, p))
            }
            
        }

        if (scaleFactorSet == FALSE)
        {
            while (TRUE)
        {
            quickPlot(dfPos, dfNeu, dfNeg, configurationData[["ColorPositive"]], configurationData[["ColorNeutral"]], configurationData[["ColorNegative"]], n, scaleFactor)
            prompt <- sprintf("Current scale factor is %f. Just press RETURN to accept for all plots, or enter a new value. (A smaller number will REDUCE the size.) ", scaleFactor)
            newScale <- readline(prompt=prompt)
            if (nchar(newScale) == 0)
                break
            scaleFactor = as.numeric(newScale)
        }
            scaleFactorSet <- TRUE
        }
        else
        {
            quickPlot(dfPos, dfNeu, dfNeg, configurationData[["ColorPositive"]], configurationData[["ColorNeutral"]], configurationData[["ColorNegative"]], n, scaleFactor)
            readline(prompt="Press RETURN for the next plot.")
        }
        
    }

    # dev.off()
    save(locationData, failedAttempts, file = locationSaveFile)
    ## par(oldPar)
    locationData    
}

locationDataToDataFrame <- function(locationData)
{
    df <- NULL
    
    for(n in names(locationData))
    {
        temp <- data.frame(location = n,
                           lat = locationData[[n]]$lat,
                           lon = locationData[[n]]$lon
                           )
        if (is.null(df) == TRUE)
        {
            df <- temp
        }
        else
        {
            df <- rbind(df, temp)
        }
    }
    df
}


quickPlot <- function(dfPos, dfNeu, dfNeg, colorPos, colorNeu, colorNeg, hashTag, scale)
{
    localFunction <- function(df, color, alpha)
    {
        d <- col2rgb(color)/255
        lat <- jitter(df$lat)
        lon <- jitter(df$lon)
        for (i in row(df))
        {
            if (df$count[i] > 0)
            {
                points(lon[i],
                       lat[i],
                       pch=19,
                       col= rgb(d[1], d[2], d[3], alpha=alpha),
                       cex=df$count[i]*0.5
                       )
            }
        }
    }
    
    alpha <- 0.5
    mainTitle <- sprintf("Tweet location data for tag: \"%s\" in continental USA.", hashTag)
    map("state",
        col="gray90",
        fill=TRUE
        )
    title(mainTitle)

    myColors <- c(colorPos, colorNeu, colorNeg)
    for (i in 1:length(myColors))
    {
        d <- col2rgb(myColors[i])/255
        myColors[i] <- rgb(d[1], d[2], d[3], alpha=alpha)
    }
    
    for (i in 1:nrow(dfPos))
    {
        z <- c(dfPos$count[i], dfNeu$count[i], dfNeg$count[i] )
        add.pie(z,
                x=dfPos$lon[i],
                y=dfPos$lat[i],
                radius=log(sum(z))*scale,
                labels="",
                col=myColors
                )
    }
    ## print(dfPos)
}


plotSendingDataWorker <- function(summaryData, configurationData, tags)
{
    oldPar <- par()
    par(mfrow=c(length(tags),1))

    myColors <- c(configurationData[["ColorNegative"]], configurationData[["ColorNeutral"]], configurationData[["ColorPositive"]])

    for (h in  names(summaryData))# "berniesanders")# 
    {
        df <- NULL
        dfLimit <- 20
        sourceNames <- names(summaryData[[h]])
        
        for (s in sourceNames)
        {
            temp <- data.frame(hashtag = h,
                               tweetSource = s,
                               positive = as.numeric(summaryData[[h]][[s]][["positive"]]),
                               neutral = as.numeric(summaryData[[h]][[s]][["neutral"]]),
                               negative = as.numeric(summaryData[[h]][[s]][["negative"]]),
                               count = as.numeric(summaryData[[h]][[s]][["count"]])
                               )
            ## print(temp)
            if(is.null(df) == TRUE)
            {
                ## print("here")
                df <- temp
            }
            else
            {
                ## print("now here")
                df <- rbind(df, temp)
            }

        }

        origNumberOfRows <- nrow(df)
        cuttOff <- min(dfLimit, origNumberOfRows)
        df <- df[order(-df$count),]
        df <- df[1:cuttOff, ]
        xMin <- 1
        xMax <- nrow(df)
        yMin <- 0
        yMax <- max(df$count)
        xLabel <- "Sources"
        yLabel <- "Number of tweets"
        mainTitle <- sprintf("Sources of tweets to: %s", h)
        mainTitle <- sprintf("Tweets to: %s (%s tweets from %s sources, top %.0f shown)",
                             h,
                             prettyNum(sum(as.numeric(df$count)),big.mark=","),
                             prettyNum(origNumberOfRows,big.mark=","),
                             cuttOff)
        custom <- df$tweetSource
        data <- list(df$positive, df$neutral, df$negative)
        plotStackedData (xMin, xMax, yMin, yMax, xLabel, yLabel, mainTitle, data, myColors, custom)
    }

    par(oldPar)
    
    df
}

getTextField <- function(line)
{
    temp <- strsplit(line, " ")[[1]][2]
    temp <- strsplit(temp, "href=")
    url <- c(url, gsub("\"", "", temp[[1]][2], fixed=TRUE))
    temp <- strsplit(line, ">")
    temp <- strsplit(temp[[1]][2], "<")

    temp[[1]][1]
}

plotSendingData <- function(configurationData, dbCon, positiveWords, negativeWords, stopWords, hashTags, jsonTweetFile)
{
    doWork <- TRUE
    table <- configurationData[["PostgresTable"]]

    skip <- 0

    sqlQuery <- sprintf("select count(time) from %s",
                        table)

    results <- dbGetQuery(dbCon, sqlQuery)

    skipLimit <- results[1,1]

    ## skipLimit <- 1000

    
    desiredResults <- min(10000, skipLimit)

    missingTags <- 0
    emptyClassifications <- classify(NULL, positiveWords, negativeWords, configurationData, count = 0)

    sourceSummary <- list()
    results <- NULL
    while(doWork == TRUE)
    {
        results <- getTweetsAsJSON(configurationData, saveFile=jsonTweetFile)
        numberOfResults <- length(results)
        ## print(names(results))

        ## numberOfResults <- 10
        if (numberOfResults > 0)
        {
            for (i in 1:numberOfResults)
            {
                tryCatch(
                {
                    ## json <- base64Decode(results$data[i])
                    json <- results[i]
                    df <- parseTweets(json, simplify=FALSE, verbose=FALSE)
                    ## print(names(df))
                    ## print(sprintf("Tweet text:%s",df$text))
                    sourceName <- getTextField(df$source)
                    rawTweet <- df$text

                    tweetText <- processText(rawTweet, stopWords)
                    ## print(tweetText)
                    classifications <- classify(tweetText, positiveWords, negativeWords, configurationData)
                    ## print(classifications)
                    foundHashTag <- FALSE
                    for (h in hashTags)
                    {
                        if (hashTagIncluded(h, tweetText) == TRUE)
                        {
                            foundHashTag <- TRUE
                            ## print(sprintf("Processing %s",h))
                            if (is.null(sourceSummary[[h]]) == TRUE)
                            {
                                ## print("is null")
                                sourceSummary[[h]] <- list()
                            }
                            else
                            {
                                ## print("not null")
                                ## print(is.null(sourceSummary[[h]]))
                            }
                            
                            ## print(is.null(sourceSummary[[h]][[sourceName]]))
                            if (is.null(sourceSummary[[h]][[sourceName]]) == TRUE)
                            {
                                ## print(sprintf("first \"%s\" for %s", sourceName, h))
                                sourceSummary[[h]][[sourceName]] <- emptyClassifications
                            }
                            
                            temp <- sourceSummary[[h]][[sourceName]]
                            ## print("updating plotting data");print(h);print(temp)
                            sourceSummary[[h]][[sourceName]] <- list("positive" = (temp[["positive"]] + classifications[["positive"]]),
                                                                     "negative" = (temp[["negative"]] + classifications[["negative"]]),
                                                                     "neutral" = (temp[["neutral"]] + classifications[["neutral"]]),
                                                                     "count" = (as.numeric(temp[["count"]]) + as.numeric(classifications[["count"]]))
                                                                     )
                            ## print(sourceSummary[[h]][[sourceName]])
                        }
                    }

                    if (foundHashTag == FALSE)
                    {
                        print(sprintf("Result %.0f of %.0f. No hashtag found in tweet text: %s.",
                                      i, numberOfResults, rawTweet))
                        print(sprintf("Tweet source: %s", sourceName))
                        missingTags <- missingTags + 1
                    }
                },
                error = function(e){
                    print(sprintf("Error processing %.0f of %.0f records.  Line skipped.", i, numberOfResults))
                }
                )
            }
        }
        skip <- skip + numberOfResults
        print(sprintf("Processed first %s tweets of maximum %s.",
                      prettyNum(skip,big.mark=","),
                      prettyNum(skipLimit,big.mark=",")
                      ))
        if ((desiredResults > numberOfResults) || (skip > skipLimit))
        {
            doWork <- FALSE
        }
    }
    ## print(sourceSummary)
    plotSendingDataWorker(sourceSummary, configurationData, hashTags)
    sourceSummary
}

plotSentimentData <- function(tags, pollData, plottingData, currentPoll, maxPolls, configurationData)
{

    tagOfInterest <- ""
    for (tag in tags)
    {
        if (is.null(plottingData[[tag]]) == TRUE)
        {
            plottingData[[tag]] <- pollData[[tag]]
            if(tag == tagOfInterest)
            {
                print("NULL case")
                print(tag)
                print(plottingData[[tag]])
            }
        }
        else
        {
            temp <- plottingData[[tag]]
            if(tag == tagOfInterest)
            {
                print(sprintf("Updated plotting data for %s", tag))
                
                print("Original data");print(temp)
                print(pollData[[tag]])
            }
            temp[["positive"]] <- c(temp[["positive"]], pollData[[tag]]$positive)
            temp[["negative"]] <- c(temp[["negative"]], pollData[[tag]]$negative)
            temp[["neutral"]] <- c(temp[["neutral"]], pollData[[tag]]$neutral)
            temp[["count"]] <- c(temp[["count"]], pollData[[tag]]$count)

            plottingData[[tag]] <- temp

            if(tag == tagOfInterest)
            {
                print("Updated data");print(plottingData[[tag]])
            }
            
        }
    }

    
    oldPar <- par()
    par(mfrow=c(length(tags),1))

    myColors <- c(configurationData[["ColorNegative"]], configurationData[["ColorNeutral"]], configurationData[["ColorPositive"]])
    yLabel <- sprintf("Number of tweets")
    
    xMin <- 0
    xMax <- maxPolls
    yMin <- 0

    for(tag in tags)
    {
        if (is.null(plottingData[[tag]]) == FALSE)
        {
            data <- list(plottingData[[tag]]$positive, plottingData[[tag]]$neutral, plottingData[[tag]]$negative)
            mainTitle <- sprintf("Data for hashtag:%s", tag)
            xLabel <- sprintf("%s total samples at %s seconds intervals.",
                              prettyNum(sum(as.numeric(plottingData[[tag]]$count)),big.mark=","),
                              prettyNum(as.numeric(configurationData[["SleepyTime"]]),big.mark=","))
            yMax <- max(plottingData[[tag]]$count)
            if(tag == tagOfInterest)
            {
                
                print(tag)
                print(data)
            }
            ## chuck
            plotStackedData(xMin, xMax, yMin, yMax, xLabel, yLabel, mainTitle, data, myColors)
        }
    }
    par(oldPar)

    plottingData
}

plotStackedData <- function(xMin, xMax, yMin, yMax, xLabel, yLabel, mainTitle, data, myColors, custom=NULL) {

    if (is.null(custom) == TRUE)
    {
        plot(x=c(xMin, xMax), y=c(yMin, yMax), type="n", main=mainTitle, xlab=xLabel, ylab=yLabel)
        
    }
    else
    {
        plot(x=c(xMin, xMax), y=c(yMin, yMax), type="n", main=mainTitle, xlab=xLabel, ylab=yLabel,
             xaxt="n")
        axis(1, at=seq(1:length(custom)), labels=FALSE)
        text(seq(1, length(custom), by=1),
             par("usr")[3] - 0.2,
             labels=custom, srt=-45, pos = 1,
             xpd = TRUE)
    }


    xS <- c(xMin:(xMin + length(data[[1]]) - 1), (xMin + length(data[[1]]) - 1):xMin)

                                        #print("xS");print(xS)

    polyBottom <- rep(0, length(data[[1]]))

    for (i in 1:length(data))
    {
                                        #	   print(sprintf("i = %.0f",i))

                                        #print(c(data[[1]],rev(data[[1]])))

        for (j in 1:length(data[[1]]))
        {
            if (j == 1) 
            {
                polyData <- data[[i]][j] + polyBottom[j]
            }
            else
            {
                polyData <- c(polyData, (data[[i]][j] + polyBottom[j]))
            }
        }
        polyData <- c(polyData,rev(polyBottom))

                                        #	    print("polyData");print(polyData)
                                        #print("polyBottom");print(polyBottom)


        polygon(xS, polyData, col=myColors[i])

        for (j in 1:length(data[[1]]))
        {
            polyBottom[j] <- polyBottom[j] + data[[i]][j]
        }
    }  
}


plotStackedDataOrig <- function(xMin, xMax, yMin, yMax, xLabel, yLabel, mainTitle, data, myColors) {


    plot(x=c(xMin, xMax), y=c(yMin, yMax), type="n", main=mainTitle, xlab=xLabel, ylab=yLabel)

    xS <- c(xMin:(xMin + length(data[[1]]) - 1), (xMin + length(data[[1]]) - 1):xMin)

                                        #print("xS");print(xS)

    polyBottom <- rep(0, length(data[[1]]))

    for (i in 1:length(data))
    {
                                        #	   print(sprintf("i = %.0f",i))

                                        #print(c(data[[1]],rev(data[[1]])))

        for (j in 1:length(data[[1]]))
        {
            if (j == 1) 
            {
                polyData <- data[[i]][j] + polyBottom[j]
            }
            else
            {
                polyData <- c(polyData, (data[[i]][j] + polyBottom[j]))
            }
        }
        polyData <- c(polyData,rev(polyBottom))

                                        #	    print("polyData");print(polyData)
                                        #print("polyBottom");print(polyBottom)


        polygon(xS, polyData, col=myColors[i])

        for (j in 1:length(data[[1]]))
        {
            polyBottom[j] <- polyBottom[j] + data[[i]][j]
        }
    }  
}

hashTagIncluded <- function(tag, words)
{
    ## hashTag <- sprintf("@%s", tag)

    returnValue <- tag %in% words

    returnValue
}



plotSentimentDataControl <- function(configurationData, dbCon, positiveWords, negativeWords, stopWords, hashTags, saveFile)
{
    unlink(saveFile)
    sleepyTime <- as.numeric(configurationData[["SleepyTime"]])
    polls <- as.numeric(configurationData[["Poll"]])
    table <- configurationData[["PostgresTable"]]

    sqlQuery <- sprintf("select min(time) as earliest from %s;",
                        table)
    
    results <- dbGetQuery(dbCon, sqlQuery)

    timeStart <- results[1,1]

    sqlQuery <- sprintf("select max(time) as earliest from %s;",
                        table)
    
    results <- dbGetQuery(dbCon, sqlQuery)

    timeEnding <- results[1,1]
    pollPlottingData <- NULL

    plottingData <- NULL

    emptyClassifications <- classify(NULL, positiveWords, negativeWords, configurationData, count = 0)

    totalResults <- 0
    missingTags <- 0
    returnValue <- c()
    for (p in 1:polls)
    {
        pollPlottingData <- list()
        
        timeEnd <- timeStart + sleepyTime

        sqlQuery <- sprintf("select data from %s where %.0f <= time and time < %.0f order by time;",   #" limit 4;",
                            table, timeStart, timeEnd)

        print(sqlQuery)
        
        lines <- dbGetQuery(dbCon, sqlQuery)

        numberOfResults <- nrow(lines)
        print(sprintf("Poll %.0f of %.0f, there are %.0f lines to process.",
                      p, polls, numberOfResults))

        totalResults <- totalResults + numberOfResults

        if (numberOfResults > 0)
        {
            ## print(names(lines))
            ## print(lines)
            for (i in 1:numberOfResults)
            {
                tryCatch(
                {
                    l <- lines$data[i]
                    json <- base64Decode(l)
                    returnValue <- c(returnValue, json)
                    ## print(sprintf("nchar(l) = %.0f, nchar(json) = %.0f",
                    ##               nchar(l),
                    ##               nchar(json)))
                    ## print(l)
                    ## print(json)
                    ## return(0)
                    df <- parseTweets(json, simplify=FALSE, verbose=FALSE)
                    ## print(names(df))
                    ## print(head(df))
                    ## print("df$text");print(df$text)
                    rawTweet <- df$text

                    tweetText <- processText(rawTweet, stopWords)
                    ## tweetText <- normalizedText(rawTweet)

                    ## tweetText <- strsplit(tweetText, "\\s+", perl=TRUE)[[1]]
                    ## ## print(tweetText)
                    ## ## print(tweetText)
                    ## tweetText <- cleansedText(tweetText, stopWords)
                    classifications <- classify(tweetText, positiveWords, negativeWords, configurationData)
                    ## classifications <- classify(tweetText, c("because","the"), negativeWords)
                    ## print(tweetText)
                    ## print(classifications)
                    foundHashTag <- FALSE
                    for (h in hashTags)
                    {
                        if (hashTagIncluded(h, tweetText) == TRUE)
                        {
                            foundHashTag <- TRUE
                            ## print(sprintf("Processing %s",h))
                            if (is.null(pollPlottingData[[h]]) == TRUE)
                            {
                                pollPlottingData[[h]] <- classifications
                            }
                            else
                            {
                                temp <- pollPlottingData[[h]]
                                ## print("updating plotting data");print(h);print(temp)
                                pollPlottingData[[h]] <- list("positive" = (temp[["positive"]] + classifications[["positive"]]),
                                                              "negative" = (temp[["negative"]] + classifications[["negative"]]),
                                                              "neutral" = (temp[["neutral"]] + classifications[["neutral"]]),
                                                              "count" = (temp[["count"]] + classifications[["count"]])
                                                              )
                            }
                        }
                    }

                    if (foundHashTag == FALSE)
                    {
                        print(sprintf("Poll %.0f, record %.0f of %.0f. No hashtag found in tweet text: %s.",
                                      p, i, numberOfResults, rawTweet))
                        print("Tweet tokens:")
                        print(tweetText)
                        ## return(0)
                        ## for (h in hashTags)
                        ## {
                        ##     print(sprintf("%s %s", h, hashTagIncluded(h, tweetText)))
                        ## }
                        missingTags <- missingTags + 1
                    }
                },
                error = function(e){
                    print(sprintf("Error processing %.0f of %.0f records.  Line skipped.", i, numberOfResults))
                }
                )
                ## print(pollPlottingData)
            }

            for (h in hashTags)
            {
                if (is.null(pollPlottingData[[h]]) == TRUE)
                {
                    pollPlottingData[[h]] <- emptyClassifications
                }
            }
        }
        plottingData <- plotSentimentData (hashTags, pollPlottingData, plottingData, p, polls, configurationData)
        
        timeStart <- timeEnd
        ## Sys.sleep(sleepyTime)
    }

    plottingData <- plotSentimentData (hashTags, pollPlottingData, plottingData, p, polls, configurationData)
    print(sprintf("Total %.0f tweets processed, %.0f missing all tags (%.0f%s).",
                  totalResults, missingTags, (missingTags/totalResults) * 100, "%"))

    save(returnValue, file = saveFile)
}

main <- function()
{
    configurationData <- parseConfigurationFile()

    ## print(configurationData)

    dbCon <- connectToDatabase(configurationData)

    lexicon <- lexiconWords(configurationData)

    positiveWords <- lexicon[["positive"]]
    negativeWords <- lexicon[["negative"]]

    stopWords <- getStopWords(configurationData)

    positiveWords <- normalizedText(positiveWords)
    negativeWords <- normalizedText(negativeWords)
    stopWords <- normalizedText(stopWords)

    sleepyTime <- as.numeric(configurationData[["SleepyTime"]])
    polls <- as.numeric(configurationData[["Poll"]])
    table <- configurationData[["PostgresTable"]]
    hashTags <- configurationData[["Hashtag"]]
    
    ## print(length(positiveWords))

    sqlQuery <- sprintf("select min(time) as earliest from %s;",
                        table)
    
    results <- dbGetQuery(dbCon, sqlQuery)

    timeStart <- results[1,1]

    sqlQuery <- sprintf("select max(time) as earliest from %s;",
                        table)
    
    results <- dbGetQuery(dbCon, sqlQuery)

    timeEnding <- results[1,1]

    print(sprintf("Earliest time in database: %.0f.  The latest time in the database: %.0f",
                  timeStart, timeEnding))

    temp <- as.integer((timeEnding - timeStart) / (polls))

    print(sprintf("Updating sleepyTime from %.0f to %.0f seconds.", sleepyTime, temp))

    sleepyTime <- temp

    configurationData[["SleepyTime"]] <- as.character(sleepyTime)

    jsonTweetFile <- "tweetsData"

    funcs <- c(plotSentimentDataControl, plotSendingData, plotLocationData)
    for (f in funcs)
    {
      par(mar = c(1, 3, 2, 1))
      d <- f(configurationData, dbCon, positiveWords, negativeWords, stopWords, hashTags, jsonTweetFile)
        readline(prompt="Press RETURN to go to the next plot.")
        dev.off()
    }

    d
}

main()
