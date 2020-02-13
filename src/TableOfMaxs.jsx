import React from 'react'
import { Table } from 'react-bootstrap'
import {getRelationToPrev} from './Tableelement'

const TableOfMaxs = ({maxRel, baseValues, oneDayAgo}) => {
   return (
      <div>
         <p>5 which max changed:</p>
         <Table striped bordered variant="dark">
            <thead>
               <tr>
                  <th>Exchange</th>
                  <th>Percent of change improvements to base</th>
               </tr>
            </thead>
            <tbody>
               {maxRel.map((el) => <tr> <td>{el}</td> <td>{getRelationToPrev(baseValues[el], oneDayAgo[el])}</td> </tr>)}
            </tbody>
         </Table>
      </div>
   )
}

export default TableOfMaxs