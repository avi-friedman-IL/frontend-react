import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { TipsPreview } from './TipsPreview.jsx'

export function TipsList({ tips }) {
   const [currentTipIndex, setCurrentTipIndex] = useState(0)

   useEffect(() => {
      const interval = setInterval(() => {
         setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length)
      }, 3000) 

      return () => clearInterval(interval)
   }, [tips.length])

   return (
      <div className='tips-list'>
         <AnimatePresence mode="wait">
            <motion.div
               key={tips[currentTipIndex].id}
               className='tip-item'
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.8 }}
               transition={{ duration: 0.5 }}
            >
               <TipsPreview tip={tips[currentTipIndex]} />
            </motion.div>
         </AnimatePresence>
      </div>
   )
}
