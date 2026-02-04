import type { NextApiRequest, NextApiResponse } from 'next'
import { listResourceJson } from '../../../../lib/mockData'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const basedOn = req.query['based-on'] as string

  if (!basedOn) {
    res.status(400).json({ message: 'Missing based-on query parameter' })
    return
  }

  try {
    const documents = await listResourceJson<any>('DocumentReference')
    const filtered = documents.filter((doc) =>
      (doc.basedOn ?? []).some((reference: { reference: string }) => reference.reference === `ServiceRequest/${basedOn}`)
    )

    res.status(200).json({
      resourceType: 'Bundle',
      type: 'collection',
      entry: filtered.map((resource) => ({ resource }))
    })
  } catch (error) {
    res.status(500).json({ message: 'Failed to load document references' })
  }
}
