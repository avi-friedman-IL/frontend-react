import { addMsg } from '../../store/actions/msg.actions'
import { storageService } from '../async-storage.service'

const STORAGE_KEY = 'msg'

export const msgService = {
  query,
  getById,
  save,
  remove,
}
window.cs = msgService

async function query(filterBy = { txt: '' }) {
  var msgs = await storageService.query(STORAGE_KEY)

  if (!msgs || !msgs.length) {
    msgs = await _createMsgs()
    storageService.saveToStorage(STORAGE_KEY, msgs)
  }
  return msgs
}

async function getById(msgId) {
  const msg = await storageService.get(STORAGE_KEY, msgId)

  return msg
}

async function remove(msgId) {
  // throw new Error('Nope')
  await storageService.remove(STORAGE_KEY, msgId)
}

async function save(msg) {
  var savedMsg
  if (msg._id) {
    savedMsg = await storageService.put(STORAGE_KEY, msg)
  } else {
    savedMsg = await storageService.post(STORAGE_KEY, msg)
  }
  return savedMsg
}

async function _createMsgs() {
  return [
    {
      _id: 1,
      name: 'Wireless Headphones',
      image_url: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439',
      price: 59.99,
    },
    {
      _id: 2,
      name: 'Smartphone',
      image_url: 'https://images.unsplash.com/photo-1512499617640-c2f999a60713',
      price: 499.99,
    },
    {
      _id: 3,
      name: '4K TV',
      image_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
      price: 799.99,
    },
    {
      _id: 4,
      name: 'Smartwatch',
      image_url: 'https://images.unsplash.com/photo-1517430816045-df4b7de01f17',
      price: 199.99,
    },
    {
      _id: 5,
      name: 'Gaming Laptop',
      image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
      price: 1199.99,
    },
    {
      _id: 6,
      name: 'Bluetooth Speaker',
      image_url: 'https://images.unsplash.com/photo-1495733715281-025e5d55b2e1',
      price: 89.99,
    },
    {
      _id: 7,
      name: 'Digital Camera',
      image_url: 'https://images.unsplash.com/photo-1519183071298-a2962f29a323',
      price: 329.99,
    },
    {
      _id: 8,
      name: 'Tablet',
      image_url: 'https://images.unsplash.com/photo-1510557880182-3b367a9e1e26',
      price: 299.99,
    },
  ]
}
