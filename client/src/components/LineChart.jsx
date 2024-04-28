import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Chart = ({ data, ynames, domains }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const handleDateChange = date => {
        setSelectedDate(date);
    };

    return (
        <div class = "container">
            <div class = "ms-5 mb-2">
                <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy"
                />
            </div>
            <LineChart width={600} height={300} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" label={{ value: 'Hour ago', position: 'insideBottomRight', dy:10 }} />
                <YAxis domain={domains} label={{ angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                {ynames.map((yname, index) => (
                    <Line key={index} type="monotone" dataKey={yname.key} stroke={yname.color} name={yname.label} />
                ))}
                <Legend />
            </LineChart>
        </div>
    );
};

export default Chart;
