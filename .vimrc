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


" Ionide for F#
Plug 'ionide/Ionide-vim'
Plug 'slint-ui/vim-slint'
Plug 'sukima/xmledit'

Plug 'xolox/vim-notes'
Plug 'xolox/vim-misc'
Plug 'jreybert/vimagit'
Plug 'zk-org/zk-nvim'
Plug 'maxmx03/solarized.nvim'

call plug#end()

filetype plugin indent on
syntax enable

" Sets
set tag=.tags
set tag+=$HOME/.tags
set clipboard^=unnamed
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
au BufReadPost *.xrc set syntax=xml
autocmd FileType xml set omnifunc=xmlcomplete#CompleteTags noci
""==================================================


"" Only FZF things
let g:fzf_vim = {}
let g:fzf_vim.preview_window = ['right,50%', 'ctrl-/']
nnoremap <silent><leader>f :Files<CR>
nnoremap <silent><leader>S :Rg<CR>
""==================================================

"" airline settings
let g:airline_theme="distinguished"

let g:gutentags_exclude_filetypes = ['gitcommit','gitconfig','gitrebase','gitsendemail','git']
let g:gutentags_ctags_extra_args = ['--languages="c,c++,javascript,typescript,haskell,python"']
let g:gutentags_cache_dir = '~/.tags'
hi Normal guibg=NONE ctermbg=NONE

nnoremap <leader>g :Magit<CR>

"" build things
nnoremap <silent><leader>C :make build<CR>:copen<CR>
nnoremap <silent><leader>ct :make test<CR>
autocmd FileType go nnoremap <buffer> <silent> <leader>ct :! go test -v ./
