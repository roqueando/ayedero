set nocompatible
call plug#begin()
" polyglot (i do not have time to create syntax files)
Plug 'sheerun/vim-polyglot' " just to get syntax highlight easy
Plug 'tpope/vim-endwise' " when using ruby or elixir for closing def
Plug 'jiangmiao/auto-pairs' " just to close brackets without efforts

" git gutter -> just to I know where I fucked up earlier
Plug 'airblade/vim-gitgutter'

" FZF -> for finding and searching things
Plug 'junegunn/fzf', { 'do': { -> fzf#install() } }
Plug 'junegunn/fzf.vim'

" Airline
Plug 'vim-airline/vim-airline'
Plug 'vim-airline/vim-airline-themes'

" Gutentags
Plug 'ludovicchabant/vim-gutentags'
call plug#end()

filetype plugin indent on
syntax enable

" Sets
set tag=.tags
set tag+=$HOME/.tags
set clipboard=unnamedplus
set background=light
set relativenumber
set number
set showmatch
set path+=**
set wildmenu
set incsearch
set smartcase
set encoding=UTF-8
set directory=/var/tmp
set autoindent
set re=0
set termguicolors
set tabstop=2
set shiftwidth=2
set expandtab
set omnifunc=syntaxcomplete#Complete
set mouse=c

colorscheme retrobox

let mapleader = ";"

" Map bindings ====================
nnoremap <leader>w :w<cr>
nnoremap <leader>R :source ~/ayedero/.vimrc<cr>
nnoremap <leader>e :Explore<cr>
nnoremap <leader>f :find
nnoremap gn :tabnext <CR>
nnoremap gp :tabprevious <CR>
inoremap jk <esc>
inoremap <expr> <Tab> pumvisible() ? "\<C-n>" : "\<Tab>"
""==================================================


"" Auto CMD ====================
autocmd Filetype haskell setlocal tabstop=2
autocmd Filetype go setlocal tabstop=4
autocmd FileType cpp set keywordprg=cppman

augroup QuickfixMappings
    autocmd!
    "" fecha o quickfix
    autocmd FileType qf nnoremap <buffer> <silent> <leader>q :cclose<CR>
augroup END
""==================================================


"" Only FZF things
let g:fzf_vim = {}
let g:fzf_vim.preview_window = ['right,50%', 'ctrl-/']
nnoremap <silent><leader>f :Files<CR>
nnoremap <silent><leader>S :Rg<CR>
""==================================================

"" airline settings
let g:airline_theme='raven'

let g:gutentags_exclude_filetypes = ['gitcommit','gitconfig','gitrebase','gitsendemail','git']
let g:gutentags_ctags_extra_args = ['--languages="c,c++,javascript,typescript,haskell,python"']
let g:gutentags_cache_dir = '~/.tags'
