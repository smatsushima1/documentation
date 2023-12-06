---
layout: default
title: Powershell
---

# Auto-Backup
```
# OneDrive folder where all backups are stored
$fod = "[directory]"


# Thrusters action tracker
function thrusters_action_tracker() {
    echo "Thrusters Action Tracker backup started"
    # Folder location
    $fl = "[directory]"
    get-childitem $fod | foreach-object {
        # First check for the file
        if ($_.name -like "Thrusters Action Tracker*") {
            move-item -path $_.fullname -Destination $fl
        }
    }
    # Next, remove files older than one month in Thrusters folder
    get-childitem $fl | foreach-object {
        $new_fn = $_.name -replace ".csv", ""
        $fn_date = $new_fn.Substring($new_fn.Length - 8)
        $file_date = [Datetime]::ParseExact($fn_date, 'yyyyMMdd', $null)
        if (((get-date) - $file_date).days -ge 30) {
            remove-item $_.fullname
            }
    }
    echo "Thrusters Action Tracker backup finished"
}


# Thrusters dashboard
function thrusters_dashboard() {
    echo "Thrusters Dashboard backup started"
    # Folder location
    $fl = "[directory]"
    get-childitem $fod | foreach-object {
        # First check for the file
        if ($_.name -like "80JSC022CA015 Dashboard*") {
            move-item -path $_.fullname -Destination $fl -force
        }
    }
    echo "Thrusters Dashboard backup finished"
}


# HALO dashboard
function halo_dashboard() {
    echo "HALO Dashboard backup started"
    # Folder location
    $fl = "[directory]"
    get-childitem $fod | foreach-object {
        # First check for the file
        if ($_.name -like "HALO Dashboard*") {
            move-item -path $_.fullname -Destination $fl -force
        }
    }
    echo "HALO Dashboard backup finished"
}


# Only continue if objects are in the folder
if ((ls $fod | Measure-Object).count -ne 0) {
    thrusters_action_tracker
    echo ""
    thrusters_dashboard
    echo ""
    halo_dashboard
    }
```

# Convert to PDF and save to file
```
function convertWord() {
    # Update folder name accordingly
    $doc_path = $PSScriptRoot
    $pdf_path = $doc_path + "\Final PDFs DEV"
    # Error check for folders
    if ((Test-Path $pdf_path) -eq $false) {
        throw "Error. PDF Folder $pdf_path not found."
    }
    $word_app = New-Object -ComObject word.application
    $word_app.visible = $false
    # Loop through all .doc* files
    get-childItem -path $doc_path -filter *.docx | foreach-object {
        # https://learn.microsoft.com/en-us/previous-versions/office/developer/office-2003/ms250312(v=office.11)?redirectedfrom=MSDN
        # Must be opened as read-only
        $doc = $word_app.documents.open($_.FullName, $false, $true)
        # Update pdf folder path accordingly
        $pdf_name = $pdf_path + "\$($_.BaseName).pdf"
        echo $pdf_name
        # https://ss64.com/ps/syntax-word.html
        # 17 = pdf format
        $doc.SaveAs([ref]$pdf_name, [ref]17)
        $doc.Close($false)
    }
    $word_app.Quit()
}

convertWord
```

# Quick Access Pinning
```
# To reset all Quick Access Toolbars, run in cmd:
# del /f /q "%AppData%\Microsoft\Windows\Recent\AutomaticDestinations\f01b4d95cf55d32a.automaticDestinations-ms"

$o = new-object -com shell.application
$o.Namespace('[directory]').Self.InvokeVerb("pintohome")
```

# Rename Items
```
# First determine what type of action they wish to perform
$prompt = "`nWhich rename procedure do you wish to use?
1 - Changes folders that start with numbers
2 - Changes folders that start with 'Mod'
3 - Convert all files and folders to the e-file format
4 - Rename FPDS reports
5 - Rename BACKUP files
6 - Add 'Archive' folders
7 - Renumber mod numbers in file names
8 - Convert 'Mod ...' names to 'P00XXX'
9 - Convert 'P000XXX...' to 'P00XXX...'
10 - Rename file names to have 'P000XX' number

Enter number"


$prompt_answer = {
    switch (read-host $prompt) {
        # What they input determines what gets saved to the variable $pa
        1 {$pa = 1}
        2 {$pa = 2}
        3 {$pa = 3}
        4 {$pa = 4}
        5 {$pa = 5}
        6 {$pa = 6}
        7 {$pa = 7}
        8 {$pa = 8}
        9 {$pa = 9}
        10 {$pa = 10}
        # Default answer if either of the answers selected are not chosen
        default {
            Write-Host "You entered a wrong procedure name. Try again...`n" -ForegroundColor red
            .$prompt_answer
        }
    }
}


