const { DEV, VITE_LOCAL } = import.meta.env

import { userService } from '../user'
import { getRandomIntInclusive, makeId } from '../util.service'

import { msgService as local } from './msg.service.local'
import { msgService as remote } from './msg.service.remote'

function getEmptyMsg() {
   return {
      from: '',
      subject: '',
      isDone: false,
      createdAt: '',
      responses: [],
   }
}

function getDefaultFilter() {
   return {
      text: '',
      subject: '',
      isDone: '',
   }
}

function getSubjects() {
   return [
      {
         id: 'tz0DA2',
         title: 'טלפון שכבר דברו איתו',
         fields: [
            { label: 'שם המגבית', type: 'text' },
            { label: 'מס הטלפון', type: 'phone' },
            { label: 'מה היה הסטטוס שלו(ניתן לראות בצפיה באירועים)', type: 'select' },
            { label: 'מה אמר כעת', type: 'textarea' },
         ],
      },
      {
         id: 'tz0DA3',
         title: 'הערה למשכורות',
         fields: [
            { label: 'שם המגבית', type: 'text' },
            { label: 'נא פרט לצורך הבנה מדויקת', type: 'textarea' },
         ],
      },
      {
         id: 'tz0DA4',
         title: 'שינוי שם לתורם',
         fields: [
            { label: 'שם המגבית', type: 'text' },
            { label: 'מס טלפון', type: 'phone' },
            { label: 'השם שרשום כעת', type: 'text' },
            { label: 'השם האמיתי', type: 'text' },
         ],
      },
      {
         id: 'tz0DA5',
         title: 'שינוי טלפון לתורם',
         fields: [
            { label: 'שם המגבית', type: 'text' },
            { label: 'מס הטלפון שרשום כעת כטלפון ראשי', type: 'phone' },
            { label: 'מס הטלפון האמיתי', type: 'phone' },
            { label: 'סיבת השינוי(כגון - עד היום היה טל של האשה)', type: 'phone' },
         ],
      },
      {
         id: 'tz0DA6',
         title: 'בעיה טכנית/ציוד חסר',
         fields: [
            { label: 'שם המגבית', type: 'text' },
            { label: 'מס עמדה', type: 'number' },
            { label: 'פרוט הבעיה לצורך הבנה מדויקת', type: 'textarea' },
         ],
      },
      {
         id: 'tz0DA7',
         title: 'ברור אם יש ללקוח הו"ק',
         fields: [
            { label: 'שם המגבית', type: 'text' },
            { label: 'מס הטלפון', type: 'phone' },
            { label: 'מה התורם אמר', type: 'textarea' },
         ],
      },
      {
         id: 'tz0DA8',
         title: 'אחר',
         fields: [
            { label: 'שם המגבית', type: 'text' },
            { label: 'נושא', type: 'text' },
            { label: 'באם קשור לשיחה-מס טלפון', type: 'phone' },
            { label: 'כתוב כאוות נפשך', type: 'textarea' },
         ],
      },
   ]
}

const service = VITE_LOCAL === 'true' ? local : remote
// const service = local
// console.log(VITE_LOCAL)
export const msgService = {
   ...service,
   getEmptyMsg,
   getDefaultFilter,
   getSubjects,
}

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

// if (DEV) window.msgService = msgService
