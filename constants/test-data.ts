const data = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "My First Dataset",
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      borderColor: "rgb(75, 192, 192)",
      tension: 0.1,
    },
  ],
};

export const config = {
  type: "line",
  options: {
    // add padding to the chart
    layout: {
      padding: {
        left: 50,
        right: 50,
        top: 50,
        bottom: 50,
      },
    },
    // add max width to the chart
    responsive: true,
    maintainAspectRatio: true
    



  },
  data: data,
};

export default config;
