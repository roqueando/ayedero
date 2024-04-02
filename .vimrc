set nocompatible
call plug#begin()
Plug 'sheerun/vim-polyglot' " just to get syntax highlight easy
Plug 'ntk148v/habamax.nvim' " habamax for neovim (just exists in vim)
Plug 'tpope/vim-endwise' " when using ruby or elixir for closing def
Plug 'jiangmiao/auto-pairs' " just to close brackets without efforts
Plug 'junegunn/fzf', { 'do': { -> fzf#install() } }
Plug 'junegunn/fzf.vim'
call plug#end()

filetype plugin indent on
syntax enable

" Sets
set background=dark
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

colorscheme habamax

let mapleader = ";"

" Map bindings ====================
nnoremap <leader>w :w<cr>
nnoremap <leader>R :source ~/ayedero/.vimrc<cr>
nnoremap <leader>e :Explore<cr>
nnoremap <leader>f :find 
nnoremap gn :tabnext <CR>
nnoremap gp :tabprevious <CR>
inoremap jk <esc>
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

"" show in tmux split docs for CPP ====================
command! -nargs=+ Cppman silent! call system("tmux split-window cppman " . expand(<q-args>))
autocmd FileType cpp nnoremap <silent><buffer> K <Esc>:Cppman <cword><CR>
""================================================== 

"" Quickfix com docs em Go ==================== 
function! CreateQuickfixDoc()
  normal! gv"xy
  let word = getreg('x')

  copen
  cexpr system("go doc " . word)
endfunction
vnoremap <silent>K :call CreateQuickfixDoc()<CR>
""================================================== 

"" FZF
let g:fzf_vim = {}
let g:fzf_vim.preview_window = ['right,50%', 'ctrl-/']
nnoremap <leader>f :Files<CR>
let &t_SI = "\e[6 q"
let &t_EI = "\e[2 q"
