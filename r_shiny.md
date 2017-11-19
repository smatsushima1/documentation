---
layout: default
title: R Shiny
---

# Auto-switching tabs

*https://groups.google.com/forum/#!topic/shiny-discuss/Zmp1bkqTfB0 *

```r
library(shiny)

##############################################################################
# functions
# change #tabset in var tabs to match tabsetPanel id
# change 3000 to any other milisecond value
##############################################################################

# switches every 3 seconds
tab_script <- "var tab_switch = setInterval(function() {
                 var tabs = $('#tabset li'),
                 active = tabs.filter('.active'),
                 next = active.next('li'),
                 toClick = next.length ? next.find('a') : tabs.eq(0).find('a');
                 toClick.trigger('click');
                 }, 3000);"

##############################################################################
# ui
##############################################################################

ui <- fluidPage(h1("Auto-Switching Tabs", align = "center"),
                tabsetPanel(id = "tabset",
                            tabPanel("Tab 1", h1("1")),
                            tabPanel("Tab 2", h1("2")),
                            tabPanel("Tab 3", h1("3"))),
                tags$script(HTML(tab_script)))

##############################################################################
# server
##############################################################################

server <- function(input, output) {

}

##############################################################################
# run app
##############################################################################

shinyApp(ui, server)

```

---

# Downloading excel files

```r
library(shiny)
library(openxlsx)

##############################################################################
# functions
##############################################################################

sysdate <- Sys.Date()
sysdate <- format(sysdate, format = "%m-%d-%Y")

file_name <- paste("data", sysdate, sep = "-")

##############################################################################
# ui
##############################################################################

ui <- shinyUI(navbarPage("Downloading Excel Files with openxlsx",
                         tabPanel("Data w/ Tablestyle", downloadButton("download_1", "Download")),
                         tabPanel("Data w/o Tablestyle", downloadButton("download_2", "Download"))
                         ))

##############################################################################
# server
##############################################################################

server <- function(input, output, session) {

session$allowReconnect(TRUE)

##############################################################################
# data
##############################################################################

df_1 <- data.frame(column_1 = c("1", "2", "3"),
                   column_2 = c("a", "b", "c"))

df_2 <- data.frame(column_1 = c("4", "5", "6"),
                   column_2 = c("d", "e", "f"))

##############################################################################
# output
##############################################################################

output$download_1 <- downloadHandler(filename = paste(file_name, "xlsx", sep = "."),
                                     content = function(download_file) {
  
                                       # R creates a temp file to be worked on but requires a '.xlsx' extension
                                       temp <- tempfile(fileext = ".xlsx")
  
                                       # creates base workbook to be
                                       workbook <- createWorkbook()
  
                                       # adds sheets
                                       addWorksheet(wb = workbook, sheetName = "sheet_01")
                                       addWorksheet(wb = workbook, sheetName = "sheet_02")
  
                                       # writes data to sheets as a table, with a table syle
                                       writeDataTable(wb = workbook, sheet = "sheet_01", x = df_1, tableStyle = "TableStyleMedium2")
                                       writeDataTable(wb = workbook, sheet = "sheet_02", x = df_2, tableStyle = "TableStyleMedium2")
  
                                       # auto-fit column widths for each sheet
                                       setColWidths(wb = workbook, sheet = "sheet_01", cols = 1:ncol(df_1), widths = "auto")
                                       setColWidths(wb = workbook, sheet = "sheet_02", cols = 1:ncol(df_2), widths = "auto")
  
                                       # saves all changes to workbook
                                       saveWorkbook(wb = workbook, file = download_file, overwrite = TRUE)
  
                                       # rewrites temp file as file to be downloaded
                                       file.rename(temp, download_file)
                                     })

# an alternative to the previous method, with less syntax but no table styles
output$download_2 <- downloadHandler(filename = paste(file_name, "xlsx", sep = "."),
                                     content = function(download_file) {
                                       temp <- tempfile(fileext = ".xlsx")
  
                                       write.xlsx(x = list(df_1, df_2),
                                                  file = temp,
                                                  asTable = TRUE,
                                                  colWidths = "auto",
                                                  sheetName = c("sheet_01", "sheet_02"))
  
                                       file.rename(temp, download_file)
                                       })

}

##############################################################################
# run app
##############################################################################

shinyApp(ui, server)

```
