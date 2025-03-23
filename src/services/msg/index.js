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
      loggedinUserId: userService.getLoggedinUser()?._id,
      isAdmin: userService.getLoggedinUser()?.isAdmin,
      isTeamManager: userService.getLoggedinUser()?.isTeamManager,
   }
}

function getSubjects() {
   return [
      {
         id: 'tz0DA2',
         title: 'טלפון שכבר דברו איתו',
         fields: [
            {
               name: 'collection',
               label: 'שם המגבית',
               type: 'text',
               required: true,
            },
            {
               name: 'phone',
               label: 'מס הטלפון',
               type: 'tel',
               required: true,
            },
            {
               name: 'hisStatus',
               label: 'מה היה הסטטוס שלו(ניתן לראות בצפיה באירועים)',
               type: 'select',
               required: true,
            },
            {
               name: 'nowStatus',
               label: 'מה אמר כעת',
               type: 'textarea',
               required: true,
            },
         ],
      },
      {
         id: 'tz0DA3',
         title: 'הערה למשכורות',
         fields: [
            {
               name: 'collection',
               label: 'שם המגבית',
               type: 'text',
               required: true,
            },
            {
               name: 'note',
               label: 'נא פרט לצורך הבנה מדויקת',
               type: 'textarea',
               required: true,
            },
         ],
      },
      {
         id: 'tz0DA4',
         title: 'שינוי שם לתורם',
         fields: [
            {
               name: 'collection',
               label: 'שם המגבית',
               type: 'text',
               required: true,
            },
            { name: 'phone', label: 'מס טלפון', type: 'tel', required: true },
            {
               name: 'nowName',
               label: 'השם שרשום כעת',
               type: 'text',
               required: true,
            },
            {
               name: 'realName',
               label: 'השם האמיתי',
               type: 'text',
               required: true,
            },
         ],
      },
      {
         id: 'tz0DA5',
         title: 'שינוי טלפון לתורם',
         fields: [
            {
               name: 'collection',
               label: 'שם המגבית',
               type: 'text',
               required: true,
            },
            {
               name: 'phone',
               label: 'מס הטלפון שרשום כעת כטלפון ראשי',
               type: 'tel',
               required: true,
            },
            {
               name: 'realPhone',
               label: 'מס הטלפון האמיתי',
               type: 'tel',
               required: true,
            },
            {
               name: 'reason',
               label: 'סיבת השינוי(כגון - עד היום היה טל של האשה)',
               type: 'textarea',
               required: true,
            },
         ],
      },
      {
         id: 'tz0DA6',
         title: 'בעיה טכנית/ציוד חסר',
         fields: [
            {
               name: 'collection',
               label: 'שם המגבית',
               type: 'text',
               required: true,
            },
            {
               name: 'stand',
               label: 'מס עמדה',
               type: 'number',
               required: false,
            },
            {
               name: 'problem',
               label: 'פרוט הבעיה לצורך הבנה מדויקת',
               type: 'textarea',
               required: true,
            },
         ],
      },
      {
         id: 'tz0DA7',
         title: 'ברור אם יש ללקוח הו"ק',
         fields: [
            {
               name: 'collection',
               label: 'שם המגבית',
               type: 'text',
               required: true,
            },
            {
               name: 'phone',
               label: 'מס הטלפון',
               type: 'tel',
               required: true,
            },
            {
               name: 'comment',
               label: 'מה התורם אמר',
               type: 'textarea',
               required: true,
            },
         ],
      },

      {
         id: 'tz0DA9',
         title: 'שיחה לא מזוהה',
         type: 'complex',
         fields: [
            // { idx: 0, label: 'שם המגבית', type: 'text' },
            // { idx: 1, label: 'מס הטלפון', type: 'phone' },
            // { idx: 2, label: 'ציין את סטטוס השיחה מבחינתך', type: 'select' },
            {
               name: 'reason',
               label: 'מה סיבת הדחיה',
               type: 'textarea',
               required: true,
            },
            {
               name: 'status',
               label: 'האם להשאיר לך או להעביר לנציג המשכים',
               type: 'select',
               required: true,
            },
            { name: 'amount', label: 'סכום', type: 'number', required: true },
            {
               name: 'credit',
               label: 'מס אשראי',
               type: 'number',
               required: true,
            },
            { name: 'expiry', label: 'תוקף', type: 'expiry', required: true },
            {
               name: 'security',
               label: '3 ספרות',
               type: 'number',
               required: true,
            },
            { name: 'ID', label: 'מס זהות', type: 'number', required: false },
         ],
      },
      {
         id: 'tz0DA8',
         title: 'אחר',
         fields: [
            {
               name: 'collection',
               label: 'שם המגבית',
               type: 'text',
               required: true,
            },
            { name: 'theme', label: 'נושא', type: 'text', required: true },
            {
               name: 'phone',
               label: 'באם קשור לשיחה-מס טלפון',
               type: 'tel',
               required: true,
            },
            {
               name: 'comment',
               label: 'כתוב כאוות נפשך',
               type: 'textarea',
               required: true,
            },
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
