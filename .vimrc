""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" mods
" main manual: http://vimdoc.sourceforge.net/htmldoc/help.html
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

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

" no creation of ~ temp files
set nobackup nowritebackup noundofile

" sets mouse support
set mouse=a

" don't show hidden buffers in tabs
set hidden

" for pathogen.vim
execute pathogen#infect()
syntax on
filetype plugin indent on

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

" ZA = save and quit-all
nnoremap ZA :wqa<CR>

" ZS = save-all
nnoremap ZS :wa<CR>

" C-j = C-W
map <C-j> <C-W>

""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" NERDTree
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

" start NERDTree automatically
au vimenter * NERDTree
au vimenter * wincmd l

