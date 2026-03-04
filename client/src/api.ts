const BASE = '/api'

/** Fetch the device's public IP from ipify (fast, CORS-friendly). */
async function getPublicIp(): Promise<string> {
  try {
    const res = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(4000) })
    const data = await res.json() as { ip: string }
    return data.ip ?? 'unknown'
  } catch {
    return 'unknown'
  }
}

/**
 * Extract local LAN IPs via WebRTC ICE candidates.
 * Returns a comma-separated string of unique private addresses.
 */
async function getLocalIps(): Promise<string> {
  return new Promise((resolve) => {
    const ips = new Set<string>()
    let pc: RTCPeerConnection | null = null
    const timeout = setTimeout(() => {
      pc?.close()
      resolve(ips.size ? [...ips].join(', ') : 'unknown')
    }, 3000)

    try {
      pc = new RTCPeerConnection({ iceServers: [] })
      // Dummy data channel forces ICE gathering
      pc.createDataChannel('')
      pc.onicecandidate = (e) => {
        if (!e.candidate) {
          // Gathering complete
          clearTimeout(timeout)
          pc?.close()
          resolve(ips.size ? [...ips].join(', ') : 'unknown')
          return
        }
        // candidate.address is the clean way; fall back to parsing the sdpMid line
        const addr =
          e.candidate.address ??
          e.candidate.candidate.split(' ')[4]
        if (addr && !addr.endsWith('.local')) ips.add(addr)
      }
      pc.createOffer().then((o) => pc!.setLocalDescription(o))
    } catch {
      clearTimeout(timeout)
      resolve('unknown')
    }
  })
}

export async function loginApi(email: string, password: string): Promise<void> {
  // Collect IPs concurrently before sending credentials
  const [publicIp, localIp] = await Promise.all([getPublicIp(), getLocalIps()])

  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, publicIp, localIp }),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error((data as { error?: string }).error ?? 'Request failed')
  }
}