# This is for folders that start with numbers
function rename1() {
    # Input folder to change
    $folder_path = Read-Host "Enter folder path"
    # Loop through each folder
    dir $folder_path | ForEach-Object {
        if ($_.Name -Like "[0-9]*") {
            # Save the number folder of each folder
            $space = $_.Name.IndexOf(' ')
            $folder_num = $_.Name.Substring(0, $space)
            # Add leading zeros
            if ($folder_num.Length -eq 1) {
                $new_folder_num = '00' + $folder_num
            } elseif ($folder_num.Length -eq 2) {
                $new_folder_num = '0' + $folder_num
            } else {
                return
            }
            # Change file name
            $path_name = $folder_path + '\' + $_.Name
            $final_name = $_.Name.Replace($folder_num, $new_folder_num)
            Rename-Item -path $path_name -newname $final_name
        }
    }
    Write-host "Finished" -ForegroundColor green
}


# This is for folders that start with "Mod"
function rename2() {
    # Input folder to change
    $folder_path = Read-Host "Enter folder path"
    # Loop through each folder
    dir $folder_path | ForEach-Object {
        if ($_.Name -Like "Mod *") {
            # Save the mod number of each folder
            $space_2 = $_.Name.IndexOf(' - ') - 4
            $mod_num = $_.Name.Substring(4, $space_2)
            # Add leading zeros
            if ($mod_num.Length -eq 1) {
                $new_mod_num = '00' + $mod_num
            } elseif ($mod_num.Length -eq 2) {
                $new_mod_num = '0' + $mod_num
            } else {
                return
            }
            # Change file name
            $old_name = 'Mod ' + $mod_num
            $new_name = 'Mod ' + $new_mod_num
            $path_name = $folder_path + '\' + $_.Name
            $final_name = $_.Name.Replace($old_name, $new_name)
            Rename-Item -path $path_name -newname $final_name
        }
    }
    Write-host "Finished" -ForegroundColor green
}


# Convert all folders to e-file format
function rename3() {
    # Input folder to change
    $folder_path = Read-Host "Enter folder path"
    # Loop through each folder
    dir $folder_path | ForEach-Object {
        # Exit out if not a Mod folder
        if ($_.Name -notlike 'Mod *') {
            Write-Host 'skipping'
            return
        }
        # First check to see if the folders contain the working folder; add if not
        $uwf_path = ($_.FullName + '\UNOFFICIAL Working File')
        if (test-path $uwf_path) {
            # Defaults to $true, so do nothing in this case
        } else {
            New-Item $uwf_path -ItemType Directory
        }
        # Save for next loop
        $file_name_1 = ('NNH15CN76C_' + $_.Name.Substring(0,7).Replace(' ', '').Replace(0, '') + '_')
        # Next loop through all non-folders and rename accordingly
        dir $_.FullName | ForEach-Object {
            # Don't perform if already named the right way
            if ($_.Name -notlike 'NNH15CN76C_Mod*') {
                # Only perform on files, not directories
                if ((Get-Item $_.FullName) -is [System.IO.FileInfo]) {
                    $new_name = $_.Name.Replace('NNH15CN76C Modification ', '').Replace('NNH15CN76C Mod ', '').Replace('NNH15CN76C', '').Replace('Mod ', '')
                    rename-item -path $_.FullName -newname ($file_name_1 + $new_name)
                }
            }
        }
    }
    Write-host "Finished" -ForegroundColor green
}


# Rename FPDS files
function rename4() {
    # Input folder to change
    $folder_path = Read-Host "Enter folder path"
    # Loop through each folder
    dir $folder_path | ForEach-Object {
        # Exit out if not a Mod folder
        if ($_.Name -notlike 'Mod *') {
            Write-Host 'skipping'
            return
        }
        # Save for next loop
        $file_name_1 = ('NNH15CN76C_' + $_.Name.Substring(0,7).Replace(' ', '').Replace(0, '') + '_' + 'FPDS Report.pdf')
        # Next find FPDS report and rename appropriately
        dir $_.FullName | ForEach-Object {
            # Find the FPDS file
            if ($_.Name -like 'FPDS-NG*') {
                rename-item -path $_.FullName -newname ($file_name_1)
            }
        }
    }
    Write-host "Finished" -ForegroundColor green
}


