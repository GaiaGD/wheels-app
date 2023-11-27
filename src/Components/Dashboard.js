import React from "react"

export default function Dashboard(props){

    const [airportImages, setAirportImages] = React.useState({departure: "", arrival: ""})

    const [elapsedPercentage, setElapsedPercentage] = React.useState("init")

    const [weatherDeparture, setWeatherDeparture] = React.useState("")
    const [weatherArrival, setWeatherArrival] = React.useState("")
    const [weatherIconDep, setWeatherIconDep] = React.useState('')
    const [weatherIconArr, setWeatherIconArr] = React.useState('')

    let data = props.dataObj

    let airportDepartureCity = data[0].departure.airport.municipalityName
    let airportArrivalCity = data[0].arrival.airport.municipalityName

    console.log(data[0].departure.scheduledTimeLocal)
    console.log(data[0].departure.scheduledTime.local.substring(11, 16))

    React.useEffect(() => {
        // getting time total and time elapsed
        if(data[0].departure.scheduledTimeUtc && data[0].arrival.scheduledTimeUtc){
            let departureTime = new Date(data[0].departure.scheduledTimeUtc)
            let arrivalTime = new Date(data[0].arrival.scheduledTimeUtc)
            function getTotalFlightTime(arrivalTime, departureTime){
                let diff =(arrivalTime.getTime() - departureTime.getTime()) / 1000
                diff /= (60 * 60)
                return Math.abs(Math.round(diff))
            }
            let totalFlightTime = getTotalFlightTime(arrivalTime, departureTime)
            let timeNow = Date.now()
            function getTotalElapsedTime(timeNow, departureTime){
                let diff = (timeNow - departureTime.getTime()) / 1000
                diff /= (60 * 60)
                return Math.abs(Math.round(diff))
            }
            let elapsed = getTotalElapsedTime(timeNow, departureTime)
            let elapsedPercentageCalc = ((elapsed * 100) / totalFlightTime)
            if (elapsedPercentageCalc <= 95){
                setElapsedPercentage(elapsedPercentageCalc)
            } else {
                setElapsedPercentage(50)
            }
        }

        // getting weather

        if(data[0].arrival.airport.location && data[0].departure.airport.location){
            let depLat = data[0].departure.airport.location.lat
            let depLon = data[0].departure.airport.location.lon
            let arrLat = data[0].arrival.airport.location.lat
            let arrLon = data[0].arrival.airport.location.lat
        
        // weather departure & arrival
            let weatherAPI = process.env.REACT_APP_ACCESS_KEY_WEATHERAPI

            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${depLat}&lon=${depLon}&appid=${weatherAPI}&units=imperial`)            
            .then((response) => response.json())
            .then((data) => {
                setWeatherDeparture(data)
                setWeatherIconDep(`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
            })

            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${arrLat}&lon=${arrLon}&appid=${weatherAPI}&units=imperial`)            
            .then((response) => response.json())
            .then((data) => {
                setWeatherArrival(data)
                setWeatherIconArr(`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
            })
        }



        let unsplashApi = process.env.REACT_APP_ACCESS_KEYUNSPLASHAPI

        async function getDepartureBg(){
            const res = await fetch(`https://api.unsplash.com/search/photos?page=1&query=${airportDepartureCity}&order_by=relevant&orientation=landscape&client_id=${unsplashApi}`)
            const dataFetched = await res.json()
            // setAirportDepartureImgUrl(dataFetched.results.length > 0 ? dataFetched.results[0].urls.regular : "https://images.unsplash.com/photo-1542296332-2e4473faf563?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80")

            dataFetched.results.length > 0 ?
                setAirportImages(prevAirportImages => ({
                    ...prevAirportImages,
                    departure: dataFetched.results[0].urls.regular
                }))
                :
                setAirportImages(prevAirportImages => ({
                    ...prevAirportImages,
                    departure: "https://images.unsplash.com/photo-1542296332-2e4473faf563?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
                }))
        }
        getDepartureBg()

        async function getArrivalBg(){
            const res = await fetch(`https://api.unsplash.com/search/photos?page=1&query=${airportArrivalCity}&order_by=relevant&orientation=landscape&client_id=${unsplashApi}`)
            const dataFetched = await res.json()

            dataFetched.results.length > 0 ?
                setAirportImages(prevAirportImages => ({
                    ...prevAirportImages,
                    arrival: dataFetched.results[0].urls.regular
                }))
                :
                setAirportImages(prevAirportImages => ({
                    ...prevAirportImages,
                    arrival: "https://images.unsplash.com/photo-1542296332-2e4473faf563?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
                }))

            // setAirportArrivalImgUrl(dataFetched.results.length > 0 ?dataFetched.results[0].urls.regular : "https://images.unsplash.com/photo-1542296332-2e4473faf563?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80")
        }
        getArrivalBg()

    }, [] )

    return (
        <div className="dashboard fade-in-image">
            <div className="departures">
                <div className="dep-img"
                style={{backgroundImage: `url(${airportImages.departure})`}} 
                >
                </div>
                <div className="dep-info">
                    <div className="dep-info-left">
                        {data[0].departure.airport.iata ? <h1>{data[0].departure.airport.iata}</h1> : <h1>{data[0].departure.airport.icao}</h1>}
                        <div className="flex">
                            <p>{airportDepartureCity},</p>
                            {data[0].departure.airport.countryCode && <p>{data[0].departure.airport.countryCode}</p>}
                        </div>
                        <span className="line-divider"></span>
                        {weatherDeparture &&
                            <div className="weather">
                            <div className="flex">
                                <p>{Math.round(weatherDeparture.main.temp)}°</p>
                                <div className="flex">
                                    <span><img alt="weather icon" className="weather-icon" src={weatherIconDep}/></span><p>{weatherDeparture.weather[0].main}</p>
                                </div>
                            </div>
                        </div>}
                    </div>
                    <div className="dep-info-right">
                        <div>
                            {data[0].departure.scheduledTime.local && <h1>{(data[0].departure.scheduledTime.local.substring(11, 16))}</h1>}
                            {/* <p className={data[0].departure.actualTime.local ? "" : "unavailable"}>Actual: {data[0].departure.actualTime.local ? (data[0].departure.actualTime.local).substring(11, 16) : ""}</p> */}
                        </div>
                        <span className="line-divider"></span>
                        <div className="flex terminal-gate">
                            <p className={data[0].departure.terminal ? "" : "unavailable"}>Terminal: {data[0].departure.terminal ? data[0].departure.terminal : ""}</p>
                            <p className={data[0].departure.gate ? "" : "unavailable"}>Gate: {data[0].departure.gate ? data[0].departure.gate : ""}</p>

                        </div>
                        <div>
                            <p className={data[0].departure.checkInDesk ? "" : "unavailable"}>Check-in Desk: {data[0].departure.checkInDesk ? data[0].departure.checkInDesk : ""}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flight-icon-code">

                <div className="flightpath"></div>
                <div className="plane-icon">
                    <img alt="plane-icon" className="plane-icon moving-plane"
                    style={{ left: elapsedPercentage ? `${elapsedPercentage}%` : '95%'}}
                    src="./plane-icon.svg"></img>
                </div>

                <div className="flightcode text-center">
                    {data[0].aircraft ? <p>{data[0].aircraft.model}</p> : <p>FLIGHT</p>}
                    <h2>{data[0].number}</h2>
                    <h3>{data[0].airline.name}</h3>
                </div>
            </div>
            <div className="arrival">
                <div className="arr-info">
                    <div className="arr-info-left">
                        <div>
                            {data[0].arrival.airport.iata ? <h1>{data[0].arrival.airport.iata}</h1> : <h1>{data[0].departure.airport.icao}</h1>}
                            <div className="flex">
                                <p>{airportArrivalCity},</p>
                                {data[0].arrival.airport.countryCode && <p>{data[0].arrival.airport.countryCode}</p>}
                            </div>
                        </div>
                        <span className="line-divider"></span>
                        {weatherArrival &&
                            <div className="weather">
                            <div className="flex">
                                <p>{Math.round(weatherArrival.main.temp)}°</p>
                                <div className="flex">
                                    <span><img alt="weather icon" className="weather-icon" src={weatherIconArr}/></span><p>{weatherArrival.weather[0].main}</p>
                                </div>
                            </div>
                        </div>}
                    </div>
                    <div className="arr-info-right">
                        <div>
                            {data[0].arrival.scheduledTime.local && <h1>{(data[0].arrival.scheduledTime.local).substring(11, 16)}</h1>}
                            {/* <p className={data[0].arrival.actualTime.local ? "" : "unavailable"}>Actual: {data[0].arrival.actualTime.local ? (data[0].arrival.actualTime.local).substring(11, 16) : ""}</p> */}
                        </div>
                        <span className="line-divider"></span>
                        <div className="flex terminal-gate">
                            <p className={data[0].arrival.terminal ? "" : "unavailable"}>Terminal: {data[0].arrival.terminal ? data[0].arrival.terminal : ""}</p>
                            <p className={data[0].arrival.gate ? "" : "unavailable"}>Gate: {data[0].arrival.gate ? data[0].arrival.gate : ""}</p>
                        </div>
                    </div>
                </div>
                <div className="arr-img"
                style={{backgroundImage: `url(${airportImages.arrival})`}} 
                >
                </div>
            </div>

            <div className="button text-center another-flight" onClick={props.getNewForm}>
                <img alt="back to homepage" src="./go-back.svg"></img>
                <p>CHECK ANOTHER FLIGHT</p>
            </div>

        </div>

    )
}


