import React from 'react';
import ReactDOM from 'react-dom';
import {Fragment, useState} from 'react';



function Example() {
    const [year,setYear] = useState(new Date().getFullYear())
    const [month,setMonth] = useState(new Date().getMonth()+1)
    const calendar = createCalendear(year,month)
    const last = new Date(year,month,0).getDate()
    const prevlast = new Date(year,month-1,0).getDate()

    const onClick = n => () => {
        const nextMonth = month + n
        if (12 < nextMonth) {
          setMonth(1)
          setYear(year + 1)
        } else if (nextMonth < 1) {
          setMonth(12)
          setYear(year - 1)
        } else {
          setMonth(nextMonth)
        }


    }
    return (

        <Fragment>
        <div className="container">
            <div className="calender-header">
                <h1>{`${year}年${month}月`}</h1>
                <p><a href=""></a>追加する</p>
                <div className="calender-nav">
                    <button onClick={onClick(-1)}>{'<先月'}</button>
                    <button onClick={onClick(1)}>{'翌月>'}</button>
                </div>
            </div>
            <table className="calender-table">
                <thead>
                    <tr>
                        <th>日</th><th>月</th><th>火</th><th>水</th><th>木</th><th>金</th><th>土</th>
                    </tr>
                </thead>
                <tbody>
                    {calendar.map((week,i) => (
                        <tr key={week.join('')}>
                            {week.map((day,j) => (
                                <td key={`${i}${j}`} id={day} >
                                    <div>
                                        <div>
                                            {day > last ? day - last : day <= 0 ? prevlast + day : day}
                                        </div>
                                        <div className="schedule-area">
                                        </div>
                                    </div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </Fragment>

    );
}

function createCalendear(year,month){
    const first = new Date(year,month - 1,1).getDay()

    return [0,1,2,3,4,5].map((weekIndex) => {
        return [0,1,2,3,4,5,6].map((dayIndex) => {
            const day = dayIndex + 1 + weekIndex * 7
            return day - first
        })
    })
}


export default Example;

// if (document.getElementById('app')) {
//     const Index = ReactDOM.createRoot(document.getElementById("app"));

//     Index.render(
//             <Example/>
//     )
// }

if (document.getElementById('app')) {
    ReactDOM.render(<Example />, document.getElementById('app'));
}
