-- Packer plugin manager setup (substitui o vim-plug)
require('packer').startup(function()
  use 'wbthomason/packer.nvim'  -- Packer can manage itself
  use 'tpope/vim-endwise'  -- Auto-close defs in ruby/elixir
  use 'jiangmiao/auto-pairs'  -- Auto-close brackets
  use 'airblade/vim-gitgutter'  -- Git gutter
  use {'junegunn/fzf', run = function() vim.fn['fzf#install']() end }  -- FZF search
  use 'junegunn/fzf.vim'
  use 'nvim-lualine/lualine.nvim'
  use 'nvim-tree/nvim-web-devicons'
  use 'dracula/vim'  -- Dracula theme
  use {
        'nvim-treesitter/nvim-treesitter',
        run = function()
            local ts_update = require('nvim-treesitter.install').update({ with_sync = true })
            ts_update()
        end,
    }
  use 'pasky/claude.vim'  -- Claude vim plugin
end)

-- Settings (equivalente aos sets no .vimrc)
vim.opt.tags = '.tags'
vim.opt.clipboard = 'unnamedplus'
vim.opt.background = 'dark'
vim.opt.relativenumber = true
vim.opt.number = true
vim.opt.cursorline = true

-- Filetype, plugins and indentation settings
vim.cmd([[filetype plugin indent on]])
vim.cmd([[syntax enable]])

vim.g.mapleader = ";"
-- Keybindings in Lua

-- Normal mode keybinding
vim.api.nvim_set_keymap('n', '<leader>f', ':Files<CR>', { noremap = true, silent = true })
vim.api.nvim_set_keymap('n', '<leader>S', ':Rg<CR>', { noremap = true, silent = true })
vim.api.nvim_set_keymap('n', '<leader>w', ':w<CR>', { noremap = true })

-- Insert mode keybinding
vim.api.nvim_set_keymap('i', 'jk', '<Esc>', { noremap = true, silent = true })  -- Exit insert mode by pressing 'jk'
vim.cmd [[colorscheme dracula]]
require('lualine').setup()

require'nvim-treesitter.configs'.setup {
  -- A list of parser names, or "all" (the listed parsers MUST always be installed)
  ensure_installed = { "c", "lua", "vim", "vimdoc", "query", "markdown", "markdown_inline", "haskell", "python", "javascript", "typescript", "rust",  "go" },

  -- Install parsers synchronously (only applied to `ensure_installed`)
  sync_install = false,

  -- Automatically install missing parsers when entering buffer
  -- Recommendation: set to false if you don't have `tree-sitter` CLI installed locally
  auto_install = true,

  ---- If you need to change the installation directory of the parsers (see -> Advanced Setup)
  -- parser_install_dir = "/some/path/to/store/parsers", -- Remember to run vim.opt.runtimepath:append("/some/path/to/store/parsers")!

  highlight = {
    enable = true,

    -- Setting this to true will run `:h syntax` and tree-sitter at the same time.
    -- Set this to `true` if you depend on 'syntax' being enabled (like for indentation).
    -- Using this option may slow down your editor, and you may see some duplicate highlights.
    -- Instead of true it can also be a list of languages
    additional_vim_regex_highlighting = false,
  },
}
