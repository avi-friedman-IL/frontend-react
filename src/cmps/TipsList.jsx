import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { TipsPreview } from './TipsPreview.jsx'

export function TipsList({ tips }) {
   const [currentTipIndex, setCurrentTipIndex] = useState(0)

   useEffect(() => {
      const interval = setInterval(() => {
         setCurrentTipIndex(prevIndex => (prevIndex + 1) % tips.length)
      }, 5000)

      return () => clearInterval(interval)
   }, [tips.length])

   return (
      <div className='tips-list'>
         <AnimatePresence mode='wait'>
            <motion.div
               key={tips[currentTipIndex].id}
               className='tip-item'
               initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
               animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
               exit={{ clipPath: 'inset(100% 0% 0% 0%)' }}
               transition={{ duration: 0.3, ease: 'easeInOut' }}>
               <TipsPreview tip={tips[currentTipIndex]} />
            </motion.div>
         </AnimatePresence>
      </div>
   )
}
