#!/bin/bash

# IDs dos teclados - substitua pelos IDs que você obteve
INTERNAL_KEYBOARD_ID="1:1:AT_Translated_Set_2_keyboard"
USB_KEYBOARD_ID="7847:2:2.4G_RF_Keyboard_&_Mouse_Keyboard"

# Função para desabilitar o teclado interno
disable_internal_keyboard() {
    swaymsg input "$INTERNAL_KEYBOARD_ID" events disabled
}

# Função para habilitar o teclado interno
enable_internal_keyboard() {
    swaymsg input "$INTERNAL_KEYBOARD_ID" events enabled
}

# Monitora eventos de dispositivos USB
while true; do
    if swaymsg -t get_inputs | grep -q "$USB_KEYBOARD_ID"; then
        disable_internal_keyboard
    else
        enable_internal_keyboard
    fi
    sleep 1
done
