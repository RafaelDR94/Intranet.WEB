'use client'
import type { Set, Get } from '../types'
import type { User } from '@/app/context/AuthContext/types'
import { saveUser, saveLastUserRemebered } from '@/app/context/AuthContext/utilities/AuthService'

export const updateUserPermissions = async (
    set: Set,
    _get: Get,
    permissions: string 
): Promise<void> => {
    const user = _get().user
    if (user) {
        const newUser: User  = { ...user, treeFirebase: permissions };
        await saveUser(newUser)
        await saveLastUserRemebered(newUser)
        set({ user:newUser })
    }
}


