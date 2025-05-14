import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

const AccelerometerChart = ({ data }) => {
  // Formate les données pour Recharts
  const formattedData = data.map(item => ({
    timestamp: format(new Date(item.timestamp), 'HH:mm:ss'),
    x: item.x,
    y: item.y,
    z: item.z,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={formattedData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="x" stroke="#f44336" name="Axe X" dot={false} />
        <Line type="monotone" dataKey="y" stroke="#4caf50" name="Axe Y" dot={false} />
        <Line type="monotone" dataKey="z" stroke="#2196f3" name="Axe Z" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AccelerometerChart;