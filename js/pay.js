
// async function fetchExpertsDetailsScore() {
//     try {
//       const url = `http://43.201.79.49/mds/635a359d731b7f22f9c438fe/date/2022-11-29`;
//       console.log(url);
//       const response = await fetch(url, {
//         method: "GET",
//       });
  
//       if (!response.ok) {
//         throw new Error(`Network response was not ok (${response.status})`);
//       }
  
//       const result2 = await response.json();
//       console.log("Response data2:", result2.data);
//       return result2.data;
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   }

//   fetchExpertsDetailsScore();