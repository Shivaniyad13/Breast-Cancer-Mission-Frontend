export const createDonation = async (donationData: {
  name: string
  email: string
  phone?: string
  organization?: string
  amount: number
  message?: string
  is_anonymous?: boolean
  transaction_id?: string
  payment_status?: string
}) => {
  const res = await fetch('/api/donations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(donationData),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to submit donation.')
  }

  return data.data || data
}

export const getDonations = async (params?: {
  limit?: number
  page?: number
  status?: string
  search?: string
}) => {
  const query = new URLSearchParams()
  if (params?.limit) query.set('limit', params.limit.toString())
  if (params?.page) query.set('page', params.page.toString())
  if (params?.status) query.set('status', params.status)
  if (params?.search) query.set('search', params.search)

  const url = `/api/donations${query.toString() ? `?${query.toString()}` : ''}`
  const res = await fetch(url)
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch donations.')
  }

  return data
}

export const getDonationStats = async () => {
  const res = await fetch('/api/donations/stats')
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch donation stats.')
  }

  return data.data || data
}

export const api = {
  createDonation,
  getDonations,
  getDonationStats,
}
