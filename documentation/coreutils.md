# Data prep with coreutils

### Contents
- [**cut**](https://github.com/smatsushima1/home/blob/master/help_and_documentation/coreutils.md#cut)
- [**cp**](https://github.com/smatsushima1/home/blob/master/help_and_documentation/coreutils.md#cp)
- [**mv**](https://github.com/smatsushima1/home/blob/master/help_and_documentation/coreutils.md#mv)
- [**wget**](https://github.com/smatsushima1/home/blob/master/help_and_documentation/coreutils.md#wget)
- [**tar**](https://github.com/smatsushima1/home/blob/master/help_and_documentation/coreutils.md#tar)
- [**unzip**](https://github.com/smatsushima1/home/blob/master/help_and_documentation/coreutils.md#unzip)
- [**awk**](https://github.com/smatsushima1/home/blob/master/help_and_documentation/coreutils.md#awk)
    - [**Printing words**](https://github.com/smatsushima1/home/blob/master/help_and_documentation/coreutils.md#printing-words)
    - [**Printing columns**](https://github.com/smatsushima1/home/blob/master/help_and_documentation/coreutils.md#printing-columns)
- [**Resources**](https://github.com/smatsushima1/home/blob/master/help_and_documentation/coreutils.md#resources)

### cut
Displays data in specified way:
```
cut -d "," -f 1-5 [INPUT_FILE] > [OUTPUT_FILE]
    # -d "," = distinguishes the delimiter used, which in this case is a comma
    # -f 1-5 = selects only the specific columns to be displayed, being 1-5
    # [INPUT_FILE] = file from which operations will be running from
    # [OUTPUT_FILE] = result of the input file after operations
```
[Top](https://github.com/smatsushima1/home/blob/master/help_and_documentation/coreutils.md#data-prep-with-coreutils)

### cp
Copy files and directories:
```
cp a 1/
    # a = file to be copied
    # 1/ = folder to be copied to
```
This example assumes both **a** and **1/** are in the same folder, for more accurate description, use this notation to preserve the destination: ```cp ~/a ~/1/```

To copy the entire directory into another directory:
```
cp -r ~/1/ ~/2/
    # -r = means recursive, as in everything in **1/** goes into **2/**
    # ~/1/ = the folder to be copied
    # ~/2/ = the destination of the folder
```
If in the same directory, the **~/** is not needed; they are only included for accuracy purposes.

This copies the file into another name in the same directory:
```
cp a b
```

This copies multiple files:
```
cp ~/[FOLDER]/{[FILE_1], [FILE_2]...} [DESTINATION]
```

[Top](https://github.com/smatsushima1/home/blob/master/help_and_documentation/coreutils.md#data-prep-with-coreutils)

### mv
The same as cp but doesnt create a copy of the file. This is great for renaming files without creating copies of them or moving them once to a location. Syntax as same as ```cp```.

[Top](https://github.com/smatsushima1/home/blob/master/help_and_documentation/coreutils.md#data-prep-with-coreutils)

### wget
```
wget [URL_ADDRESS]
```
Right click page and select view page source to find download link. One block of code on the source page for an eclipse download was on line 113 and read:
```
href="http://ftp.osuosl.org/pub/eclipse/oomph/epp/neon/R3/eclipse-inst-linux64.tar.gz">click here</a> to start the download.</p></span>
```
Adding ```--no-check-certificate``` disables ssl verification.

[Top](https://github.com/smatsushima1/home/blob/master/help_and_documentation/coreutils.md#data-prep-with-coreutils)

### tar
Unzips .tar and .tar.gz files. Used for this example is the file titled 'eclipse-inst-linux64.tar.gz'
```
tar xzf eclipse-inst-linux64.tar.gz -C ~/[DIRECTORY]
    # x = extract file
    # z = gunzip, filters file through gunzip
    # f = uses archive file
    # -C = saves contents of the file into the [DIRECTORY]; optional
    # eclipse*.gz = file from which to be worked on
```
[Top](https://github.com/smatsushima1/home/blob/master/help_and_documentation/coreutils.md#data-prep-with-coreutils)

### unzip
Unzips file into the same directory:
```
unzip [FILE].zip
```
[Top](https://github.com/smatsushima1/home/blob/master/help_and_documentation/coreutils.md#data-prep-with-coreutils)

### awk
The format for the following examples is as follows:
```
awk [OPERATION] '{[PROGRAM]}' [FILE]
	# [GENERAL_NOTES]
[EXPECTED_RESULT]
```
The examples listed below are done on .csv file titled 'file.csv' that looks like:
```
1,a
2,b
3,c
```
[Top](https://github.com/smatsushima1/home/blob/master/help_and_documentation/coreutils.md#data-prep-with-coreutils)

### Printing words
BEGIN works before all the programs are executed, and END operates after. Both need to be in all caps.
```
awk 'Begin{print "Hello!"}' file.csv

awk 'BEGIN{print "Hello!"}' file.csv
Hello!

awk 'END{print "Good Bye!}' file.csv
Good Bye!
```
[Top](https://github.com/smatsushima1/home/blob/master/help_and_documentation/coreutils.md#data-prep-with-coreutils)

### Printing columns
Awk needs to distinguish the deliminator of the data files. In this case, a comma is used in file but is still shown when trying to print the individual columns because it wasnt specified.
```
awk '{print $0}' file.csv
1,a
2,b
3,c

awk '{print $1}' file.csv
1,a
2,b
3,c

awk '{print $2}' file.csv

```
To identify the commas and print the individual columns:
```
awk 'BEGIN{FS = ","}; {print $1}' file.csv
	# FS = field separator
1
2
3

awk 'BEGIN{FS = ","}; {print $2}' file.csv
a
b
c

awk 'BEGIN{FS = ","}; {print $2, $1}' file.csv
a 1
b 2
c 3
```
BEGIN removes the commas before any of the processing occured, but an easier way to do this is to use -F and specify the deliminator of choice directly after it:
```
awk -F, '{print $1}' file.csv
	# -F = field separator
1
2
3

awk -F, '{print $2}' file.csv
a
b
c

awk -F',' '{print $2, $1}' file.csv
a 1
b 2
c 3

awk -F, '{print $2 $1}' file.csv
a1
b2
c3
```
Commas to separate the columns results in a space, while a space simply prints the data directly. Furthermore, you can add any character inbetween the two columns of data by placing it inbetween the columns surrounded by quotes:
```
awk -F, '{print $1 "a" $2}' file.csv
1aa
2ab
3ac

awk -F, '{print $1 "|" $2}' file.csv
1|a
2|b
3|c
```
A character can be placed inbetween each set of data points instead of manually typing it in like in the previous step by using the OFS operator within the BEGIN:
```
awk -F, 'BEGIN{OFS="=";} {print $1 $2}' file.csv
	# commas inbetween each column are required for this
1a
2b
3c

awk -F, 'BEGIN{OFS="=";} {print $1, $2}' file.csv
1=a
2=b
3=c

awk -F, 'BEGIN{OFS="=";} {print $1, $2, $1}' file.csv
1=a=1
2=b=2
3=c=3
```
[Top](https://github.com/smatsushima1/home/blob/master/help_and_documentation/coreutils.md#data-prep-with-coreutils)

### Resources
Link | Explanation
--- | ---
[**GNU Coreutils**](https://www.gnu.org/software/coreutils/manual/coreutils.html#toc-Basic-operations-1) | Expansive list documenting the usage of the GNU coreutils
[**GNU Awk User Guide**](https://www.gnu.org/software/gawk/manual/html_node/index.html) | How to use awk
[**Bash Reference Manual**](/references/bash_reference_manual.pdf) | PDF manual on bash
[**OpenSSH Manual Pages**](https://www.openssh.com/manual.html) | Guide on SSH

[Top](https://github.com/smatsushima1/home/blob/master/help_and_documentation/coreutils.md#data-prep-with-coreutils)
