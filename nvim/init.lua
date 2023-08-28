vim.opt.syntax = "on"
vim.opt.relativenumber = true
vim.opt.number = true
vim.opt.mouse = "c"
vim.opt.wrap = true
vim.opt.tabstop = 2
vim.opt.shiftwidth = 2
vim.opt.termguicolors = true
vim.api.nvim_command('filetype plugin indent on')

--
vim.opt.path:remove "/usr/include"
vim.opt.path:append "."
vim.opt.path:append "**"
vim.opt.wildignorecase = true
vim.opt.wildignore:append "**/node_modules/*"
vim.opt.wildignore:append "**/.git/*"
vim.opt.wildignore:append "**/build/*"
vim.opt.wildignore:append "**/dist/*" -- For dist builds like typescript
--
local rg_installed = vim.fn.executable("rg") == 1

if rg_installed then
    vim.api.nvim_exec([[
        set grepprg=rg\ --vimgrep\ --smart-case\ --hidden
        set grepformat=%f:%l:%c:%m
    ]], false)
end

--
vim.cmd([[silent! autocmd! filetypedetect BufRead,BufNewFile *.tf]])
vim.cmd([[autocmd BufRead,BufNewFile *.hcl set filetype=hcl]])
vim.cmd([[autocmd BufRead,BufNewFile .terraformrc,terraform.rc set filetype=hcl]])
vim.cmd([[autocmd BufRead,BufNewFile *.tf,*.tfvars set filetype=terraform]])
vim.cmd([[autocmd BufRead,BufNewFile *.tfstate,*.tfstate.backup set filetype=json]])

-- NetRW Settings
vim.g.netrw_banner = 0
vim.g.netrw_liststyle = 3
vim.g.netrw_winsize = 15
vim.g.netrw_localrmdir = 'rm -r'

-- Leader
vim.g.mapleader = ";"

-- Functions
local test_runners = {
  elixir = "mix test",
  rust = "cargo test",
  go = "go test ./...",
  node = "yarn test",
}

-- Keybindings general
vim.keymap.set('i', 'jk', '<esc>')
vim.keymap.set('n', '<leader>w', '<cmd>write<cr>', { desc = "Save" })
vim.keymap.set('n', '<leader>f', ':find ', { desc = "Find File" })
vim.keymap.set('n', '<leader>T', function()
  local path = vim.fn.expand("%")
  local bufnr = vim.api.nvim_get_current_buf()
  local extension = vim.bo[bufnr].filetype

  if test_runners[extension] == nil then
    print("Runner not supported")
    return ""
  else
    local pane = "2"
    local test_command = ":silent ! tmux send-keys -t " ..
        '"' .. pane .. '" ' .. "'" .. test_runners[extension] .. "'" .. " Enter"
    vim.cmd(test_command)
  end
end, { desc = "Test suite" })


-- New file in new tab
function CreateFileInNewTab()
    local current_directory = vim.fn.expand('%:p:h')
    
    local file_name = vim.fn.input("New filename: ")
    
    if file_name ~= "" then
        local file_path = current_directory .. '/' .. file_name
        local command = string.format("tabedit %s", file_path)
        vim.cmd(command)
    else
        print("Invalid filename")
    end
end
vim.keymap.set('n', '<leader>nn', CreateFileInNewTab, { desc = "Create new file in current directory" })

-- Live grep
function live_grep_directory()
	local text_to_find = vim.fn.input("Text to find [all project]: ")
	if text_to_find ~= "" then
		local command = string.format("vimgrep /%s/ *", text_to_find)
		vim.cmd(command)
	else
		print("Text should not be empty")
	end
end
vim.keymap.set('n', '<leader>g', live_grep_directory, {desc = "Find text in all directory"})
vim.keymap.set('n', 'gn', ":cnext <cr>", {desc = "Next match on vimgrep"})
vim.keymap.set('n', 'gp', ":cprev <cr>", {desc = "Previous match on vimgrep"})
vim.keymap.set('n', 'gf', ":cfirst <cr>", {desc = "First match on vimgrep"})
vim.keymap.set('n', 'gl', ":clast <cr>", {desc = "Last match on vimgrep"})

-- NETRW keybindigs
vim.keymap.set('n', '<leader>e', '<cmd>Lexplore<cr>', { desc = "File Explorer" })
vim.g.editorconfig = false

-- CMD Vim commands
vim.cmd [[highlight Normal ctermbg=none]]
vim.cmd [[highlight NonText ctermbg=none]]
vim.cmd [[colorscheme habamax]]
