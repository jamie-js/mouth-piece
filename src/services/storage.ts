import { Plugins } from '@capacitor/core'
//Note data stored this way to local storage can be lost
//If the data is import modify this method to use firestore etc.
const { Storage } = Plugins

export async function set(key: string, value: any): Promise<void> {
  await Storage.set({
    key: key,
    value: JSON.stringify(value),
  })
}

export async function get(key: string): Promise<any> {
  const item = await Storage.get({ key: key })
  return JSON.parse(item.value)
}

export async function remove(key: string): Promise<void> {
  await Storage.remove({
    key: key,
  })
}
