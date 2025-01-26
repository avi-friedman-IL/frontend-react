import { VscSymbolColor } from 'react-icons/vsc'
import { updateObjection } from '../store/actions/objection.actions'
import { showErrorMsg } from '../services/event-bus.service'

export function ObjectionStyle({ currObjection, setCurrObjection }) {
   function handleChange(ev) {
      const { name, value } = ev.target
      setCurrObjection(prevState => ({
         ...prevState,
         style: { ...prevState.style, [name]: value },
      }))
   }

   async function onSave(ev) {
      ev.preventDefault()
      try {
         await updateObjection(currObjection)
      } catch (err) {
         console.log('Cannot save objection', err)
         showErrorMsg('Cannot save objection')
      }
   }
   return (
      <section className='objection-style'>
         <label>
            <VscSymbolColor
               className='btn2'
               style={{ fill: currObjection?.style?.color }}
            />
            <input
               type='color'
               name='color'
               value={currObjection?.style?.color || '#000000'}
               onChange={handleChange}
               style={{
                  position: 'absolute',
                  opacity: 0,
                  width: '1px',
                  height: '1px',
                  pointerEvents: 'none',
               }}
               onBlur={onSave}
            />
         </label>
      </section>
   )
}
