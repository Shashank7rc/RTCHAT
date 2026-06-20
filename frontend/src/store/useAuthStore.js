import {create} from 'zustand'

export const useAuthStore = create((set)=>({
    authuser :{name:"john", _id:12}
}))

