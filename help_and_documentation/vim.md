# Vim Help

### Contents
- [**Commands**](https://github.com/smatsushima1/home/blob/master/help_and_documentation/vim.md#commands)
- [**Remapping Caps Lock key for CentOS/RHEL**](https://github.com/smatsushima1/home/blob/master/help_and_documentation/vim.md#remapping-caps-lock-key-for-centos)
- [**Remapping Caps Lock key for Windows**](https://github.com/smatsushima1/home/blob/master/help_and_documentation/vim.md#remapping-caps-lock-key-for-windows)
- [**Modifications to .vimrc**](https://github.com/smatsushima1/home/blob/master/help_and_documentation/vim.md#modifications-to-vimrc)
- [**Resources**](https://github.com/smatsushima1/home/blob/master/help_and_documentation/vim.md#resources)

### Commands
*This list will be updated as more commands are discovered*

![cheat_sheet](/references/vim_cheat_sheet.gif)

Command | Function
--- | ---
```I``` | insert at beginning of line
```A``` | insert at end of line
```o``` | insert new line below
```O``` | insert new line above
```ciw``` | change in word
```C``` | deletes everything after cursor then goes to insert mode
```w``` | next word (faster navigation)
```e``` | end of word (faster navigation)
```b``` | back one word (faster navigation)
```[CTRL+d]``` | down one page
```[CTRL+u]``` | up one page
 | 
```:%s/1/2/gc``` | replace all 1s with 2s in the document (g), and asks for approval at each instance (c)
```:r [FILE]``` | pastes everything from a file in the document
```:w [NAME]``` | creates an additional file named [NAME] 
 | 
```[CTRL+v] [MOVE_CURSOR] [SHIFT+i] [INPUT] [ESC]``` | inputs [INPUT] at the beginning of every line

[Top](https://github.com/smatsushima1/home/blob/master/help_and_documentation/vim.md#vim-help)

### Remapping Caps Lock key for CentOS
- search for "Tweak Tool" in the program finder
- open "Tweak Tool"
- select "Typing" (along the left)
- select "Caps Lock key behavior"
- choose desired option

[Top](https://github.com/smatsushima1/home/blob/master/help_and_documentation/vim.md#vim-help)

### [Remapping Caps Lock key for Windows](https://commons.lbl.gov/display/~jwelcher@lbl.gov/Making+Caps+Lock+a+Control+Key)
- run regedit.exe from the Windows search bar
- verify you are in the folder "Keyboard Layout" (not "Keyboard Layouts") from the left pane: HKEY_LOCAL_MACHINE/System/CurrentControlSet/Control/Keyboard Layout
- from the top, select "Edit" > "New" > "Binary Value" and call it "Scancode Map"
- double-click the name to input one of the following commands:
    - to remap to [CTRL]:
        - 0000000000000000020000001D003A0000000000
        - or: 17 x 0s, 2, 6 x 0s, 1d, 2 x 0s, 3a, 10 x 0s
    - to remap to [ESC]:
        - 00000000000000000200000001003A0000000000
        - or: 17 x 0s, 2, 7 x 0s, 1, 2 x 0s, 3a, 10 x 0s
- restart the system

[Top](https://github.com/smatsushima1/home/blob/master/help_and_documentation/vim.md#vim-help)

### Modifications to .vimrc
Create a ```.vimrc``` file in the home directory and input the below code. You must source it while in vim with ```:source [LOCATION_OF_.vimrc_FILE]```
Command | Function
--- | ---
```set expandtab tabstop=4 shiftwidth=4 softtabstop=4``` | tabs = 4 spaces
```set number``` | shows number of line working on
```set cursorline``` | highlights line that cursor is on
```set wildmenu``` | shows matches for words when auto-completing
```set showmatch``` | shows matching parenthesis when in brackets
```nnoremap j gj | move up per display line, ignoring line length with j```
```nnoremap k gk | move down per display line, ignoring line length with k```
```nnoremap <Down> gj | same as above, but with down arrow```
```nnoremap <Up> gk | same as above, but with up arrow```
```vnoremap j gj | -```
```vnoremap k gk | -```
```vnoremap <Down> gj | -```
```vnoremap <Up> gk | -```

[Top](https://github.com/smatsushima1/home/blob/master/help_and_documentation/vim.md#vim-help)

### Resources
Link | Explanation
--- | ---
[**Vim Tips Wiki**](http://vim.wikia.com/wiki/Vim_Tips_Wiki) | Vim wiki
[**Vim Genius**](http://www.vimgenius.com/) | Interactive exercises on vim

[Top](https://github.com/smatsushima1/home/blob/master/help_and_documentation/vim.md#vim-help)
