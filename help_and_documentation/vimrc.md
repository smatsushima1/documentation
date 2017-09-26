# Vim Help

### Contents
- [**Remapping Caps Lock key for CentOS/RHEL**](https://github.com/smatsushima1/home/blob/master/help_and_documentation/vim.md#remapping-caps-lock-key-for-centos)
- [**Remapping Caps Lock key for Windows**](https://github.com/smatsushima1/home/blob/master/help_and_documentation/vim.md#remapping-caps-lock-key-for-windows)
- [**.vimrc**](https://github.com/smatsushima1/home/blob/master/help_and_documentation/vim.md#vimrc)
- [**Resources**](https://github.com/smatsushima1/home/blob/master/help_and_documentation/vim.md#resources)

### Remapping Caps Lock key for CentOS
- search for "Tweak Tool" in the program finder
- open "Tweak Tool"
- select "Typing" (along the left)
- select "Caps Lock key behavior"
- choose desired option

###### [Top](https://github.com/smatsushima1/home/blob/master/help_and_documentation/vim.md#vim-help)

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

###### [Top](https://github.com/smatsushima1/home/blob/master/help_and_documentation/vim.md#vim-help)

### .vimrc
Create a ```.vimrc``` file in the home directory and input the below code. You must source it while in vim with:
```
:source [LOCATION_OF_.vimrc_FILE]
```
```
set expandtab tabstop=4 shiftwidth=4 softtabstop=4
set number
set cursorline
set wildmenu
set showmatch
set textwidth=80
set nobackup nowritebackup noundofile

nnoremap j gj
nnoremap k gk
nnoremap <Down> gj
nnoremap <Up> gk
vnoremap j gj
vnoremap k gk
vnoremap <Down> gj
vnoremap <Up> gk

nnoremap <c-h> <c-w>W
nnoremap <c-j> :tabprevious<CR>
nnoremap <c-k> :tabnext<CR>
nnoremap <c-l> <c-w>w
```

Command | Function
--- | ---
```set expandtab tabstop=4 shiftwidth=4 softtabstop=4``` | tabs = 4 spaces
```set number``` | shows number of line working on
```set cursorline``` | highlights line that cursor is on
```set wildmenu``` | shows matches for words when auto-completing
```set showmatch``` | shows matching parenthesis when in brackets
```set textwidth=80``` | sets automatic word-wrapping at 80 characters
```set nobackup nowritebackup noundofile``` | no temp files saved
```nnoremap j gj``` | move up per display line, ignoring line length with j
```nnoremap k gk``` | move down per display line, ignoring line length with k
```nnoremap <Down> gj``` | same as above, but with down arrow
```nnoremap <Up> gk``` | same as above, but with up arrow
```vnoremap j gj``` | -
```vnoremap k gk``` | -
```vnoremap <Down> gj``` | -
```vnoremap <Up> gk``` | -
```map <c-h> <c-w>W``` | previous window
```map <c-j> :tabprevious<CR>``` | previous tab
```map <c-k> :tabnext<CR>``` | next tab
```map <c-l> <c-w>w``` | next window

###### [Top](https://github.com/smatsushima1/home/blob/master/help_and_documentation/vim.md#vim-help)

### Resources
Link | Explanation
--- | ---
[**Vim Tips Wiki**](http://vim.wikia.com/wiki/Vim_Tips_Wiki) | Vim wiki
[**Vim Genius**](http://www.vimgenius.com/) | Interactive exercises on vim

###### [Top](https://github.com/smatsushima1/home/blob/master/help_and_documentation/vim.md#vim-help)
