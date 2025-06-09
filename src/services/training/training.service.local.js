import { addTraining } from '../../store/actions/training.actions'
import { storageService } from '../async-storage.service'

const STORAGE_KEY = 'training'

export const trainingService = {
  query,
  getById,
  save,
  remove,
}
window.cs = trainingService

async function query(filterBy = { txt: '' }) {
  var trainings = await storageService.query(STORAGE_KEY)

  if (!trainings || !trainings.length) {
    trainings = await _createTrainings()
    storageService.saveToStorage(STORAGE_KEY, trainings)
  }
  return trainings
}

async function getById(trainingId) {
  const training = await storageService.get(STORAGE_KEY, trainingId)

  return training
}

async function remove(trainingId) {
  // throw new Error('Nope')
  await storageService.remove(STORAGE_KEY, trainingId)
}

async function save(training) {
  var savedTraining
  if (training._id) {
    savedTraining = await storageService.put(STORAGE_KEY, training)
  } else {
    savedTraining = await storageService.post(STORAGE_KEY, training)
  }
  return savedTraining
}

async function _createTrainings() {
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
