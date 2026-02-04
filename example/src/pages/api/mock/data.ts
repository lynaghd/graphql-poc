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

type FhirReference = {
  reference: string
  display?: string
}

type FhirPatient = {
  resourceType: 'Patient'
  id: string
  identifier: { system: string; value: string }[]
  name: { family?: string; given?: string[]; text?: string }[]
  birthDate: string
  managingOrganization?: FhirReference
}

type FhirServiceRequest = {
  resourceType: 'ServiceRequest'
  id: string
  status: string
  intent: 'order'
  subject: FhirReference
  authoredOn: string
  code: { text: string }
}

type FhirDocumentReference = {
  resourceType: 'DocumentReference'
  id: string
  status: string
  subject: FhirReference
  basedOn: FhirReference[]
  date: string
  content: {
    attachment: {
      title: string
      contentType?: string
      size?: number
    }
  }[]
  author?: FhirReference[]
}

const NHS_NUMBER_SYSTEM = 'https://fhir.nhs.uk/Id/nhs-number'

const splitName = (fullName: string) => {
  const parts = fullName.trim().split(' ')
  if (parts.length === 1) {
    return { given: [parts[0]], family: undefined }
  }

  return {
    given: parts.slice(0, -1),
    family: parts[parts.length - 1]
  }
}

const buildFhirPatient = (patient: PatientRecord): FhirPatient => {
  const { given, family } = splitName(patient.name)

  return {
    resourceType: 'Patient',
    id: patient.id,
    identifier: [{ system: NHS_NUMBER_SYSTEM, value: patient.nhsNumber }],
    name: [
      {
        given,
        family,
        text: patient.name
      }
    ],
    birthDate: patient.dateOfBirth,
    managingOrganization: {
      reference: `Organization/${patient.id}-gp`,
      display: patient.gpPractice
    }
  }
}

const buildFhirServiceRequest = (
  patient: PatientRecord,
  referral: ReferralRecord
): FhirServiceRequest => ({
  resourceType: 'ServiceRequest',
  id: referral.id,
  status: referral.status.toLowerCase().replace(' ', '-'),
  intent: 'order',
  subject: { reference: `Patient/${patient.id}`, display: patient.name },
  authoredOn: referral.receivedAt,
  code: { text: referral.title }
})

const buildFhirDocumentReference = (
  patient: PatientRecord,
  referral: ReferralRecord,
  document: DocumentRecord
): FhirDocumentReference => ({
  resourceType: 'DocumentReference',
  id: document.id,
  status: 'current',
  subject: { reference: `Patient/${patient.id}`, display: patient.name },
  basedOn: [{ reference: `ServiceRequest/${referral.id}`, display: referral.title }],
  date: document.createdAt,
  content: [
    {
      attachment: {
        title: document.title,
        contentType: document.type,
        size: document.sizeKb
      }
    }
  ],
  author: [{ reference: `Organization/${patient.id}-gp`, display: document.uploadedBy }]
})

export const getFhirPatientsBundle = () => ({
  resourceType: 'Bundle',
  type: 'collection',
  entry: patients.map((patient) => ({ resource: buildFhirPatient(patient) }))
})

export const getFhirPatient = (id: string) => {
  const patient = patients.find((record) => record.id === id)
  return patient ? buildFhirPatient(patient) : null
}

export const getFhirReferralsBundle = (patientId: string) => {
  const patient = patients.find((record) => record.id === patientId)
  if (!patient) {
    return null
  }

  return {
    resourceType: 'Bundle',
    type: 'collection',
    entry: patient.referrals.map((referral) => ({
      resource: buildFhirServiceRequest(patient, referral)
    }))
  }
}

export const getFhirDocumentsBundle = (referralId: string) => {
  const patient = patients.find((record) =>
    record.referrals.some((referral) => referral.id === referralId)
  )

  if (!patient) {
    return null
  }

  const referral = patient.referrals.find((item) => item.id === referralId)
  if (!referral) {
    return null
  }

  return {
    resourceType: 'Bundle',
    type: 'collection',
    entry: referral.documents.map((document) => ({
      resource: buildFhirDocumentReference(patient, referral, document)
    }))
  }
}
