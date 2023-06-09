vim.opt.syntax = "on"
vim.opt.relativenumber = true
vim.opt.mouse = "c"
vim.opt.wrap = true
vim.opt.tabstop = 2
vim.opt.shiftwidth = 2
vim.opt.termguicolors = true

--
vim.opt.path:remove "/usr/include"
vim.opt.path:append "**"
vim.opt.wildignorecase = true
vim.opt.wildignore:append "**/node_modules/*"
vim.opt.wildignore:append "**/.git/*"
vim.opt.wildignore:append "**/build/*"

-- NetRW Settings
vim.g.netrw_banner = 0
vim.g.netrw_winsize = 15


-- Leader
vim.g.mapleader = ";"

-- Functions
local test_runners = {
	elixir = "mix test",
	rust = "cargo test",
	go = "go test ./...",
	node = "yarn test",
}

function test_by_lang()
	local path = vim.fn.expand("%")
  local bufnr = vim.api.nvim_get_current_buf()
	local extension = vim.bo[bufnr].filetype 
	if test_nearest_runners[extension] == nil then
		return "Runner not supported"
	else
		-- :silent ! tmux send-keys -t 0:0.0 'print("test")' Enter
		local test_command = ":silent ! tmux send-keys -t" .. test_nearest_runners[extension]
		return test_command
	end
end


-- Keybindings general
vim.keymap.set('i', 'jk', '<esc>')
vim.keymap.set('n', '<leader>w', '<cmd>write<cr>', {desc = "Save"})
vim.keymap.set('n', '<leader>f', ':find ', {desc = "Find File"})

-- My Own
--vmap <C-c><C-c> "ry :call Send_to_Pane(@r)<CR>

-- NETRW keybindigs
vim.keymap.set('n', '<leader>e', '<cmd>Lexplore<cr>', {desc = "File Explorer"})

-- CMD Vim commands
vim.cmd [[highlight Normal ctermbg=none]]
vim.cmd [[highlight NonText ctermbg=none]]
vim.cmd [[colorscheme habamax]]
