import type { NextApiRequest, NextApiResponse } from 'next'
import { readResourceJson } from '../../../../lib/mockData'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  try {
    const patient = await readResourceJson('Patient', id as string)
    res.status(200).json(patient)
  } catch (error) {
    res.status(404).json({ message: 'Patient not found' })
  }
}
