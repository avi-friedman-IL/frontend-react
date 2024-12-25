export function Tooltip({ position, text }) {
   return (
      <section
         className='tooltip'
         style={{ top: position.y, left: position.x }}>
         <p>{text}</p>
      </section>
   )
}
