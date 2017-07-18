## Follow these steps to create new user/connect pgadmin to local Postgres instance
## http://stackoverflow.com/questions/24917832/how-connect-postgres-to-localhost-server-using-pgadmin-on-ubuntu


parseConfigurationFile <- function(fileName="config.txt")
{
    returnValue <- list(
        "APIPrivateKey" = NULL,
        "APIPublicKey"	= NULL,
        "CollectionFile" = NULL,
        "ColorNegative" = "BLACK",
        "ColorNeutral" = "WHITE",
        "ColorPositive" = "GREEN",
        "LexiconFile" = "lexicon.csv",
        "Offset" = "FALSE",
        "Poll" = 23,
        "ResetDatabase" = "FALSE",
        "SleepyTime" = 5,
        "SourceFile" = NULL,
        "StopwordsFile" = "stopwords.txt",
        "ThresholdNegative" = 0.33,
        "ThresholdPositive" = 0.33,
        "Hashtag" = NULL,
        "PostgresUser" = "openpg",
        "PostgresPassword" = "new_user_password",
        "PostgresTable" = "tweets"
    )

    if (file.exists(fileName) == TRUE)
    {
        con <- file(fileName, open="rb")

        while (TRUE)
        {
            line <- readLines(con, n = 1)
            if (identical(line, character(0)))
                break
            ## print(line)
            if (nchar(line) > 0)
            {
                if (substr(line, 1, 1) != "#")
                {
### process line

                    fields <- strsplit(line, "\\s+", perl=TRUE)
                    token <- fields[[1]][1]
                    temp <- fields[[1]][2]
                    data <- strsplit(temp, "#", fixed=TRUE)[[1]][1]
                    ## print(token); print(data)
                    if (token == "Hashtag")
                    {
                        returnValue[[token]] <- c(returnValue[[token]], data)
                    }
                    else
                    {
                        returnValue[[token]] = data    
                    }
                    
                }
            }
        }

        close(con)
    }
    returnValue
}

connectToDatabase <- function(configurationData)
{
    drv <- dbDriver("PostgreSQL")

    all_cons <- dbListConnections(drv)
    print(sprintf("Closing %.0f existing connections to the database.", length(all_cons)))
    
    for(con in all_cons)
    {
        dbDisconnect(con)
    }

    con <- dbConnect(drv,
                     dbname = "postgres",
                     host = "localhost",
                     port = 5432,
                     user = configurationData[["PostgresUser"]],
                     password = configurationData[["PostgresPassword"]])

    con
}



processText <- function(text, stopWords)
{
    lengthOfText <- length(text)
    ## print(sprintf("%s() lengthOfText = %.0f",
    ##               as.character(match.call()[[1]]),
    ##               lengthOfText))

    ## print(head(text))
    
    text <- iconv(text, "latin1", "ASCII", sub="")
    ## print("after iconv");print(head(text))

    text <- lapply(text, function(x)strsplit(x, "\\s+", perl=TRUE)[[1]])
    ## text <- strsplit(text, "\\s+", perl=TRUE)[[1]] 

    text <- unlist(text)
    ## print("after strsplit");print(head(text))

    processedText <- normalizedText(text)

    assign ("numberOfWords",length(processedText), envir=globalenv())
    
    processedText <- cleansedText(processedText, stopWords)

    ## print("head(processedText)");    print(head(processedText))
    processedText
}


cleansedText <- function(text, stopWords)
{
    indices <- match(stopWords, text)

    indices <- indices[!is.na(indices)]

    while(length(indices) > 0)
    {
        ## print("text before removal"); print(text)
        text <- text[-indices]
        ## print("text after removal"); print(text)
        indices <- match(stopWords, text)

        indices <- indices[!is.na(indices)]
    }
    
    returnValue <- text

    returnValue
}

normalizedText <- function(text, printer=FALSE)
{
    words <- iconv(text, "latin1", "ASCII", sub="")

    words <- tolower(words)
    words <- gsub("@", " ", words)
    words <- gsub("’", " ", words)
    words <- gsub("'", " ", words)
    words <- gsub("-", " ", words)
    words <- gsub(";", " ", words)
    words <- gsub(".", " ", words, fixed = TRUE)
    words <- gsub(",", " ", words, fixed = TRUE)
    words <- gsub("/", " ", words, fixed = TRUE)
    words <- gsub("(", " ", words, fixed = TRUE)
    words <- gsub(")", " ", words, fixed = TRUE)
    words <- gsub("&", " ", words, fixed = TRUE)
    words <- gsub(":", " ", words, fixed = TRUE)

    words <- unlist(lapply(words, trimws))

    words <- removePunctuation(words)
    words <- removeNumbers(words)
    words <- wordStem(words, language = "english")

    words <- unlist(unlist(lapply(words, function(x) strsplit(x, "\\s+", perl=TRUE))))

    ## words <- wordStem(words)

    if (printer == TRUE)
    {
        print("normalizedText() words")
        print(words)
    }

    returnValue <- words

    returnValue
}

