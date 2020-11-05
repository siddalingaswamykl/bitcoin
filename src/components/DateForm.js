import React, { useState, useEffect} from "react";
import axios from 'axios';

const DateForm = () => {
    const [startDate, setStartDate] = useState('2020-11-01');
    const [endDate, setEndDate] = useState('2020-11-02');
    //const [sub, setSub] = useState('');
    const [resp, setResp] = useState({});

    const filterval = (val)=>{
        let bpnum = (val.toString().split(".").length > 1)?val.toString().split(".")[0]+val.toString().split(".")[1]:val.toString().split(".")[0];
        let bpnum1 = [];
        bpnum.split("").forEach((c) => {
            if (!bpnum1.includes(parseInt(c))) {
                bpnum1.push(parseInt(c));
            }
        });  
        console.log("fill",bpnum1);
        return bpnum1;
    }

    const isPrime = (num)=>{
        var numArray = num;

        numArray = numArray.filter((number) => {
            if(number === 0 || number === 1) return false;
            for (var i = 2; i <= Math.sqrt(number); i++) {
                if (number % i === 0) return false;
            }
            return true;
        });
        
        console.log("number",numArray);
        return numArray.join(",");
    }

    const data = async (ss) => {
        const res = await axios.get('https://api.coindesk.com/v1/bpi/historical/close.json',{
            params: ss,
        });
        console.log(res);
        let bp = Object.entries(res.data.bpi);
        setResp({"bpdata":bp});
    };

    const onsubmits = (event)=>{
        console.log("chek data", startDate, endDate);
        data({
            start:startDate,
            end: endDate
        });
    } 

    //To restrict the date field to 6 months
    const Nowdate = ()=>{
        var d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        return [year, month, day].join('-');
    }
    const Pastdate = ()=>{
        var d = new Date(),
            month = '' + (d.getMonth() -5),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        return [year, month, day].join('-');
    }

    //Update the result based on the date change. 
    useEffect((event)=>{
        console.log("Data showing",event);

        console.log(startDate,endDate);
        data({
            start:startDate,
            end: endDate
          }); 
    },[startDate,endDate]);

    return (
        <div className="ui segement">
            <h2> Select Date Range for the Bit coin Price:</h2>
            <div className="ui form">
            <div className="field">
                <label htmlFor="startDate">Enter Start Date</label>
                <input 
                    id="startDate"
                    type="date"
                    value={startDate}
                    min={Pastdate()} max={Nowdate()}
                    onChange={(event) => { console.log(event.target.value); 
                        setStartDate(event.target.value)}}
                />
            </div>
            <div className="field">
                <label htmlFor="endDate">Enter End Date</label>
                <input 
                    id="endDate"
                    type="date"
                    value={endDate}
                    min={Pastdate()} max={Nowdate()}
                    onChange={(event) => setEndDate(event.target.value)}
                />
            </div>
            <button className="positive ui button" onClick={onsubmits}>Submit</button>
            </div>
            <div className="ui segment data">
                
                
                <table class="ui celled table">
                    <thead>
                        <tr><th>Date</th>
                        <th>BitCoin Price</th>
                        <th>Prime Numbers in the Price</th>
                    </tr></thead>
                    <tbody>
                    {resp && resp.bpdata && resp.bpdata.map((dat) =>{
                       return ( <tr>
                            <td data-label="date">{dat[0]}</td>
                            <td data-label="price">${dat[1]}</td>
                            <td data-label="prime">{isPrime(filterval(dat[1]))}</td>
                        </tr> )
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DateForm;