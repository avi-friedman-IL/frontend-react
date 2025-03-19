import i18n from '../i18n.js'

export function makeId(length = 6) {
   var txt = ''
   var possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

   for (var i = 0; i < length; i++) {
      txt += possible.charAt(Math.floor(Math.random() * possible.length))
   }

   return txt
}
export function getDayOrDate(dateNumber) {
   const givenDate = new Date(dateNumber)
   const today = new Date()

   if (givenDate.toDateString() === today.toDateString()) {
      return i18n.t('today')
   }

   const sevenDaysAgo = new Date()
   sevenDaysAgo.setDate(today.getDate() - 7)

   if (givenDate >= sevenDaysAgo && givenDate < today) {
      const daysOfWeek = i18n.t('daysOfWeek', { returnObjects: true })
      // const daysOfWeek = [
      //    'Sunday',
      //    'Monday',
      //    'Tuesday',
      //    'Wednesday',
      //    'Thursday',
      //    'Friday',
      //    'Saturday',
      // ]
      const dayName = daysOfWeek[givenDate.getDay()]
      return dayName
   }
   return givenDate.toLocaleDateString()
}
export function formatTime(date) {
   return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
   })
}
export function makeLorem(size = 100) {
   var words = [
      'The sky',
      'above',
      'the port',
      'was',
      'the color of television',
      'tuned',
      'to',
      'a dead channel',
      '.',
      'All',
      'this happened',
      'more or less',
      '.',
      'I',
      'had',
      'the story',
      'bit by bit',
      'from various people',
      'and',
      'as generally',
      'happens',
      'in such cases',
      'each time',
      'it',
      'was',
      'a different story',
      '.',
      'It',
      'was',
      'a pleasure',
      'to',
      'burn',
   ]
   var txt = ''
   while (size > 0) {
      size--
      txt += words[Math.floor(Math.random() * words.length)] + ' '
   }
   return txt
}

export function getRandomIntInclusive(min, max) {
   min = Math.ceil(min)
   max = Math.floor(max)
   return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive
}

export function randomPastTime() {
   const HOUR = 1000 * 60 * 60
   const DAY = 1000 * 60 * 60 * 24
   const WEEK = 1000 * 60 * 60 * 24 * 7

   const pastTime = getRandomIntInclusive(HOUR, WEEK)
   return Date.now() - pastTime
}

export function getRandomColor() {
   return '#' + Math.floor(Math.random() * 16777215).toString(16)
}

export function getNiceColor() {
   const niceColors = [
      '#4A90E2', // כחול מים בהיר (Sky Blue)
      '#2ECC71', // ירוק אמרלד עדין (Emerald Green)
      '#F39C12', // כתום חם (Warm Orange)
      '#9B59B6', // סגול ארגמן (Plum Purple)
      '#3498DB', // כחול תכלת בהיר (Light Blue)
      '#1ABC9C', // טורקיז רענן (Turquoise)
      '#E74C3C', // אדום עז (Vibrant Red)
      '#F1C40F', // צהוב זהוב (Golden Yellow)
      '#34495E', // כחול-אפור כהה (Dark Slate Blue)
      '#16A085', // ירוק-טורקיז עמוק (Deep Teal)
   ]
   return niceColors[Math.floor(Math.random() * niceColors.length)]
}

export function debounce(func, timeout = 300) {
   let timer
   return (...args) => {
      clearTimeout(timer)
      timer = setTimeout(() => {
         func.apply(this, args)
      }, timeout)
   }
}

export function saveToStorage(key, value) {
   localStorage.setItem(key, JSON.stringify(value))
}

export function loadFromStorage(key) {
   const data = localStorage.getItem(key)
   return data ? JSON.parse(data) : undefined
}

export function sortColorsByHue(colors) {
   return colors.sort((a, b) => {
      const hslA = _hexToHSL(a.color)
      const hslB = _hexToHSL(b.color)
      return hslA.h - hslB.h
   })
}

function _hexToHSL(hex) {
   hex = hex.replace(/^#/, '')

   let r = parseInt(hex.substring(0, 2), 16) / 255
   let g = parseInt(hex.substring(2, 4), 16) / 255
   let b = parseInt(hex.substring(4, 6), 16) / 255

   let max = Math.max(r, g, b),
      min = Math.min(r, g, b)
   let h,
      s,
      l = (max + min) / 2

   if (max === min) {
      h = s = 0 // achromatic
   } else {
      let d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
         case r:
            h = (g - b) / d + (g < b ? 6 : 0)
            break
         case g:
            h = (b - r) / d + 2
            break
         case b:
            h = (r - g) / d + 4
            break
      }
      h /= 6
   }

   return {
      h: h * 360, // Hue
      s: s * 100, // Saturation
      l: l * 100, // Lightness
   }
}

export function convertToTransparent(color, alpha = 1) {
   // בדיקה אם הצבע הוא בפורמט HEX
   if (color.startsWith('#')) {
      const hex = color.replace('#', '')

      // המרה ל-RGB
      const bigint = parseInt(hex, 16)
      const r = (bigint >> 16) & 255
      const g = (bigint >> 8) & 255
      const b = bigint & 255

      return `rgba(${r}, ${g}, ${b}, ${alpha})`
   }

   // אם הצבע כבר בפורמט RGBA
   if (color.startsWith('rgba')) {
      return color.replace(
         /rgba\(([^,]+),([^,]+),([^,]+),([^,]+)\)/,
         `rgba($1,$2,$3,${alpha})`
      )
   }

   // אם הצבע בפורמט RGB
   if (color.startsWith('rgb')) {
      return color.replace(
         /rgb\(([^,]+),([^,]+),([^,]+)\)/,
         `rgba($1,$2,$3,${alpha})`
      )
   }

   // אם הצבע לא מזוהה, החזר את הצבע המקורי
   return color
}

export function extractPlainText(content) {
   try {
      // Parse the JSON string
      const parsedContent = JSON.parse(content)

      // Extract text from the "blocks" array
      return parsedContent.blocks.map(block => block.text).join('\n')
   } catch (err) {
      console.error('Error parsing content:', err)
      return '' // Return an empty string if parsing fails
   }
}
