import { useEffect, useState } from "react";
import "./App.css";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

function randomNumber(min: number, max: number, fixed = 2) {
  return (Math.random() * (max - min) + min).toFixed(fixed);
}

function debug(msg: string) {
  console.log('debug: ', msg);
} 

function generateX1andX2(limit: number, result: number) {
  let isFine = true;

  let x1 = 0;
  let x2 = 0;

  let fact = 0;

  let iter = 0;

  while(isFine) {
    const randomRepeat = +randomNumber(1, limit);

     x1 = Math.round(result + randomRepeat);
     x2 = Math.round(result * 2 - x1);

    fact = Math.round(200*((Math.abs(x1-x2))/(x1+x2))); 
    isFine = !(fact <=limit);
  
    debug(`Iter = ${iter}`);

    debug(`
      isFine = ${fact <=limit} 
      result = ${result} 
      x1 = ${x1} 
      x2 = ${x2} 
      fact = ${fact}
    `);
    
    iter++;

    if (iter === 100) {
      isFine = false;
    }
  }

  return [x1, x2, fact];
}


const headers = [
  { name: "V(пробы), см3" },
  { name: "№ чашки" },
  { name: "m(пустой),г" },
  { name: "m(п. сушки),г" },
  { name: "X, мг/дм3" },
  { name: "Xср, мг/дм3" },
  { name: "Xср, мг/дм3" },
  { name: 'Диапазон измерений' },
  { name: "Фактическая повторяемость" },
  { name: 'Предел повторяемости'},
  { name: 'Погрешность'}
];

const LIMIT_1 = 17;
const LIMIT_2 = 8;
const LIMIT_3 = 6;

const TOCH_1 = 17;
const TOCH_2 = 9;
const TOCH_3 = 7;

