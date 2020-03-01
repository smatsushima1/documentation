---
layout: default
title: VBA
---

# **Table of Contents**

1. [Common Variables](#common-variables)
2. [Charts](#charts)
    - [Basic Line Chart](#basic-line-chart)
    - [Chart With Multiple Axes](#chart-with-multiple-axes)
3. [Checkboxes](#checkboxes)
    - [Adding Multiple Check Boxes and Links](#adding-multiple-check-boxes-and-links)
    - [Uncheck or Check All Boxes](#uncheck-or-check-all-boxes)
4. [Filters](#filters)
    - [Loop Through All Columns and Reset All](#loop-through-all-columns-and-reset-all)
    - [Find Column Name in Table and Apply Filter](#find-column-name-in-table-and-apply-filter)
    - [Pivot Table Filters](#pivot-table-filters)
5. [Find](#find)
    - [Fix to Find First Occurence on Row 1](#fix-to-find-first-occurence-on-row-1)
6. [Copy Contents From One Worksheet to Another](#copy-contents-from-one-worksheet-to-another)
    - [generateWIP](#generatewip)
    - [resetVariables](#resetvariables)
    - [selectWIP](#selectwip)
    - [copyWIP](#copywip)
    - [applyTemplate](#applytemplate)
    - [closeGenerator](#closegenerator)
7. [Folder Generator](#folder-generator)
8. [Send Emails Based on Conditionals](#send-emails-based-on-conditionals)
9. [UserForm Basics](#userform-basics)
    - [Generating the UserForm](#generating-the-userform)
    - [Modify UserForm Initialization](#modify-userform-initialization)
    - [Modifying Text Box Changes](#modifying-text-box-changes)
    - [CommandButton Modification](#commandbutton-modification)
    - [Auto-Updating List Box and Auto-Closing](#auto-updating-list-box-and-auto-closing)
10. [Auto-Updating Button Position](#auto-updating-button-position)
11. [Print Columns to Fit Page](#print-columns-to-fit-page)
12. [Find Unique Values and Navigate to Location](#find-unique-values-and-navigate-to-location)
    - [Identify Unique Values in an Array](#identify-unique-values-in-an-array)
    - [Navigate to the Associated Folder](#navigate-to-the-associated-folder)
    - [Add Folder Location](#add-folder-location)
    - [Exit UserForm](#exit-userForm)
13. [Auto-Save Workbook](#auto-save-workbook)
14. [VBscript](#vbscript)
    - [Running a Macro](#running-a-macro)
    - [Printing to Console](#printing-to-console)
    - [Passing Arguments](#passing-arguments)

---

## **Common Variables**

Workbook Info
```vbnet
'workbook name
ThisWorkbook.Name

'worksheet as an object
Dim ws as Worksheet
Set ws = ThisWorkbook.Worksheets(1)
```

First and last rows and columns
```vbnet
'last row
ws.Cells(Rows.Count, 1).End(xlUp).Row

'last column
ws.Cells(1, Columns.Count).End(xlToLeft).Column

'columns used alternate
ws.Rows(1).Find(What:=vbNullString, _
                SearchOrder:=xlByColumns, _
                SearchDirection:=xlNext).Column
```

Filters
```vbnet
'data tables
'Field is the column index
ws.ListObjects("TABLE").Range.AutoFilter Field:=1, Criteria1:="="

'auto-filters
ws.Range("A:A").AutoFilter Field:=1, Criteria1:="="

'reset all values in a data table
ws.ListObjects("TABLE").Range.AutoFilter Field:=1
```

Miscellaneous
```vbnet
'module subroutine to automatically run on workbook opening
Private Sub Auto_Open()
End Sub

'check for network connection
If Dir("I:\", vbDirectory) = vbNullString Then
  MsgBox "No connection"
End If
```
---

## **Charts**
### **Basic Line Chart**
```vbnet
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
```
---
### **Chart with Multiple Axes**
```vbnet
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
```
---

## **Checkboxes**
### **Adding Multiple Check Boxes and Links**
```vbnet
Dim ws As Worksheet
Dim sheet_num_range As Range
Dim col_offset As Integer
Dim cell As Range
Dim ch_box As CheckBox

'Adjust below dimensions accordingly:
'sheet_num = specific sheet number, not sheet name, where checkboxes are desired
'sheet_num_range = range within the sheet number to insert the checkboxes
'col_offset = column where linked cell will be in reference to checkbox cell
'             (ie 1 is right 1, -1 is left 1)

Set ws = ThisWorkbook.Worksheets(1)
Set sheet_num_range = ws.Range("A1:A10")
col_offset = 1

For Each cell In sheet_num_range
  Set ch_box = ws.checkBoxes.Add(cell.Left, cell.Top, cell.Width, cell.Height)
  With ch_box
    .Caption = ""
    .LinkedCell = .TopLeftCell.Offset(0, col_offset).Address
  End With
Next
```
### **Uncheck or Check All Boxes**
```vbnet
'False will uncheck all boxes, True will check all boxes
ThisWorkbook.Worksheets(1).CheckBoxes.Value = False
```

---
## **Filters**
### **Loop Through All Columns and Reset All**
```vbnet
Dim col As Long
Dim ws as Worksheet

Set ws = ThisWorkbook.Worksheets(1)
col = ws.Cells(1, Columns.Count).End(xlToLeft).Column

For i = 1 To col
  ws.ListObjects("Table1").Range.AutoFilter Field:=i
Next i
```

### **Find Column Name in Table and Apply Filter**
```vbnet
Dim ws as Worksheet
Dim col_name as String
Dim col As Long

Set ws = ThisWorkbook.Worksheets(1)
col_name = "Column5"
col = ws.Rows(1).Find(what:=col_name).Column

ws.ListObjects("Table1").Range.AutoFilter Field:=col, Criteria1:="1"
```

### **Pivot Table Filters**
```vbnet
Dim ws as Worksheet
Dim i, j as long
Dim field, criteria as String

Set ws = Thisworkbook.Worksheets(1)

field = "FY"
criteria = "FY18"

'first loop through each pivot table (names are in the array) and clear all filters
'next, only search for criteria specified within the field variable and make
'  it the only visible criteria in the table
'else make all others invisilble
'lastly, autofit the columns since pivot tables don't do that for some reason
For Each i In Array("count", "sum_awarded", "sum_savings", "average_savings")
  With ws
    With .PivotTables(i).PivotFields(field)
      .ClearAllFilters
      For j = 1 To .PivotItems.count
        If .PivotItems(j).Name = criteria Then
          .PivotItems(j).Visible = True
        Else
          .PivotItems(j).Visible = False
        End If
      Next j
    End With
    .Columns("A:B").EntireColumn.AutoFit
  End With
Next i
```
---

## **Find**
### **Fix to Find First Occurence on Row 1**
- For whatever reason, `Find` won't find the first occorence of something if it occurs on row 1
- To fix this, search for it with the last row used in the column under the `After` variable
- This will reset the position to start searching for everything at the beginning of the data set
```vbnet
Dim ws As Worksheet
Dim last_row As Long

Set ws = ThisWorkbook.Worksheets(1)

last_row = ws.Cells(Rows.Count, 1).End(xlUp).Row

Debug.Print ws.Columns(9).Find("a", After:=ws.Cells(last_row + 1, 1)).Row
```
---

## **Copy Contents From One Worksheet to Another**
*The following code does quite a few things, so I will isolate each code block and explain some of the functionalities preceding each code block*

### **generateWIP**
- This sub runs all the other subs
- First, I declare public variables to be used throughout the macro
- `Application.ScreenUpdating = False` allows the macro to run without opening windows, speeding up the code; this must be turned to `True` before the macro ends
- Error handling is handled after the macro finishes; `error_code` and `error_message` are saved as public variables so they can be used for other errors, not just in the specific code block

```vbnet
'public variables must be saved outside of functions to be used throughout
Public error_code, _
       error_message, _
       main_wip_name, _
       team_wip_name _
       As String

Option Explicit

Sub generateWIP()

Application.ScreenUpdating = False

'step 1 - reset variables
resetVariables

'step 2 - select main wip file and check if team wip is open
selectWIP

If error_code = 1 Then
  MsgBox Prompt:=error_message, Title:="Error"
  Application.ScreenUpdating = True
  Exit Sub
End If

'step 3 - copy data from main wip
copyWIP

'step 4 - apply template to wip
applyTemplate

'step 5 - close wip generator
closeGenerator

End Sub
```
---

### **resetVariables**
- This resets all public variables so the code can run from a clean slate
```vbnet
Sub resetVariables()

'step 1 - reset variables
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
- The macro running this must be in the same folder as the team's WIP; the path of this file is used for the path of the team's WIP
- Also checks to see if one of the principle files to be opened is already opened; if it is, another error ensues
```vbnet
Sub selectWIP()

'step 2 - select main wip file and check if team wip is open

Dim team_wip_path As String
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

'check if team WIP is already open; close macro if it is

team_wip_name = "240.3 Weekly WIP Status.xlsx"

team_wip_path = Workbooks("WIP Generator.xlsm").path

Set team_wip_wb = Workbooks.Open(team_wip_path & "\" & team_wip_name)

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

'step 3 - copy data from main wip
'open a read-only version of the file
'create an array based on the last names from the team_name tables
'apply filters with the array
'copy as values to the WIP template
'close file without saving

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

'step 4 - apply template to wip
'open team's WIP spreadsheet
'count last sheet number in all sheets
'copy the template to the page after the last page
'save this copied worksheet as the last sheet + 1
'with this worksheet, apply all formatting to it

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

'step 5 - close wip generator

MsgBox Prompt:="Finished!", Title:="Success!"

Application.ScreenUpdating = True

Workbooks("WIP Generator.xlsm").Close SaveChanges:=False

End Sub
```
---

## **Folder Generator**
*This will take text inputted into text content controls and apply them to other documents*
### **Generating the Subroutine**
- One sub will run all the vba code; this way, error-handling is much easier managed
- Public variables are defined here to be used throughout all other subs
```vbnet
'public variables must be saved outside of functions to be used throughout

Public error_code, _
       error_message, _
       file_name, _
       description, _
       initials, _
       pr, _
       ige, _
       supp_service, _
       psc, _
       naics, _
       ja, _
       delivery_date, _
       requirement_type, _
       it, _
       directory_name, _
       sap_folder, _
       large_folder1, _
       large_folder2, _
       large_folder3, _
       large_folder4, _
       large_folder5, _
       large_folder6 _
  As String

Option Explicit
Sub generateRequirement()

Application.ScreenUpdating = False

'step 1 - reset variables
resetVariables

'step 2 - save input as public variables
saveInput

'step 3 - create initial folder in specified location
createFolder

If error_code = 1 Then
  MsgBox error_message, Title:="Error"
  resetVariables
  Application.ScreenUpdating = True
  Exit Sub
End If

'step 4 - create subfolders within main folder
createSubfolders

'step 5 - populate forms with data and save in subfolders
populateForms

'finished

MsgBox "E-file requirement successfully generated!", Title:="Success!"

resetVariables

Application.ScreenUpdating = True

End Sub
```

### **Resetting Variables**
- This sub is utilized so that all global variables can't be re-used in future sub calls in case errors prevent the code from finishing
- Global variables are to be re-defined after utilizing the main sub
```
Sub resetVariables()

'step 1 - reset variables
'reset all variables before running all other steps

error_code = vbNullString
error_message = vbNullString
file_name = vbNullString
description = vbNullString
initials = vbNullString
pr = vbNullString
ige = vbNullString
supp_service = vbNullString
psc = vbNullString
naics = vbNullString
ja = vbNullString
delivery_date = vbNullString
requirement_type = vbNullString
it = vbNullString
directory_name = vbNullString
sap_folder = vbNullString
large_folder1 = vbNullString
large_folder2 = vbNullString
large_folder3 = vbNullString
large_folder4 = vbNullString
large_folder5 = vbNullString
large_folder6 = vbNullString

End Sub
```

### **Saving Input**
- This will redefine each global variable
- Logically done directly after resetting everything
```
Sub saveInput()

'step 2 - save input as public variables
'first reset all public variables, then reassign them

file_name = "macro_dev"

With Documents(file_name)
  description = .SelectContentControlsByTitle("DESCRIPTION").Item(1).Range.Text
  initials = .SelectContentControlsByTitle("INITIALS").Item(1).Range.Text
  pr = .SelectContentControlsByTitle("PR").Item(1).Range.Text
  ige = .SelectContentControlsByTitle("IGE").Item(1).Range.Text
  supp_service = .SelectContentControlsByTitle("SUPPLY/SERVICE").Item(1).Range.Text
  psc = .SelectContentControlsByTitle("PSC").Item(1).Range.Text
  naics = .SelectContentControlsByTitle("NAICS").Item(1).Range.Text
  ja = .SelectContentControlsByTitle("J&A").Item(1).Range.Text
  delivery_date = .SelectContentControlsByTitle("DELIVERY DATE").Item(1).Range.Text
  requirement_type = .SelectContentControlsByTitle("REQUIREMENT TYPE").Item(1).Range.Text
  it = .SelectContentControlsByTitle("IT").Item(1).Range.Text
End With

End Sub
```

### **Creating the Initial Folder**
- First select where the folder wishes to be, then save the folder path as a variable
- Rename the folder the correct name
```
Sub createFolder()

'step 3 - create initial folder in specified location

Dim message, folder_path As String

message = "Select the folder where your requirement will be saved"

'if folder is selected (Show = -1), then save path as folder_path; else, exit
With Application.FileDialog(msoFileDialogFolderPicker)
  MsgBox message & ".", Title:="Select Folder"
  .Title = message
  If .Show = -1 Then
    folder_path = .SelectedItems(1)
  Else
    error_code = 1
    error_message = "No folder selected."
    Exit Sub
  End If
End With

'concatenate pr, initials, and description with folder_path
directory_name = folder_path & "\" & pr & ", " & initials & ", " & description

'if folder already exists, exit so as not to overwrite files
If Dir(directory_name, vbDirectory) = "" Then
  MkDir directory_name
Else
  error_code = 1
  error_message = "Folder already exists."
  Exit Sub
End If

End Sub
```

### **Create the Subfolders**
- Create all subfolders and working folders underneath
```
Sub createSubfolders()

'step 4 - create subfolders within main folder

Dim working As String

working = "\WORKING"

'if SAP, then just create "WORKING" folder
'if Large, then create subfolders
If requirement_type = "SAP" Then
  sap_folder = directory_name & working
  MkDir sap_folder
Else
  large_folder1 = directory_name & "\1 PLANNING"
  large_folder2 = directory_name & "\2 SOLICITATION"
  large_folder3 = directory_name & "\3 EVALUATION"
  large_folder4 = directory_name & "\4 AWARD"
  large_folder5 = directory_name & "\5 POST AWARD"
  large_folder6 = directory_name & "\6 CONTRACT AND MODS"
  MkDir large_folder1
  MkDir large_folder2
  MkDir large_folder3
  MkDir large_folder4
  MkDir large_folder5
  MkDir large_folder6
  large_folder1 = large_folder1 & working
  large_folder2 = large_folder2 & working
  large_folder3 = large_folder3 & working
  large_folder4 = large_folder4 & working
  large_folder5 = large_folder5 & working
  large_folder6 = large_folder6 & working
  MkDir large_folder1
  MkDir large_folder2
  MkDir large_folder3
  MkDir large_folder4
  MkDir large_folder5
  MkDir large_folder6
End If

End Sub
```

### **Populating Forms**
- This is the final step
- Insert as many other forms starting with the `With` code, and renaming it anyway you want
```
Sub populateForms()

'step 5 - populate forms with data and save in subfolders

Dim forms_path As String

forms_path = Documents(file_name).Path & "\FORMS\"

If requirement_type = "SAP" Then
  Documents.Open forms_path & "Blank Form.docx"
  With Documents("Blank Form.docx")
    .SelectContentControlsByTitle("PR").Item(1).Range.Text = pr
    .SelectContentControlsByTitle("IGE").Item(1).Range.Text = ige
    .SaveAs2 sap_folder & "\Blank Form.docx"
    .Close
  End With
End If

End Sub
```
---

## **Send Emails Based on Conditionals**
*In process*
```vbnet
Option Explicit
Sub postAwardWIP()

Dim row_num, _
    max_row, _
    blanks, _
    i _
    As Long
Dim date_now, _
    date_cust _
    As Date
Dim find_range, _
    first_address, _
    ws_range _
    As Range
Dim ws As Worksheet

date_now = Format(Now(), "mm-dd-yyyy")

date_cust = Worksheets(2).Range("H3").Value

max_row = Worksheets(2).Cells(Rows.Count, 1).End(xlUp).Row

blanks = WorksheetFunction.CountBlank(Range("I2:I" & max_row))

MsgBox blanks

Set ws_range = Worksheets(2).Range("I2:I" & max_row)

Set find_range = Worksheets(2).Range("I2:I" & max_row).Find(What:="", _
                                            LookIn:=xlValues, _
                                            SearchOrder:=xlByRows, _
                                            SearchDirection:=xlNext, _
                                            lookat:=xlPart)
If Not find_range Is Nothing Then
  first_address = find_range.Address
  Do
    MsgBox first_address
  Set find_range = Worksheets(2).Range("I2:I" & max_row).FindNext(find_range)
'  If find_range Is Nothing Then
'    GoTo endFinding
'  End If
  Loop While find_range.Address <> first_address
End If

'endFinding:
'  End With

'If date_cust < date_now Then
'  MsgBox "If test works"
'Else
'  MsgBox "derp"
'End If

End Sub
```

```vbnet
Sub macro1()

' WORKING

Dim cell_value As Long
Dim ws_range, _
    find_range _
    As Range
Dim first_address _
    As Variant

Set ws_range = Worksheets(2).Range("i2:i9")
Set find_range = ws_range.Find("", LookIn:=xlValues)

If Not find_range Is Nothing Then
  first_address = find_range.Address
  Do
    cell_value = find_range.Row
    'MsgBox Worksheets(2).Range("h" & cell_value).Value
    MsgBox find_range.Row
    Set find_range = ws_range.FindNext(find_range)
  Loop While find_range.Address <> first_address
End If

End Sub
```

```vbnet
Sub macro2()

' WORKING

Dim file_num As Long
Dim date_now, _
    append_text _
    As String

date_now = Format(Now(), "D MMMM YYYY")
append_text = "derp"
append_text = date_now & " - " & append_text
 
file_num = FreeFile
Open "c:\users\smats\documents\office\excel\log.txt" For Append As #file_num
Print #file_num, append_text
Close #file_num

End Sub
```

```vbnet
Sub macro3()

' WORKING

If Worksheets(2).Range("H9").Value < Now() Then
  MsgBox "yes"
Else
  MsgBox "no"
End If

End Sub
```

```vbnet
Sub macro4()

Dim table_column As Long

table_column = Worksheets(2).ListObjects("post_award_wip").DataBodyRange.Rows.Count

MsgBox table_column

End Sub
```

```vbnet
Sub macro5()

' WORKING

With Worksheets(2).Range("i2:i9")
     Set c = .Find("", LookIn:=xlValues)
     If Not c Is Nothing Then
        firstAddress = c.Address
        Do
            MsgBox c.Row
            Set c = .FindNext(c)
        If c Is Nothing Then
            GoTo DoneFinding
        End If
        Loop While c.Address <> firstAddress
      End If
DoneFinding:
End With

End Sub
```

```vbnet
Sub macro6()

Dim find_cell As Range
Dim find_range As Range

Set find_range = Worksheets(2).Range("i2:i9").Find("", LookIn:=xlValues)

For Each find_cell In find_range
  MsgBox find_cell.Row
Next

End Sub
```
---

## **UserForm Basics**
*UserForms allow for a more elaborate `MsgBox` that allows for pictures, custom input, and more.*
### **Generating the UserForm**
- First generate the UserForm in Excel by going to **DEVELOPER > Visual Basic > Insert > UserForm**
- Name this UserForm anything in the `(Name)` field in the properties box on the left
- Shape the UserForm to meet your needs, add images, and texts
- To call the UserForm and have it pop-up at the center of the excel screen, use the following submodule:
```vbnet
'text_box is the name of the UserForm, change it as applicable

With text_box
  .StartUpPosition = 0
  .Left = Application.Left + (0.5 * Application.Width) - (0.5 * .Width)
  .Top = Application.Top + (0.5 * Application.Height) - (0.5 * .Height)
  .Show
End With
```

### **Modify UserForm Initialization**

- Certain settings may need to be modified upon initialization (creation) of the UserForm
- To do so, right-click the user form, select **View Code**, then select **Initialize** from the right drop-down
- The following code pre-populates each text and combo box with values, and sets the background color to red in order to motivate the user to modify the textbox

```vbnet
Private Sub UserForm_Initialize()

Dim red as Long

'step 1 - populate text and combo boxes

red = RGB(255, 153, 153)

With userform_example

  .contract.BackColor = red
  .description.BackColor = red
  .first_name.BackColor = red
  .last_name.BackColor = red
  .customer.BackColor = red
  .customer_poc.BackColor = red
  .contractor.BackColor = red
  .contractor_poc.BackColor = red

  With .option_years
    .BackColor = red
    For i = 0 To 12
      .AddItem i
    Next i
  End With

  With .start_month
    .BackColor = red
    For i = 1 To 12
      .AddItem i
    Next i
  End With

  With .start_day
    .BackColor = red
    For i = 1 To 31
      .AddItem i
    Next i
  End With

  With .start_year
    .BackColor = red
    For i = year(Now()) - 10 To year(Now()) + 3
      .AddItem i
    Next i
  End With

  With .included
    .BackColor = red
    .AddItem "YES"
    .AddItem "NO"
  End With

  With .days_customer
    .BackColor = red
    .AddItem "N/A"
    For i = 1 To 60
      .AddItem i
    Next i
  End With

  With .days_exercise
    .BackColor = red
    .AddItem "N/A"
    For i = 1 To 30
      .AddItem i
    Next i
  End With
  
End With

End Sub
```

### **Modifying Text Box Changes**
- The following code will modify the textbox as it gets changed
- Each textbox that requires changing will need to have its own module
```vbnet
Private Sub contract_Change()

With userform_example
  If Trim(.contract.Value) = vbNullString Then
    .contract.BackColor = RGB(255, 153, 153)
  Else
    .contract.BackColor = RGB(153, 255, 153)
  End If
End With

End Sub
Private Sub first_name_Change()

With userform_example
  If Trim(.first_name.Value) = vbNullString Then
    .first_name.BackColor = RGB(255, 153, 153)
  Else
    .first_name.BackColor = RGB(153, 255, 153)
  End If
End With

End Sub
Private Sub last_name_Change()

Private Sub last_name_Change()

With userform_example
  If Trim(.last_name.Value) = vbNullString Then
    .last_name.BackColor = RGB(255, 153, 153)
 Else
    .last_name.BackColor = RGB(153, 255, 153)
  End If
End With

End Sub
Private Sub customer_Change()

With userform_example
  If Trim(.customer.Value) = vbNullString Then
    .customer.BackColor = RGB(255, 153, 153)
  Else
    .customer.BackColor = RGB(153, 255, 153)
  End If
End With

End Sub
Private Sub customer_poc_Change()

With userform_example
  If Trim(.customer_poc.Value) = vbNullString Then
    .customer_poc.BackColor = RGB(255, 153, 153)
  Else
   .customer_poc.BackColor = RGB(153, 255, 153)
  End If
End With

End Sub
Private Sub contractor_Change()

With userform_example
  If Trim(.contractor.Value) = vbNullString Then
    .contractor.BackColor = RGB(255, 153, 153)
 Else
    .contractor.BackColor = RGB(153, 255, 153)
  End If
End With

End Sub
Private Sub contractor_poc_Change()

With userform_example
  If Trim(.contractor_poc.Value) = vbNullString Then
    .contractor_poc.BackColor = RGB(255, 153, 153)
  Else
   .contract_poc.BackColor = RGB(153, 255, 153)
  End If
End With

End Sub
Private Sub option_years_Change()

With userform_example
  If Trim(.option_years.Value) = vbNullString Then
    .option_years.BackColor = RGB(255, 153, 153)
  Else
    .option_years.BackColor = RGB(153, 255, 153)
  End If
End With

End Sub
Private Sub start_month_Change()

With userform_example
  If Trim(.start_month.Value) = vbNullString Then
    .start_month.BackColor = RGB(255, 153, 153)
  Else
    .start_month.BackColor = RGB(153, 255, 153)
  End If
End With

End Sub
Private Sub start_day_Change()

With userform_example
  If Trim(.start_day.Value) = vbNullString Then
    .start_day.BackColor = RGB(255, 153, 153)
  Else
    .start_day.BackColor = RGB(153, 255, 153)
  End If
End With

End Sub
Private Sub start_year_Change()

With userform_example
  If Trim(.start_year.Value) = vbNullString Then
    .start_year.BackColor = RGB(255, 153, 153)
  Else
    .start_year.BackColor = RGB(153, 255, 153)
  End If
End With

End Sub
Private Sub included_Change()

With userform_example
  If Trim(.included.Value) = vbNullString Then
    .included.BackColor = RGB(255, 153, 153)
  Else
    .included.BackColor = RGB(153, 255, 153)
  End If
End With

End Sub
Private Sub days_customer_Change()

With userform_example
  If Trim(.days_customer.Value) = vbNullString Then
    .days_customer.BackColor = RGB(255, 153, 153)
  Else
    .days_customer.BackColor = RGB(153, 255, 153)
  End If
End With

End Sub
Private Sub days_exercise_Change()

With userform_example
  If Trim(.days_exercise.Value) = vbNullString Then
    .days_exercise.BackColor = RGB(255, 153, 153)
  Else
    .days_exercise.BackColor = RGB(153, 255, 153)
  End If
End With

End Sub
```

### **CommandButton Modification**
- To insert a CommandButton, click CommandButton in the Toolbox window
    - If you can't find this, go to **View > Toolbox**
- To activate it, right-click the button and click **View Code**
- Error checks are incorporated to make sure no null strings exist
```vbnet
Private Sub continue_button_Click()

'step 2 - ok button

Dim contract_val, _
    description_val, _
    first_name_val, _
    last_name_val, _
    customer_val, _
    customer_poc_val, _
    contractor_val, _
    contractor_poc_val, _
    included_val _
    As String
Dim option_years_val, _
    start_month_val, _
    start_day_val, _
    start_year_val, _
    days_customer_val, _
    days_exercise_val, _
    new_row _
    As Long
Dim start_date, _
    end_date, _
    included_date _
    As Date
Dim ws As Worksheet

Set ws = ThisWorkbook.Worksheets(1)

'1) error check for no inputs

With userform_example
  If .contract.Value = vbNullString Then
    MsgBox "Missing CONTRACT"
    .contract.SetFocus
    Exit Sub
  End If
  If .description.Value = vbNullString Then
    MsgBox "Missing DESCRIPTION"
    .description.SetFocus
    Exit Sub
  End If
  If .first_name.Value = vbNullString Then
    MsgBox "Missing FIRST NAME"
    .first_name.SetFocus
    Exit Sub
  End If
  If .last_name.Value = vbNullString Then
    MsgBox "Missing LAST NAME"
    .last_name.SetFocus
   Exit Sub
  End If
  If .customer.Value = vbNullString Then
    MsgBox "Missing CUSTOMER"
    .customer.SetFocus
   Exit Sub
  End If
  If .customer_poc.Value = vbNullString Then
    MsgBox "Missing CUSTOMER POC"
   .customer_poc.SetFocus
    Exit Sub
  End If
  If .contractor.Value = vbNullString Then
    MsgBox "Missing CONTRACTOR"
    .contractor.SetFocus
   Exit Sub
  End If
  If .contractor_poc.Value = vbNullString Then
    MsgBox "Missing CONTRACTOR POC"
   .contractor_poc.SetFocus
    Exit Sub
  End If
  If .option_years.Value = vbNullString Then
    MsgBox "Missing OPTION YEARS"
    .option_years.SetFocus
    Exit Sub
  End If
  If .start_month.Value = vbNullString Then
    MsgBox "Missing START MONTH"
    .start_month.SetFocus
    Exit Sub
  End If
  If .start_day.Value = vbNullString Then
    MsgBox "Missing START DAY"
    .start_day.SetFocus
    Exit Sub
  End If
  If .start_year.Value = vbNullString Then
    MsgBox "Missing START YEAR"
    .start_year.SetFocus
    Exit Sub
  End If
  If .included.Value = vbNullString Then
    MsgBox "Missing -8 INCLUDED?"
    .included.SetFocus
    Exit Sub
  End If
  If .days_customer.Value = vbNullString Then
    MsgBox "Missing DAYS TO NOTIFY CUSTOMER"
    .days_customer.SetFocus
    Exit Sub
  End If
  If .days_exercise.Value = vbNullString Then
    MsgBox "Missing DAYS TO EXERCISE OPTION"
    .days_exercise.SetFocus
    Exit Sub
  End If
End With

'2) save input values as variables, add 1 to option_years_val if -8 is included

With userform_example
  contract_val = .contract.Value
  description_val = .description.Value
  first_name_val = .first_name.Value
  last_name_val = .last_name.Value
  customer_val = .customer.Value
  customer_poc_val = .customer_poc.Value
  contractor_val = .contractor.Value
  contractor_poc_val = .contractor_poc.Value
  option_years_val = .option_years.Value
  start_month_val = .start_month.Value
  start_day_val = .start_day.Value
  start_year_val = .start_year.Value
  included_val = .included.Value
  days_customer_val = .days_customer.Value
  days_exercise_val = .days_exercise.Value
End With

If included_val = "YES" Then
  option_years_val = option_years_val + 1
End If

'3) find last row

new_row = ws.Cells(Rows.Count, 1).End(xlUp).Row
new_row = new_row + 1

'4) create start and end dates from inputs, as well as -8 included dates

start_date = DateValue(start_month_val & "/" & start_day_val & "/" & start_year_val)

end_date = DateAdd("d", -1, start_date)
end_date = DateAdd("yyyy", 1, end_date)

If included_val = "YES" Then
  included_date = DateAdd("yyyy", option_years_val, start_date)
  included_date = DateAdd("d", -1, included_date)
  included_date = DateAdd("m", 6, included_date)
End If

'5) Begin populating sheet
'Populate: CONTRACT, FIRST NAME, LAST NAME, CUSTOMER, CUSTOMER POC, CONTRACTOR,
'CONTRACTOR POC

For i = 0 To option_years_val
  ws.Cells(new_row + i, 1).Value = contract_val
  ws.Cells(new_row + i, 2).Value = description_val
  ws.Cells(new_row + i, 3).Value = first_name_val
  ws.Cells(new_row + i, 4).Value = last_name_val
  ws.Cells(new_row + i, 5).Value = customer_val
  ws.Cells(new_row + i, 6).Value = customer_poc_val
  ws.Cells(new_row + i, 7).Value = contractor_val
  ws.Cells(new_row + i, 8).Value = contractor_poc_val

'6) populate YEAR

  If i = 0 Then
    ws.Cells(new_row + i, 9).Value = "Base"
  ElseIf (i = option_years_val) And (included_val = "YES") Then
    ws.Cells(new_row + i, 9).Value = "-8"
  Else
    ws.Cells(new_row + i, 9).Value = "Option " & i
  End If

'7) populate START DATE and END DATE

  ws.Cells(new_row + i, 10).Value = DateAdd("yyyy", i, start_date)
  
  If i = option_years_val And included_val = "YES" Then
    ws.Cells(new_row + i, 11).Value = included_date
  Else
    ws.Cells(new_row + i, 11).Value = DateAdd("yyyy", i, end_date)
  End If

'8) populate DAYS TO NOTIFY CUSTOMER and DAYS TO EXERCISE OPTION
  
  If i = 0 Then
    ws.Cells(new_row + i, 13).Value = vbNullString
    ws.Cells(new_row + i, 14).Value = vbNullString
  Else
    ws.Cells(new_row + i, 13).Value = days_customer_val
    ws.Cells(new_row + i, 14).Value = days_exercise_val
  End If

Next i

'9) unloading removes the UserForm from memory, as opposed to just hiding it;
'remember_guide pops-up, reminding user to input values

Unload userform_example

With remember_guide
  .StartUpPosition = 0
  .Left = Application.Left + (0.5 * Application.Width) - (0.5 * .Width)
  .Top = Application.Top + (0.5 * Application.Height) - (0.5 * .Height)
  .Show
End With

ws.Cells(new_row, 8).Select

End Sub
```

### Auto-Updating List Box and Auto-Closing

- Using the Scripting Dictionaries from [below](#find-unique-values-and-navigate-to-location), you can auto-populate a List Box based on unique values in a column
- Selecting anything in the List Box will perform any actions, then close it
- This assumes a userform named `user_form` and List Box named `list_box`
- The below code is basic out of simplicity, but `values` is an array

```vbnet
Dim val, values as Variant

For each val in values
  user_form.list_box.AddItem val
next val
```

- Next select the List Box in the drop-down and select the `Change` property
- `Msgbox list_box.Value` can be anything, this just shows the value to the user, then closes the user form

```vbnet
Private Sub list_box_Change()

MsgBox list_box.Value

Unload user_form

End Sub
```
---

## **Auto-Updating Button Position**
- Save this macro in the module with all other code, then run it under the specified worksheet during the `SelectionChange`: `Private Sub Worksheet_SelectionChange(ByVal Target As Range)`
- Modify the `.Left` address as necessary depending on what column you want it in, but it will always be on the row of your cell
```vbnet
Sub cellAddress()

Dim ws As Worksheet

Set ws = ThisWorkbook.Worksheets(1)

With ws.Shapes("button_go_to")
  .Left = ws.Range("A1")
  .Top = ActiveCell.Top
End With

End Sub
```
---

## **Print Columns to Fit Page**
```vbnet
Dim ws as Worksheet

'Application.PrintCommunication must be set to False in order to have the
'  columns fit to the page
'for some reason, this must be set back to True when applying headers and
'  footers
'&D is date
'&F is file name
'&P is page number
'&N is total number of pages

Set ws = ThisWorkbook.Worksheets(1)

Application.PrintCommunication = False
With ws.PageSetup
  .FitToPagesWide = 1
  .FitToPagesTall = False
  .ScaleWithDocHeaderFooter = True
  .AlignMarginsHeaderFooter = True
End With
Application.PrintCommunication = True

With ws.PageSetup
  .LeftHeader = "&""Times New Roman,Regular""&D"
  .CenterHeader = "&""Times New Roman,Bold""&18&F - NOTIFICATIONS REPORT"
  .RightHeader = "&""Times New Roman,Regular""&P of &N"
End With

ws.columns("A:O").PrintPreview
```
---

## **Find Unique Values and Navigate to Location**
### **Identify Unique Values in an Array**
- Scripting dictionaries are utilized here to take an array of strings and create another array with only the unique values
- One of the best resources to explain this is [here](http://www.snb-vba.eu/VBA_Dictionary_en.html)
```vbnet
Option Explicit
Private Sub UserForm_Initialize()

Dim d As Object
Dim ws, ws3 As Worksheet
Dim last_row As Long
Dim val, values As Variant
Dim find_range As Range

Set d = CreateObject("Scripting.Dictionary")
Set ws = ThisWorkbook.Worksheets(1)
Set ws3 = ThisWorkbook.Worksheets(3)

'step 1 - create initial array
'first create an array of all values in the first column of the table
'dupes will be present

With ws
  values = .ListObjects("Table1").ListColumns(1).DataBodyRange
  values = Application.Transpose(values)
End With

'STEP 2 - ASSIGN UNIQUE ITEM TO EACH VALUE
'the scripting dictionary object will create items for each unique item
'dupes will be removed
'new array is simply d

For Each val In values
  d.Item(val) = val
Next val

'step 3 - loop through and auto-update other table
'for each value that is in the new array d, check to see if its in the table
'if not, then add the value to the table
'"Nothing" is used since the value will not be a null string or empty string
'"xlWhole" must be used since we want to search all contents of the cell

For Each val In d
  Set find_range = ws3.Columns(1).Find(what:=val, LookAt:=xlWhole)
  If find_range Is Nothing Then
    last_row = ws3.Cells(Rows.Count, 1).End(xlUp).Row
    ws3.Cells(last_row + 1, 1).value = val
  End If
Next val

'step 4 - populate combo box
'for each value in d, add it to the combo box

For Each val In d
  go_to_folder.contracts.AddItem val
Next val

go_to_folder.contracts.ListIndex = 0

End Sub
```

### **Navigate to the Associated Folder**
```vbnet
Private Sub button_go_to_Click()

Dim ws3 As Worksheet
Dim val_contracts, folder As String
Dim find_row As Long

Set ws3 = ThisWorkbook.Worksheets(3)

val_contracts = go_to_folder.contracts.value

'step 1 - save row value and folder column value
'whatever is captured in the folder column, we want to capture it

With ws3.Columns(1)
  find_row = .Find(what:=val_contracts, LookAt:=xlWhole).Row
  folder = .Cells(find_row, 2).value
End With

'step 2 - go to folder or raise warning
'if the folder value is empty, then instruct to add a folder for the contract
'if folder is there, then first check if system can access it (Dir folder)
'if there is an error, it will raise a msgbox then exit the sub
'if no errors, the system will go to folder

If folder = vbNullString Then
  MsgBox "No folders have been added for this contract." & vbCrLf & _
    vbCrLf & _
    "Use the ADD FOLDER button to add a folder location to this contrat.", _
    Title:="Folder Needs To Be Added"
Else
  On Error GoTo error_message
  Dir folder
  Call Shell("explorer.exe" & " " & folder, vbNormalFocus)
End If

Done:
  Exit Sub

error_message:
  MsgBox "Sorry, folder can't be accessed on your system." & vbCrLf & vbCrLf & _
    "You may need to add another folder for this contract.", _
    Title:="Can't Access Folder"
  Exit Sub

End Sub
```

### **Add Folder Location**
```vbnet
Private Sub button_add_folder_Click()

Dim ws3 As Worksheet
Dim val_contracts, folder, folder_path As String
Dim find_row As Long

Set ws3 = ThisWorkbook.Worksheets(3)

val_contracts = go_to_folder.contracts.value

'step 1 - save row value and folder column value
'whatever is captured in the folder column, we want to capture it
'identical to button_go_to sub procedure

With ws3.Columns(1)
  find_row = .Find(what:=val_contracts, LookAt:=xlWhole).Row
  folder = .Cells(find_row, 2).value
End With

'step 2 - select folder location
'if the folder value is empty, then add folder to folder column
'if not empty and value is already there, raise warning to proceed
'if user doesn't want to continue, then exit sub
'save folder path as the value in the folder column
    
If folder = vbNullString Then
  With Application.FileDialog(msoFileDialogFolderPicker)
    .Title = "Select Folder"
    If .Show = -1 Then
      folder_path = .SelectedItems(1)
    Else
      MsgBox "No folder selected."
      Exit Sub
    End If
  End With
ElseIf folder <> vbNullString Then
  If MsgBox("Current location will be replaced with new location." & _
    vbCrLf & vbCrLf & "Proceed?", _
    Buttons:=vbYesNo, _
    Title:="Overwrite data?") = vbYes Then
    With Application.FileDialog(msoFileDialogFolderPicker)
      .Title = "Select Folder"
      If .Show = -1 Then
        folder_path = .SelectedItems(1)
      Else
        MsgBox "No folder selected."
        Exit Sub
      End If
    End With
  Else
    Exit Sub
  End If
End If

'step 3 - save folder path
'save folder_path as the value in the folder column

ws3.Cells(find_row, 2).value = folder_path

MsgBox "Folder added successfully." & _
  vbCrLf & vbCrLf & _
  "You can now navigate to contract: " & val_contracts, _
  Title:="Success!"

End Sub
```

### **Exit UserForm**
```vbnet
Private Sub button_exit_Click()

Unload go_to_folder

End Sub
```
---

## **Auto-Save Workbook**
- Save this code as a Sub module and call it in the workbook code after you change it to `Private Sub Workbook_AfterSave(ByVal Success As Boolean)`
```vbnet
Dim backup_path, file_name As String
Dim monday As Long
Dim monday_date As String

'1) create the location to store all backup files
backup_path = ThisWorkbook.path
backup_path = backup_path & "\BACKUP FOLDER"

'2) calculate the day Monday would be for the current week
'Date must be saved as a string since dates have "/" and those are read as
'folder separators in the file path

monday = Weekday(Date, vbMonday)
monday_date = Format(Date - monday + 1, "yyyy-mm-dd")

'3) check to see if the folder is created; if not created, then create it

If Len(Dir(backup_path, vbDirectory)) = 0 Then
  MkDir backup_path
End If

'4) create the new file name to include the path location, replace the
'   extension with the date, "Backup", and add back in the extension

file_name = ThisWorkbook.Name
file_name = Replace(file_name, ".xlsm", " - " & monday_date)
file_name = file_name & " Backup.xlsm"
file_name = backup_path & "\" & file_name

'5) finally, save the copy

ThisWorkbook.SaveCopyAs file_name
```
---

## **VBscript**
- Call scripts with either `cscript` or `wscript`
    - `cscript` will run output in the console
    - `wscript` will run output in a pop-up window
### **Running a Macro**
```vbnet
Option Explicit

Dim excel_obj, excel_wb

set excel_obj = createobject("Excel.Application")

excel_obj.visible = False

set excel_wb = excel_obj.workbooks.open("c:\Users\smats\Documents\OFFICE\EXCEL\dev.xlsm")

excel_obj.run "Module1.macro1"

excel_wb.close

wscript.echo "done"

excel_obj.Quit

wscript.quit
```

### Printing to Console
- In order to print to console, use `cscript` to call the script, not `wscript`
- First method
```vbnet
wscript.echo _
vbcrlf & _
"################################################################################" & vbcrlf & _
"DATE: " & Now & vbcrlf & _
"TESTING" & vbcrlf & _
"################################################################################"
```

- Second method, ends code after `stdout.writeline`
```vbnet
Dim fso, stdout, stderr

set fso = CreateObject("Scripting.FilesystemObject")
set stdout = fso.GetStandardStream(1)
set stderr = fso.GetStandardStream(2)

stdout.writeline "derp"
```

### Passing Arguments
- This includes error checking to see if all parameters were inputted
```vbnet
Dim arg, arg_1, arg_2

set arg = wscript.arguments

if wscript.arguments.count < 2 then
  wscript.echo "VBscript cancelled - please input parameters"
  wscript.quit
else
  arg_1 = arg(0)
  arg_2 = arg(1)
end if
```

