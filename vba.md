---
layout: default
title: VBA
---

# Table of Contents

1. [Basic Line Chart](#basic-line-chart)
2. [Chart With Multiple Axes](#chart-with-multiple-axes)
3. [Adding Multiple Check Boxes and Links](#adding-multiple-check-boxes-and-links)
4. [Reset Button to Uncheck or Check All Boxes](#reset-button-to-uncheck-or-check-all-boxes)
5. [Apply Filter to Table](#apply-filter-to-table)
6. [Copy Contents From One Worksheet to Another](#copy-contents-from-one-worksheet-to-another)

---

## Basic Line Chart

```vbnet
Option Explicit

Sub generateChart1()

Dim max_row As Range
Dim source_data_range As String
Dim chart1 As ChartObject
Dim chart1_xvalue As String

Set max_row = Sheet1.Range("A:A").Find(What:="*", _
                                       After:=Sheet1.[A1], _
                                       LookIn:=xlValues, _
                                       SearchDirection:=xlPrevious)

source_data_range = "B1:C1,B2:C" & max_row.Row

Set chart1 = Sheet1.ChartObjects.Add(Left:=0, Top:=0, Width:=450, Height:=250)

chart1_xvalue = "='SHEET1'!$A$2:$A$" & max_row.Row

With chart1.Chart

  .SetSourceData Source:=Sheet1.Range(source_data_range)
  .ChartType = xlLine

  .FullSeriesCollection(1).AxisGroup = 1
  .FullSeriesCollection(1).XValues = chart1_xvalue

  .FullSeriesCollection(2).AxisGroup = 2
  .FullSeriesCollection(2).XValues = chart1_xvalue

  .HasTitle = True
  .ChartTitle.Text = "CHART 1 TITLE"
  .ClearToMatchStyle
  .ChartStyle = 322
  .SetElement (msoElementLegendBottom)

  .Axes(xlValue, xlPrimary).HasTitle = True
  .Axes(xlValue, xlPrimary).AxisTitle.Text = "PRIMARY AXIS"
  .Axes(xlValue, xlSecondary).HasTitle = True
  .Axes(xlValue, xlSecondary).AxisTitle.Text = "SECONDARY AXIS"
  .Axes(xlCategory).MajorUnit = 3
  .Axes(xlCategory).TickLabels.Orientation = xlUpward

  .Parent.Left = Sheet1.Range("D1").Left
  .Parent.Top = Sheet1.Range("D1").Top
  .Parent.Width = Sheet1.Range("D1:M1").Width
  .Parent.Height = Sheet1.Range("D1:D15").Height

  .ChartArea.Select

End With

End Sub
```

---

## Chart with Multiple Axes

```vbnet
Option Explicit

Sub generateChart2()

Dim max_row As Range
Dim source_data_range As String
Dim source_data_range2 As String
Dim chart2 As ChartObject
Dim chart2_xvalue As String

Set max_row = Sheet1.Range("A:A").Find(What:="*", _
                                       After:=Sheet1.[A1], _
                                       LookIn:=xlValues, _
                                       SearchDirection:=xlPrevious)

source_data_range = "='SHEET1'!$A$1:$A$365"

source_data_range2 = "='SHEET1'!$B$1:$B$" & max_row.Row

Set chart2 = Sheet2.ChartObjects.Add(Left:=0, Top:=0, Width:=450, Height:=250)

chart2_xvalue = "='SHEET1'!$A$1:$A$365"

With chart2.Chart

  .SetSourceData Source:=Sheet1.Range(source_data_range)
  .ChartType = xlLine

  .FullSeriesCollection(1).AxisGroup = 1
  .FullSeriesCollection(1).Name = "=""GROUP1"""
  .FullSeriesCollection(1).XValues = chart2_xvalue

  .SeriesCollection.NewSeries
  .FullSeriesCollection(2).AxisGroup = 1
  .FullSeriesCollection(2).Values = "='SHEET1'!$A$1:$A$7"
  .FullSeriesCollection(2).Name = "=""GROUP2"""

  .SeriesCollection.NewSeries
  .FullSeriesCollection(3).AxisGroup = 1
  .FullSeriesCollection(3).Values = "='SHEET1'!$A$7:$A$14"
  .FullSeriesCollection(3).Name = "=""GROUP3"""

  .ClearToMatchStyle
  .ChartStyle = 322
  .SetElement (msoElementLegendBottom)

  .Axes(xlValue).MinimumScale = 0
  .Axes(xlCategory).MajorUnitScale = xlMonths
  .Axes(xlCategory).MajorUnit = 1
  .Axes(xlCategory).TickLabels.NumberFormat = "[$-en-US]d-mmm;@"

  .Parent.Left = Sheet2.Range("A1").Left
  .Parent.Top = Sheet2.Range("A1").Top
  .Parent.Width = Sheet2.Range("A1:F1").Width
  .Parent.Height = Sheet2.Range("A1:A20").Height

  .ChartArea.Select

End With

End Sub
```

---

## Adding Multiple Check Boxes and Links

```vbnet
Option Explicit

Sub checkBoxes()

Dim sheet_num As Worksheet
Dim sheet_num_range As Range
Dim col_offset As Integer
Dim cell As Range
Dim ch_box As CheckBox

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
' adjust below dimensions accordingly:
' sheet_num = specific sheet number, not sheet name, where checkboxes are desired
' sheet_num_range = range within the sheet number to insert the checkboxes
' col_offset = column where linked cell will be in reference to checkbox cell
 '             (ie 1 is right 1, -1 is left 1)
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

Set sheet_num = Sheet1
Set sheet_num_range = sheet_num.Range("A1:A10")
col_offset = 1

For Each cell In sheet_num_range
  Set ch_box = sheet_num.checkBoxes.Add(cell.Left, cell.Top, cell.Width, cell.Height)
  With ch_box
    .Caption = ""
    .LinkedCell = .TopLeftCell.Offset(0, col_offset).Address
  End With
Next

End Sub
```

---

## Reset Button to Uncheck or Check All Boxes

```vbnet
Option Explicit

Sub resetButton()

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
' adjust sheet number accordingly
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

Worksheets(1).CheckBoxes.Value = False

End Sub
```

---

## Apply Filter to Table

```vbnet
Option Explicit

Sub filter()

Dim table As ListObject

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
' adjust sheet number accordingly
' tables are their chronological List Object, or just put their names in quotes
' Field = column number
' Criteria1 = filter
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

Set table = Worksheets(1).ListObjects(1)

table.Range.AutoFilter Field:=1, Criteria1:="="

End Sub
```

---

## Copy Contents From One Worksheet to Another

*The following code does quite a few things, so I will isolate each code block and explain some of the functionalities preceding each code block*

### **generateWIP**
- This sub runs all the other subs
- First, I declare public variables to be used throughout the macro
- `Application.ScreenUpdating = False` allows the macro to run without opening windows, speeding up the code; this must be turned to `True` before the macro ends
- Error handling is handled after the macro finishes; `error_code` and `error_message` are saved as public variables so they can be used for other errors, not just in the specific code block

```vbnet
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'Public variables must be saved outside of functions to be used throughout
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

Public error_code, _
       error_message, _
       main_wip_name, _
       team_wip_name _
       As String

Option Explicit

Sub generateWIP()

Application.ScreenUpdating = False

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'STEP 1 - RESET VARIABLES
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

resetVariables

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'STEP 2 - SELECT MAIN WIP FILE AND CHECK IF TEAM WIP IS OPEN
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

selectWIP

If error_code = 1 Then
  MsgBox Prompt:=error_message, Title:="Error"
  Application.ScreenUpdating = True
  Exit Sub
End If

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'STEP 3 - COPY DATA FROM MAIN WIP
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

copyWIP

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'STEP 4 - APPLY TEMPLATE TO WIP
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

applyTemplate

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'STEP 5 - CLOSE WIP GENERATOR
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

closeGenerator

End Sub
```

---

### **resetVariables**

- This resets all public variables so the code can run from a clean slate

```vbnet
Sub resetVariables()

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'STEP 1 - RESET VARIABLES
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

error_code = vbNullString
error_message = vbNullString
main_wip_name = vbNullString
team_wip_name = vbNullString

End Sub
```

---

### **selectWIP**

- The user selects the  file from the specified folder and this gets saved as a variable
- Error handling is first introduced here; `0` denotes success and `1` denotes failure, like Bash and others
    - `error_code` and `error_message` are handled outside this in `generateWIP` macro
- Also checks to see if one of the principle files to be opened is already opened; if it is, another error ensues

```vbnet
Sub selectWIP()

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'STEP 2 - SELECT MAIN WIP FILE AND CHECK IF TEAM WIP IS OPEN
'- select WIP
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

Dim team_wip_wb As Workbook

With Application.FileDialog(msoFileDialogFilePicker)
  .AllowMultiSelect = False
  .InitialFileName = "C:\Users\smats\WEEKLY REPORT"
  .Title = "Select the WIP"
  If .Show = -1 Then
    main_wip_name = .SelectedItems.Item(1)
  Else
    error_code = 1
    error_message = "File not selected."
    Exit Sub
  End If
End With

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'- check if team WIP is already open; close macro if it is
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

team_wip_name = "240.3 Weekly WIP Status.xlsx"

Set team_wip_wb = Workbooks.Open("C:\Users\smats\WIP STATUS\" & team_wip_name)

If team_wip_wb.ReadOnly Then
  team_wip_wb.Close
  error_code = 1
  error_message = "Team's WIP is already open - can't continue till it's closed."
  Exit Sub
End If

End Sub
```

---

### **copyWIP**

- First, open a read-only version of the user-specified file in the previous step
- An array is created from the values of of the second column in a table
    - `Application.Transpose` must be used in order to turn the initial 2D array into a 1D array
- Filters are then applied to a specfic worksheet, using the transposed array as filter criteria
- All data that is above the last line of data is copied onto a template file
    - `main_wip_ws.Cells(Rows.Count, 1).End(xlUp).Row` finds the last used row

```vbnet
Sub copyWIP()

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'STEP 3 - COPY DATA FROM MAIN WIP
'- open a read-only version of the file
'- create an array based on the last names from the team_name tables
'- apply filters with the array
'- copy as values to the WIP template
'- close file without saving
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

Dim team_row_num, row_num As Long
Dim team_names_array As Variant
Dim main_wip_wb As Workbook
Dim main_wip_ws As Worksheet

Set main_wip_wb = Workbooks.Open(main_wip_name, , True)
Set main_wip_ws = main_wip_wb.Worksheets("NRFK")

With Workbooks("WIP Generator.xlsm").Worksheets(1)
  team_names_array = .ListObjects("team_names").DataBodyRange.Columns(2)
  team_names_array = Application.Transpose(team_names_array)
End With

main_wip_ws.Range("A:A").AutoFilter _
                         Field:=1, _
                         Criteria1:="SHORE", _
                         Operator:=xlFilterValues
main_wip_ws.Range("B:B").AutoFilter _
                         Field:=2, _
                         Criteria1:=team_names_array, _
                         Operator:=xlFilterValues

row_num = main_wip_ws.Cells(Rows.Count, 1).End(xlUp).Row

main_wip_ws.Range("A1:E" & row_num).Copy _
Workbooks("WIP Generator.xlsm").Worksheets(2).Range("A1")

main_wip_wb.Close SaveChanges:=False

End Sub
```

---

### **applyTemplate**

- Once the data is copied, it is then transferred to another worksheet
    - `team_wip_wb.Worksheets(Worksheets.Count).Index` captures the last sheet number; pasting after this makes it now this number plus one
- Among many things, this reformats the data:
    - The `vlookup` formula included on this sheet references cell `J1`, which is just the name of the previous sheet; this formula is copied down
    - Once copied, is pasted over so only the values remain
    - Filters are applied, as well as an auto-fit, changing of column widths for certain columns, and hiding columns
    - Headers are turned black with bold white font, and all borders are marked

```vbnet
Sub applyTemplate()

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'STEP 4 - APPLY TEMPLATE TO WIP
'- open team's WIP spreadsheet
'- count last sheet number in all sheets
'- copy the template to the page after the last page
'- save this copied worksheet as the last sheet + 1
'- with this worksheet, apply all formatting to it
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

Dim last_sheet, row_num As Long
Dim team_wip_wb As Workbook
Dim team_wip_ws As Worksheet

Set team_wip_wb = Workbooks.Open("C:\Users\smats\WIP STATUS\" & team_wip_name)

last_sheet = team_wip_wb.Worksheets(Worksheets.Count).Index

Workbooks("WIP Generator.xlsm").Worksheets(2).Copy _
  After:=team_wip_wb.Worksheets(last_sheet)

Set team_wip_ws = team_wip_wb.Worksheets(last_sheet + 1)

With team_wip_ws
  row_num = .Cells(Rows.Count, 1).End(xlUp).Row
  .Range("J1") = team_wip_wb.Worksheets(last_sheet).Name
  .Name = Format(Now(), Format:="mm-dd-yy")
  .Range("F2:G2").AutoFill _
    Destination:=team_wip_ws.Range("F2:G" & row_num), _
    Type:=xlFillDefault
  .Range("F2:G" & row_num).Copy
    team_wip_ws.Range("F2").PasteSpecial Paste:=xlPasteValues
  .Range("A1:H1").AutoFilter
  .Columns("A:H").AutoFit
  .Columns("F:G").ColumnWidth = 75
  .Range("A:A,B:B,E:E").EntireColumn.Hidden = True
  .Range("A1:H1").Interior.ThemeColor = xlThemeColorLight1
  With .Range("A1:H1").Font
    .ThemeColor = xlThemeColorDark1
    .Bold = True
  End With
  .Range("A1:H" & row_num).Borders(xlEdgeLeft).LineStyle = xlContinuous
  .Range("A1:H" & row_num).Borders(xlEdgeRight).LineStyle = xlContinuous
  .Range("A1:H" & row_num).Borders(xlEdgeTop).LineStyle = xlContinuous
  .Range("A1:H" & row_num).Borders(xlEdgeBottom).LineStyle = xlContinuous
  .Range("A1:H" & row_num).Borders(xlInsideVertical).LineStyle = xlContinuous
  .Range("A1:H" & row_num).Borders(xlInsideHorizontal).LineStyle = xlContinuous
End With

End Sub
```

---

### **closeGenerator**

- Lastly, this turns `Application.ScreenUpdating = True` so macros can run "normally" again
- The file from which the macro runs is closed so only the main file remains

```vbnet
Sub closeGenerator()

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'STEP 5 - CLOSE WIP GENERATOR
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

MsgBox Prompt:="Finished!", Title:="Success!"

Application.ScreenUpdating = True

Workbooks("WIP Generator.xlsm").Close SaveChanges:=False

End Sub
```