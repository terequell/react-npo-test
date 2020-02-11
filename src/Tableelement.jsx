import React from 'react'

export const getRelationToPrev = (nowValue, prevValue) => {
   const rel = nowValue/prevValue * 100;
   if (rel < 100) {
      return `-${100-rel}%`
   }
   else if (rel > 100) return `+${rel-100}%`
   else return 'Without changes'
}

const Tableelement = ({exchange, baseValues, oneDayAgo}) => {
   return (
      <tr>
         <td >{exchange}</td>
         <td>{baseValues}</td>
         <td>{getRelationToPrev(baseValues,oneDayAgo)}</td>   
      </tr>
   )
}
export default Tableelement