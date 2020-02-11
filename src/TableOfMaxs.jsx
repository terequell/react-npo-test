import React from 'react'
import { Table } from 'react-bootstrap'
import {getRelationToPrev} from './Tableelement'

const TableOfMaxs = ({maxRel, baseValues, oneDayAgo}) => {
   return (
      <div>
         <p>Максимальные 5:</p>
         <Table striped bordered variant="dark">
            <thead>
               <tr>
                  <th>Валюта</th>
                  <th>Изменение относительно базового</th>
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