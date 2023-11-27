import React from 'react'
import Intro from './Components/Intro'
import Form from './Components/Form'
import MoreFlights from './Components/MoreFlights'
import Dashboard from './Components/Dashboard'

export default function App() {

  const [intro, setIntro] = React.useState(true)
  const [form, setForm] = React.useState(false)
  const [dashboard, setDashboard] = React.useState(false)
  const [moreFlights, setMoreFlights] = React.useState(false)
  
  const [dataFromRapidApi, setDataFromRapidApi] = React.useState()
  const [formData, setFormData] = React.useState({ departureIATA: "", arrivalIATA: "", airlineCode: "" })
  
  //intro
  function goToForm(){
    setIntro(false)
    setForm(true)
  }
  
  // form
  
  function handleChange(event) {
    const {name, value} = event.target
    setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value
    }))
  }
  
  function handleDepartureCode(depIata){
    setFormData(prevFormData => ({
      ...prevFormData,
      departureIATA: depIata
    }))
    console.log(formData)
  }
  
  function handleArrivalCode(arrIata){
    setFormData(prevFormData => ({
      ...prevFormData,
      arrivalIATA: arrIata
    }))
    console.log(formData)
  }
  
  function handleAirlineIata(airlineIata){
    console.log(airlineIata)
    setFormData(prevFormData => ({
      ...prevFormData,
      airlineCode: airlineIata
    }))
    console.log(formData)
  }

  let rapidapiData

  async function handleSubmit() {
    if(formData.departureIATA !== "" && formData.arrivalIATA !== "" && formData.airlineCode !== ""){
  
      let airlabKey = process.env.REACT_APP_ACCESS_KEY_AIRLAB

      let airlabAPI = `https://airlabs.co/api/v9/flights?api_key=${airlabKey}&dep_iata=${formData.departureIATA}&arr_iata=${formData.arrivalIATA}&airline_iata=${formData.airlineCode}`
      
  
      const response = await fetch(airlabAPI)
      const airlabData = await response.json()
      console.log("airlabData: ", airlabData)
  
      // catch undefined iata ?
  
        if (airlabData.response.length > 0 ){

          console.log(airlabData.response)

          let IATAcode = airlabData.response[0].flight_iata
    
            const options = {
              method: 'GET',
              headers: {
                'X-RapidAPI-Key': process.env.REACT_APP_ACCESS_KEY_RAPIDAPI,
                'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com'
              }
            }
    
            let rapidapiAPI = `https://aerodatabox.p.rapidapi.com/flights/number/${IATAcode}/?withAircraftImage=false&withLocation=false`
            const response2 = await fetch(rapidapiAPI, options)
    
            // solving the Unexpected end of JSON problem
            try {
              let rapidapiData = await response2.json()
              console.log("rapidapiData: ", rapidapiData)
              setDataFromRapidApi(rapidapiData)
              setForm(false)
              setDashboard(true)
    
            } catch (err) {
              // 👇️ SyntaxError: Unexpected end of JSON input
              console.log('error', err)
              alert("Oops, there seems to be a problem with your request. Try again or check later.")
            }
    
          } else {
            console.log(formData)
            console.log(airlabData.response.length)
            alert("No flights found - Maybe is the same city but a different airport? Or is it the right airline? If you double checked, maybe there just no flight in the air at this time with this destination.")
          }
  
        } else {
          console.log(formData)
          alert("Please fill in all the fields")
        }
  }
  
    
  function getNewForm(){
    setDashboard(false)
    setFormData({ departureIATA: "", arrivalIATA: "", airlineCode: "" })
    setForm(true)
  }
  
    return (
      <div className="App">
  
        { intro && <Intro goToForm={goToForm}/>}
  
        { form &&
            <Form
              formData={formData}
              // formData={{formData}}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              handleDepartureCode={handleDepartureCode}
              handleArrivalCode={handleArrivalCode}
              handleAirlineIata={handleAirlineIata}
              getNewForm={getNewForm}
            />
        }
  
        { dashboard && <Dashboard
        // departure={dataFromRapidApi[0].departure.airport.name} arrival={dataFromRapidApi[0].arrival.airport.name}
        dataObj={dataFromRapidApi}
        getNewForm={getNewForm}
        />}
  
        { moreFlights && <MoreFlights/>}
  
        {/* <footer>
          API
        </footer> */}
  
      </div>
    )
  }