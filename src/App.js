import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { hexToRgb, hexToHSL, hexColorDelta, colorToHex } from './ColorConversion';

function App() {
  const [color, setColor] = useState('');
  const [tableData, setTableData] = useState([]);
  const [filteredTableData, setFilteredTableData] = useState([]);
  const [isColorInvalid, setIsColorInvalid] = useState(false);
  const [triggerRefetch, setTriggerRefetch] = useState(false);
  const [isColorPickerSupport, setIsColorPickerSupport] = useState(true);

  useEffect(() => {
    const hasColorInputSupport = () => {
      try {
        const input = document.createElement('input');
        input.type = 'color';
        input.value = '!';
        return input.type === 'color' && input.value !== '!';
      } catch (e) {
        return false;
      };
    };

    hasColorInputSupport() ? setIsColorPickerSupport(true) : setIsColorPickerSupport(false);
  }, [])


  useEffect(() => {
    axios.get('https://raw.githubusercontent.com/NishantChandla/color-test-resources/main/xkcd-colors.json').then(res => {
      const mutatedColorsData = res.data.colors.map((row, index) => {
        return {
          color: row.color,
          hex: row.hex.substring(1),
          rgb: hexToRgb(row.hex),
          hsl: hexToHSL(row.hex)
        }
      })
      setTableData(mutatedColorsData)
    })
  }, [triggerRefetch])

  useEffect(() => {
    if (color === '') {
      setFilteredTableData([])
    }
    setIsColorInvalid(false);
  }, [color])

  const checkColorValidity = (testString) => {
    const rgbColorRegex = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    const hslColorRegex = /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;

    if (rgbColorRegex.test(testString) || hexColorRegex.test(testString) || hslColorRegex.test(testString)) {
      return true;
    }
    return false;
  }

  const handleColorSearch = (e) => {
    if (e.key === 'Enter') {
      let filteredData = [];

      const isValid = checkColorValidity(color);

      if (isValid) {
        setIsColorInvalid(false);
      } else {
        setIsColorInvalid(true);
        return;
      }

      let convertedHexColor = colorToHex(color);

      const COMPARISON_THRESHOLD = 0.8;

      for (let row of tableData) {
        let colorDifference = hexColorDelta(row.hex, convertedHexColor);

        if (colorDifference >= COMPARISON_THRESHOLD) {
          filteredData.push({ ...row, delta: colorDifference });
        }

        // limiting filteration to 100 entries only
        if (filteredData.length === 99) {
          break;
        }
      }

      filteredData.sort((a, b) => {
        return b.delta - a.delta
      })
      setFilteredTableData(filteredData);
    }
  }

  const handleColorChange = (e) => {
    setColor(e.target.value);
  }

  const handleColorPick = (e) => {
    handleColorChange(e);
    e.key = 'Enter'
    handleColorSearch(e)
  }

  return (
    <div className="App">
      <div className="search-bar">
        <h5>Color</h5>
        <div className="color-choosers">
          <input className='search-color-box' type="search" onKeyUp={handleColorSearch} onChange={handleColorChange} value={color} />
          {isColorPickerSupport ? <input type="color" id="head" name="head" onChange={handleColorPick} value={color} /> : null}
        </div>
        {isColorInvalid ? <div className="invalid-color">The color is invalid.</div> : null}
      </div>
      <div className="colors-container">
        {!filteredTableData.length && !tableData.length ? <button onClick={_ => setTriggerRefetch(!triggerRefetch)}>Retry</button> : <div>
          <h5>All Colors</h5>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Hex</th>
                <th>RGB</th>
                <th>HSL</th>
              </tr>
            </thead>
            <tbody>
              {
                (filteredTableData.length ? filteredTableData : tableData).map((row, index) => {
                  return (
                    <tr className="row" key={`color-row-${index}`}>
                      <td className='color-box-container'>
                        <div className='color-box' style={{ backgroundColor: '#' + row.hex }}></div>
                        <div>{row.color}</div>
                      </td>
                      <td>#{row.hex}</td>
                      <td>{row.rgb}</td>
                      <td>{row.hsl}</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>}
      </div>
    </div>
  );
}

export default App;
