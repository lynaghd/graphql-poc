import type { NextApiRequest, NextApiResponse } from 'next'
import { patients } from '../data'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  const patient = patients.find((record) => record.id === id)

  if (!patient) {
    res.status(404).json({ message: 'Patient not found' })
    return
  }

  const referralSummaries = patient.referrals.map((referral) => ({
    id: referral.id,
    title: referral.title,
    status: referral.status,
    receivedAt: referral.receivedAt,
    documentCount: referral.documents.length,
    documents: referral.documents.map((document) => ({
      id: document.id,
      title: document.title
    }))
  }))

  res.status(200).json({
    ...patient,
    referrals: referralSummaries
  })
}
