import XMonad
import XMonad.Layout.Gaps
import XMonad.Layout.Spacing
import XMonad.Layout.Spiral
import Data.Monoid
import Data.Function
import System.Exit

import Data.List (sortBy)
import Control.Monad (forM_, join)
import XMonad.Util.Run (safeSpawn, spawnPipe)
import XMonad.Util.NamedWindows (getName)

import qualified XMonad.StackSet as W
import qualified Data.Map        as M

-- Some basic settings
myTerminal          = "alacritty"
myFocusFollowsMouse = True
myClickJustFocuses  = False
myBorderWidth       = 4
mySpacing           = 6
myGaps              = [(U, 60), (D, 30), (L, 30), (R, 30)]
myModMask           = mod4Mask
myWorkspaces        = map show [1..9]

-- color0 and color12 are declared at the end of
-- the file and are inserted by pywal
myNormalBorderColor  = color0
myFocusedBorderColor = color12

-- Keybindings
myKeys conf@(XConfig {XMonad.modMask = modm}) = M.fromList $
    [ ((modm, xK_Return), spawn $ XMonad.terminal conf)
    , ((modm,               xK_d     ), spawn "rofi -show run")
    , ((modm .|. shiftMask, xK_q     ), kill)
    , ((modm,               xK_space ), sendMessage NextLayout)
    , ((modm .|. shiftMask, xK_space ), setLayout $ XMonad.layoutHook conf)
    , ((modm,               xK_n     ), refresh)
    , ((modm,               xK_Tab   ), windows W.focusDown)
    , ((modm,               xK_j     ), windows W.focusDown)
    , ((modm,               xK_k     ), windows W.focusUp  )
    , ((modm,               xK_m     ), windows W.focusMaster  )
    , ((modm,               xK_Return), windows W.swapMaster)
    , ((modm .|. shiftMask, xK_j     ), windows W.swapDown  )
    , ((modm .|. shiftMask, xK_k     ), windows W.swapUp    )
    , ((modm,               xK_h     ), sendMessage Shrink)
    , ((modm,               xK_l     ), sendMessage Expand)
    , ((modm,               xK_t     ), withFocused $ windows . W.sink)
    , ((modm              , xK_comma ), sendMessage (IncMasterN 1))
    , ((modm              , xK_period), sendMessage (IncMasterN (-1)))
    , ((modm .|. shiftMask, xK_e     ), io exitSuccess)
    , ((mod4Mask .|. shiftMask, xK_z), spawn "xscreensaver-command -lock")
    , ((modm              , xK_c     ), spawn "xmonad --recompile; xmonad --restart")
    ]
    ++
    [((m .|. modm, k), windows $ f i)
        | (i, k) <- zip (XMonad.workspaces conf) [xK_1 .. xK_9]
        , (f, m) <- [(W.greedyView, 0), (W.shift, shiftMask)]]


myMouseBindings (XConfig {XMonad.modMask = modm}) = M.fromList
    -- Move the window
    [ ((modm, button1), \w -> focus w >> mouseMoveWindow w
                                      >> windows W.shiftMaster)
    -- Promote window as a master
    , ((modm, button2), \w -> focus w >> windows W.shiftMaster)
    -- Resize the window
    , ((modm, button3), \w -> focus w >> mouseResizeWindow w
                                      >> windows W.shiftMaster)
    ]

-- Layouts configuration
myLayout = tiled ||| Mirror tiled ||| Full ||| spiral (6/7) &
               gaps myGaps &
               smartSpacing mySpacing
  where
     tiled   = Tall nmaster delta ratio
     nmaster = 1
     ratio   = 1/2
     delta   = 3/100

-- Window rules
myManageHook = composeAll
    [ className =? "MPlayer"        --> doFloat
    , className =? "Gimp"           --> doFloat
    , resource  =? "desktop_window" --> doIgnore
    , resource  =? "kdesktop"       --> doIgnore ]

-- Logging for xmobar
myEventHook = mempty
myLogHook = do
  winset <- gets windowset
  title <- maybe (return "") (fmap show . getName) . W.peek $ winset
  let currWs = W.currentTag winset
  let wss = map W.tag $ W.workspaces winset
  let wsStr = join $ map (fmt currWs) $ sort' wss

  io $ appendFile "/tmp/.xmonad-title-log" (title ++ "\n")
  io $ appendFile "/tmp/.xmonad-workspace-log" (wsStr ++ "\n")

  where fmt currWs ws
          -- #C15A45 font color for the current workspace
          | currWs == ws = "<fc=#C15A45> " ++ ws ++ " </fc>"
          | otherwise    = " " ++ ws ++ " "
        sort' = sortBy (compare `on` (!! 0))

-- Stuff that will be executed on the startup, i typically just use .xinitrc for that
myStartupHook = return ()

main = do
  forM_ [".xmonad-workspace-log", ".xmonad-title-log"] $ \file -> do
    safeSpawn "mkfifo" ["/tmp/" ++ file]
    xmproc <- spawnPipe "xmobar"
    xmonad defaults

-- No need to edit this, it just uses stuff from the functions above
defaults = def {
      -- simple stuff
        terminal           = myTerminal,
        focusFollowsMouse  = myFocusFollowsMouse,
        clickJustFocuses   = myClickJustFocuses,
        borderWidth        = myBorderWidth,
        modMask            = myModMask,
        workspaces         = myWorkspaces,
        normalBorderColor  = myNormalBorderColor,
        focusedBorderColor = myFocusedBorderColor,

      -- key bindings
        keys               = myKeys,
        mouseBindings      = myMouseBindings,

      -- hooks, layouts
        layoutHook         = myLayout,
        manageHook         = myManageHook,
        handleEventHook    = myEventHook,
        logHook            = myLogHook,
        startupHook        = myStartupHook
    }

-- Inserted by cat .cache/wal/colors.hs | grep "color0"  | tail -n1 >> .config/xmonad/xmonad.hs
--             cat .cache/wal/colors.hs | grep "color12" | tail -n1 >> .config/xmonad/xmonad.hs
color0="#0d0e0c"
color12="#C15A45"
