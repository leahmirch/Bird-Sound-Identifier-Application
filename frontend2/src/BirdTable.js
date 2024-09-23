import React from 'react';

function BirdTable({ birds }) {
  return (
    <div className="bird-table-container">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Bird Name</th>
            <th>Latitude</th>
            <th>Longitude</th>
          </tr>
        </thead>
        <tbody>
          {birds.map((bird, index) => (
            <tr key={index}>
              <td>{bird.date}</td>
              <td>{bird.time}</td>
              <td>{bird.name}</td>
              <td>{bird.lat}</td>
              <td>{bird.lon}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BirdTable;
