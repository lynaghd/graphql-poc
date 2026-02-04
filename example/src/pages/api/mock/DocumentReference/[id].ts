import type { NextApiRequest, NextApiResponse } from 'next'
import { readResourceJson } from '../../../../lib/mockData'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  console.log(`GET /api/mock/DocumentReference/${id}`)

  try {
    const document = await readResourceJson('DocumentReference', id as string)
    res.status(200).json(document)
  } catch (error) {
    res.status(404).json({ message: 'DocumentReference not found' })
  }
}