lexiconWords <- function(configurationData)
{
    file <- configurationData[["LexiconFile"]]
    d <- read.csv(file, header=TRUE)
    positive <- as.character(d[d$polarity=="positive",]$word)
    negative <- as.character(d[d$polarity=="negative",]$word)

    returnValue <- list("positive" = positive,
                        "negative" = negative)
}

getStopWords <- function(configurationData)
{
    con <- file(configurationData[["StopwordsFile"]], "r")
    returnValue <- readLines(con)
    close(con)

    returnValue
}

getTweetTokens <- function(configurationData,locationSaveFile="tokensData")
{

    
    if (file.exists(locationSaveFile) == TRUE)
    {
        print(sprintf("Loading token data from file: %s", locationSaveFile))
        load(locationSaveFile)
    }
    else
    {
        returnValue <- c()

        results <- getTweetsAsJSON(configurationData)
        ## dbCon <- connectToDatabase(configurationData)

        ## table <- configurationData[["PostgresTable"]]

        ## sqlQuery <- sprintf("select data from %s", table)

        ## results <- dbGetQuery(dbCon, sqlQuery)

        numberOfResults <- length(results)
        printCounter <- 0
        printCounterLimit <- 1000
        for (i in 1:numberOfResults)
        {
            printCounter <- printCounter + 1
            if (printCounter >= printCounterLimit)
                {
                    print(sprintf("Completed tokenizing %s of %s tweets",
                                  prettyNum(i,big.mark=","),
                                  prettyNum(numberOfResults,big.mark=",")))
                    printCounter <-  0
                }

            ## json <- base64Decode(results$data[i])
            json <- results[i]
            df <- parseTweets(json, simplify=FALSE, verbose=FALSE)
            rawTweet <- df$text
            returnValue <- c(returnValue, strsplit(rawTweet, "\\s+"[[1]]))
        }
        
        ## dbDisconnect(dbCon)

        save(returnValue, file = locationSaveFile)
    }

    returnValue
}

getTweetsAsJSON <- function(configurationData, saveFile="tweetsData")
{

    
    if (file.exists(saveFile) == TRUE)
    {
        print(sprintf("Loading tweets from file: %s", saveFile))
        load(saveFile)
    }
    else
    {
        returnValue <- c()

        dbCon <- connectToDatabase(configurationData)

        table <- configurationData[["PostgresTable"]]

        sqlQuery <- sprintf("select data from %s", table)

        results <- dbGetQuery(dbCon, sqlQuery)

        numberOfResults <- length(results$data)
        printCounter <- 0
        printCounterLimit <- 1000
        for (i in 1:numberOfResults)
        {
            printCounter <- printCounter + 1
            if (printCounter >= printCounterLimit)
                {
                    print(sprintf("Completed processing %s of %s tweets",
                                  prettyNum(i,big.mark=","),
                                  prettyNum(numberOfResults,big.mark=",")))
                    printCounter <-  0
                }

            json <- base64Decode(results$data[i])
            returnValue <- c(returnValue, json)
        }
        
        dbDisconnect(dbCon)

        save(returnValue, file = saveFile)
    }

    returnValue
}

classify <- function(words, pos.words, neg.words, configurationData, count=1)
{
    positiveTweet <- FALSE
    negativeTweet <- FALSE
    neutralTweet <- FALSE
    pos.matches <- 0
    neg.matches <- 0
    neutral.words <- 0
    percentPositive <- 0
    percentNegative <- 0
    percentNeutral <- 0
    
    if(is.null(words) == FALSE)
    {
        numberOfWords <- length(words)
                                        # count number of positive and negative word matches
        pos.matches <- sum(words %in% pos.words)
        neg.matches <- sum(words %in% neg.words)
        neutral.words <- numberOfWords - pos.matches - neg.matches
        percentPositive <- pos.matches / numberOfWords
        percentNegative <- neg.matches / numberOfWords
        percentNeutral <- neutral.words / numberOfWords

        positiveTweet <- percentPositive >= configurationData[["ThresholdPositive"]]
        negativeTweet <- percentNegative >= configurationData[["ThresholdNegative"]]
        neutralTweet <- FALSE

        if (((positiveTweet == TRUE) && (negativeTweet == TRUE) ) ||
            ((positiveTweet == FALSE) && (negativeTweet == FALSE) ))
        {
            neutralTweet <- TRUE
            positiveTweet <- FALSE
            negativeTweet <- FALSE
        }

    }
    returnValue <- list("positive" = positiveTweet,
                        "negative" = negativeTweet,
                        "neutral" = neutralTweet,
                        "count" = count,
                        "positiveCount" = pos.matches,
                        "negativeCount" = neg.matches,
                        "neutralCount" = neutral.words,
                        "percentPositive" = percentPositive,
                        "percentNegative" = percentNegative,
                        "percentNeutral" = percentNeutral
                        )
    returnValue
}
