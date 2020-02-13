import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Table, Spinner, Button } from 'react-bootstrap'
import Tableelement from './Tableelement'
import TableOfMaxs from './TableOfMaxs'

const Tabledata = ({baseEx}) => {
   const [currentBaseEx, setCurrentBaseEx] = useState('')
   const [baseData, setBaseData] = useState({rates:{}, date:null, time: null})
   const [oneDayAgoData, setOneDayAgoData] = useState({rates:{}, date:null})
   const [twoDaysAgoData, setTwoDaysAgoData] = useState({rates:{}, date:null})
   const [currentRel, setCurrentRel] = useState(null)
   const [isLoading, setIsLoading] = useState(false)
   const [cmpWithLatest, setCmpWithLatest] = useState(true)
   const [timeOfRequest, setTimeOfRequest] = useState(null)

   const getPrevStringyData = (date) => {
      if (date) {
         let prevDate = new Date(date)
         prevDate.setDate(prevDate.getDate()-1)
         return `${prevDate.getFullYear()}-${prevDate.getMonth() + 1}-${prevDate.getDate()}`
      }
   }

   useEffect(() => {
      setCurrentBaseEx(baseEx)
      const getData = async (setMethod, date = 'latest') => {
         try {
            const response = await axios.get(`https://api.exchangeratesapi.io/${date}?base=${baseEx}`)
            setMethod({...response.data, date: new Date(response.data.date)})
            return response.data.date
         }
         catch (error) {
            console.log(error)
         }
      }

      if (currentBaseEx !== baseEx) {
         setIsLoading(true)
         getData(setBaseData)
            .then(response => getData(setOneDayAgoData, getPrevStringyData(response))
               .then(response => getData(setTwoDaysAgoData, getPrevStringyData(response))))
         setIsLoading(false)
         setTimeOfRequest(new Date())
      }
   }, [currentBaseEx, baseData])

   const showRightFormatTime = (value) => {
      if (value < 10) {
         return `0${value}`
      }
      else return value
   }

   const setFiveMax = () => {
      if (cmpWithLatest) {
         setCurrentRel(Object.keys(baseData.rates).slice(0).sort((a,b) => compareHelperFunction(baseData.rates[a],oneDayAgoData.rates[a]) < compareHelperFunction(baseData.rates[b],oneDayAgoData.rates[b]) ? 1 : -1).slice(0,5))
      }
      else {
         setCurrentRel(Object.keys(baseData.rates).sort((a,b) => compareHelperFunction(oneDayAgoData.rates[a],twoDaysAgoData.rates[a]) < compareHelperFunction(oneDayAgoData.rates[b],twoDaysAgoData.rates[b]) ? 1 : -1).slice(0,5))
      }
   }

   const compareHelperFunction = (value1, value2) => {
      const res = value1/value2*100
      return Math.abs(res-100)
   }

   return ( 
      isLoading || !baseData.date || !oneDayAgoData.date || !twoDaysAgoData.date ? <Spinner animation = 'border'/>
      :<div>
         {<Button onClick = {() => (setCmpWithLatest(!cmpWithLatest), setCurrentRel(null))}>{cmpWithLatest ? <p>Показать вчера/позавчера</p> : <p>Показать сегодня/вчера</p>}</Button>}
         <p>Базовая валюта: {baseEx}</p>
         <div>Дата запроса: {baseData.date.toDateString()} </div>
         <p>Время запроса: {timeOfRequest ? `${showRightFormatTime(timeOfRequest.getHours())}:${showRightFormatTime(timeOfRequest.getMinutes())}` : null}</p>
         <Button onClick = {() => setFiveMax()}>Показать 5 максимально изменившихся (под основной таблицей)</Button>
         <Table striped bordered>
            <thead>
               <tr>
                  <th>Валюта</th>
                  <th>Базовое значение(на {cmpWithLatest ? baseData.date.toDateString() : oneDayAgoData.date.toDateString()})</th>
                  <th>Изменение по сравнению с {cmpWithLatest ? oneDayAgoData.date.toDateString() : twoDaysAgoData.date.toDateString()}</th>
               </tr>
            </thead>
            <tbody>
               {Object.keys(baseData.rates)
                  .map(el => <Tableelement exchange = {el} setCurrentRel = {setCurrentRel} baseValues = {cmpWithLatest ? baseData.rates[el] : oneDayAgoData.rates[el]} oneDayAgo = {cmpWithLatest ? oneDayAgoData.rates[el] : twoDaysAgoData.rates[el]} />)
               }  
            </tbody>
         </Table>
         {currentRel ? <TableOfMaxs maxRel = {currentRel} baseValues = {cmpWithLatest ? baseData.rates : oneDayAgoData.rates} oneDayAgo = {cmpWithLatest ? oneDayAgoData.rates : twoDaysAgoData.rates}/> : null}
      </div>
   )
}

export default Tabledata