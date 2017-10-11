""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" modifications
" main manual: http://vimdoc.sourceforge.net/htmldoc/help.html
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

" allows text highlighting
syntax enable

" allows some vim features to work
filetype plugin on

" automatically indent based on file syntax
filetype indent on

" let vim not act like vi
set nocompatible

" sets tabs to 4 spaces
set expandtab tabstop=4 shiftwidth=4 softtabstop=4

" shows number of line
set number

" shows line where cursor is on
set cursorline

" searches down in subdirectories
set path+=**

" shows matches for auto-completion
set wildmenu

" shows matching braces
set showmatch

" no creation of ~ temp files
set nobackup nowritebackup noundofile

" sets mouse support
set mouse=a

" don't show hidden buffers in tabs
set hidden

" shows commad in bottom
set showcmd

""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" remappings
" all key bindings: http://vimdoc.sourceforge.net/htmldoc/vimindex.html
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

" hjkl moves with each character, not line, in normal mode
nnoremap j gj
nnoremap k gk
nnoremap <Down> gj
nnoremap <Up> gk

" hjkl moves with each character, not line, in visual mode
vnoremap j gj
vnoremap k gk
vnoremap <Down> gj
vnoremap <Up> gk

" C-j = C-W
map <C-j> <C-W>

" ZA = save and quit-all
nnoremap ZA :wqa<CR>

" ZS = save-all
nnoremap ZS :wa<CR>

" ZX = quit without save-all
nnoremap ZX :qa<CR>

