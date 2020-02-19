import React, { useState, useEffect, useRef } from 'react'
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

   useEffect(() => {
      const getPrevStringyData = (date) => {
         if (date) {
            const prevDate = new Date(date)
            prevDate.setDate(prevDate.getDate()-1)
            return `${prevDate.getFullYear()}-${prevDate.getMonth() + 1}-${prevDate.getDate()}`
         }
      }
      setCurrentBaseEx(baseEx)
      const getData = async (setMethod, date = 'latest') => {
         try {
            const response = await fetch(`https://api.exchangeratesapi.io/${date}?base=${baseEx}`)
            const toJson = await response.json()
            setMethod({...toJson, date: new Date(toJson.date)})
            return toJson.date
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
   }, [baseEx])

   const showRightFormatTime = (value) => {
      if (value < 10) {
         return `0${value}`
      }
      else return value
   }

   const myRef = useRef(null)

   const scrollToRef = (ref) => {
      if (currentRel && ref) {
         window.scrollTo(0, ref.current.offsetTop)
      } 
   }

   const setFiveMax =  () => { 
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
      :<div class = 'container'>
         {<Button onClick = {() => (setCmpWithLatest(!cmpWithLatest), setCurrentRel(null))}>{cmpWithLatest ? <p> Show for yesterday / one day before</p> : <p>Show for today/yesterday</p>}</Button>}
         <p>Base exchange: <b>{baseEx}</b></p>
         <div>Request date: <b>{baseData.date.toDateString()}</b></div>
         <p>Request time: <b>{timeOfRequest ? `${showRightFormatTime(timeOfRequest.getHours())}:${showRightFormatTime(timeOfRequest.getMinutes())}` : null}</b></p>
         <Button onClick = {() => {setFiveMax(); scrollToRef(myRef)}} className = 'getmax__button'>Show 5 maximally changed (under the main table) via doubleClick</Button>
         <div>
            <Table striped bordered >
               <thead >
                  <tr>
                     <th className = {'maintable-col__nameex'}>Exchange</th>
                     <th className = {'maintable-col__baseex'}>Base course(on {cmpWithLatest ? baseData.date.toDateString() : oneDayAgoData.date.toDateString()})</th>
                     <th className = {'maintable-col__compareex'}>Improvements to {cmpWithLatest ? oneDayAgoData.date.toDateString() : twoDaysAgoData.date.toDateString()}</th>
                  </tr>
               </thead>
               <tbody>
                  {Object.keys(baseData.rates)
                     .map(el => <Tableelement exchange = {el} setCurrentRel = {setCurrentRel} baseValues = {cmpWithLatest ? baseData.rates[el] : oneDayAgoData.rates[el]} oneDayAgo = {cmpWithLatest ? oneDayAgoData.rates[el] : twoDaysAgoData.rates[el]} />)
                  }  
               </tbody>
            </Table>
         </div>
         <div ref = {myRef}>
            {currentRel ? <TableOfMaxs  maxRel = {currentRel} baseValues = {cmpWithLatest ? baseData.rates : oneDayAgoData.rates} oneDayAgo = {cmpWithLatest ? oneDayAgoData.rates : twoDaysAgoData.rates}/> : null}
         </div>
      </div>
   )
}

export default Tabledata