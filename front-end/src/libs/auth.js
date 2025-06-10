// Third-party Imports
import CredentialProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'



const prisma = new PrismaClient()

export const authOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialProvider({
      name: 'Credentials',
      type: 'credentials',
      credentials: {},
      async authorize(credentials) {
        
        const { username, password } = credentials
        // console.log({ username, password })

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_TEST_API_URL}/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
          })

          const data = await res.json()
       

          if (res.status === 401) {
            // console.log(data.message)
            throw new Error(data.message)
          }

          if (res.status === 200) {
            // Decode the JWT token to get user info
            const decodedToken = jwt.decode(data.token)
            return {
              id: decodedToken.id,
              name: decodedToken.name,
              user: decodedToken.user,
              email: decodedToken.email,
              role: decodedToken.role,
              image: decodedToken.image,
              token: data.token,
              hospitalId: decodedToken.hospitalId,
              exp: decodedToken.exp // Include the token in the returned user object
            }
          }

          return null
        } catch (e) {
          throw new Error(e.message)
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60
  },

  pages: {
    signIn: '/login'
  },

  callbacks: {
    async jwt({ token, user }) {
      // console.log(user)
      if (user) {
        token.id = user.id
        token.image = user.image
        token.name = user.name
        token.user = user.user
        token.hospitalId = user.hospitalId
        token.role = user.role
        token.token = user.token,
        token.exp = user.exp // Save the token in the JWT
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.user = token.user
        session.user.image = token.image
        session.user.hospitalId = token.hospitalId
        session.user.role = token.role
        session.user.token = token.token,
        session.user.exp = token.exp // Add the token to the session
      }
      // console.log('session: ', session, 'token: ', token)
      return session
    }
  }
}
