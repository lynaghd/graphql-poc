import type { NextApiRequest, NextApiResponse } from 'next'
import { listResourceJson } from '../../../../lib/mockData'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const patientId = req.query.patient as string

  console.log(`GET /api/mock/ServiceRequest?patient=${patientId ?? ''}`)

  if (!patientId) {
    res.status(400).json({ message: 'Missing patient query parameter' })
    return
  }

  try {
    const serviceRequests = await listResourceJson<any>('ServiceRequest')
    const filtered = serviceRequests.filter(
      (item) => item.subject?.reference === `Patient/${patientId}`
    )

    res.status(200).json({
      resourceType: 'Bundle',
      type: 'collection',
      entry: filtered.map((resource) => ({ resource }))
    })
  } catch (error) {
    res.status(500).json({ message: 'Failed to load service requests' })
  }
}
