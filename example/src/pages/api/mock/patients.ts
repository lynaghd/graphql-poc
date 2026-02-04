import type { NextApiRequest, NextApiResponse } from 'next'
import { patients } from './data'

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const list = patients.map(({ id, name }) => ({ id, name }))

  res.status(200).json(list)
}
