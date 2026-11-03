import { liveQuery } from 'dexie'

/** Reactive Dexie query: re-runs whenever the underlying tables change. */
export function useLive<T>(query: () => Promise<T>, initial: T) {
  const data = ref(initial) as Ref<T>
  const sub = liveQuery(query).subscribe({ next: (v) => (data.value = v) })
  onScopeDispose(() => sub.unsubscribe())
  return data
}
