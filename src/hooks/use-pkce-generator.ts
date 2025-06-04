import { useState } from 'react'
import { generateCodeVerifier, generateCodeChallenge } from '../lib/pkce'
import { toast } from 'sonner'

export function usePKCEGenerator() {
  const [verifier, setVerifier] = useState<string>('')
  const [challenge, setChallenge] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string>('')
  const [verifierLength, setVerifierLength] = useState<number>(128)

  async function generate() {
    setIsGenerating(true)
    setError('')
    try {
      const pkceCodeVerifier = generateCodeVerifier(verifierLength)
      const pkceCodeChallenge = await generateCodeChallenge(pkceCodeVerifier)
      setVerifier(pkceCodeVerifier)
      setChallenge(pkceCodeChallenge)
      toast.success(`PKCE values generated with ${verifierLength} character verifier!`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate PKCE values'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }

  function clear() {
    setVerifier('')
    setChallenge('')
    setError('')
    toast.success('Values cleared')
  }

  function increaseLength() {
    setVerifierLength((prev) => Math.min(128, prev + 5))
  }

  function decreaseLength() {
    setVerifierLength((prev) => Math.max(43, prev - 5))
  }

  return {
    // State
    verifier,
    challenge,
    isGenerating,
    error,
    verifierLength,
    setVerifierLength,

    // Actions
    generate,
    clear,
    increaseLength,
    decreaseLength,

    // Computed
    hasValues: Boolean(verifier && challenge),
  }
}
