import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

const GyroscopeChart = ({ data }) => {
  // Formate les données pour Recharts
  const formattedData = data ? data.map(item => ({
    timestamp: format(new Date(item.timestamp), 'HH:mm:ss'),
    rotationX: item.rotationX,
    rotationY: item.rotationY,
    rotationZ: item.rotationZ,
  })) : [];

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
        <Line type="monotone" dataKey="rotationX" stroke="#f44336" name="Rotation X" dot={false} />
        <Line type="monotone" dataKey="rotationY" stroke="#4caf50" name="Rotation Y" dot={false} />
        <Line type="monotone" dataKey="rotationZ" stroke="#2196f3" name="Rotation Z" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default GyroscopeChart;