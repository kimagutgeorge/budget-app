import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'

export function useHaptics() {
    const tap = async () => { try{ await Haptics.impact({style:ImpactStyle.Light})} catch{} }
    const success = async () => { try { await Haptics.notification({ type: NotificationType.Success })} catch{} }
    return { tap, success}
}