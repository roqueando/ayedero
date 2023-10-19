#!/bin/sh

echo "[AYEDERO] config"
echo "Installing Helix [...]"

ln -s ~/ayedero/config.toml ~/.config/helix/config.toml

echo "Helix [OK]"

echo "Installing Tmux [...]"

ln -s ~/ayedero/.tmux.conf ~/.tmux.conf

echo "Tmux [OK]"

echo "Installing Neovim & VIM [...]"
ln -s $HOME/ayedero/.vimrc $HOME/.config/nvim/init.vim
ln -s $HOME/ayedero/.vimrc $HOME/.vimrc

echo "Neovim & VIM [OK]"
