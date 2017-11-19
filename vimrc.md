---
layout: default
title: .vimrc
position: 3
---

```
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" modifications
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

syntax enable                  " allows text highlighting
filetype plugin on             " allows some vim features to work
filetype indent on             " automatically indent based on file syntax
set nocompatible               " let vim not act like vi

set expandtab                  " sets tabs to spaces in insert mode
set tabstop=4                  " sets tabs to 4 spaces
set shiftwidth=4               " sets shifts to 4 spaces
set softtabstop=4              " tabs get deleted as tabs, not spaces

set number                     " shows number of lines on left
set cursorline                 " shows line where cursor is on

set path+=**                   " searches down in subdirectories
set wildmenu                   " shows matches for auto-completion
set ignorecase                 " ignores case when searching
set hlsearch                   " highlight matches as searching
set incsearch                  " matches while typing

set nobackup                   " no creation of ~ temp files
set nowritebackup              " no creation of ~ temp files
set noundofile                 " no creation of ~ temp files

set mouse=a                    " sets mouse support
set hidden                     " don't show hidden buffers in tabs
set ruler                      " show cursor position in lower right corner
set showcmd                    " shows commad in bottom
set backspace=indent,eol,start " backspaces work as normal
set showmatch                  " shows matching braces
set sidescroll=10              " automatically scrolls 10 characters
set background=dark            " font will brighten as if in dark background
set linebreak                  " words don't get broken at end of line
set foldcolumn=4               " shows folds in columns
set viminfo='500               " remembers 500 vim commands

""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" remappings
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

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

" space acts like space in normal mode
nnoremap <space> i<space><right><esc>

" backspace acts like backspace in normal mode
nnoremap <bs> i<bs><right><esc>

" enter acts like enter in normal mode
nnoremap <enter> i<enter><esc>

" move <C-l> to <C-k>
nnoremap <C-k> <C-l>

" <C-h> = 0
nnoremap <C-h> 0

" <C-l> = $
nnoremap <C-l> $
```