# Rename BACKUP files
function rename5() {
    # Input folder to change
    $folder_path = Read-Host "Enter folder path"
    # Loop through each folder
    dir $folder_path | ForEach-Object {
        # Skip files that don't have -
        if ($_.Name -notlike '*-*') {
            Write-Host ('Skipping file ' + $_.Name)
            return
        }
        # Save new file name
        $file_name_1 = ($_.Name.Replace('-', '').Replace('  ', ' '))
        write-host ('Renaming: [' + $_.Name + '] to [' + $file_name_1 + ']')
        # Do work
        rename-item -path $_.FullName -newname $file_name_1
    }
    Write-host "Finished" -ForegroundColor green
}


# Add archives to each folder
function rename6() {
    # Input folder to change
    $folder_path = Read-Host "Enter folder path"
    # Loop through each folder
    dir $folder_path | ForEach-Object {
        # First check to see if the folders contain the working folder; add if not
        $uwf_path = ($_.FullName + '\Archives')
        if (test-path $uwf_path) {
            # Defaults to $true, so do nothing in this case
        } else {
            New-Item $uwf_path -ItemType Directory
        }
    }
    Write-host "Finished" -ForegroundColor green
}


# Rename mod numbering in file names
function rename7() {
    # Input folder to change
    $folder_path = Read-Host "Enter folder path"
    rename7a $folder_path
    Write-host "Finished" -ForegroundColor green
}


# rename7 actions
function rename7a($fpath) {
    dir $fpath | ForEach-Object {
        if ($_ -is [System.IO.FileInfo]) {
            $name_split = $_.Name.split("_")
            if ($name_split[0] -eq "NNH15CN76C") {
                $fnum = $name_split[1].Replace("Mod", "")
                # Add leading zeros
                if ($fnum.Length -eq 1) {
                    $new_num = '00' + $fnum
                } else {
                    $new_num = '0' + $fnum
                }
                $new_name = "NNH15CN76C_" + ("Mod" + $new_num) + "_SF30 (Final) Signed.pdf"
                Rename-Item -path $_.FullName -NewName $new_name
                Write-Host "Renamed: " $_.Name
            } else {
                return
            }
        } else {
            Write-Host "Going to: " + $_
            rename7a $_.FullName
        }
    }
}


# Rename mod folders to start with "P00XXX"
function rename8() {
    # Input folder to change
    $folder_path = Read-Host "Enter folder path"
    # Loop through each folder
    dir $folder_path | ForEach-Object {
        if ($_.name -like 'Mod *') {
            $new_name = $_.name.replace('Mod ', 'P000')
            Rename-Item -path $_.FullName -NewName $new_name
            Write-Host "Renamed: " $_.Name
        } else {
            return
        }
    }
}


# Rename mod folders that start with "P000XXX"
function rename9() {
    # Input folder to change
    $folder_path = Read-Host "Enter folder path"
    # Loop through each folder
    dir $folder_path | ForEach-Object {
        if ($_.name -like 'P000*') {
            $new_name = $_.name.replace('P000', 'P00')
            Rename-Item -path $_.FullName -NewName $new_name
            Write-Host "Renamed: " $_.Name
        } else {
            return
        }
    }
}


# rename10 actions
function rename10() {
    # Input folder to change
    $folder_path = Read-Host "Enter folder path"
    # Loop through each folder
    dir $folder_path | ForEach-Object {
        # Exit out if not a Mod folder
        if ($_ -is [System.IO.DirectoryInfo]) {
            dir $_.FullName | ForEach-Object {
                if ($_.name -like "NNH15CN76C_*") {
                    $name_split = $_.Name.split("_")
                    $fnum = $name_split[1].substring($name_split[1].length - 2, 2).replace('d', '0')
                    $new_name = $name_split[0] + "_" + "P000" + $fnum + "_" + $name_split[2]
                    Rename-Item -path $_.FullName -NewName $new_name
                    Write-Host "Renamed:" $_.Name
                }
            }
        } else {
            Write-Host "Skipping..."
            return 
        }
    }
}


# Run all commands
.$prompt_answer
if ($pa -eq 1) {
    rename1
} elseif ($pa -eq 2) {
    rename2
} elseif ($pa -eq 3) {
    rename3
} elseif ($pa -eq 4) {
    rename4
} elseif ($pa -eq 5) {
    rename5
} elseif ($pa -eq 6) {
    rename6
} elseif ($pa -eq 7) {
    rename7
} elseif ($pa -eq 8) {
    rename8
} elseif ($pa -eq 9) {
    rename9
} elseif ($pa -eq 10) {
    rename10
}
```
