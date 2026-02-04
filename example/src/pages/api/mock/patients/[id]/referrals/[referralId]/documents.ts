import type { NextApiRequest, NextApiResponse } from 'next'
import { patients } from '../../../../data'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, referralId } = req.query
  const patient = patients.find((record) => record.id === id)

  if (!patient) {
    res.status(404).json({ message: 'Patient not found' })
    return
  }

  const referral = patient.referrals.find((item) => item.id === referralId)

  if (!referral) {
    res.status(404).json({ message: 'Referral not found' })
    return
  }

  res.status(200).json(referral.documents)
}
