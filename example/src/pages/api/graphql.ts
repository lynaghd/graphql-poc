import { ApolloServer, gql } from 'apollo-server-micro'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getBaseUrl } from '../../lib/getBaseUrl'

const typeDefs = gql`
  type Document {
    id: ID!
    title: String!
    type: String
    sizeKb: Int
    createdAt: String
    uploadedBy: String
  }

  type Referral {
    id: ID!
    title: String!
    status: String!
    receivedAt: String!
    documentCount: Int!
    documents: [Document!]!
  }

  type Patient {
    id: ID!
    name: String!
    nhsNumber: String
    dateOfBirth: String
    gpPractice: String
    referrals: [Referral!]!
  }

  type Query {
    patients: [Patient!]!
    patient(id: ID!): Patient
    referralDocuments(patientId: ID!, referralId: ID!): [Document!]!
  }
`

const resolvers = {
  Query: {
    patients: async (_parent: unknown, _args: unknown, context: { baseUrl: string }) => {
      const response = await fetch(`${context.baseUrl}/api/mock/patients`)
      return response.json()
    },
    patient: async (
      _parent: unknown,
      args: { id: string },
      context: { baseUrl: string }
    ) => {
      const response = await fetch(`${context.baseUrl}/api/mock/patients/${args.id}`)
      if (!response.ok) {
        return null
      }
      return response.json()
    },
    referralDocuments: async (
      _parent: unknown,
      args: { patientId: string; referralId: string },
      context: { baseUrl: string }
    ) => {
      const response = await fetch(
        `${context.baseUrl}/api/mock/patients/${args.patientId}/referrals/${args.referralId}/documents`
      )

      if (!response.ok) {
        return []
      }

      return response.json()
    }
  },
  Referral: {
    documentCount: (referral: { documents?: unknown[] }) => {
      return referral.documents?.length ?? 0
    }
  }
}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }: { req: NextApiRequest }) => ({ baseUrl: getBaseUrl(req) })
})

const startServer = apolloServer.start()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await startServer
  const apolloHandler = apolloServer.createHandler({ path: '/api/graphql' })
  return apolloHandler(req, res)
}

export const config = {
  api: {
    bodyParser: false
  }
}
