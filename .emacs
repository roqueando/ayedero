(setq custom-file "~/.emacs.custom.el")
(setenv "PATH" (concat (getenv "PATH") ":/opt/homebrew/bin"))
(add-to-list 'exec-path "/opt/homebrew/bin")
(setenv "PATH" (concat (getenv "HOME") "/.ghcup/bin:" (getenv "PATH")))
(add-to-list 'exec-path (concat (getenv "HOME") "/.ghcup/bin"))

;; package manager inicial
(setq package-archives '(("melpa" . "https://melpa.org/packages/")
                         ("elpa" . "https://elpa.gnu.org/packages/")))
(setq backup-directory-alist `(("." . "~/.saves")))
(setq backup-by-copying t)
(setq delete-old-versions t
  kept-new-versions 6
  kept-old-versions 2
  version-control t)
(package-initialize)
(dolist (pkg '(evil
                evil-collection
                gruvbox-theme
		solarized-theme
                projectile
                evil-escape
		vertico
		vterm
		corfu
		org
		company
		magit
		neotree
		org-superstar
		all-the-icons
		ivy
		; lang modes
		fsharp-mode
		yaml-mode
		nix-mode ;; Nix
		go-mode ;; Golang
                haskell-mode ;; Haskell
                rust-mode ;; Rust
                cc-mode ;; C/C++ 
                python-mode ;; Python
		typescript-mode
		gtags-mode ;; GTAGS
                ))
  (unless (package-installed-p pkg)
    (package-refresh-contents)
    (package-install pkg))
  )
(use-package gtags-mode
  :hook ((emacs-startup . gtags-mode)))
(setq-default evil-want-keybinding nil)

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
(define-key my-semicolon-map (kbd "e") 'projectile-dired)
(define-key my-semicolon-map (kbd "p") 'projectile-switch-project)
(define-key my-semicolon-map (kbd "E") 'neotree-toggle)

;; neotree config

;; Theme all the gruv all the box 
(load-theme 'solarized-light t)

;; evil keybinds
(define-key evil-normal-state-map (kbd "; w") 'save-buffer)

;; projectile
(require 'projectile)
(projectile-mode +1)
(setq projectile-indexing-method 'native)
(define-key evil-normal-state-map (kbd "; f") 'projectile-find-file)

;; langs
(require 'haskell-mode)
(require 'rust-mode)
(require 'cc-mode)
(require 'python-mode)

(eval-after-load "haskell-mode"
    '(define-key my-semicolon-map (kbd "c") 'haskell-compile))

(require 'haskell-interactive-mode)
(require 'haskell-process)
(add-hook 'haskell-mode-hook 'interactive-haskell-mode)

;;(eval-after-load "haskell-cabal"
 ;   '(define-key haskell-cabal-mode-map (kbd "C-c C-c") 'haskell-compile))


(setq projectile-completion-system 'ivy)

;; Packages
(use-package vterm
    :ensure t)

;; My Functions
(defun open-vterm-in-project ()
  "Open a buffer with vterm in directory of project with a window at his side"
  (interactive)
  (let ((default-directory (projectile-project-root)))
    (split-window-below)
    (other-window 1)
    (vterm)))

(define-key my-semicolon-map (kbd "t") 'open-vterm-in-project)
(define-key my-semicolon-map (kbd "g") 'magit)

;; company mode
(add-hook 'after-init-hook 'global-company-mode)

(evil-collection-init)

;; Org mode settings
(setq org-adapt-indentation t
      org-hide-leading-stars t
      org-hide-emphasis-markers t
      org-pretty-entities t
	  org-ellipsis "  ·")

(setq org-src-fontify-natively t
	  org-src-tab-acts-natively t
      org-edit-src-content-indentation 0)
(add-hook 'org-mode-hook 'visual-line-mode)
(setq org-lowest-priority ?F)  ;; Gives us priorities A through F
(setq org-default-priority ?E) ;; If an item has no priority, it is considered [#E].

(setq org-priority-faces
      '((65 . "#BF616A")
        (66 . "#EBCB8B")
        (67 . "#B48EAD")
        (68 . "#81A1C1")
        (69 . "#5E81AC")
        (70 . "#4C566A")))
(setq org-todo-keywords
      '((sequence
		 "TODO" "PROJ" "READ" "CHECK" "IDEA" ; Needs further action
		 "|"
		 "DONE")))                           ; Needs no action currently

(setq org-todo-keyword-faces
      '(("TODO"      :inherit (org-todo region) :foreground "#A3BE8C" :weight bold)
		("PROJ"      :inherit (org-todo region) :foreground "#88C0D0" :weight bold)
        ("READ"      :inherit (org-todo region) :foreground "#8FBCBB" :weight bold)
		("CHECK"     :inherit (org-todo region) :foreground "#81A1C1" :weight bold)
		("IDEA"      :inherit (org-todo region) :foreground "#EBCB8B" :weight bold)
		("DONE"      :inherit (org-todo region) :foreground "#30343d" :weight bold)))

(require 'org-superstar)
(add-hook 'org-mode-hook (lambda () (org-superstar-mode 1)))

(require 'all-the-icons)

(add-to-list 'default-frame-alist '(fullscreen . maximized))

