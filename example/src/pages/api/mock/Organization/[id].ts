import type { NextApiRequest, NextApiResponse } from 'next'
import { readResourceJson } from '../../../../lib/mockData'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  try {
    const organization = await readResourceJson('Organization', id as string)
    res.status(200).json(organization)
  } catch (error) {
    res.status(404).json({ message: 'Organization not found' })
  }
}
