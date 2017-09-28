" sets tabs to 4 spaces
set expandtab tabstop=4 shiftwidth=4 softtabstop=4

" shows number of line
set number

" shows line of cursor
set cursorline

" shows matches for auto-completion
set wildmenu

" shows matching braces
set showmatch

" auto-wraps lines at 80 characters
set textwidth=80

" no creation of ~ temp files
set nobackup nowritebackup noundofile

" sets mouse support
set mouse=a

" remaps hjkl to move with the line
nnoremap j gj
nnoremap k gk
nnoremap <Down> gj
nnoremap <Up> gk
vnoremap j gj
vnoremap k gk
vnoremap <Down> gj
vnoremap <Up> gk
