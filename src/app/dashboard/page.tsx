import React from 'react'
import { getSession } from '../lib/getSession'
import DashboardClient from '../components/DashboardClient'

async function page() {
  
  const session = await getSession()
  return (
    <>
    <DashboardClient ownerId={session?.user?.id!} />
    </>
  )
}

export default page