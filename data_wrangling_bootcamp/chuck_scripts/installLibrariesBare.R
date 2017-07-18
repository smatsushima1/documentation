## https://gist.github.com/stevenworthington/3178163

rm(list=ls())

ipak <- function(pkg){
    new.pkg <- pkg[!(pkg %in% installed.packages()[, "Package"])]
    if (length(new.pkg)) 
        install.packages(new.pkg, dependencies = TRUE)
    sapply(pkg, require, character.only = TRUE)
}


neededPackages = c(
"bitops",
"DBI",
"ggmap",
"ggplot2",
"httr",
"jsonlite",
"mapdata",
"mapplots",
"mapproj",
"maps",
"methods",
"NLP",
"openssl",
"RCurl",
"rjson",
"ROAuth",
"RPostgreSQL",
"SnowballC",
"streamR",
"tm"
)

ipak(neededPackages)

print ("All packages installed.")    
