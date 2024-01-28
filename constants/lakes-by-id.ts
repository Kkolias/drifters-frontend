import type { LakeId } from "~/interfaces/fishing-permit.interface";



type LakeByIdType = {
    [key in LakeId]: string;
};

export const LAKES_BY_ID: LakeByIdType = {
    salaisjarvi: 'Säläisjärvi'
} as const