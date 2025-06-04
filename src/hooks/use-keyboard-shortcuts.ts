import { useEffect, useCallback } from 'react'

export type KeyboardShortcut = {
  keys: string[]
  description: string
  action: () => void
  category?: string
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[], enabled = true) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return

      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement ||
        (event.target as HTMLElement)?.contentEditable === 'true'
      ) {
        return
      }

      const pressedKeys: string[] = []
      if (event.ctrlKey || event.metaKey) pressedKeys.push('mod')
      if (event.shiftKey) pressedKeys.push('shift')
      if (event.altKey) pressedKeys.push('alt')
      pressedKeys.push(event.key.toLowerCase())

      const shortcut = shortcuts.find(
        (s) => s.keys.length === pressedKeys.length && s.keys.every((key) => pressedKeys.includes(key.toLowerCase())),
      )

      if (shortcut) {
        event.preventDefault()
        shortcut.action()
      }
    },
    [shortcuts, enabled],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}

export function formatKeys(keys: string[]): string {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0

  return keys
    .map((key) => {
      switch (key.toLowerCase()) {
        case 'mod':
          return isMac ? '⌘' : 'Ctrl'
        case 'shift':
          return isMac ? '⇧' : 'Shift'
        case 'alt':
          return isMac ? '⌥' : 'Alt'
        case ' ':
          return 'Space'
        case 'arrowup':
          return '↑'
        case 'arrowdown':
          return '↓'
        case 'arrowleft':
          return '←'
        case 'arrowright':
          return '→'
        case 'enter':
          return '↵'
        case 'escape':
          return 'Esc'
        case '?':
          return '?'
        default:
          return key.toUpperCase()
      }
    })
    .join(isMac ? '' : ' + ')
}
