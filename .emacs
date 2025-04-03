(setq custom-file "~/.emacs.custom.el")

;; package manager inicial
(setq package-archives '(("melpa" . "https://melpa.org/packages/")
                         ("elpa" . "https://elpa.gnu.org/packages/")))
(package-initialize)
(dolist (pkg '(evil
                gruvbox-theme
                projectile
                evil-escape
		; lang modes
		lsp-mode
                haskell-mode
                rust-mode
                cc-mode
                python-mode
                ))
  (unless (package-installed-p pkg)
    (package-refresh-contents)
    (package-install pkg))
  )

;; UI settings
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

;; Eletric Pair
(defun electric-pair ()
  "If at end of line, insert character pair without surrounding spaces.
   Otherwise, just insert the typed character."
  (interactive)
  (if (eolp) (let (parens-require-spaces) (insert-pair)) 
    (self-insert-command 1)))


; LSP mode
(require 'lsp-mode)
(add-hook 'haskell-mode-hook #'lsp)

;; python eletric pair
(add-hook 'python-mode-hook
          (lambda ()
            (define-key python-mode-map "\"" 'electric-pair)
            (define-key python-mode-map "\'" 'electric-pair)
            (define-key python-mode-map "(" 'electric-pair)
            (define-key python-mode-map "[" 'electric-pair)
            (define-key python-mode-map "{" 'electric-pair)))

;; haskell
(add-hook 'haskell-mode-hook
          (lambda ()
            (define-key haskell-mode-map "\"" 'electric-pair)
            (define-key haskell-mode-map "\'" 'electric-pair)
            (define-key haskell-mode-map "(" 'electric-pair)
            (define-key haskell-mode-map "[" 'electric-pair)
            (define-key haskell-mode-map "{" 'electric-pair)))
