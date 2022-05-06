import 'next-auth'

declare module 'next-auth' {
  interface User {
    firstName: string
    middleName: string
    lastName: string
    email: string
    pui: string
    image: string
    permissions: array
    componentPermissions: array
  }

  interface Session {
    user: User
  }
}