function App() {
  const [emptyW, setEmptyW] = useState("59.1093");
  const [dryW, setDryW] = useState("59.1306");
  const [volume, setVolume] = useState("50");
  const [result, setResult] = useState<number>(0);
  const [cups, setCups] = useState<any[]>(
    Array.from({ length: 80 }, (_, i) => ({
      value: randomNumber(60, 90, 4),
      label: i + 1,
    }))
  );
  const [emptyM1, setEmptyM1] = useState<any>();
  const [emptyM2, setEmptyM2] = useState<any>();
  const [fact, setFact] = useState(0);

  const [dryM1, setDryM1] = useState(0);
  const [dryM2, setDryM2] = useState(0);

  const [x1, setX1] = useState(0);

  const [x2, setX2] = useState(0);

  useEffect(() => {
    const res = Math.round(((+dryW - +emptyW) * 1_000_000) / +volume);


    let limit = 0;

    if (res > 1 && res <= 50) {
      limit = LIMIT_1;
    } else if (res > 50 && res <= 5000) {
      limit = LIMIT_2;
    } else if (res > 5000 && res <= 35000) {
      limit = LIMIT_3;
    }

    const randomRepeat = +randomNumber(1, limit);

    const X1 = res + randomRepeat;
    const X2 = res * 2 - X1;

    setX1(X1);
    setX2(X2);

    setResult(res);
  }, [emptyW, dryW, volume]);

  useEffect(() => {
    let limit = 0;

    if (result > 1 && result <= 50) {
      limit = LIMIT_1;
    } else if (result > 50 && result <= 5000) {
      limit = LIMIT_2;
    } else if (result > 5000 && result <= 35000) {
      limit = LIMIT_3;
    }

    const [X1,X2, FACT] = generateX1andX2(limit, result);

    setX1(X1);
    setX2(X2);
    setFact(FACT);

  }, [result])


  useEffect(() => {
    const dM1 = (+x1 * +volume) / 1_000_000 + +emptyM1;
    const dM2 = (+x2 * +volume) / 1_000_000 + +emptyM2;

    setDryM1(+dM1.toFixed(4));
    setDryM2(+dM2.toFixed(4));
  }, [emptyM1, emptyM2, x1, x2, volume]);

  useEffect(() => {
    const cacheCups = localStorage.getItem("cups");

    if (cacheCups) {
      setCups(JSON.parse(cacheCups));

      return;
    }

    const Cups = Array.from({ length: 80 }, (_, i) => ({
      value: randomNumber(60, 90, 4),
      label: i + 1,
    }));

    localStorage.setItem("cups", JSON.stringify(Cups));

    setCups(Cups);
  }, []);

  const renderRound = () => {
    if (result > 10 && result <= 1000) {
      return result;
    } else if (result > 1000 && result <= 10000) {
      return Math.round(result / 10) * 10;
    } else if (result > 10000) {
      return Math.round(result / 100) * 100;
    }
  }

  const onChangeCups = (value: string) => {
    const randomMass = randomNumber(0, 0.0005, 4);
    const emptyM1withMass = Number(value) + +randomMass;

    setEmptyM1(emptyM1withMass);
  }

  const onChangeCups2 = (value: string) => {
    const randomMass = randomNumber(0, 0.0005, 4);
    const emptyM2withMass = Number(value) + +randomMass;

    setEmptyM2(emptyM2withMass);
  }

  return (
    <>
      <Box p={4}>
        <p>
          Предел повторяемости в диапазоне от 1 до 50 = <b>{LIMIT_1}</b>
        </p>
        <p>
          Предел повторяемости в диапазоне от 50 до 5000 = <b>{LIMIT_2}</b>
        </p>
        <p>
          Предел повторяемости в диапазоне от 5000 до 35000 = <b>{LIMIT_3}</b>
        </p>
      </Box>

      <Box p={4} maxW="20%">
        <FormControl>
          <FormLabel>Объем</FormLabel>
          <Input
            size="sm"
            type="text"
            value={volume}
            onChange={(event) => {
              setVolume(event.target.value);
            }}
          />
        </FormControl>
      </Box>

      <Flex p={4} gap={4}>
        <FormControl>
          <FormLabel>Пустая</FormLabel>
          <Input
            size="sm"
            type="text"
            value={emptyW}
            onChange={(event) => {
              setEmptyW(event.target.value);
            }}
            disabled={true}
          />
        </FormControl>
        <FormControl>
          <FormLabel>После сушки</FormLabel>
          <Input
            size="sm"
            type="text"
            value={dryW}
            onChange={(event) => {
              setDryW(event.target.value);
            }}
            disabled={true}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Результат</FormLabel>
          <Input size="sm" type="text" value={result} onChange={(event) => {
            setResult(+event.target.value);
          }} />
        </FormControl>
      </Flex>

      <TableContainer>
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              {headers.map((head) => (
                <Th key={head.name + Math.random()}>{head.name}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>{volume}</Td>
              <Td>
                <Select
                  size="sm"
                  placeholder="Выберите чашку"
                  onChange={(event) => {
                    onChangeCups(event.target.value);
                  }}
                >
                  {cups.map((cup) => (
                    <option key={cup.value} value={cup.value}>
                      {cup.label}
                    </option>
                  ))}
                </Select>
              </Td>
              <Td>{emptyM1}</Td>
              <Td>{dryM1}</Td>
              <Td>{x1}</Td>
              <Td rowSpan={3}>{result}</Td>
              <Td rowSpan={3}>{renderRound()}</Td>
              <Td>от 1 до 50 включ</Td>
              <Td rowSpan={3}>{fact}</Td>
              <Td>{LIMIT_1}</Td>
              <Td>{(TOCH_1*0.01*result).toFixed(2)}</Td>
            </Tr>
            <Tr>
              <Td>{volume}</Td>
              <Td>
                <Select
                  size="sm"
                  placeholder="Выберите чашку"
                  onChange={(event) => {
                    onChangeCups2(event.target.value);
                  }}
                >
                  {cups.map((cup) => (
                    <option key={cup.value} value={cup.value}>
                      {cup.label}
                    </option>
                  ))}
                </Select>
              </Td>
              <Td>{emptyM2}</Td>
              <Td>{dryM2}</Td>
              <Td>{x2}</Td>
              <Td>св 50 до 5000 включ</Td>
              <Td>{LIMIT_2}</Td>
              <Td>{(TOCH_2*0.01*result).toFixed(2)}</Td>

            </Tr>
            <Tr>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td>св 5000 до 35000 вкл</Td>
              <Td>{LIMIT_3}</Td>
              <Td>{(TOCH_3*0.01*result).toFixed(2)}</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
      <Box m={5} overflow="scroll" maxH="300px" maxW="500px">
        <p>Preview cups</p>
        <pre>{JSON.stringify(cups, null, 2)}</pre>
      </Box>
    </>
  );
}

export default App;
