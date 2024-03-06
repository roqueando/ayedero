set nocompatible
call plug#begin()
Plug 'sheerun/vim-polyglot'
Plug 'ntk148v/habamax.nvim'
Plug 'dracula/vim'
Plug 'tpope/vim-endwise'
Plug 'jiangmiao/auto-pairs'
call plug#end()
filetype plugin indent on
syntax on

" Sets
set relativenumber
set number
set path+=**
set wildmenu
set incsearch
set smartcase
set encoding=UTF-8
set directory=/var/tmp
set autoindent
"set term=xterm-256color
set termguicolors
set tabstop=2
set shiftwidth=2
set expandtab

let mapleader = ";"
colorscheme habamax

" Map bindings
nnoremap <leader>w :w<cr>
nnoremap <leader>e :Explore<cr>
nnoremap <leader>f :find 
nnoremap gn :tabnext <CR>
nnoremap gp :tabprevious <CR>
inoremap jk <esc>


"" Auto CMD
autocmd Filetype haskell setlocal tabstop=2
autocmd FileType cpp set keywordprg=cppman

command! -nargs=+ Cppman silent! call system("tmux split-window cppman " . expand(<q-args>))
autocmd FileType cpp nnoremap <silent><buffer> K <Esc>:Cppman <cword><CR>
