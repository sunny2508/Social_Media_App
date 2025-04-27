import { atom } from "recoil";

export const userAtom = atom({
    key:"useratom",
    default:null
});

export const loadingatom = atom({
    key:"loadingatom",
    default:false,
})

export const isCheckingAuth = atom({
    key:"isCheckingAuth",
    default:true
})


