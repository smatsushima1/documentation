""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
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
" netrw modifications
" netrw manual: http://vimdoc.sourceforge.net/htmldoc/pi_netrw.html
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

" no banner
let g:netrw_banner=0

" tree view
let g:netrw_liststyle=3

" opens new file in another tab
let g:netrw_browse_split=3

" splits window vertically with new cursor at the right
let g:netrw_altv=1

" netrw starts at 25% of screen size
let g:netrw_winsize=25

" auto-starts netrw with cursor in file
au VimEnter * Vex
au VimEnter * wincmd l

