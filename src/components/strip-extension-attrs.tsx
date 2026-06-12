'use client'

import { useEffect } from 'react'

/** Attributs injectés par Bitdefender / extensions avant l'hydratation React. */
const EXTENSION_ATTRS = ['bis_skin_checked', 'bis_use'] as const

function stripExtensionAttrs() {
  for (const attr of EXTENSION_ATTRS) {
    document.querySelectorAll(`[${attr}]`).forEach((node) => {
      node.removeAttribute(attr)
    })
  }
}

/**
 * Retire uniquement les attributs d'extensions (pas les nœuds <script> :
 * les supprimer provoque des conflits removeChild avec React / l'extension).
 */
export function StripExtensionAttrs() {
  useEffect(() => {
    stripExtensionAttrs()

    const observer = new MutationObserver(stripExtensionAttrs)
    observer.observe(document.documentElement, {
      subtree: true,
      attributes: true,
      attributeFilter: [...EXTENSION_ATTRS],
    })

    return () => observer.disconnect()
  }, [])

  return null
}
