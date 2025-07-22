(setq custom-file "~/.emacs.custom.el")
(load "~/ayedero/ghcid.el")
(load "~/ayedero/odin-mode.el")
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
(global-so-long-mode 1)
(package-initialize)
(dolist (pkg '(evil
               evil-collection
               ;; Themes
               solarized-theme
               ;; Tools
               tabspaces
               projectile
               evil-escape
               vertico
               direnv
               vterm
               counsel
               corfu
               org
               deft
               zetteldeft
               company
               magit
               org-superstar
               all-the-icons
               ivy
               rg
               ;; lang modes
               lsp-haskell
               lsp-mode
               fsharp-mode
               yaml-mode
               dart-mode
               julia-mode
               nix-mode
               go-mode ;; Golang
               haskell-mode ;; Haskell
               rust-mode ;; Rust
               cc-mode ;; C/C++
               python-mode ;; Python
               typescript-mode
               gtags-mode ;; GTAGS
               dts-mode ;; Device tree
               cmake-mode
               web-mode
               swift-mode
               tuareg
               ))
  (unless (package-installed-p pkg)
    (package-refresh-contents)
    (package-install pkg))
  )
(use-package gtags-mode
  :hook ((emacs-startup . gtags-mode)))
(setq-default evil-want-keybinding nil)

(setq lsp-go-env '(
                   (GOFLAGS . "-tags=tinygo")
                   )
      )
;; ;; LSP-MODE settings
(use-package lsp-mode
  :init
  :hook (
         (python-mode . lsp)
         (go-mode . lsp)
         (c++-mode . lsp)
         (fsharp-mode . lsp)
         (rust-mode . lsp)
         (dart-mode . lsp)
         (swift-mode . lsp)
         )
  :config
  (setq lsp-headerline-breadcrumb-enable nil)
  (lsp-register-custom-settings
   '(("gopls.env" (
                   ("GOFLAGS" . "-tags=tinygo")
                   ))))
  :commands lsp)

(add-hook 'haskell-mode-hook #'lsp)
(add-hook 'haskell-literate-mode-hook #'lsp)
(add-hook 'c-mode-hook 'lsp)
(add-hook 'c++-mode-hook 'lsp)
(add-hook 'fsharp-mode-hook 'lsp)
(add-hook 'rust-mode-hook 'lsp)
(add-hook 'dart-mode-hook 'lsp)

;; UI settings
(electric-pair-mode 1)
(tool-bar-mode 0)
(menu-bar-mode 0)
(when (fboundp 'scroll-bar-mode)
  (if (display-graphic-p)
      (scroll-bar-mode 0)   ;; ativa se for GUI
    (scroll-bar-mode -1)))  ;; desativa se for terminal
;; (scroll-bar-mode 0)
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
(define-key my-semicolon-map (kbd "C") 'projectile-compile-project)
(define-key my-semicolon-map (kbd "p") 'projectile-switch-project)
(define-key my-semicolon-map (kbd "S") 'counsel-rg)

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

(require 'haskell-interactive-mode)
(require 'haskell-process)
(add-hook 'haskell-mode-hook 'interactive-haskell-mode)

;;(eval-after-load "haskell-cabal"
                                        ;   '(define-key haskell-cabal-mode-map (kbd "C-c C-c") 'haskell-compile))


(setq projectile-completion-system 'ivy)

;; Packages
(use-package vterm
  :ensure t)

;; package: tabspaces
(use-package tabspaces
  :hook (after-init . tabspaces-mode)
  :commands (tabspaces-switch-or-create-workspace
             tabspaces-open-or-create-project-and-workspace)
  :custom
  (tabspaces-use-filtered-buffers-as-default t)
  (tabspaces-default-tab "main")
  (tabspaces-remove-to-default t)
  (tabspaces-include-buffers '("*scratch*"))
  ;; (tabspaces-initialize-project-with-todo t)
  ;; (tabspaces-todo-file-name "project-todo.org")
  ;; sessions
  (tabspaces-session t)
  (tabspaces-session-auto-restore t)
  (tab-bar-new-tab-choice "*scratch*"))

(defvar tabspaces-command-map
  (let ((map (make-sparse-keymap)))
    (define-key my-semicolon-map (kbd "c w") 'tabspaces-clear-buffers)
    (define-key my-semicolon-map (kbd "b w") 'tabspaces-switch-to-buffer)
    (define-key my-semicolon-map (kbd "d w") 'tabspaces-close-workspace)
    (define-key my-semicolon-map (kbd "k") 'tabspaces-kill-buffers-close-workspace)
    (define-key my-semicolon-map (kbd "ow") 'tabspaces-open-or-create-project-and-workspace)
    (define-key my-semicolon-map (kbd "rc") 'tabspaces-remove-current-buffer)
    (define-key my-semicolon-map (kbd "rw") 'tabspaces-remove-selected-buffer)
    (define-key my-semicolon-map (kbd "sw") 'tabspaces-switch-or-create-workspace)
    (define-key my-semicolon-map (kbd "tw") 'tabspaces-switch-buffer-and-tab)
    map)
  "Keymap for tabspace/workspace commands after `tabspaces-keymap-prefix'.")

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
(define-key my-semicolon-map (kbd "S") 'counsel-rg)

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


(setq-default tab-width 2)
(setq-default indent-tabs-mode nil)
(setq-default c-basic-offset 2)
(setq-default go-basic-offset 2)

;; lsp

(with-eval-after-load 'lsp-ui-doc
  (define-key lsp-ui-doc-frame-mode-map (kbd "q") nil)
  )


(setq projectile-indexing-method 'alien)
(setq ring-bell-function 'ignore)

(use-package deft
  :ensure t
  :init
    (setq deft-extensions '("org" "md" "txt")
          deft-use-filename-as-title t))

(use-package zetteldeft
  :ensure t
  :after deft
  :config (zetteldeft-set-classic-keybindings))


(setq zetteldeft-link-indicator "@"
      zetteldeft-id-format "%Y-%m-%d-%H%M"
      zetteldeft-id-regex "[0-9]\\{4\\}\\(-[0-9]\\{2,\\}\\)\\{3\\}"
      zetteldeft-tag-regex "[#][a-z-]+")

(define-key my-semicolon-map (kbd "nf") 'zetteldeft-new-file)
(define-key my-semicolon-map (kbd "nt") 'zetteldeft-tag-insert)
(define-key my-semicolon-map (kbd "ns") 'zetteldeft-search-tag)

;;; I prefer cmd key for meta
(setq mac-option-key-is-meta nil
      mac-command-key-is-meta t
      mac-command-modifier 'meta
      mac-option-modifier 'none)
(setq lsp-inlay-hint-enable t)

;; dante
(use-package attrap
  :ensure t)

(use-package dante
  :ensure t
  :after haskell-mode
  :commands 'dante-mode
  :init
  (add-hook 'haskell-mode-hook 'flycheck-mode)
  (add-hook 'haskell-mode-hook 'dante-mode)
  :config
  (flycheck-add-next-checker 'haskell-dante '(info . haskell-hlint)))




;; Swift editing support
(use-package swift-mode
    :ensure t
    :mode "\\.swift\\'"
    :interpreter "swift")

(add-to-list 'auto-mode-alist '("\\.overlay\\'" . dts-mode))
(global-set-key (kbd "TAB") 'self-insert-command)
