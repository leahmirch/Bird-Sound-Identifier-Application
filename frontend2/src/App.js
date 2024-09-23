import React, { useEffect, useState, useCallback } from 'react';
import Axios from 'axios';
import Popup from './Popup';
import './App.css';


export default function App() {
 const [birdData, setBirdData] = useState({ bird: {}, DataisLoaded: false });
 const [imageUrls, setImageUrls] = useState([]);
 const [birdHasChanged, setBirdHasChanged] = useState(false);
 const [popUpTrigger, setPopUpTrigger] = useState(false);
 const [birds, setBirds] = useState([]);
 const [birdDescription, setBirdDescription] = useState('');
 const [isSpeaking, setIsSpeaking] = useState(false);
 const [isUpdating, setIsUpdating] = useState(true);
 const [intervalId, setIntervalId] = useState(null);
 const [selectedDate, setSelectedDate] = useState(null);
 const [filteredBirds, setFilteredBirds] = useState([]);
 const [searchQuery, setSearchQuery] = useState('');
 const [dateRange, setDateRange] = useState({ start: '', end: '' });


 const updateBirdLatest = useCallback(async () => {
   await Axios.get(`http://${process.env.REACT_APP_API_HOST}:3001/birds/latest`)
     .then((res) => {
       const birdInfo = res.data.data;
       var birdDict = {
         time: birdInfo[0],
         bird: birdInfo[1],
         lat: birdInfo[2],
         lon: birdInfo[3]
       };
       if (birdInfo[1] !== birdData.bird.bird) {
         setBirdHasChanged(true);
       }
       setBirdData({
         bird: birdDict,
         DataisLoaded: true
       });
     });
 }, [birdData.bird.bird]);


 const fetchBirdHistory = useCallback(async () => {
   await Axios.get(`http://${process.env.REACT_APP_API_HOST}:3001/birds`)
     .then((res) => {
       const birdHistory = res.data.data.map(bird => ({
         date: new Date(bird.created).toLocaleDateString(),
         time: new Date(bird.created).toLocaleTimeString(),
         name: bird.bird,
         lat: bird.lat,
         lon: bird.lon,
         created: new Date(bird.created) // Add the original date object for sorting
       }));
       birdHistory.sort((a, b) => b.created - a.created); // Sort by date in descending order
       setBirds(birdHistory);
     });
 }, []);


 const fetchBirdDescription = async (birdName) => {
   try {
     console.log(`Fetching description for bird: ${birdName}`);
     const response = await Axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${birdName}`);
     console.log("API response status:", response.status);
     console.log("API response data:", response.data);
     if (response.data && response.data.extract) {
       const description = `${response.data.extract}\n\nAppearance: The ${birdName} typically has distinctive features such as its size, color, and notable markings. For more details, visit ${response.data.content_urls.desktop.page}.`;
       setBirdDescription(description);
     } else {
       setBirdDescription("Description not available");
     }
   } catch (error) {
     console.error("Error fetching bird description: ", error);
     if (error.response) {
       console.error("Response data:", error.response.data);
       console.error("Response status:", error.response.status);
       console.error("Response headers:", error.response.headers);
     } else if (error.request) {
       console.error("Request data:", error.request);
     } else {
       console.error("Error message:", error.message);
     }
     setBirdDescription("Error fetching description");
   }
 };


 async function getBirdImages() {
   const bird = birdData.bird.bird;
   try {
     const response = await Axios.get(
       `https://api.unsplash.com/search/photos?query=${bird}&client_id=i7RoddcRb7XMxsfWJKJfI1SAuu4m7KPgz5Umdd7d3J4&per_page=6`
     );
     const data = response.data.results;
     const imageUrls = data.map(img => img.urls.regular);
     setImageUrls(imageUrls);
   } catch (error) {
     console.error("Error fetching images: ", error);
   }
 }


 function renderBird() {
   const { DataisLoaded, bird } = birdData;
   if (!DataisLoaded) {
     return <div>Loading...</div>;
   } else {
     if (birdHasChanged) {
       getBirdImages();
       fetchBirdDescription(bird.bird); // Fetch description
       setBirdHasChanged(false);
     }
     return bird.bird;
   }
 }


 function renderTime() {
   const { DataisLoaded, bird } = birdData;
   if (!DataisLoaded) {
     return <div>Loading...</div>;
   } else {
     const utcTime = new Date(bird.time);
     const convertedTime = utcTime.toLocaleString("en-US", { timeZone: "America/New_York" });
     const timeArray = convertedTime.split(", ");
     const timestring = `${timeArray[1]} on ${timeArray[0]}`;
     return timestring;
   }
 }


 function renderImages() {
   if (imageUrls.length > 0) {
     return (
       <div className="images-container">
         {imageUrls.map((url, index) => (
           <img key={index} src={url} alt={`Bird ${index + 1}`} className="bird-image" />
         ))}
       </div>
     );
   }
   return null;
 }


 const speakDescription = () => {
   if ('speechSynthesis' in window) {
     if (isSpeaking) {
       window.speechSynthesis.cancel();
       setIsSpeaking(false);
     } else {
       const speech = new SpeechSynthesisUtterance(birdDescription);
       speech.lang = 'en-US';
       speech.onend = () => {
         setIsSpeaking(false);
       };
       window.speechSynthesis.speak(speech);
       setIsSpeaking(true);
     }
   } else {
     alert("Sorry, your browser doesn't support text to speech!");
   }
 };


 const toggleUpdates = () => {
   if (isUpdating) {
     clearInterval(intervalId);
   } else {
     const id = setInterval(() => {
       updateBirdLatest();
     }, 5000);
     setIntervalId(id);
   }
   setIsUpdating(!isUpdating);
 };


 const startVoiceRecognition = useCallback(() => {
   if ('webkitSpeechRecognition' in window) {
     const recognition = new window.webkitSpeechRecognition();
     recognition.lang = 'en-US';
     recognition.continuous = true;
     recognition.interimResults = false;


     recognition.onstart = () => {
       console.log("Voice recognition started.");
     };


     recognition.onresult = (event) => {
       const transcript = event.results[event.resultIndex][0].transcript.trim().toLowerCase();
       console.log("Voice command received:", transcript);


       if (transcript === "read description") {
         speakDescription();
       }
     };


     recognition.onerror = (event) => {
       console.error("Voice recognition error:", event.error);
     };


     recognition.onend = () => {
       console.log("Voice recognition ended.");
       startVoiceRecognition(); // Restart recognition
     };


     recognition.start();
     console.log("Voice recognition initialized.");
   } else {
     alert("Sorry, your browser doesn't support voice recognition!");
   }
 }, [speakDescription]);


 useEffect(() => {
   const id = setInterval(() => {
     updateBirdLatest();
   }, 5000);
   setIntervalId(id);
   return () => clearInterval(id);
 }, [updateBirdLatest]);


 useEffect(() => {
   fetchBirdHistory();
 }, [fetchBirdHistory]);


 useEffect(() => {
   startVoiceRecognition();
 }, [startVoiceRecognition]);


 const handleDateClick = (date) => {
   if (selectedDate === date) {
     setSelectedDate(null); // Close the table if the same date is clicked again
     setFilteredBirds([]);
   } else {
     setSelectedDate(date);
     setFilteredBirds(birds.filter(bird => bird.date === date));
   }
 };


 const handleSearchChange = (e) => {
   setSearchQuery(e.target.value);
 };


 const handleDateRangeChange = (e) => {
   const { name, value } = e.target;
   setDateRange((prev) => ({ ...prev, [name]: value }));
 };


 const filterBirds = () => {
   let filtered = birds;
   if (searchQuery) {
     filtered = filtered.filter(bird => bird.name.toLowerCase().includes(searchQuery.toLowerCase()));
   }
   if (dateRange.start && dateRange.end) {
     filtered = filtered.filter(bird => {
       const birdDate = new Date(bird.created);
       return birdDate >= new Date(dateRange.start) && birdDate <= new Date(dateRange.end);
     });
   }
   setFilteredBirds(filtered);
 };


 useEffect(() => {
   filterBirds();
 }, [searchQuery, dateRange, birds]);


 return (
   <div>
     <main>
       <header className="header">
         <h1><i className="fas fa-dove"></i> Bird Sound Identifier</h1>
         <div>
           <button className="update-btn" onClick={toggleUpdates}>
             {isUpdating ? 'Stop Updates' : 'Start Updates'}
           </button>
           <button className="history-btn" onClick={() => { setPopUpTrigger(true) }}>
             <i className="fas fa-history"></i> Bird History
           </button>
         </div>
       </header>
       <div className='parent-container'>
         <h2 className="bird-name">{renderBird()}</h2> {/* New bird name header */}
         <div className="fun-facts">
           <h3>Description:</h3>
           <p>{birdDescription}</p>
           <button className="read-btn" onClick={speakDescription}>
             {isSpeaking ? 'Stop Reading' : 'Read Description'}
           </button>
         </div>
         <h1>Latest bird I heard was a {renderBird()} at {renderTime()}</h1>
         <div>
           {renderImages()}
         </div>
       </div>
     </main>
     <Popup trigger={popUpTrigger} setTrigger={setPopUpTrigger}>
       <div className="table-container">
         <div className="search-filter-container">
           <input
             type="text"
             placeholder="Search by bird name"
             value={searchQuery}
             onChange={handleSearchChange}
           />
           <input
             type="date"
             name="start"
             placeholder="Start Date"
             value={dateRange.start}
             onChange={handleDateRangeChange}
           />
           <input
             type="date"
             name="end"
             placeholder="End Date"
             value={dateRange.end}
             onChange={handleDateRangeChange}
           />
         </div>
         <div className="date-container">
           {Array.from(new Set(birds.map(bird => bird.date))).map(date => (
             <button key={date} onClick={() => handleDateClick(date)} className="date-button">
               {date}
             </button>
           ))}
         </div>
         <div className="bird-table">
           {selectedDate && (
             <table className="table table-striped">
               <thead>
                 <tr>
                   <th>Time</th>
                   <th>Name</th>
                   <th>Latitude</th>
                   <th>Longitude</th>
                 </tr>
               </thead>
               <tbody>
                 {filteredBirds.map((bird, index) => (
                   <tr key={index}>
                     <td>{bird.time}</td>
                     <td>{bird.name}</td>
                     <td>{bird.lat}</td>
                     <td>{bird.lon}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           )}
         </div>
       </div>
     </Popup>
   </div>
 );
}





