import type { NextApiRequest, NextApiResponse } from 'next'
import { readResourceJson } from '../../../../lib/mockData'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  console.log(`GET /api/mock/ServiceRequest/${id}`)

  try {
    const serviceRequest = await readResourceJson('ServiceRequest', id as string)
    res.status(200).json(serviceRequest)
  } catch (error) {
    res.status(404).json({ message: 'ServiceRequest not found' })
  }
}
