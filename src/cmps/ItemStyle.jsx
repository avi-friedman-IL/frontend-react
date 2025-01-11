import { VscSymbolColor } from 'react-icons/vsc'
export function ItemStyle({ item, setEditedItem }) {
   function handleChange(ev) {
      const { name, value } = ev.target
      setEditedItem(prevState => ({
         ...prevState,
         style: { ...prevState.style, [name]: value },
      }))
   }

   const { id, style } = item
   return (
      <section className='item-style'>
         <label>
            <VscSymbolColor
               className='btn2'
               style={{ fill: style?.color || 'black' }}
            />
            <input
               type='color'
               name='color'
               id={`color-picker-${id}`}
               value={style?.color}
               onInput={handleChange}
               style={{
                  position: 'absolute',
                  opacity: 0,
                  width: '1px',
                  height: '1px',
                  pointerEvents: 'none',
               }}
            />
         </label>
      </section>
   )
}
