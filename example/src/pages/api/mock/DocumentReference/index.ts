import type { NextApiRequest, NextApiResponse } from 'next'
import { listResourceJson } from '../../../../lib/mockData'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const basedOn = req.query['based-on'] as string

  console.log(`GET /api/mock/DocumentReference?based-on=${basedOn ?? ''}`)

  if (!basedOn) {
    res.status(400).json({ message: 'Missing based-on query parameter' })
    return
  }

  try {
    const documents = await listResourceJson<any>('DocumentReference')
    const matchesBasedOn = (doc: any) =>
      (doc.basedOn ?? []).some(
        (reference: { reference: string }) => reference.reference === `ServiceRequest/${basedOn}`
      )

    const matchesContext = (doc: any) =>
      (doc.context?.related ?? []).some(
        (reference: { reference: string }) => reference.reference === `ServiceRequest/${basedOn}`
      )

    const filtered = documents.filter((doc) => matchesBasedOn(doc) || matchesContext(doc))

    res.status(200).json({
      resourceType: 'Bundle',
      type: 'collection',
      entry: filtered.map((resource) => ({ resource }))
    })
  } catch (error) {
    res.status(500).json({ message: 'Failed to load document references' })
  }
}
