// src/app/(intranet)/IntranetGatewayInit.tsx
'use client'
import { useLayoutEffect } from 'react'
import useIntranetCRUD from '@/app/hooks/useIntranetCRUD/useIntranetCRUD'
import { useIntranetGatewayStore } from '@/app/stores/system/useIntranetGatewayStore'

export default function IntranetGatewayInit() {
  const { IntranetGet, IntranetPost, IntranetPut, IntranetDelete } = useIntranetCRUD()
  const setCRUD = useIntranetGatewayStore(s => s.setCRUD)

  // useLayoutEffect para registrar CRUD antes que los effects hijos
  useLayoutEffect(() => {
    setCRUD({ get: IntranetGet, post: IntranetPost, put: IntranetPut, del: IntranetDelete })
  }, [IntranetGet, IntranetPost, IntranetPut, IntranetDelete, setCRUD])

  return null
}
