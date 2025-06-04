import { useState } from 'react'
import { toast } from 'sonner'

export function useCopyActions() {
  const [justCopiedAll, setJustCopiedAll] = useState(false)

  async function copyAll(verifier: string, challenge: string) {
    if (!verifier || !challenge) return

    const pkceData = {
      code_verifier: verifier,
      code_challenge: challenge,
      code_challenge_method: 'S256',
      verifier_length: verifier.length,
      generated_at: new Date().toISOString(),
    }

    try {
      await navigator.clipboard.writeText(JSON.stringify(pkceData, null, 2))
      setJustCopiedAll(true)
      toast.success('All values copied as JSON!')
      setTimeout(() => setJustCopiedAll(false), 2000)
    } catch {
      toast.error('Failed to copy to clipboard')
    }
  }

  async function copyText(text: string, label: string) {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`${label} copied!`)
    } catch {
      toast.error(`Failed to copy ${label.toLowerCase()}`)
    }
  }

  return {
    justCopiedAll,
    copyAll,
    copyVerifier: (verifier: string) => copyText(verifier, 'Code verifier'),
    copyChallenge: (challenge: string) => copyText(challenge, 'Code challenge'),
  }
}
