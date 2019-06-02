---
layout: default
title: VBA
---

# Charts

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
' col_offset = column offset where linked cell will be in reference to checkbox cell
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

## Reser Button to Uncheck or Check All Boxes

```vbnet
Option Explicit

Sub resetButton()

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
' adjust sheet number accordingly
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

Sheet1.CheckBoxes.Value = False

End Sub
```

## Apply Filter to Table

```vbnet
Option Explicit

Sub filter()

Dim table As ListObject

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
' adjust sheet number accordingly
' tables are their chronological List Object
' Field = column number
' Criteria1 = filter
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

Set table = Sheet1.ListObjects(1)

table.Range.AutoFilter Field:=1, Criteria1:="="

End Sub
```
