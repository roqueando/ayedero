(setq custom-file "~/.emacs.custom.el")

;; package manager inicial
(setq package-archives '(("melpa" . "https://melpa.org/packages/")
                         ("elpa" . "https://elpa.gnu.org/packages/")))
(package-initialize)
(dolist (pkg '(evil
                evil-collection
                gruvbox-theme
                projectile
                evil-escape
		vertico
		vterm
		org
		company
		magit
		; lang modes
		go-mode ;; Golang
                haskell-mode ;; Haskell
                rust-mode ;; Rust
                cc-mode ;; C/C++ 
                python-mode ;; Python
                ))
  (unless (package-installed-p pkg)
    (package-refresh-contents)
    (package-install pkg))
  )

;; UI settings
(electric-pair-mode 1)
(tool-bar-mode 0)
(menu-bar-mode 0)
(scroll-bar-mode 0)
(column-number-mode 1)
(display-line-numbers-mode)
(setq display-line-numbers-type 'relative)
(show-paren-mode 1)
(global-display-line-numbers-mode)

;; Font
(set-face-attribute 'default nil :family "CodeNewRoman Nerd Font Mono" :height 150)

;; Evil mode
(require 'evil)
(evil-mode 1)
(evil-escape-mode 1)
(setq-default evil-escape-key-sequence "jk")


;; create a prefix ";"
(define-prefix-command 'my-semicolon-map)
(define-key evil-normal-state-map (kbd ";") 'my-semicolon-map)

;; Dired as netrw
(setq dired-listing-switches "-lah")
(setq dired-dwim-target t)
(setq dired-hide-details-hide-symlink-targets nil)
(define-key my-semicolon-map (kbd "e") 'dired)

;; Theme all the gruv all the box 
(load-theme 'gruvbox-light-hard t)

;; evil keybinds
(define-key evil-normal-state-map (kbd "; w") 'save-buffer)

;; projectile
(require 'projectile)
(projectile-mode +1)
(define-key evil-normal-state-map (kbd "; f") 'projectile-find-file)

;; langs
(require 'haskell-mode)
(require 'rust-mode)
(require 'cc-mode)
(require 'python-mode)

(eval-after-load "haskell-mode"
    '(define-key my-semicolon-map (kbd "c") 'haskell-compile))

;;(eval-after-load "haskell-cabal"
 ;   '(define-key haskell-cabal-mode-map (kbd "C-c C-c") 'haskell-compile))


(setq projectile-completion-system 'ido)
(ido-mode 1)
(setq ido-enable-flex-matching t)
(setq ido-everywhere t)

;; Packages
(use-package vterm
    :ensure t)

;; My Functions
(defun open-vterm-in-project ()
  "Open a buffer with vterm in directory of project with a window at his side"
  (interactive)
  (let ((default-directory (projectile-project-root)))
    (split-window-bottom)
    (other-window 1)
    (vterm)))

(define-key my-semicolon-map (kbd "t") 'open-vterm-in-project)
(define-key my-semicolon-map (kbd "g") 'magit)

;; company mode
(add-hook 'after-init-hook 'global-company-mode)

(evil-collection-init)
