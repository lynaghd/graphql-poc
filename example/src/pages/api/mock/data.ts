export type DocumentRecord = {
  id: string
  title: string
  type: string
  sizeKb: number
  createdAt: string
  uploadedBy: string
}

export type ReferralRecord = {
  id: string
  title: string
  status: string
  receivedAt: string
  documents: DocumentRecord[]
}

export type PatientRecord = {
  id: string
  name: string
  nhsNumber: string
  dateOfBirth: string
  gpPractice: string
  referrals: ReferralRecord[]
}

export const patients: PatientRecord[] = [
  {
    id: '1',
    name: 'Alex Morgan',
    nhsNumber: '943 476 5919',
    dateOfBirth: '1984-03-14',
    gpPractice: 'Leeds City Health Centre',
    referrals: [
      {
        id: 'ref-100',
        title: 'Cardiology referral',
        status: 'In review',
        receivedAt: '2025-11-10',
        documents: [
          {
            id: 'doc-1001',
            title: 'Referral letter',
            type: 'PDF',
            sizeKb: 220,
            createdAt: '2025-11-09',
            uploadedBy: 'Leeds City Health Centre'
          },
          {
            id: 'doc-1002',
            title: 'ECG results',
            type: 'PDF',
            sizeKb: 540,
            createdAt: '2025-11-08',
            uploadedBy: 'Leeds City Health Centre'
          }
        ]
      },
      {
        id: 'ref-101',
        title: 'Respiratory follow-up',
        status: 'Awaiting triage',
        receivedAt: '2025-10-03',
        documents: [
          {
            id: 'doc-1011',
            title: 'Spirometry report',
            type: 'PDF',
            sizeKb: 310,
            createdAt: '2025-10-02',
            uploadedBy: 'Leeds City Health Centre'
          }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Priya Shah',
    nhsNumber: '487 930 1224',
    dateOfBirth: '1992-11-02',
    gpPractice: 'Manchester Central GP',
    referrals: [
      {
        id: 'ref-200',
        title: 'Neurology referral',
        status: 'Scheduled',
        receivedAt: '2025-12-01',
        documents: [
          {
            id: 'doc-2001',
            title: 'Headache diary',
            type: 'PDF',
            sizeKb: 120,
            createdAt: '2025-11-28',
            uploadedBy: 'Manchester Central GP'
          },
          {
            id: 'doc-2002',
            title: 'MRI request form',
            type: 'DOCX',
            sizeKb: 85,
            createdAt: '2025-11-29',
            uploadedBy: 'Manchester Central GP'
          }
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'Jamie Clarke',
    nhsNumber: '205 118 7701',
    dateOfBirth: '1976-07-29',
    gpPractice: 'Harbourside Family Practice',
    referrals: [
      {
        id: 'ref-300',
        title: 'Diabetes clinic review',
        status: 'Completed',
        receivedAt: '2025-09-15',
        documents: [
          {
            id: 'doc-3001',
            title: 'HbA1c results',
            type: 'PDF',
            sizeKb: 260,
            createdAt: '2025-09-12',
            uploadedBy: 'Harbourside Family Practice'
          },
          {
            id: 'doc-3002',
            title: 'Medication list',
            type: 'PDF',
            sizeKb: 140,
            createdAt: '2025-09-13',
            uploadedBy: 'Harbourside Family Practice'
          }
        ]
      }
    ]
  }
]
