import type { NextApiRequest, NextApiResponse } from 'next'
import { listResourceJson } from '../../../../lib/mockData'

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const patients = await listResourceJson('Patient')
    res.status(200).json({
      resourceType: 'Bundle',
      type: 'collection',
      entry: patients.map((patient) => ({ resource: patient }))
    })
  } catch (error) {
    res.status(500).json({ message: 'Failed to load patients' })
  }
}
