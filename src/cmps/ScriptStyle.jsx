import { VscSymbolColor } from 'react-icons/vsc'
import { updateScript } from '../store/actions/script.actions'
import { showErrorMsg } from '../services/event-bus.service'

export function ScriptStyle({ currScript, setCurrScript }) {
   function handleChange(ev) {
      const { name, value } = ev.target
      setCurrScript(prevState => ({
         ...prevState,
         style: { ...prevState.style, [name]: value },
      }))
   }

   async function onSave(ev) {
      ev.preventDefault()
      try {
         await updateScript(currScript)
      } catch (err) {
         console.log('Cannot save script', err)
         showErrorMsg('Cannot save script')
      }
   }
   return (
      <section className='script-style'>
         <label>
            <VscSymbolColor
               className='btn2'
               style={{ fill: currScript?.style?.color }}
            />
            <input
               type='color'
               name='color'
               value={currScript?.style?.color || '#000000'}
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
