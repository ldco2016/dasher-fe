import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import env from '@beam-australia/react-env'

const source = 'nextauth.js'

const nimbusAuth = async (body) => {
  try {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')

    const requestOptions = {
      method: 'POST',
      headers,
      body,
      redirect: 'follow',
    }
    const authenticatedUser = await fetch(
      `${env('PUBLIC_ALUNA_API')}/auth/login`,
      requestOptions
    )
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText)
        }
        return response.text()
      })
      .catch((error) => {
        console.warn(source, 'error', error)
        return null
      })

    return authenticatedUser
  } catch (e) {
    throw new Error('There was an error on user authentication')
  }
}

const options = {
  debug: false,
  providers: [
    Providers.Credentials({
      name: 'Credentials',

      // The credential's property is used to generate a suitable form on the sign-in page.
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: '' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        const body = JSON.stringify({
          email: credentials.email,
          credentialType: 'email',
          password: credentials.password,
        })

        return nimbusAuth(body)
      },
    }),

    Providers.Credentials({
      id: 'integration-login',
      name: 'Integration Login',
      async authorize(credentials) {
        const body = JSON.stringify({
          email: credentials.email,
          credentialType: credentials.credentialType,
          token: credentials.token,
        })

        return nimbusAuth(body)
      },
    }),
  ],
  session: {
    jwt: true,
    //maxAge: 30 * 24 * 60 * 60, // 30 days
    maxAge: 60 * 60, // 1 hour.
    // updateAge: 60 * 5, // 5 minutes; not relevant for JWT.
  },
  jwt: {
    secret: `${env('secret')}`,
  },
  pages: {
    signIn: '/auth/signin/', // Displays signin buttons
    signOut: '/auth/signin/', // Displays form with sign out button
    // error: '/auth/error', // Error code passed in query string as ?error=
    verifyRequest: '/auth/verify-request', // Used for check email page
    newUser: '/',
  },
  callbacks: {
    jwt: async (token, user) => {
      if (user) {
        const parsedUser = JSON.parse(user)
        // console.log(source, 'parsedUser: ', parsedUser)
        token.accessToken = parsedUser.token
        let parsedToken = jwtDecode(parsedUser.token)

        // Grab this for comparison later
        token.accessTokenExpires = parsedToken.exp

        // Session storage is limited so only include necessary info
        // In the future we will want to persist a permissions ID and call
        // a service to get a list of permissions
        const condensedPermissions = parsedUser.permissions.map(
          (permission) => permission.targetKey
        )

        token.firstName = parsedUser.firstName
        token.middleName = parsedUser.middleName
        token.pui = parsedUser.pui
        token.lastName = parsedUser.lastName
        token.email = parsedUser.email
        token.componentPermissions = condensedPermissions
      }

      // If access token is expired invalidate the session which redirects to signin
      const accessTokenExpiresInMS = token.accessTokenExpires * 1000 //Date now is in MS.
      if (accessTokenExpiresInMS < Date.now()) {
        console.log(source, 'jwt:invalid')
        return null
      }
      console.log(source, 'jwt:valid')
      return token
    },
    session: async (session, token) => {
      session.user.email = token.email
      session.user.pui = token.pui
      session.user.firstName = token.firstName
      session.user.middleName = token.middleName
      session.user.lastName = token.lastName
      session.user.email = token.email
      session.user.componentPermissions = token.componentPermissions

      return session
    },
  },
}

export default (req, res) => NextAuth(req, res, options)
