import React, { useState } from 'react';
import './App.css';
import Tabledata from './Tabledata';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DropdownButton, Dropdown, Button } from 'react-bootstrap';

function App(props) {
  const [baseEx, setBaseEx] = useState('EUR')
  const [displayTable, setDisplayTable] = useState(false)

  return (
    <div>
      <DropdownButton id="dropdown-basic-button" title="Выберите базовую валюту (EUR по дефолту)" onClick = {() => setDisplayTable(false)}>
        <Dropdown.Item onClick = {() => setBaseEx('EUR')}>EUR</Dropdown.Item>
        <Dropdown.Item onClick = {() => setBaseEx('USD')}>USD</Dropdown.Item>
        <Dropdown.Item onClick = {() => setBaseEx('RUB')}>RUB</Dropdown.Item>
      </DropdownButton>
      <Button onClick = {() => setDisplayTable(true)}>Получить котировки</Button>
      {displayTable ? <Tabledata baseEx = {baseEx}/> : null}
    </div>
  );
}

export default App;
